/**
 * Reddit Event Management System
 * Handles real-time monitoring and processing of Reddit events including:
 * - New submissions in monitored subreddits
 * - User mentions and replies
 * - Comment tracking and processing
 *
 * Features:
 * - Event polling with configurable intervals
 * - Deduplication of events
 * - Automatic cleanup of old events
 * - Detailed logging and error tracking
 *
 * @module RedditEventManager
 */
import { IAgentRuntime } from "@ai16z/eliza";
export interface RedditMetadata {
    id: string;
    author: string;
    subreddit: string;
    created_utc: number;
    type?: 'submission' | 'comment';
    parent_id?: string;
    link_id?: string;
}
export declare class EventManager {
    private static instance;
    private service;
    private runtime;
    private env;
    private currentUser;
    private lastCheckedTime;
    private processedItems;
    private readonly POLL_INTERVAL;
    private readonly MAX_ITEMS_PER_CHECK;
    private constructor();
    static getInstance(): EventManager;
    initialize(runtime: IAgentRuntime): Promise<void>;
    checkForNewEvents(): Promise<void>;
    private checkMentions;
    private checkSubreddit;
    private checkInbox;
    private handleMention;
    private handlePost;
    private handleComment;
    private createMemory;
    private composeState;
    private shouldRespond;
    private generateResponse;
    cleanup(): void;
}
