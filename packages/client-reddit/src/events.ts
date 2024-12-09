/**
 * Reddit Event Management System
 * Handles real-time monitoring and processing of Reddit events including:
 * - New submissions in monitored subreddits
 * - User mentions and replies
 * - Comment tracking and processing
 * 
 * Features:
 * - Event polling with configurable intervals
 * - Deduplication of events
 * - Automatic cleanup of old events
 * - Detailed logging and error tracking
 * 
 * @module RedditEventManager
 */

import { 
  elizaLogger, 
  IAgentRuntime,
  generateMessageResponse,
  generateShouldRespond,
  ModelClass,
  Memory,
  Content,
  State,
  stringToUuid,
  getEmbeddingZeroVector,
  composeContext
} from "@ai16z/eliza";
import { RedditService } from "./services/reddit.service";
import { 
    RedditUser, 
    RedditSubmission, 
    RedditComment, 
    CommentResponse,
    isRedditUser,
    hasResponseData
} from "./types/reddit-types";
import { validateRedditEnv, RedditEnv } from "./environment";

export interface RedditMetadata {
  id: string;
  author: string;
  subreddit: string;
  created_utc: number;
  type?: 'submission' | 'comment';
  parent_id?: string;
  link_id?: string;
}

export class EventManager {
  private static instance: EventManager | null = null;
  private service: RedditService;
  private runtime: IAgentRuntime | null = null;
  private env: RedditEnv | null = null;
  private currentUser: RedditUser | null = null;
  private lastCheckedTime: number = 0;
  private processedItems: Set<string> = new Set();
  private readonly POLL_INTERVAL = 30000; // 30 seconds
  private readonly MAX_ITEMS_PER_CHECK = 25;

  private constructor() {
    this.service = RedditService.getInstance();
  }

  public static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager();
    }
    return EventManager.instance;
  }

  public async initialize(runtime: IAgentRuntime): Promise<void> {
    elizaLogger.info("Initializing Reddit event manager");
    this.runtime = runtime;
    
    try {
      await this.service.initialize(runtime);
      const env = await validateRedditEnv(runtime);
      this.env = env;
      
      const user = await this.service.getCurrentUser();
      if (!isRedditUser(user)) {
        throw new Error("Invalid user data received");
      }
      this.currentUser = user;
      
      elizaLogger.info(`🤖 Initialized Reddit event manager for u/${this.currentUser.name}`);
      if (this.env.REDDIT_SUBREDDIT) {
        elizaLogger.info(`📡 Monitoring subreddits: r/${this.env.REDDIT_SUBREDDIT}`);
      }
    } catch (error) {
      elizaLogger.error("Failed to initialize event manager:", error);
      throw error;
    }
  }

  public async checkForNewEvents(): Promise<void> {
    if (!this.runtime || !this.env || !this.currentUser) {
      elizaLogger.error("Event manager not properly initialized", {
        hasRuntime: !!this.runtime,
        hasEnv: !!this.env,
        hasCurrentUser: !!this.currentUser
      });
      return;
    }

    const now = Date.now();
    if (now - this.lastCheckedTime < this.POLL_INTERVAL) {
      elizaLogger.debug(`Skipping event check - too soon (${Math.floor((now - this.lastCheckedTime)/1000)}s elapsed)`);
      return;
    }
    this.lastCheckedTime = now;

    elizaLogger.info("🔄 Starting event check cycle");
    try {
      // Check mentions across Reddit
      elizaLogger.info("📡 Checking for mentions across Reddit");
      await this.checkMentions();

      // Check monitored subreddits
      if (this.env.REDDIT_SUBREDDIT) {
        elizaLogger.info(`📡 Checking monitored subreddit: r/${this.env.REDDIT_SUBREDDIT}`);
        await this.checkSubreddit(this.env.REDDIT_SUBREDDIT);
      }

      // Check inbox for direct messages and comment replies
      elizaLogger.info("📡 Checking inbox for messages and replies");
      await this.checkInbox();

      elizaLogger.info("✅ Event check cycle completed");
    } catch (error) {
      elizaLogger.error("❌ Error during event check cycle:", error);
    }
  }

  private async checkMentions(): Promise<void> {
    if (!this.currentUser) return;

    try {
      elizaLogger.debug(`🔍 Checking mentions for u/${this.currentUser.name}`);
      const mentions = await this.service.getUserMentions(this.currentUser.name);
      
      const newMentions = mentions.filter(mention => 
        hasResponseData(mention) && !this.processedItems.has(mention.data.id)
      );
      
      elizaLogger.info(`Found ${newMentions.length} new mentions out of ${mentions.length} total`);
      
      for (const mention of newMentions.slice(0, this.MAX_ITEMS_PER_CHECK)) {
        if (!hasResponseData(mention)) continue;
        
        elizaLogger.debug(`Processing mention:`, {
          id: mention.data.id,
          author: mention.data.author,
          subreddit: mention.data.subreddit,
          created: new Date(mention.data.created_utc * 1000).toISOString()
        });
        
        await this.handleMention(mention.data);
        this.processedItems.add(mention.data.id);
      }
    } catch (error) {
      elizaLogger.error("Error checking mentions:", error);
    }
  }

  private async checkSubreddit(subreddit: string): Promise<void> {
    try {
      elizaLogger.debug(`🔍 Checking subreddit: r/${subreddit}`);
      
      const posts = await this.service.getSubredditPosts({
        subreddit,
        sort: "new",
        limit: this.MAX_ITEMS_PER_CHECK
      });

      const newPosts = posts.filter(post => 
        hasResponseData(post) && !this.processedItems.has(post.data.id)
      );

      elizaLogger.info(`Found ${newPosts.length} new posts in r/${subreddit}`);

      for (const post of newPosts) {
        if (!hasResponseData(post)) continue;

        elizaLogger.debug(`Processing post:`, {
          id: post.data.id,
          title: post.data.title,
          author: post.data.author,
          created: new Date(post.data.created_utc * 1000).toISOString()
        });

        const comments = await this.service.getComments(post.data.id);
        const validComments = comments.filter(hasResponseData);

        elizaLogger.debug(`Found ${validComments.length} comments in post ${post.data.id}`);

        await this.handlePost(post.data, comments);
        this.processedItems.add(post.data.id);

        for (const comment of validComments) {
          if (!this.processedItems.has(comment.data.id)) {
            elizaLogger.debug(`Processing comment:`, {
              id: comment.data.id,
              author: comment.data.author,
              created: new Date(comment.data.created_utc * 1000).toISOString()
            });
            
            await this.handleComment(comment.data);
            this.processedItems.add(comment.data.id);
          }
        }
      }
    } catch (error) {
      elizaLogger.error(`Error checking subreddit r/${subreddit}:`, error);
    }
  }

  private async checkInbox(): Promise<void> {
    try {
      if (!this.currentUser) return;
      
      elizaLogger.debug(`🔍 Checking inbox for u/${this.currentUser.name}`);
      const comments = await this.service.getUserComments(this.currentUser.name);
      
      const newComments = comments.filter(comment => 
        hasResponseData(comment) && !this.processedItems.has(comment.data.id)
      );

      elizaLogger.info(`Found ${newComments.length} new inbox items`);
      
      for (const comment of newComments.slice(0, this.MAX_ITEMS_PER_CHECK)) {
        if (!hasResponseData(comment)) continue;

        elizaLogger.debug(`Processing inbox comment:`, {
          id: comment.data.id,
          author: comment.data.author,
          subreddit: comment.data.subreddit,
          created: new Date(comment.data.created_utc * 1000).toISOString()
        });
        
        await this.handleComment(comment.data);
        this.processedItems.add(comment.data.id);
      }
    } catch (error) {
      elizaLogger.error("Error checking inbox:", error);
    }
  }

  private async handleMention(mention: RedditComment): Promise<void> {
    if (!mention.body || mention.body.trim().length === 0) {
      elizaLogger.debug(`Skipping empty mention from u/${mention.author}`);
      return;
    }

    elizaLogger.debug(`Processing mention from u/${mention.author}`, {
      id: mention.id,
      subreddit: mention.subreddit,
      created: new Date(mention.created_utc * 1000).toISOString()
    });
    
    try {
      const memory = await this.createMemory(mention);
      if (!this.runtime) {
        elizaLogger.error("Cannot process mention - runtime not initialized");
        return;
      }

      await this.runtime.messageManager.createMemory(memory);
      const state = await this.composeState(memory);
      
      const shouldRespond = await this.shouldRespond(state);
      if (shouldRespond) {
        elizaLogger.debug(`Generating response for mention ${mention.id}`);
        const response = await this.generateResponse(state);
        await this.service.replyToComment(mention.id, response.text);
        elizaLogger.info(`✓ Replied to mention ${mention.id} in r/${mention.subreddit}`);
      } else {
        elizaLogger.debug(`Skipping response for mention ${mention.id} - shouldRespond returned false`);
      }
    } catch (error) {
      elizaLogger.error(`Error handling mention ${mention.id}:`, error);
    }
  }

  private async handlePost(post: RedditSubmission, comments: CommentResponse[]): Promise<void> {
    if (!post.selftext && !post.title) {
      elizaLogger.debug(`Skipping empty post ${post.id} from u/${post.author}`);
      return;
    }

    elizaLogger.debug(`Processing post from u/${post.author}`, {
      id: post.id,
      title: post.title,
      subreddit: post.subreddit,
      created: new Date(post.created_utc * 1000).toISOString()
    });
    
    try {
      const memory = await this.createMemory(post);
      if (!this.runtime) {
        elizaLogger.error("Cannot process post - runtime not initialized");
        return;
      }

      await this.runtime.messageManager.createMemory(memory);
      const state = await this.composeState(memory);
      
      const shouldRespond = await this.shouldRespond(state);
      if (shouldRespond) {
        elizaLogger.debug(`Generating response for post ${post.id}`);
        const response = await this.generateResponse(state);
        await this.service.replyToSubmission(post.id, response.text);
        elizaLogger.info(`✓ Replied to post ${post.id} in r/${post.subreddit}`);
      } else {
        elizaLogger.debug(`Skipping response for post ${post.id} - shouldRespond returned false`);
      }

      // Process any comments that mention us
      const ourMentions = comments.filter(c => 
        hasResponseData(c) && 
        c.data.body?.toLowerCase().includes(`u/${this.currentUser?.name}`.toLowerCase())
      );

      if (ourMentions.length > 0) {
        elizaLogger.debug(`Found ${ourMentions.length} mentions in comments of post ${post.id}`);
        for (const mention of ourMentions) {
          if (hasResponseData(mention) && !this.processedItems.has(mention.data.id)) {
            await this.handleMention(mention.data);
            this.processedItems.add(mention.data.id);
          }
        }
      }
    } catch (error) {
      elizaLogger.error(`Error handling post ${post.id}:`, error);
    }
  }

  private async handleComment(comment: RedditComment): Promise<void> {
    if (!comment.body || comment.body.trim().length === 0) {
      elizaLogger.debug(`Skipping empty comment ${comment.id} from u/${comment.author}`);
      return;
    }

    // Skip if it's our own comment
    if (comment.author === this.currentUser?.name) {
      elizaLogger.debug(`Skipping our own comment ${comment.id}`);
      return;
    }

    // Check if this is a reply to our comment
    let isReplyToUs = false;
    if (comment.parent_id) {
      const parentId = comment.parent_id.replace('t1_', '');
      try {
        const parentComment = await this.service.getComment(parentId);
        isReplyToUs = hasResponseData(parentComment) && parentComment.data.author === this.currentUser?.name;
        if (isReplyToUs) {
          elizaLogger.debug(`Found reply to our comment: ${comment.id} -> ${parentId}`);
        }
      } catch (error) {
        elizaLogger.debug(`Could not verify parent comment ${parentId}:`, error);
      }
    }

    elizaLogger.info(`💬 Processing comment from u/${comment.author}`, {
      id: comment.id,
      subreddit: comment.subreddit,
      created: new Date(comment.created_utc * 1000).toISOString(),
      parent_id: comment.parent_id,
      isReplyToUs,
      body: comment.body?.substring(0, 100) + (comment.body?.length > 100 ? '...' : '')
    });
    
    try {
      const memory = await this.createMemory(comment);
      if (!this.runtime) {
        elizaLogger.error("Cannot process comment - runtime not initialized");
        return;
      }

      await this.runtime.messageManager.createMemory(memory);
      const state = await this.composeState(memory);
      
      const shouldRespond = await this.shouldRespond(state);
      if (shouldRespond) {
        elizaLogger.info(`🤖 Generating response for comment ${comment.id}`);
        const response = await this.generateResponse(state);
        await this.service.replyToComment(comment.id, response.text);
        elizaLogger.success(`✓ Replied to comment ${comment.id} in r/${comment.subreddit}`, {
          responseLength: response.text.length,
          responsePreview: response.text.substring(0, 100) + (response.text.length > 100 ? '...' : '')
        });
      } else {
        elizaLogger.debug(`Skipping response for comment ${comment.id} - shouldRespond returned false`);
      }
    } catch (error) {
      elizaLogger.error(`Error handling comment ${comment.id}:`, error);
    }
  }

  private async createMemory(item: RedditSubmission | RedditComment): Promise<Memory> {
    if (!this.runtime) throw new Error("Runtime not initialized");

    const isSubmission = 'selftext' in item;
    const metadata: RedditMetadata = {
      id: item.id,
      author: item.author,
      subreddit: item.subreddit,
      created_utc: item.created_utc,
      type: isSubmission ? 'submission' : 'comment',
      parent_id: !isSubmission ? item.parent_id : undefined,
      link_id: !isSubmission ? item.link_id : undefined
    };

    const content: Content = {
      text: isSubmission ? `${item.title}\n\n${item.selftext}` : item.body,
      source: 'reddit',
      metadata
    };

    return {
      id: stringToUuid(item.id),
      userId: stringToUuid(item.author),
      agentId: this.runtime.agentId,
      roomId: stringToUuid(item.subreddit),
      content,
      embedding: await getEmbeddingZeroVector(),
      createdAt: item.created_utc * 1000
    };
  }

  private async composeState(memory: Memory): Promise<State> {
    if (!this.runtime) throw new Error("Runtime not initialized");

    const state = await this.runtime.composeState(memory);
    const metadata = memory.content.metadata as RedditMetadata;
    
    return {
      ...state,
      subreddit: this.env?.REDDIT_SUBREDDIT || '',
      currentUser: this.currentUser?.name || '',
      platform: 'reddit',
      messageType: metadata?.type || 'unknown',
      parentId: metadata?.parent_id,
      linkId: metadata?.link_id
    };
  }

  private async shouldRespond(state: State): Promise<boolean> {
    if (!this.runtime) return false;

    const context = composeContext({
      state,
      template: 'Should I respond to this Reddit interaction?'
    });

    return await generateShouldRespond({
      runtime: this.runtime,
      context,
      modelClass: ModelClass.SMALL
    }) === 'RESPOND';
  }

  private async generateResponse(state: State): Promise<Content> {
    if (!this.runtime) throw new Error("Runtime not initialized");

    const context = composeContext({
      state,
      template: 'Generate a response to this Reddit interaction.'
    });

    return await generateMessageResponse({
      runtime: this.runtime,
      context,
      modelClass: ModelClass.SMALL
    });
  }

  public cleanup(): void {
    elizaLogger.debug("🧹 Cleaning up event manager");
    this.processedItems.clear();
    this.lastCheckedTime = 0;
    this.runtime = null;
    this.env = null;
    this.currentUser = null;
  }
}
