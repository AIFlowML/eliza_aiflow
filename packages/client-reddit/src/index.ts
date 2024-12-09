/**
 * Reddit Client for Eliza AI Agent
 * Handles Reddit interactions, event processing, and message management
 */

import { elizaLogger, IAgentRuntime, Client as ElizaClient } from "@ai16z/eliza";
import { RedditService } from "./services/reddit.service";
import { EventManager } from "./events";
import { validateRedditEnv } from "./environment";
import { commentAction } from "./actions/comment.action";
import { PostContentAction } from "./actions/post-content.action";
import { UserInteractionAction } from "./actions/user-interaction.action";
import { RetrieveDataAction } from "./actions/retrieve-data.action";

export class RedditClient {
  private static instance: RedditClient | null = null;
  private service: RedditService;
  private eventManager: EventManager;
  private runtime: IAgentRuntime;
  private isInitialized: boolean = false;

  private constructor(runtime: IAgentRuntime) {
    this.runtime = runtime;
    this.service = RedditService.getInstance();
    this.eventManager = EventManager.getInstance();
  }

  public static getInstance(runtime?: IAgentRuntime): RedditClient {
    if (!RedditClient.instance && runtime) {
      RedditClient.instance = new RedditClient(runtime);
    } else if (!RedditClient.instance) {
      throw new Error("RedditClient must be initialized with a runtime");
    }
    return RedditClient.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      elizaLogger.warn("⚠️ RedditClient already initialized - skipping initialization");
      return;
    }

    elizaLogger.info("🚀 Starting RedditClient initialization");

    try {
      // Initialize core services
      elizaLogger.info("◎ Initializing Reddit service");
      await this.service.initialize(this.runtime);
      
      // Validate environment first to ensure all configs are correct
      elizaLogger.info("◎ Validating environment configuration");
      await validateRedditEnv(this.runtime);
      elizaLogger.info(`✓ Environment validation successful`);

      // Get current user info early to validate authentication
      elizaLogger.info("◎ Retrieving bot user information");
      const currentUser = await this.service.getCurrentUser();
      elizaLogger.info(`✓ Bot user authenticated: u/${currentUser.name}`, {
        id: currentUser.id,
        created: new Date(currentUser.created_utc * 1000).toISOString(),
        karma: {
          comment: currentUser.comment_karma,
          link: currentUser.link_karma
        }
      });

      // Initialize event manager with validated environment
      elizaLogger.info("◎ Initializing event manager");
      await this.eventManager.initialize(this.runtime);

      // Initialize and register user interaction action
      elizaLogger.info("◎ Initializing user interaction action");
      const userAction = UserInteractionAction.getInstance();
      await userAction.initialize(this.runtime);
      
      elizaLogger.info("◎ Registering user interaction action");
      await this.runtime.registerAction(userAction);
      elizaLogger.success("✓ Registering action: REDDIT_USER_INTERACTION");

      // Comment action temporarily disabled while developing user interaction
      // elizaLogger.info("◎ Registering comment action");
      // await this.runtime.registerAction(commentAction);
      // elizaLogger.success("✓ Registering action: REDDIT_COMMENT");

      this.isInitialized = true;
      elizaLogger.success("✨ RedditClient initialization complete");
    } catch (error) {
      elizaLogger.error("❌ Failed to initialize RedditClient:", error);
      throw error;
    }
  }

  public async checkForEvents(): Promise<void> {
    if (!this.isInitialized) {
      elizaLogger.error("❌ Cannot check for events - RedditClient not initialized");
      return;
    }

    try {
      const startTime = Date.now();
      elizaLogger.debug("🔄 Starting event check cycle");
      await this.eventManager.checkForNewEvents();
      const duration = Date.now() - startTime;
      elizaLogger.debug(`✓ Event check cycle completed in ${duration}ms`);
    } catch (error) {
      elizaLogger.error("❌ Error during event check cycle:", error, {
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  }

  public cleanup(): void {
    elizaLogger.info("🧹 Starting cleanup process");
    
    try {
      elizaLogger.debug("◎ Cleaning up Reddit service");
      this.service.cleanup();
      
      elizaLogger.debug("◎ Cleaning up event manager");
      this.eventManager.cleanup();
      
      this.isInitialized = false;
      elizaLogger.success("✨ Cleanup completed successfully");
    } catch (error) {
      elizaLogger.error("❌ Error during cleanup:", error);
    }
  }
}

export const RedditClientInterface: ElizaClient = {
  start: async (runtime?: IAgentRuntime) => {
    elizaLogger.info("RedditClientInterface start");
    try {
      if (!runtime) throw new Error("Runtime is required");
      const client = RedditClient.getInstance(runtime);
      await client.initialize();
      return client as any; // Type assertion needed for ElizaClient interface
    } catch (error) {
      elizaLogger.error("Failed to start RedditClientInterface:", error);
      throw error;
    }
  },
  stop: async () => {
    const client = RedditClient.getInstance();
    await client.cleanup();
  },
};

// Export actions for external use
export { commentAction, PostContentAction, UserInteractionAction, RetrieveDataAction };

// Export types
export * from "./types/reddit-types";

// Default export
export default RedditClientInterface;
