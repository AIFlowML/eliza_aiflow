import { UUID } from "@ai16z/eliza";
/**
 * Raw response types from Snoowrap to break circular references
 */
export interface RawRedditContent {
    id: string;
    author: {
        name: string;
    };
    created_utc: number;
    subreddit: {
        display_name: string;
    };
}
export interface RawRedditComment extends RawRedditContent {
    body: string;
    parent_id: string;
    link_id?: string;
}
export interface RawRedditSubmission extends RawRedditContent {
    title: string;
    selftext: string;
    url?: string;
    is_self: boolean;
}
export interface RawRedditUser {
    id: string;
    name: string;
    created_utc: number;
    comment_karma?: number;
    link_karma?: number;
}
/**
 * Safe types for our application
 */
export interface RedditContent {
    id: string;
    author: string;
    created_utc: number;
    subreddit: string;
    author_link_karma?: number;
    author_created_utc?: number;
}
export interface RedditComment extends RedditContent {
    body: string;
    parent_id: string;
    link_id?: string;
}
export interface RedditSubmission extends RedditContent {
    title: string;
    selftext: string;
    url?: string;
    is_self: boolean;
    is_video?: boolean;
}
export interface RedditUser {
    id: string;
    name: string;
    created_utc: number;
    comment_karma?: number;
    link_karma?: number;
}
/**
 * Response wrappers with helper functions
 */
export interface ErrorDetails {
    statusCode?: number;
    endpoint?: string;
}
/**
 * Response type for user mentions
 */
export interface UserMentionResponse {
    success: boolean;
    data?: {
        id: string;
        author: string;
        body?: string;
        subreddit?: string;
        created_utc: number;
    };
    error?: string;
    details?: ErrorDetails;
}
/**
 * Response type for comments
 */
export interface CommentResponse {
    success: boolean;
    data?: RedditComment;
    error?: string;
    details?: ErrorDetails;
}
/**
 * Response type for submissions
 */
export interface SubmissionResponse {
    success: boolean;
    data?: RedditSubmission;
    error?: string;
    details?: ErrorDetails;
}
/**
 * Type guard to check if a response has data
 * @param response - The response to check
 */
export declare function hasResponseData<T extends {
    success: boolean;
    data?: any;
}>(response: T): response is T & {
    data: NonNullable<T['data']>;
};
/**
 * Action options
 */
export interface RedditActionOptions {
    subreddit: string;
    sort?: 'hot' | 'new' | 'top';
    limit?: number;
}
export interface RedditOAuthConfig {
    userAgent: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
}
/**
 * Event types
 */
export declare enum RedditEventType {
    NEW_POST = "new_post",
    NEW_COMMENT = "new_comment",
    MENTION = "mention"
}
export interface RedditEvent {
    id: string;
    type: RedditEventType;
    timestamp: number;
    subreddit?: string;
    author?: string;
}
export interface RedditPostEvent extends RedditEvent {
    type: RedditEventType.NEW_POST;
    data: RedditSubmission;
}
export interface RedditCommentEvent extends RedditEvent {
    type: RedditEventType.NEW_COMMENT;
    data: RedditComment;
}
export interface RedditMentionEvent extends RedditEvent {
    type: RedditEventType.MENTION;
    data: RedditComment;
}
export type RedditEventUnion = RedditPostEvent | RedditCommentEvent | RedditMentionEvent;
export interface RedditClientState {
    userId?: UUID;
    username?: string;
    subreddit?: string;
    lastProcessedEventId?: string;
    processedEvents: Set<string>;
}
/**
 * Type guard to check if an object is a RedditComment
 * @param obj - Object to check
 */
export declare function isRedditComment(obj: unknown): obj is RedditComment;
/**
 * Type guard to check if an object is a RedditSubmission
 * @param obj - Object to check
 */
export declare function isRedditSubmission(obj: any): obj is RedditSubmission;
/**
 * Type guard to check if an object is a RedditUser
 * @param obj - Object to check
 */
export declare function isRedditUser(obj: any): obj is RedditUser;
