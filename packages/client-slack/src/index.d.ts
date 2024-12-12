import { Client as ElizaClient, IAgentRuntime } from "@ai16z/eliza";
import { EventEmitter } from 'events';
export declare class SlackClient extends EventEmitter {
    private client;
    private runtime;
    private server;
    private messageManager;
    private botUserId;
    private character;
    private signingSecret;
    constructor(runtime: IAgentRuntime);
    private handleEvent;
    private verifyPermissions;
    start(): Promise<void>;
    stop(): Promise<void>;
}
export declare const SlackClientInterface: ElizaClient;
export default SlackClientInterface;
