import dotenv from "dotenv";
import { elizaLogger, IAgentRuntime } from "@ai16z/eliza";
import { UserInteractionAction } from "../actions/user-interaction.action";
import type { SubredditConfig } from "../actions/user-interaction.action";

// Load environment variables
dotenv.config();

async function main() {
  // Create a minimal runtime for testing
  const runtime: IAgentRuntime = {
    getSetting: (key: string) => process.env[key] || "",
  } as IAgentRuntime;

  try {
    elizaLogger.info("🚀 Starting Reddit User Interaction Example");
    elizaLogger.info("----------------------------------------");

    // Initialize the user interaction action
    elizaLogger.info("Initializing user interaction action...");
    const userAction = UserInteractionAction.getInstance();
    await userAction.initialize(runtime);

    // Configure test subreddit
    const testSubreddit: SubredditConfig = {
      name: "test", // Replace with your test subreddit
      allowedTopics: [
        "python",
        "javascript",
        "typescript",
        "react",
        "node"
      ],
      forbiddenTopics: [
        "politics",
        "cryptocurrency",
        "nsfw",
        "controversy"
      ],
      allowedPostTypes: ["text", "link"],
      minimumKarma: 50,
      minimumAccountAgeDays: 30,
      customRules: [
        "Be respectful and professional",
        "Stay on technical topics",
        "No recruitment or job posts",
        "English language only",
        "Format code properly"
      ]
    };

    elizaLogger.info("\n📋 Configuring subreddit rules:");
    elizaLogger.info(`Subreddit: r/${testSubreddit.name}`);
    elizaLogger.info("Allowed Topics:", testSubreddit.allowedTopics);
    elizaLogger.info("Forbidden Topics:", testSubreddit.forbiddenTopics);
    elizaLogger.info("Allowed Post Types:", testSubreddit.allowedPostTypes);
    elizaLogger.info("Minimum Requirements:");
    elizaLogger.info(`- Karma: ${testSubreddit.minimumKarma}`);
    elizaLogger.info(`- Account Age: ${testSubreddit.minimumAccountAgeDays} days`);
    elizaLogger.info("\nCustom Rules:");
    testSubreddit.customRules.forEach((rule: string, index: number) => {
      elizaLogger.info(`${index + 1}. ${rule}`);
    });

    // Configure the subreddit
    userAction.configureSubreddit(testSubreddit);

    // Start monitoring
    elizaLogger.info("\n🔍 Starting subreddit monitoring...");
    elizaLogger.info("Will check for:");
    elizaLogger.info("- New posts matching allowed topics");
    elizaLogger.info("- Direct mentions of bot");
    elizaLogger.info("- Responses to bot's comments");
    elizaLogger.info("\nMonitoring will run for 5 minutes...");

    // Monitor for 5 minutes
    const monitoringTime = 5 * 60 * 1000; // 5 minutes
    const startTime = Date.now();

    while (Date.now() - startTime < monitoringTime) {
      await userAction.monitorSubreddit(testSubreddit.name);
      
      // Wait for 30 seconds before next check
      elizaLogger.info("\n⏳ Waiting 30 seconds before next check...");
      await new Promise(resolve => setTimeout(resolve, 30000));
      
      const timeLeft = Math.round((monitoringTime - (Date.now() - startTime)) / 1000);
      elizaLogger.info(`⏰ Time remaining: ${timeLeft} seconds`);
    }

    // Cleanup
    elizaLogger.info("\n🧹 Cleaning up...");
    userAction.cleanup();

  } catch (error) {
    elizaLogger.error("----------------------------------------");
    elizaLogger.error("❌ Error in Reddit User Interaction Example:");
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
main().catch((error) => {
  elizaLogger.error("❌ Unhandled error:", error);
  process.exit(1);
});
