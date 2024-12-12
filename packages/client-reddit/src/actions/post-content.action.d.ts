import { IAgentRuntime } from "@ai16z/eliza";
import { RedditSubmission, RedditComment, SubmissionResponse } from "../types/reddit-types";
export interface PostInteraction {
    postId: string;
    commentId: string;
    responseCount: number;
    lastInteractionTime: number;
}
/**
 * Action for interacting with Reddit posts and comments
 */
export declare class PostContentAction {
    private static instance;
    private service;
    private interactions;
    private runtime;
    private readonly MAX_RESPONSES_PER_POST;
    private readonly INTERACTION_COOLDOWN;
    private constructor();
    static getInstance(): PostContentAction;
    private composeState;
    private createMemory;
    initialize(runtime: IAgentRuntime): Promise<void>;
    /**
     * Find a post by URL or search criteria
     * @param criteria - URL or search query
     * @returns The found post or null
     */
    findPost(criteria: string): Promise<SubmissionResponse | null>;
    /**
     * Read a post and its comments
     * @param postId - The ID of the post to read
     * @returns The post and its comments
     */
    readPost(postId: string): Promise<{
        post: RedditSubmission;
        comments: RedditComment[];
    } | null>;
    /**
     * Check replies to a comment
     * @param commentId - The ID of the comment to check
     * @returns Array of reply comments
     */
    checkReplies(commentId: string): Promise<RedditComment[]>;
    /**
     * Monitor a comment for replies
     * @param commentId - The ID of the comment to monitor
     * @param interval - Check interval in milliseconds
     * @returns Array of reply comments
     */
    monitorComment(commentId: string, interval?: number): Promise<RedditComment[]>;
    /**
     * Comment on a post
     * @param postId - The ID of the post to comment on
     * @param content - The comment content
     * @returns The created comment or null
     */
    commentOnPost(postId: string, content: string): Promise<RedditComment | null>;
    /**
     * Reply to a comment
     * @param commentId - The ID of the comment to reply to
     * @param content - The reply content
     * @returns The created reply comment or null
     */
    replyToComment(commentId: string, content: string): Promise<RedditComment | null>;
    private extractPostId;
    cleanup(): void;
}
