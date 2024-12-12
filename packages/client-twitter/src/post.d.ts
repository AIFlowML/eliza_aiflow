import { IAgentRuntime } from "@ai16z/eliza";
import { ClientBase } from "./base.ts";
export declare class TwitterPostClient {
    client: ClientBase;
    runtime: IAgentRuntime;
    start(postImmediately?: boolean): Promise<void>;
    constructor(client: ClientBase, runtime: IAgentRuntime);
    private generateNewTweet;
}
