import { IAgentRuntime } from "@ai16z/eliza";
import { z } from "zod";
export declare const imageGenEnvSchema: z.ZodEffects<z.ZodObject<{
    ANTHROPIC_API_KEY: z.ZodOptional<z.ZodString>;
    TOGETHER_API_KEY: z.ZodOptional<z.ZodString>;
    HEURIST_API_KEY: z.ZodOptional<z.ZodString>;
    FAL_API_KEY: z.ZodOptional<z.ZodString>;
    OPENAI_API_KEY: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    ANTHROPIC_API_KEY?: string | undefined;
    TOGETHER_API_KEY?: string | undefined;
    HEURIST_API_KEY?: string | undefined;
    FAL_API_KEY?: string | undefined;
    OPENAI_API_KEY?: string | undefined;
}, {
    ANTHROPIC_API_KEY?: string | undefined;
    TOGETHER_API_KEY?: string | undefined;
    HEURIST_API_KEY?: string | undefined;
    FAL_API_KEY?: string | undefined;
    OPENAI_API_KEY?: string | undefined;
}>, {
    ANTHROPIC_API_KEY?: string | undefined;
    TOGETHER_API_KEY?: string | undefined;
    HEURIST_API_KEY?: string | undefined;
    FAL_API_KEY?: string | undefined;
    OPENAI_API_KEY?: string | undefined;
}, {
    ANTHROPIC_API_KEY?: string | undefined;
    TOGETHER_API_KEY?: string | undefined;
    HEURIST_API_KEY?: string | undefined;
    FAL_API_KEY?: string | undefined;
    OPENAI_API_KEY?: string | undefined;
}>;
export type ImageGenConfig = z.infer<typeof imageGenEnvSchema>;
export declare function validateImageGenConfig(runtime: IAgentRuntime): Promise<ImageGenConfig>;
