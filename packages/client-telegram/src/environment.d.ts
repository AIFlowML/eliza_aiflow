import { IAgentRuntime } from "@ai16z/eliza";
import { z } from "zod";
export declare const telegramEnvSchema: z.ZodObject<{
    TELEGRAM_BOT_TOKEN: z.ZodString;
}, "strip", z.ZodTypeAny, {
    TELEGRAM_BOT_TOKEN: string;
}, {
    TELEGRAM_BOT_TOKEN: string;
}>;
export type TelegramConfig = z.infer<typeof telegramEnvSchema>;
export declare function validateTelegramConfig(runtime: IAgentRuntime): Promise<TelegramConfig>;
