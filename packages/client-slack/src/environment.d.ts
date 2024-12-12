import { IAgentRuntime } from "@ai16z/eliza";
import { z } from "zod";
export declare const slackEnvSchema: z.ZodObject<{
    SLACK_APP_ID: z.ZodString;
    SLACK_CLIENT_ID: z.ZodString;
    SLACK_CLIENT_SECRET: z.ZodString;
    SLACK_SIGNING_SECRET: z.ZodString;
    SLACK_VERIFICATION_TOKEN: z.ZodString;
    SLACK_BOT_TOKEN: z.ZodString;
    SLACK_SERVER_PORT: z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>;
}, "strip", z.ZodTypeAny, {
    SLACK_APP_ID: string;
    SLACK_CLIENT_ID: string;
    SLACK_CLIENT_SECRET: string;
    SLACK_SIGNING_SECRET: string;
    SLACK_VERIFICATION_TOKEN: string;
    SLACK_BOT_TOKEN: string;
    SLACK_SERVER_PORT: number;
}, {
    SLACK_APP_ID: string;
    SLACK_CLIENT_ID: string;
    SLACK_CLIENT_SECRET: string;
    SLACK_SIGNING_SECRET: string;
    SLACK_VERIFICATION_TOKEN: string;
    SLACK_BOT_TOKEN: string;
    SLACK_SERVER_PORT?: string | undefined;
}>;
export type SlackConfig = z.infer<typeof slackEnvSchema>;
export declare function validateSlackConfig(runtime: IAgentRuntime): Promise<SlackConfig>;
