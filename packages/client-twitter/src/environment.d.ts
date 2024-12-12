import { IAgentRuntime } from "@ai16z/eliza";
import { z } from "zod";
export declare const twitterEnvSchema: z.ZodObject<{
    TWITTER_DRY_RUN: z.ZodEffects<z.ZodString, boolean, string>;
    TWITTER_USERNAME: z.ZodString;
    TWITTER_PASSWORD: z.ZodString;
    TWITTER_EMAIL: z.ZodString;
    TWITTER_COOKIES: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    TWITTER_USERNAME: string;
    TWITTER_PASSWORD: string;
    TWITTER_EMAIL: string;
    TWITTER_DRY_RUN: boolean;
    TWITTER_COOKIES?: string | undefined;
}, {
    TWITTER_USERNAME: string;
    TWITTER_PASSWORD: string;
    TWITTER_EMAIL: string;
    TWITTER_DRY_RUN: string;
    TWITTER_COOKIES?: string | undefined;
}>;
export type TwitterConfig = z.infer<typeof twitterEnvSchema>;
export declare function validateTwitterConfig(runtime: IAgentRuntime): Promise<TwitterConfig>;
