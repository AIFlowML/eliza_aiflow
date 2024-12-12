import { IAgentRuntime } from "@ai16z/eliza";
export declare class TelegramClient {
    private bot;
    private runtime;
    private messageManager;
    private backend;
    private backendToken;
    private tgTrader;
    constructor(runtime: IAgentRuntime, botToken: string);
    start(): Promise<void>;
    private initializeBot;
    private setupMessageHandlers;
    private setupShutdownHandlers;
    stop(): Promise<void>;
}
