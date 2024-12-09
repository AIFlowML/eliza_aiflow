import dotenv from "dotenv";
import { elizaLogger, IAgentRuntime, Character, Memory, UUID } from "@ai16z/eliza";
import { PostContentAction } from "../actions/post-content.action";
import { RedditService } from "../services/reddit.service";
import { RedditComment, hasResponseData } from "../types/reddit-types";

// Load environment variables
dotenv.config();

async function main() {
  // Create a minimal runtime for testing
  const runtime = {
    getSetting: (key: string) => process.env[key] || "",
    character: {
      name: "TestBot",
      bio: "I am a test bot for the Reddit client.",
    } as Character,
    agentId: "00000000-0000-0000-0000-000000000001" as UUID,
    composeState: async () => ({}),
    serverUrl: "http://localhost:3000",
    databaseAdapter: null,
    token: "test-token",
    modelProvider: "openai",
    imageModelProvider: "openai",
    providers: {},
    actions: {},
    evaluators: {},
    services: {},
    registerAction: async () => {},
    registerService: async () => {},
    getService: () => null,
    getAction: () => null,
    getMemory: async () => [],
    saveMemory: async () => {},
    getState: async () => ({}),
    setState: async () => {},
    composeContext: () => "",
    generateResponse: async () => ({ text: "" }),
    generateShouldRespond: async () => "RESPOND",
    generateMessageResponse: async () => ({ text: "" }),
    generateActionResponse: async () => ({ text: "" }),
    generateStateResponse: async () => ({ text: "" }),
    generateMemoryResponse: async () => ({ text: "" }),
    generateContextResponse: async () => ({ text: "" }),
  } as unknown as IAgentRuntime;

  try {
    elizaLogger.info("🚀 Starting Reddit Post Content Example");
    elizaLogger.info("----------------------------------------");

    // Initialize the Reddit service and post action
    elizaLogger.info("Initializing services...");
    const service = RedditService.getInstance();
    const postAction = PostContentAction.getInstance();
    await Promise.all([
      service.initialize(runtime),
      postAction.initialize(runtime)
    ]);

    // Test URLs
    const testUrls = [
      "https://www.reddit.com/r/nvidia/comments/1h6v6s5/a_valve_engineer_fixed_3d_lighting_so_hard_he_had/",
      "https://www.reddit.com/r/apple/comments/1h7g2wh/ios_182_rc_now_available_to_developers_and_public/"
    ];

    // Process each post
    for (const url of testUrls) {
      elizaLogger.info(`\n📝 Processing post: ${url}`);
      
      // 1. Find and read the post
      const foundPost = await postAction.findPost(url);
      if (!foundPost || !hasResponseData(foundPost)) {
        elizaLogger.error(`❌ Could not find post: ${url}`);
        continue;
      }

      // Create memory for the post
      const postMemory: Memory = {
        content: {
          id: foundPost.data.id,
          source: "reddit",
          text: `${foundPost.data.title}\n\n${foundPost.data.selftext}`,
          title: foundPost.data.title,
        },
        createdAt: foundPost.data.created_utc * 1000,
        userId: "00000000-0000-0000-0000-000000000000" as UUID,
        agentId: runtime.agentId,
        roomId: "00000000-0000-0000-0000-000000000002" as UUID,
      };

      // Save the post memory using messageManager
      await runtime.messageManager.createMemory(postMemory);

      // 2. Display post content
      elizaLogger.info("\n=== Post Content ===");
      elizaLogger.info(`Title: ${foundPost.data.title}`);
      elizaLogger.info(`Author: u/${foundPost.data.author}`);
      elizaLogger.info(`Subreddit: r/${foundPost.data.subreddit}`);
      elizaLogger.info(`Content: ${foundPost.data.selftext.substring(0, 200)}...`);

      // 3. Read existing comments
      const postData = await postAction.readPost(foundPost.data.id);
      if (!postData) {
        elizaLogger.error(`❌ Could not read post data: ${foundPost.data.id}`);
        continue;
      }
      const { comments: initialComments } = postData;
      
      elizaLogger.info(`\n💬 Found ${initialComments.length} comments`);
      elizaLogger.info("\n=== Recent Comments ===");
      initialComments.slice(0, 3).forEach((comment: RedditComment) => {
        elizaLogger.info(`\nFrom: u/${comment.author}`);
        elizaLogger.info(`Content: ${comment.body.substring(0, 100)}...`);
        elizaLogger.info(`Posted: ${new Date(comment.created_utc * 1000).toLocaleString()}`);
      });

      // 4. Post our initial comment
      elizaLogger.info("\n💭 Posting initial comment...");
      const newComment = await postAction.commentOnPost(foundPost.data.id, "Cool");
      
      if (newComment) {
        elizaLogger.info("✅ Successfully posted comment");
        elizaLogger.info(`Comment ID: ${newComment.id}`);
        elizaLogger.info(`Posted at: ${new Date(newComment.created_utc * 1000).toLocaleString()}`);

        // 5. Monitor for responses
        elizaLogger.info("\n🔍 Starting to monitor for responses...");
        const replies = await postAction.monitorComment(newComment.id);
        
        if (replies.length > 0) {
          elizaLogger.info(`Found ${replies.length} new responses:`);
          replies.forEach((reply: RedditComment) => {
            elizaLogger.info(`\nFrom: u/${reply.author}`);
            elizaLogger.info(`Content: ${reply.body}`);
            elizaLogger.info(`Posted: ${new Date(reply.created_utc * 1000).toLocaleString()}`);
          });

          // Reply to the first response
          const firstReply = replies[0];
          elizaLogger.info("\n💭 Replying to first response...");
          const replyComment = await postAction.replyToComment(
            firstReply.id,
            "Thanks for your response! This is an automated test reply."
          );

          if (replyComment) {
            elizaLogger.info("✅ Successfully posted reply");
          }
        } else {
          elizaLogger.info("No responses found during the monitoring period");
        }
      }

      elizaLogger.info("\n----------------------------------------\n");
    }

    // Cleanup
    elizaLogger.info("\n🧹 Cleaning up...");
    postAction.cleanup();

  } catch (error: unknown) {
    elizaLogger.error("----------------------------------------");
    elizaLogger.error("❌ Error in Reddit Post Content Example:");
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
