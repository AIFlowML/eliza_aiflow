import { IAgentRuntime } from "@ai16z/eliza";
export interface RedditEnv {
    REDDIT_APP_NAME: string;
    REDDIT_SERVER_PORT: number;
    REDDIT_CLIENT_ID: string;
    REDDIT_CLIENT_SECRET: string;
    REDDIT_REFRESH_TOKEN: string;
    REDDIT_USER_AGENT: string;
    REDDIT_NGROK_URL: string;
    REDDIT_REDIRECT_URI: string;
    REDDIT_TOPIC: string;
    REDDIT_TOPIC_2: string;
    REDDIT_SUBREDDIT_1: string;
    REDDIT_SUBREDDIT_2: string;
    REDDIT_COMMENTS_TEST: string;
    REDDIT_COMMENTS_LIMIT: number;
    REDDIT_COMMENT_COOLDOWN: number;
    REDDIT_MAX_COMMENTS_PER_HOUR: number;
    REDDIT_MAX_COMMENTS_PER_DAY: number;
    REDDIT_SUBREDDIT: string;
}
export interface RedditOAuthConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    userAgent: string;
    appName: string;
    serverPort: number;
    refreshToken?: string;
}
export interface RedditMonitoringConfig {
    topics: string[];
    subreddits: string[];
}
export declare function validateRedditEnv(runtime: IAgentRuntime): Promise<RedditEnv>;
export declare function getOAuthConfig(runtime: IAgentRuntime): Promise<RedditOAuthConfig>;
export declare function getMonitoringConfig(runtime: IAgentRuntime): Promise<RedditMonitoringConfig>;
