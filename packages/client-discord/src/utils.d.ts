import { IAgentRuntime } from "@ai16z/eliza";
import { Message as DiscordMessage, TextChannel } from "discord.js";
export declare function getWavHeader(audioLength: number, sampleRate: number, channelCount?: number, bitsPerSample?: number): Buffer;
export declare function generateSummary(runtime: IAgentRuntime, text: string): Promise<{
    title: string;
    description: string;
}>;
export declare function sendMessageInChunks(channel: TextChannel, content: string, inReplyTo: string, files: any[]): Promise<DiscordMessage[]>;
export declare function canSendMessage(channel: any): {
    canSend: boolean;
    reason: string;
    missingPermissions?: undefined;
} | {
    canSend: boolean;
    reason: null;
    missingPermissions?: undefined;
} | {
    canSend: boolean;
    missingPermissions: bigint[];
    reason: string | null;
};
