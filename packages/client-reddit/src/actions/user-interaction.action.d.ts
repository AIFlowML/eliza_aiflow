import { IAgentRuntime, Memory, Action } from "@ai16z/eliza";
export interface SubredditConfig {
    name: string;
    allowedTopics: string[];
    forbiddenTopics: string[];
    allowedPostTypes: ('text' | 'link' | 'image' | 'video')[];
    minimumKarma: number;
    minimumAccountAgeDays: number;
    customRules: string[];
}
/**
 * Action for autonomous Reddit interaction with enhanced safety features
 */
export declare class UserInteractionAction implements Action {
    readonly name = "REDDIT_USER_INTERACTION";
    readonly description = "Handles user interactions on Reddit including mentions, comments, and post responses";
    readonly similes: string[];
    readonly examples: {
        user: string;
        content: {
            text: string;
            source: string;
        };
    }[][];
    private static instance;
    private service;
    private postAction;
    private retrieveAction;
    private stats;
    private safetyStats;
    private currentUser;
    private isShutdown;
    private runtime;
    private env;
    private processedPosts;
    private processedComments;
    private readonly WARNING_THRESHOLD;
    private readonly ERROR_THRESHOLD;
    private readonly SAFETY_RESET_INTERVAL;
    private readonly limits;
    private readonly defaultConfig;
    private subredditConfigs;
    private constructor();
    static getInstance(): UserInteractionAction;
    /**
     * Initialize the action with the runtime
     * @param runtime - The agent runtime instance
     */
    initialize(runtime: IAgentRuntime): Promise<void>;
    /**
     * Get user mentions for a subreddit
     */
    private getUserMentions;
    /**
     * Validate access to the subreddit and configure it
     */
    private validateSubredditAccess;
    /**
     * Configure a subreddit with context
     * @param subreddit - The subreddit name to configure
     */
    private configureSubredditWithContext;
    /**
     * Configure a subreddit for autonomous interaction
     */
    configureSubreddit(config: Partial<SubredditConfig> & {
        name: string;
    }): void;
    private validateSubredditConfig;
    private validateSafetyStatus;
    private recordSafetyViolation;
    private initiateEmergencyShutdown;
    /**
     * Check if we're allowed to interact right now
     */
    private canInteract;
    /**
     * Check if we can comment right now
     */
    private canComment;
    /**
     * Monitor a subreddit for interaction opportunities
     */
    monitorSubreddit(subreddit: string): Promise<void>;
    /**
     * Process a post for potential interaction
     * @param post - The Reddit submission response
     * @param config - The subreddit configuration
     */
    private processPost;
    private replyToPost;
    /**
     * Determine if we should interact with a post
     * @param post - The Reddit submission
     * @param config - The subreddit configuration
     * @returns Whether we should interact with the post
     */
    private shouldInteractWithPost;
    /**
     * Determine if we should comment on a post
     * @param post - The Reddit submission
     * @param comments - Array of comment responses
     * @returns Whether we should comment on the post
     */
    private shouldCommentOnPost;
    /**
     * Determine if we should reply to a comment
     * @param comment - The Reddit comment
     * @param config - The subreddit configuration
     * @returns Whether we should reply to the comment
     */
    private shouldReplyToComment;
    /**
     * Update interaction statistics
     */
    private updateCommentStats;
    /**
     * Reset daily stats if it's a new day
     */
    private checkAndResetDailyStats;
    /**
     * Initialize interaction statistics
     */
    private initializeStats;
    private initializeSafetyStats;
    /**
     * Get the type of a post
     * @param post - The Reddit submission
     * @returns The type of the post
     */
    private getPostType;
    cleanup(): void;
    private dumpSafetyStats;
    /**
     * Create a memory object from a Reddit submission
     * @param post - The Reddit submission
     * @returns A memory object
     */
    private createMemoryFromPost;
    /**
     * Create a memory object from a Reddit comment
     * @param comment - The Reddit comment
     * @returns A memory object
     */
    private createMemoryFromComment;
    private composeState;
    /**
     * Check if we should respond to a post
     * @param post - The Reddit submission
     * @param state - The current state
     * @returns Whether we should respond to the post
     */
    private shouldRespondToPost;
    private generateResponse;
    private handleComment;
    private replyToComment;
    validate(runtime: IAgentRuntime): Promise<boolean>;
    handler(runtime: IAgentRuntime, message: Memory): Promise<{
        success: boolean;
        error?: string;
        response?: string;
    }>;
}
