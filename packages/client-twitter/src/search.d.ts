import { IAgentRuntime } from "@ai16z/eliza";
import { ClientBase } from "./base";
export declare class TwitterSearchClient extends ClientBase {
    private respondedTweets;
    constructor(runtime: IAgentRuntime);
    onReady(): Promise<void>;
    private engageWithSearchTermsLoop;
    private engageWithSearchTerms;
}
