import { z } from "zod";
export const telegramEnvSchema = z.object({
    TELEGRAM_BOT_TOKEN: z.string().min(1, "Telegram bot token is required"),
});
export async function validateTelegramConfig(runtime) {
    try {
        const config = {
            TELEGRAM_BOT_TOKEN: runtime.getSetting("TELEGRAM_BOT_TOKEN") ||
                process.env.TELEGRAM_BOT_TOKEN,
        };
        return telegramEnvSchema.parse(config);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(`Telegram configuration validation failed:\n${errorMessages}`);
        }
        throw error;
    }
}
//# sourceMappingURL=environment.js.map