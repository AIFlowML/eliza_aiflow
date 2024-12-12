import { WebClient } from '@slack/web-api';
import { IAgentRuntime } from '@ai16z/eliza';
export declare class MessageManager {
    private client;
    private runtime;
    private botUserId;
    private processedEvents;
    private messageProcessingLock;
    private processedMessages;
    constructor(client: WebClient, runtime: IAgentRuntime, botUserId: string);
    private generateEventKey;
    private cleanMessage;
    private _shouldRespond;
    private _generateResponse;
    handleMessage(event: any): Promise<void>;
}
