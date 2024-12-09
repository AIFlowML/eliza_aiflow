import { 
    elizaLogger, 
    IAgentRuntime,
    Memory,
    State,
    stringToUuid,
    getEmbeddingZeroVector,
    composeContext,
    ModelClass,
    generateText
} from "@ai16z/eliza";
import { RedditService } from "../services/reddit.service";
import { RedditActionOptions } from "../types/reddit-types";
import { getMonitoringConfig } from "../environment";


export interface SearchOptions {
  query: string;
  subreddit?: string;
  sort?: 'relevance' | 'hot' | 'top' | 'new' | 'comments';
  timeframe?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
  limit?: number;
}

export class RetrieveDataAction {
  private static instance: RetrieveDataAction | null = null;
  private service: RedditService;
  private monitoredTopics: string[] = [];
  private monitoredSubreddits: string[] = [];
  private runtime: IAgentRuntime | null = null;
  private env: any = null;

  private constructor() {
    this.service = RedditService.getInstance();
  }

  public static getInstance(): RetrieveDataAction {
    if (!RetrieveDataAction.instance) {
      RetrieveDataAction.instance = new RetrieveDataAction();
    }
    return RetrieveDataAction.instance;
  }

  public async initialize(runtime: IAgentRuntime): Promise<void> {
    elizaLogger.debug("🔄 Initializing RetrieveData action");
    this.runtime = runtime;
    await this.service.initialize(runtime);
    
    // Load monitoring configuration
    const config = await getMonitoringConfig(runtime);
    this.monitoredTopics = config.topics;
    this.monitoredSubreddits = config.subreddits;
    this.env = config;
    
    elizaLogger.debug(`Monitoring topics: ${this.monitoredTopics.join(', ')}`);
    elizaLogger.debug(`Monitoring subreddits: ${this.monitoredSubreddits.join(', ')}`);
  }

  private async createMemory(content: { text: string; id: string; created_utc: number; author: { name: string }; subreddit: { display_name: string } }): Promise<Memory> {
    if (!this.runtime) throw new Error("Runtime not initialized");

    return {
      id: stringToUuid(`${content.id}-${this.runtime.agentId}`),
      userId: stringToUuid(`${content.author.name}-${this.runtime.agentId}`),
      agentId: stringToUuid(this.runtime.agentId),
      roomId: stringToUuid(`${content.subreddit.display_name}-${this.runtime.agentId}`),
      content: {
        text: content.text,
        source: 'reddit',
        id: content.id,
        timestamp: new Date(content.created_utc * 1000).toISOString()
      },
      createdAt: content.created_utc * 1000,
      embedding: getEmbeddingZeroVector()
    };
  }

  private async composeState(subreddit: string): Promise<State> {
    if (!this.runtime) throw new Error("Runtime not initialized");

    // Initial state composition
    let state = await this.runtime.composeState(
      { 
        content: { text: '', source: 'reddit' },
        userId: stringToUuid('system'),
        agentId: this.runtime.agentId,
        roomId: stringToUuid(subreddit)
      },
      {
        subreddit,
        env: this.env,
        monitoredTopics: this.monitoredTopics,
        monitoredSubreddits: this.monitoredSubreddits
      }
    );

    // Update state with recent messages
    state = await this.runtime.updateRecentMessageState(state);

    return state;
  }

  /**
   * Search for posts matching the given criteria
   * @param options - Search options including query, subreddit, sort, timeframe, and limit
   * @returns Array of matching posts
   */
  public async searchPosts(options: SearchOptions) {
    const { query, subreddit, sort = 'relevance', timeframe = 'week', limit = 25 } = options;
    elizaLogger.debug(`🔍 Searching for "${query}" in ${subreddit || 'all subreddits'}`);
    
    try {
      // Compose state for this operation
      const state = await this.composeState(subreddit || 'all');

      // Use state to determine if we should process this search
      const searchContext = composeContext({
        state,
        template: `Analyze if we should process this search for "${query}" in ${subreddit || 'all subreddits'}`
      });

      const shouldProcess = await generateText({
        runtime: this.runtime!,
        context: searchContext,
        modelClass: ModelClass.SMALL
      });

      if (shouldProcess.toLowerCase().includes('no')) {
        elizaLogger.debug(`Skipping search based on context analysis`);
        return [];
      }

      const searchQuery = subreddit ? `subreddit:${subreddit} ${query}` : query;
      const results = await this.service.search(searchQuery, { sort, time: timeframe, limit });

      if (this.runtime) {
        for (const post of results) {
          if (post.success && post.data) {
            const memory = await this.createMemory({
              text: `${post.data.title}\n\n${post.data.selftext}`,
              id: post.data.id,
              created_utc: post.data.created_utc,
              author: { name: post.data.author },
              subreddit: { display_name: post.data.subreddit }
            });
            await this.runtime.messageManager.createMemory(memory);
          }
        }
      }

      elizaLogger.debug(`✅ Found ${results.length} results`);
      return results;
    } catch (error) {
      elizaLogger.error(`❌ Failed to search for "${query}":`, error);
      throw error;
    }
  }

  /**
   * Get a specific post by ID
   * @param postId - The ID of the post to retrieve
   * @returns The post data or null if not found
   */
  public async getPost(postId: string) {
    elizaLogger.debug(`🔍 Retrieving post with ID: ${postId}`);
    
    try {
      const post = await this.service.getSubmission(postId);
      if (!post.success || !post.data) {
        elizaLogger.warn(`Post ${postId} not found`);
        return null;
      }

      if (this.runtime) {
        // Compose state for this post
        const state = await this.composeState(post.data.subreddit);

        // Use state to determine if we should process this post
        const postContext = composeContext({
          state,
          template: `Analyze if we should process this post from r/${post.data.subreddit}`
        });

        const shouldProcess = await generateText({
          runtime: this.runtime,
          context: postContext,
          modelClass: ModelClass.SMALL
        });

        if (shouldProcess.toLowerCase().includes('yes')) {
          const memory = await this.createMemory({
            text: `${post.data.title}\n\n${post.data.selftext}`,
            id: post.data.id,
            created_utc: post.data.created_utc,
            author: { name: post.data.author },
            subreddit: { display_name: post.data.subreddit }
          });
          await this.runtime.messageManager.createMemory(memory);
          elizaLogger.debug(`✅ Successfully retrieved and processed post`);
        }
      }

      return post;
    } catch (error) {
      elizaLogger.error(`❌ Failed to retrieve post ${postId}:`, error);
      throw error;
    }
  }

  /**
   * Get posts from a subreddit
   * @param options - Options for retrieving posts including subreddit, sort, and limit
   * @returns Array of posts from the subreddit
   */
  public async getSubredditPosts(options: RedditActionOptions) {
    elizaLogger.debug(`🔍 Retrieving posts from r/${options.subreddit}`);
    try {
      // Compose state for this subreddit
      const state = await this.composeState(options.subreddit);

      // Use state to determine if we should process this subreddit
      const subredditContext = composeContext({
        state,
        template: `Analyze if we should process posts from r/${options.subreddit}`
      });

      const shouldProcess = await generateText({
        runtime: this.runtime!,
        context: subredditContext,
        modelClass: ModelClass.SMALL
      });

      if (shouldProcess.toLowerCase().includes('no')) {
        elizaLogger.debug(`Skipping subreddit based on context analysis`);
        return [];
      }

      const posts = await this.service.getSubredditPosts(options);
      
      if (this.runtime) {
        for (const post of posts) {
          if (post.success && post.data) {
            const memory = await this.createMemory({
              text: `${post.data.title}\n\n${post.data.selftext}`,
              id: post.data.id,
              created_utc: post.data.created_utc,
              author: { name: post.data.author },
              subreddit: { display_name: post.data.subreddit }
            });
            await this.runtime.messageManager.createMemory(memory);
          }
        }
      }

      elizaLogger.debug(`✅ Successfully retrieved posts from r/${options.subreddit}`);
      return posts;
    } catch (error) {
      elizaLogger.error(`❌ Failed to retrieve posts from r/${options.subreddit}:`, error);
      throw error;
    }
  }

  /**
   * Get information about a subreddit
   * @param name - The name of the subreddit
   * @returns Subreddit information or null if not found
   */
  public async getSubreddit(name: string) {
    elizaLogger.debug(`🔍 Retrieving information for r/${name}`);
    
    try {
      const state = await this.composeState(name);
      const subredditContext = composeContext({
        state,
        template: `Analyze if we should process r/${name}`
      });

      const shouldProcess = await generateText({
        runtime: this.runtime!,
        context: subredditContext,
        modelClass: ModelClass.SMALL
      });

      if (shouldProcess.toLowerCase().includes('no')) {
        elizaLogger.debug(`Skipping subreddit based on context analysis`);
        return null;
      }

      // Since getSubredditInfo is not available, we'll get posts to verify subreddit exists
      const posts = await this.service.getSubredditPosts({ subreddit: name, limit: 1 });
      if (posts.length > 0 && posts[0].success && posts[0].data) {
        return {
          name,
          display_name: name,
          created_utc: posts[0].data.created_utc
        };
      }
      
      elizaLogger.debug(`✅ Successfully retrieved information for r/${name}`);
      return null;
    } catch (error) {
      elizaLogger.error(`❌ Failed to retrieve information for r/${name}:`, error);
      throw error;
    }
  }

  public cleanup(): void {
    elizaLogger.debug("🧹 Cleaning up RetrieveData action");
    this.service.cleanup();
    this.runtime = null;
    this.env = null;
  }
}
