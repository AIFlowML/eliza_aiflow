import Snoowrap, { SearchOptions } from 'snoowrap';
import { RawRedditComment, RawRedditContent, RawRedditSubmission, RawRedditUser } from '../types/reddit-types';
/**
 * Wrapper for Snoowrap that breaks circular references and extracts essential data
 * This class provides a simplified interface to interact with Reddit's API through Snoowrap
 */
export declare class SnoowrapWrapper {
    private readonly client;
    constructor(client: Snoowrap);
    /**
     * Extracts basic data common to both submissions and comments
     * @param obj - The Reddit object to extract data from
     * @returns Basic data object or null if input is invalid
     */
    private extractBasicData;
    /**
     * Extracts relevant data from a Reddit comment
     * @param obj - The comment object to extract data from
     * @returns Formatted comment data or null if invalid
     */
    private extractCommentData;
    /**
     * Extracts relevant data from a Reddit submission
     * @param obj - The submission object to extract data from
     * @returns Formatted submission data or null if invalid
     */
    private extractSubmissionData;
    /**
     * Extracts relevant data from a Reddit user
     * @param obj - The user object to extract data from
     * @returns Formatted user data or null if invalid
     */
    private extractUserData;
    /**
     * Retrieves a submission by its ID
     * @param id - The Reddit submission ID
     * @returns The submission data or null if not found
     */
    getSubmission(id: string): Promise<RawRedditSubmission | null>;
    /**
     * Retrieves a comment by its ID
     * @param id - The Reddit comment ID
     * @returns The comment data or null if not found
     */
    getComment(id: string): Promise<RawRedditComment | null>;
    /**
     * Get all comments for a submission, including replies
     * @param submissionId - The ID of the submission to get comments for
     * @returns Array of comments
     */
    getComments(submissionId: string): Promise<RawRedditComment[]>;
    /**
     * Replies to a comment
     * @param id - The ID of the comment to reply to
     * @param text - The reply text
     * @returns The created comment data or null if failed
     */
    replyToComment(id: string, text: string): Promise<RawRedditComment | null>;
    /**
     * Replies to a submission
     * @param id - The ID of the submission to reply to
     * @param text - The reply text
     * @returns The created comment data or null if failed
     */
    replyToSubmission(id: string, text: string): Promise<RawRedditComment | null>;
    /**
     * Gets the currently authenticated user
     * @returns The user data or null if not authenticated
     */
    getCurrentUser(): Promise<RawRedditUser | null>;
    /**
     * Gets a user by username
     * @param username - The Reddit username
     * @returns The user data or null if not found
     */
    getUser(username: string): Promise<RawRedditUser | null>;
    /**
     * Searches Reddit for submissions
     * @param query - The search query
     * @param options - Search options (sort, time, limit)
     * @returns Array of matching submissions
     */
    search(query: string, options?: Partial<SearchOptions>): Promise<RawRedditSubmission[]>;
    /**
     * Gets posts from a subreddit
     * @param subreddit - The subreddit name
     * @param sort - Sort method ('hot', 'new', or 'top')
     * @param limit - Maximum number of posts to retrieve
     * @returns Array of subreddit posts
     */
    getSubredditPosts(subreddit: string, sort?: 'hot' | 'new' | 'top', // Default to 'new' to catch all recent posts
    limit?: number): Promise<RawRedditSubmission[]>;
    /**
     * Gets mentions for a user from their inbox
     * @param username - The Reddit username to get mentions for
     * @returns Array of comments that mention the user
     */
    getUserMentions(username: string): Promise<RawRedditComment[]>;
    /**
     * Gets a subreddit by name
     * @param name - The subreddit name
     * @returns The subreddit data or null if not found
     */
    getSubreddit(name: string): Promise<RawRedditContent | null>;
    /**
     * Gets comments for a specific user
     * @param username - The username to get comments for
     * @returns Array of formatted comment data
     */
    getUserComments(username: string): Promise<RawRedditComment[]>;
}
