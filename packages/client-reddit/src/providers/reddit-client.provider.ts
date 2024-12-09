import { elizaLogger, IAgentRuntime } from "@ai16z/eliza";
import Snoowrap from "snoowrap";
import { getOAuthConfig } from "../environment";

export class RedditClientProvider {
  private static instance: RedditClientProvider | null = null;
  private _client: Snoowrap | null = null;

  private constructor() {}

  public static getInstance(): RedditClientProvider {
    if (!RedditClientProvider.instance) {
      RedditClientProvider.instance = new RedditClientProvider();
    }
    return RedditClientProvider.instance;
  }

  public async getClient(runtime: IAgentRuntime): Promise<Snoowrap> {
    if (this._client) {
      return this._client;
    }

    try {
      elizaLogger.debug("🔄 Initializing Reddit client");
      const config = await getOAuthConfig(runtime);
      
      elizaLogger.debug("📋 Client configuration:", {
        appName: config.appName,
        userAgent: config.userAgent,
        hasRefreshToken: !!config.refreshToken
      });

      this._client = new Snoowrap({
        userAgent: config.userAgent,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        refreshToken: config.refreshToken
      });

      elizaLogger.debug("✅ Reddit client initialized successfully");
      return this._client;
    } catch (error) {
      elizaLogger.error("❌ Failed to initialize Reddit client:", error);
      throw error;
    }
  }

  public cleanup(): void {
    elizaLogger.debug("🧹 Cleaning up Reddit client");
    this._client = null;
  }
}
