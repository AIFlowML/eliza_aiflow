import { Telegraf } from "telegraf";
import { elizaLogger } from "@ai16z/eliza";
import { MessageManager } from "./messageManager.ts";
import { getOrCreateRecommenderInBe } from "./getOrCreateRecommenderInBe.ts";
export class TelegramClient {
    constructor(runtime, botToken) {
        elizaLogger.log("📱 Constructing new TelegramClient...");
        this.runtime = runtime;
        this.bot = new Telegraf(botToken);
        this.messageManager = new MessageManager(this.bot, this.runtime);
        this.backend = runtime.getSetting("BACKEND_URL");
        this.backendToken = runtime.getSetting("BACKEND_TOKEN");
        this.tgTrader = runtime.getSetting("TG_TRADER"); // boolean To Be added to the settings
        elizaLogger.log("✅ TelegramClient constructor completed");
    }
    async start() {
        elizaLogger.log("🚀 Starting Telegram bot...");
        try {
            await this.initializeBot();
            this.setupMessageHandlers();
            this.setupShutdownHandlers();
        }
        catch (error) {
            elizaLogger.error("❌ Failed to launch Telegram bot:", error);
            throw error;
        }
    }
    async initializeBot() {
        this.bot.launch({ dropPendingUpdates: true });
        elizaLogger.log("✨ Telegram bot successfully launched and is running!");
        const botInfo = await this.bot.telegram.getMe();
        this.bot.botInfo = botInfo;
        elizaLogger.success(`Bot username: @${botInfo.username}`);
        this.messageManager.bot = this.bot;
    }
    setupMessageHandlers() {
        elizaLogger.log("Setting up message handler...");
        this.bot.on("message", async (ctx) => {
            try {
                if (this.tgTrader) {
                    const userId = ctx.from?.id.toString();
                    const username = ctx.from?.username || ctx.from?.first_name || "Unknown";
                    if (!userId) {
                        elizaLogger.warn("Received message from a user without an ID.");
                        return;
                    }
                    try {
                        await getOrCreateRecommenderInBe(userId, username, this.backendToken, this.backend);
                    }
                    catch (error) {
                        elizaLogger.error("Error getting or creating recommender in backend", error);
                    }
                }
                await this.messageManager.handleMessage(ctx);
            }
            catch (error) {
                elizaLogger.error("❌ Error handling message:", error);
                await ctx.reply("An error occurred while processing your message.");
            }
        });
        this.bot.on("photo", (ctx) => {
            elizaLogger.log("📸 Received photo message with caption:", ctx.message.caption);
        });
        this.bot.on("document", (ctx) => {
            elizaLogger.log("📎 Received document message:", ctx.message.document.file_name);
        });
        this.bot.catch((err, ctx) => {
            elizaLogger.error(`❌ Telegram Error for ${ctx.updateType}:`, err);
            ctx.reply("An unexpected error occurred. Please try again later.");
        });
    }
    setupShutdownHandlers() {
        const shutdownHandler = async (signal) => {
            elizaLogger.log(`⚠️ Received ${signal}. Shutting down Telegram bot gracefully...`);
            try {
                await this.stop();
                elizaLogger.log("🛑 Telegram bot stopped gracefully");
            }
            catch (error) {
                elizaLogger.error("❌ Error during Telegram bot shutdown:", error);
                throw error;
            }
        };
        process.once("SIGINT", () => shutdownHandler("SIGINT"));
        process.once("SIGTERM", () => shutdownHandler("SIGTERM"));
        process.once("SIGHUP", () => shutdownHandler("SIGHUP"));
    }
    async stop() {
        elizaLogger.log("Stopping Telegram bot...");
        await this.bot.stop();
        elizaLogger.log("Telegram bot stopped");
    }
}
//# sourceMappingURL=telegramClient.js.map