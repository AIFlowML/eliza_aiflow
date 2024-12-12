import { Client, IAgentRuntime } from "@ai16z/eliza";
export declare class AutoClient {
    interval: NodeJS.Timeout;
    runtime: IAgentRuntime;
    constructor(runtime: IAgentRuntime);
}
export declare const AutoClientInterface: Client;
export default AutoClientInterface;
