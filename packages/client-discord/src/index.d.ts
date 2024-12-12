import { Character, Client as ElizaClient, IAgentRuntime } from "@ai16z/eliza";
import { Client, MessageReaction, User } from "discord.js";
import { EventEmitter } from "events";
export declare class DiscordClient extends EventEmitter {
    apiToken: string;
    client: Client;
    runtime: IAgentRuntime;
    character: Character;
    private messageManager;
    private voiceManager;
    constructor(runtime: IAgentRuntime);
    private setupEventListeners;
    private onClientReady;
    handleReactionAdd(reaction: MessageReaction, user: User): Promise<void>;
    handleReactionRemove(reaction: MessageReaction, user: User): Promise<void>;
    private handleGuildCreate;
    private handleInteractionCreate;
    private onReady;
}
export declare function startDiscord(runtime: IAgentRuntime): DiscordClient;
export declare const DiscordClientInterface: ElizaClient;
