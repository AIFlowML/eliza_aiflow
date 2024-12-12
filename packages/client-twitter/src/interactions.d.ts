import { Tweet } from "agent-twitter-client";
import { IAgentRuntime } from "@ai16z/eliza";
import { ClientBase } from "./base";
export declare const twitterMessageHandlerTemplate: string;
export declare const twitterShouldRespondTemplate: string;
export declare class TwitterInteractionClient {
    client: ClientBase;
    runtime: IAgentRuntime;
    constructor(client: ClientBase, runtime: IAgentRuntime);
    start(): Promise<void>;
    handleTwitterInteractions(): Promise<void>;
    private handleTweet;
    buildConversationThread(tweet: Tweet, maxReplies?: number): Promise<Tweet[]>;
}
