import { Content, Media, UUID } from "@ai16z/eliza";
import { Message as DiscordMessage, TextChannel } from "discord.js";
import { VoiceManager } from "./voice.ts";
export type InterestChannels = {
    [key: string]: {
        lastMessageSent: number;
        messages: {
            userId: UUID;
            userName: string;
            content: Content;
        }[];
    };
};
export declare class MessageManager {
    private client;
    private runtime;
    private attachmentManager;
    private interestChannels;
    private discordClient;
    private voiceManager;
    constructor(discordClient: any, voiceManager: VoiceManager);
    handleMessage(message: DiscordMessage): Promise<void>;
    cacheMessages(channel: TextChannel, count?: number): Promise<void>;
    processMessageMedia(message: DiscordMessage): Promise<{
        processedContent: string;
        attachments: Media[];
    }>;
    private _checkInterest;
    private _shouldIgnore;
    private _shouldRespond;
    private _generateResponse;
    fetchBotName(botToken: string): Promise<any>;
}
