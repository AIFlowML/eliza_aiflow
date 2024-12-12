import { WebClient } from '@slack/web-api';
import { Service, ServiceType } from '@ai16z/eliza';
export interface SlackConfig {
    appId: string;
    clientId: string;
    clientSecret: string;
    signingSecret: string;
    verificationToken: string;
    botToken: string;
    botId: string;
}
export interface SlackClientContext {
    client: any;
    config: SlackConfig;
}
export interface SlackMessage {
    text: string;
    userId: string;
    channelId: string;
    threadTs?: string;
    attachments?: Array<{
        type: string;
        url: string;
        title: string;
        size: number;
    }>;
}
export declare const SLACK_SERVICE_TYPE = ServiceType.TEXT_GENERATION;
export interface ISlackService extends Service {
    client: WebClient;
}
