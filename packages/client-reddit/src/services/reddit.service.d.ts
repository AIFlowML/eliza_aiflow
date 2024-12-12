import { IAgentRuntime, Service, ServiceType } from "@ai16z/eliza";
import { RedditActionOptions, RedditUser, CommentResponse, SubmissionResponse, RawRedditContent } from "../types/reddit-types";
export declare class RedditServiceError extends Error {
    constructor(message: string);
}
export declare class RedditInitializationError extends RedditServiceError {
    constructor(message: string);
}
export declare class RedditAuthenticationError extends RedditServiceError {
    constructor(message: string);
}
export declare class RedditRateLimitError extends RedditServiceError {
    retryAfter?: number | undefined;
    constructor(message: string, retryAfter?: number | undefined);
}
export declare class RedditNotFoundError extends RedditServiceError {
    constructor(message: string);
}
export declare class RedditInvalidIdError extends RedditServiceError {
    constructor(message: string);
}
export declare class RedditApiError extends RedditServiceError {
    statusCode?: number | undefined;
    endpoint?: string | undefined;
    constructor(message: string, statusCode?: number | undefined, endpoint?: string | undefined);
}
interface SearchOptions {
    sort?: 'relevance' | 'hot' | 'top' | 'new' | 'comments';
    time?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
    limit?: number;
}
interface IRedditService {
    initialize(runtime: IAgentRuntime): Promise<void>;
    isInitialized(): boolean;
    cleanup(): void;
    search(query: string, options: SearchOptions): Promise<SubmissionResponse[]>;
    getSubmission(submissionId: string): Promise<SubmissionResponse>;
    getSubredditPosts(options: RedditActionOptions): Promise<SubmissionResponse[]>;
    getComment(commentId: string): Promise<CommentResponse>;
    getComments(submissionId: string): Promise<CommentResponse[]>;
    replyToComment(commentId: string, text: string): Promise<CommentResponse>;
    replyToSubmission(submissionId: string, text: string): Promise<CommentResponse>;
    getCurrentUser(): Promise<RedditUser>;
    getUserInfo(username: string): Promise<RedditUser>;
    getUserMentions(username: string): Promise<CommentResponse[]>;
    getSubredditInfo(name: string): Promise<RawRedditContent | null>;
    getUserComments(username: string): Promise<CommentResponse[]>;
}
export declare class RedditService extends Service implements IRedditService {
    private static readonly MAX_RETRIES;
    private static readonly RETRY_DELAY;
    private static readonly MIN_POLL_INTERVAL;
    private static readonly MAX_POLL_INTERVAL;
    private static readonly SUBMISSION_ID_REGEX;
    private static readonly COMMENT_ID_REGEX;
    static get serviceType(): ServiceType;
    get serviceType(): ServiceType;
    private wrapper;
    private initialized;
    protected constructor();
    isInitialized(): boolean;
    static getInstance<T extends Service>(): T;
    private cleanSubmissionId;
    private validateSubmissionId;
    private validateCommentId;
    private handleApiError;
    private validatePollInterval;
    private retryOperation;
    private validateInitialization;
    private validateInput;
    initialize(runtime: IAgentRuntime): Promise<void>;
    private convertToComment;
    private convertToSubmission;
    search(query: string, options?: SearchOptions): Promise<SubmissionResponse[]>;
    getSubmission(submissionId: string): Promise<SubmissionResponse>;
    getSubredditPosts(options: RedditActionOptions): Promise<SubmissionResponse[]>;
    getComment(commentId: string): Promise<CommentResponse>;
    getComments(submissionId: string): Promise<CommentResponse[]>;
    replyToComment(commentId: string, text: string): Promise<CommentResponse>;
    replyToSubmission(submissionId: string, text: string): Promise<CommentResponse>;
    getCurrentUser(): Promise<RedditUser>;
    getUserInfo(username: string): Promise<RedditUser>;
    getUserMentions(username: string): Promise<CommentResponse[]>;
    getUser(username: string): Promise<RedditUser>;
    /**
     * Get subreddit information
     * @param name - The name of the subreddit
     * @returns Subreddit information
     */
    getSubredditInfo(name: string): Promise<RawRedditContent | null>;
    getUserComments(username: string): Promise<CommentResponse[]>;
    cleanup(): void;
}
export {};
