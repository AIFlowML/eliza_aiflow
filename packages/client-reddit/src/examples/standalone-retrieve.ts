import dotenv from "dotenv";
import { elizaLogger, IAgentRuntime } from "@ai16z/eliza";
import { RetrieveDataAction } from "../actions/retrieve-data.action";
import { RedditSubmission, hasResponseData } from "../types/reddit-types";

// Load environment variables
dotenv.config();

// Define our base types for display purposes
interface DisplaySubmission {
  id: string;
  title: string;
  selftext: string;
  author: string;
  score?: number;
  num_comments?: number;
  created_utc: number;
  url?: string;
  subreddit: string;
  is_self: boolean;
}

interface DisplaySubreddit {
  display_name: string;
  subscribers?: number;
  public_description?: string;
  description?: string;
  created_utc: number;
  over18?: boolean;
  url?: string;
  active_user_count?: number;
}

// Helper function to format submission for display
function formatSubmission(post: RedditSubmission): DisplaySubmission {
  return {
    id: post.id,
    title: post.title,
    selftext: post.selftext,
    author: post.author,
    created_utc: post.created_utc,
    url: post.url,
    subreddit: post.subreddit,
    is_self: post.is_self
  };
}

// Helper function to format subreddit for display
function formatSubreddit(sub: any): DisplaySubreddit {
  return {
    display_name: sub.display_name || sub.name,
    subscribers: sub.subscribers,
    public_description: sub.public_description,
    description: sub.description,
    created_utc: sub.created_utc,
    over18: sub.over18,
    url: sub.url,
    active_user_count: sub.active_user_count
  };
}

async function main() {
  const action = RetrieveDataAction.getInstance();

  try {
    // Create a minimal runtime for testing
    const runtime: IAgentRuntime = {
      getSetting: (key: string) => process.env[key] || "",
    } as IAgentRuntime;

    // Initialize the action
    elizaLogger.info("🚀 Initializing RetrieveData action...");
    await action.initialize(runtime);

    // Test Case 1: Search for specific topics
    const searchTopics = ["NFT", "DeFi", "Web3"];
    for (const topic of searchTopics) {
      elizaLogger.info(`\n🔍 Searching for "${topic}" posts...`);
      const searchResults = await action.searchPosts({
        query: topic,
        sort: 'hot',
        timeframe: 'week',
        limit: 3
      });

      elizaLogger.info(`=== Found ${searchResults.length} ${topic} posts ===`);
      searchResults.forEach((post) => {
        if (hasResponseData(post)) {
          const formattedPost = formatSubmission(post.data);
          elizaLogger.info(`\n- Title: ${formattedPost.title}`);
          elizaLogger.info(`  Subreddit: r/${formattedPost.subreddit}`);
          elizaLogger.info(`  Author: u/${formattedPost.author}`);
          elizaLogger.info(`  Created: ${new Date(formattedPost.created_utc * 1000).toLocaleDateString()}`);
        }
      });
    }

    // Test Case 2: Get Solana subreddit info
    elizaLogger.info("\n📚 Getting info for r/solana...");
    const solanaSubInfo = await action.getSubreddit("solana");
    if (solanaSubInfo) {
      const formattedSub = formatSubreddit(solanaSubInfo);
      elizaLogger.info("=== Solana Subreddit Info ===");
      elizaLogger.info(`Name: r/${formattedSub.display_name}`);
      elizaLogger.info(`Description: ${formattedSub.public_description || 'N/A'}`);
      elizaLogger.info(`Created: ${new Date(formattedSub.created_utc * 1000).toLocaleDateString()}`);
    }

    // Test Case 3: Get latest posts from monitored subreddits
    for (const subreddit of ["solana", "ethereum"]) {
      elizaLogger.info(`\n📝 Getting latest posts from r/${subreddit}...`);
      const posts = await action.getSubredditPosts({
        subreddit,
        sort: "hot",
        limit: 3,
      });

      elizaLogger.info(`=== Latest Posts in r/${subreddit} ===`);
      posts.forEach((post) => {
        if (hasResponseData(post)) {
          const formattedPost = formatSubmission(post.data);
          elizaLogger.info(`\n- Title: ${formattedPost.title}`);
          elizaLogger.info(`  Author: u/${formattedPost.author}`);
          elizaLogger.info(`  Created: ${new Date(formattedPost.created_utc * 1000).toLocaleDateString()}`);
          elizaLogger.info(`  URL: ${formattedPost.url || 'N/A'}`);
        }
      });
    }

    // Cleanup
    elizaLogger.info("\n🧹 Cleaning up...");
    action.cleanup();

  } catch (error) {
    elizaLogger.error("❌ Error:", error);
    if (error instanceof Error) {
      elizaLogger.error("Error message:", error.message);
      elizaLogger.error("Stack trace:", error.stack);
    }
  }
}

// Run the example
main().catch((error) => {
  elizaLogger.error("❌ Unhandled error:", error);
  process.exit(1);
});
