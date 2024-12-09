import dotenv from "dotenv";
import { elizaLogger, IAgentRuntime, Character, Memory, UUID } from "@ai16z/eliza";
import { commentAction } from "../actions/comment.action";
import { RedditService } from "../services/reddit.service";
import OpenAI from "openai";

// Load environment variables from local .env file
dotenv.config();

async function main() {
  // Initialize OpenAI
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Create a minimal runtime for testing
  const runtime = {
    getSetting: (key: string) => process.env[key] || "",
    character: {
      name: "TestBot",
      bio: "I am a test bot for the Reddit client.",
    } as Character,
    agentId: "test-agent",
    composeState: async () => ({}),
    serverUrl: process.env.ELIZA_SERVER_URL || "http://localhost:3000",
    databaseAdapter: null,
    token: process.env.OPENAI_API_KEY || "",
    modelProvider: "openai",
    imageModelProvider: "openai",
    providers: {
      openai: {
        client: openai,
        config: {
          apiKey: process.env.OPENAI_API_KEY,
          organization: process.env.OPENAI_ORG_ID,
        }
      }
    },
    actions: {},
    evaluators: {},
    services: {},
    messageManager: {
      createMemory: async (memory: Memory) => memory,
      getMemory: async () => [],
      getMemoryByRoomId: async () => [],
      getMemoryByUserId: async () => [],
      getMemoryByAgentId: async () => [],
      getMemoryByContent: async () => [],
      deleteMemory: async () => {},
      updateMemory: async () => {},
    },
    registerAction: async () => {},
    registerService: async () => {},
    getService: () => null,
    getAction: () => null,
    getMemory: async () => [],
    saveMemory: async () => {},
    getState: async () => ({}),
    setState: async () => {},
    composeContext: () => "",
    // Hardcode responses for testing
    generateResponse: async () => ({ text: "Test response" }),
    generateShouldRespond: async () => "RESPOND",
    generateMessageResponse: async () => ({ text: "Test message" }),
    generateActionResponse: async () => ({ text: "Test action" }),
    generateStateResponse: async () => ({ text: "Test state" }),
    generateMemoryResponse: async () => ({ text: "Test memory" }),
    generateContextResponse: async () => ({ text: "Test context" }),
    generateText: async () => ({ text: "Test text" }),
  } as unknown as IAgentRuntime;

  try {
    elizaLogger.info("🚀 Starting Reddit Comment Example");
    elizaLogger.info("----------------------------------------");

    // Initialize the Reddit service
    elizaLogger.info("Initializing Reddit service...");
    const service = RedditService.getInstance();
    await service.initialize(runtime);

    // Get the test post URL from environment or use hardcoded one
    const testPostUrl = process.env.REDDIT_COMMENTS_TEST || "https://www.reddit.com/r/ethereum/comments/1h62hdi/just_wonder_how_can_people_raise_and_discuss/";
    elizaLogger.info(`📝 Target Post URL: ${testPostUrl}`);

    // Extract post ID from URL
    const postId = testPostUrl.split('/comments/')[1]?.split('/')[0];
    if (!postId) {
      throw new Error("Could not extract post ID from URL");
    }
    elizaLogger.info(`🔑 Extracted Post ID: ${postId}`);

    // Create a test memory object with explicit UUID types
    const userId: UUID = "00000000-0000-0000-0000-000000000000" as UUID;
    const agentId: UUID = "00000000-0000-0000-0000-000000000001" as UUID;
    const roomId: UUID = "00000000-0000-0000-0000-000000000002" as UUID;

    const testMemory: Memory = {
      content: {
        id: postId,
        source: "reddit",
        text: "Please comment on this post",
      },
      createdAt: Date.now(),
      userId,
      agentId,
      roomId,
      embedding: new Array(1536).fill(0),
    };

    // Update runtime agentId to match
    runtime.agentId = agentId;

    // Validate and handle the comment
    elizaLogger.info("💬 Attempting to post comment...");
    const isValid = await commentAction.validate(runtime, testMemory, undefined);
    
    if (!isValid) {
      throw new Error("Comment validation failed");
    }

    const result = await commentAction.handler(
      runtime,
      testMemory,
      undefined,
      {},
      async (content) => {
        elizaLogger.info("Callback received:", content);
        return [testMemory];
      }
    );

    if (!result || typeof result !== 'object' || !('text' in result)) {
      throw new Error("Invalid comment result");
    }

    const comment = result as { text: string; id?: string; timestamp?: string };
    
    elizaLogger.info("----------------------------------------");
    if (comment.text.startsWith("Error:")) {
      elizaLogger.error("❌ Comment posting failed!");
      elizaLogger.error(`Error: ${comment.text}`);
    } else {
      elizaLogger.info("✅ Comment posted successfully!");
      elizaLogger.info(`💬 Comment text: "${comment.text}"`);
      elizaLogger.info(`🔗 Comment ID: ${comment.id || 'N/A'}`);
      elizaLogger.info(`⏰ Posted at: ${comment.timestamp || new Date().toISOString()}`);
    }
    elizaLogger.info("----------------------------------------");

  } catch (error: unknown) {
    elizaLogger.error("----------------------------------------");
    elizaLogger.error("❌ Error in Reddit Comment Example:");
    if (error instanceof Error) {
      elizaLogger.error(`Error message: ${error.message}`);
      elizaLogger.error(`Error stack: ${error.stack}`);
    } else {
      elizaLogger.error("Unknown error:", error);
    }
    elizaLogger.error("----------------------------------------");
    process.exit(1);
  }
}

// Run the example
main().catch((error: unknown) => {
  elizaLogger.error("❌ Unhandled error:", error);
  process.exit(1);
});
