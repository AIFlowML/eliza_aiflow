import { Service, IAgentRuntime, ServiceType } from "@ai16z/eliza";
import { WebClient } from "@slack/web-api";
import { ISlackService } from "../types/slack-types";
export declare class SlackService extends Service implements ISlackService {
    client: WebClient;
    static get serviceType(): ServiceType;
    get serviceType(): ServiceType;
    initialize(runtime: IAgentRuntime): Promise<void>;
}
