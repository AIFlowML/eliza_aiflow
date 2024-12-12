/**
 * Reddit Client for Eliza AI Agent
 * Handles Reddit interactions, event processing, and message management
 */
import { IAgentRuntime, Client as ElizaClient } from "@ai16z/eliza";
import { commentAction } from "./actions/comment.action";
import { PostContentAction } from "./actions/post-content.action";
import { UserInteractionAction } from "./actions/user-interaction.action";
import { RetrieveDataAction } from "./actions/retrieve-data.action";
export declare class RedditClient {
    private static instance;
    private service;
    private eventManager;
    private runtime;
    private isInitialized;
    private constructor();
    static getInstance(runtime?: IAgentRuntime): RedditClient;
    initialize(): Promise<void>;
    checkForEvents(): Promise<void>;
    cleanup(): void;
}
export declare const RedditClientInterface: ElizaClient;
export { commentAction, PostContentAction, UserInteractionAction, RetrieveDataAction };
export * from "./types/reddit-types";
export default RedditClientInterface;
