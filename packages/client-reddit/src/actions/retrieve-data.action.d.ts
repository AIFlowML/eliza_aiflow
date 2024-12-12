import { IAgentRuntime } from "@ai16z/eliza";
import { RedditActionOptions } from "../types/reddit-types";
export interface SearchOptions {
    query: string;
    subreddit?: string;
    sort?: 'relevance' | 'hot' | 'top' | 'new' | 'comments';
    timeframe?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
    limit?: number;
}
export declare class RetrieveDataAction {
    private static instance;
    private service;
    private monitoredTopics;
    private monitoredSubreddits;
    private runtime;
    private env;
    private constructor();
    static getInstance(): RetrieveDataAction;
    initialize(runtime: IAgentRuntime): Promise<void>;
    private createMemory;
    private composeState;
    /**
     * Search for posts matching the given criteria
     * @param options - Search options including query, subreddit, sort, timeframe, and limit
     * @returns Array of matching posts
     */
    searchPosts(options: SearchOptions): Promise<import("..").SubmissionResponse[]>;
    /**
     * Get a specific post by ID
     * @param postId - The ID of the post to retrieve
     * @returns The post data or null if not found
     */
    getPost(postId: string): Promise<import("..").SubmissionResponse | null>;
    /**
     * Get posts from a subreddit
     * @param options - Options for retrieving posts including subreddit, sort, and limit
     * @returns Array of posts from the subreddit
     */
    getSubredditPosts(options: RedditActionOptions): Promise<import("..").SubmissionResponse[]>;
    /**
     * Get information about a subreddit
     * @param name - The name of the subreddit
     * @returns Subreddit information or null if not found
     */
    getSubreddit(name: string): Promise<{
        name: string;
        display_name: string;
        created_utc: number;
    } | null>;
    cleanup(): void;
}
