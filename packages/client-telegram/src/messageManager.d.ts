import { Context, Telegraf } from "telegraf";
import { IAgentRuntime } from "@ai16z/eliza";
export declare class MessageManager {
    bot: Telegraf<Context>;
    private runtime;
    constructor(bot: Telegraf<Context>, runtime: IAgentRuntime);
    private processImage;
    private _shouldRespond;
    private sendMessageInChunks;
    private splitMessage;
    private _generateResponse;
    handleMessage(ctx: Context): Promise<void>;
}
