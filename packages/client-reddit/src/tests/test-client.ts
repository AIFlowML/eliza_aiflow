import { elizaLogger, IAgentRuntime } from "@ai16z/eliza";
import Snoowrap, { Listing, Subreddit } from "snoowrap";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import { validateRedditEnv } from "../environment.js";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
const envPath = path.resolve(__dirname, '../../../.env');
elizaLogger.info(`Loading .env file from: ${envPath}`);
dotenv.config({ path: envPath });

async function main() {
  try {
    elizaLogger.info("🚀 Testing Reddit client...");
    
    // Load and validate environment variables
    const requiredEnvVars = {
      REDDIT_CLIENT_ID: process.env.REDDIT_CLIENT_ID,
      REDDIT_CLIENT_SECRET: process.env.REDDIT_CLIENT_SECRET,
      REDDIT_USER_AGENT: process.env.REDDIT_USER_AGENT,
      REDDIT_REFRESH_TOKEN: process.env.REDDIT_REFRESH_TOKEN,
      REDDIT_APP_NAME: process.env.REDDIT_APP_NAME
    };

    // Check for missing environment variables
    const missingVars = Object.entries(requiredEnvVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    elizaLogger.info("Environment variables loaded successfully");

    // Create runtime for environment
    const runtime: IAgentRuntime = {
      getSetting: (key: string) => process.env[key] || "",
    } as IAgentRuntime;

    // Validate environment configuration
    elizaLogger.info("🔍 Validating environment configuration...");
    const env = await validateRedditEnv(runtime);
    elizaLogger.info("✅ Environment configuration validated");

    // Initialize Snoowrap with validated credentials
    elizaLogger.info("🔄 Initializing Reddit client...");
    const client = new Snoowrap({
      userAgent: env.REDDIT_USER_AGENT,
      clientId: env.REDDIT_CLIENT_ID,
      clientSecret: env.REDDIT_CLIENT_SECRET,
      refreshToken: env.REDDIT_REFRESH_TOKEN
    });

    // Configure client behavior
    client.config({
      requestDelay: 1000,
      continueAfterRatelimitError: true,
      retryErrorCodes: [502, 503, 504, 522],
      maxRetryAttempts: 3
    });

    // Test authentication
    elizaLogger.info("🔑 Testing authentication...");
    const userPromise = client.getMe()
      .then(user => {
        elizaLogger.info(`✅ Successfully authenticated as: ${user.name}`);
        elizaLogger.info(`Link Karma: ${user.link_karma}`);
        elizaLogger.info(`Comment Karma: ${user.comment_karma}`);
        return user;
      }) as Promise<void>;

    // Test subreddit access
    elizaLogger.info("\n📚 Fetching subscribed subreddits...");
    const subredditsPromise = Promise.resolve(client.getSubscriptions())
      .then((listing: Listing<Subreddit>) => listing.fetchAll())
      .then((subreddits: Subreddit[]) => {
        elizaLogger.info(`✅ Successfully fetched ${subreddits.length} subreddits`);
        if (subreddits.length > 0) {
          elizaLogger.info("First 5 subreddits:");
          subreddits.slice(0, 5).forEach((sub: Subreddit) => {
            elizaLogger.info(`- r/${sub.display_name} (${sub.subscribers} subscribers)`);
          });
        }
        return subreddits;
      }) as Promise<void>;

    // Wait for all operations to complete
    await Promise.all([userPromise, subredditsPromise]);

    elizaLogger.info("\n✅ All tests completed successfully!");

  } catch (error) {
    elizaLogger.error("❌ Error testing Reddit client:");
    if (error instanceof Error) {
      elizaLogger.error(`Error message: ${error.message}`);
      elizaLogger.error(`Stack trace: ${error.stack}`);
    } else {
      elizaLogger.error("Unknown error:", error);
    }
    process.exit(1);
  }
}

// Run if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    elizaLogger.error("❌ Unhandled error:", error);
    process.exit(1);
  });
}

export { main as testRedditClient }; 