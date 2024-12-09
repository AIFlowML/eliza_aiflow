import Snoowrap from "snoowrap";
import { elizaLogger, IAgentRuntime, Service, ServiceType } from "@ai16z/eliza";
import { 
    RedditActionOptions,
    RedditComment,
    RedditSubmission,
    RedditUser,
    CommentResponse,
    SubmissionResponse,
    RawRedditComment,
    RawRedditSubmission,
    RawRedditContent,
} from "../types/reddit-types";
import { validateRedditEnv } from "../environment";
import { SnoowrapWrapper } from "../utils/snoowrap-wrapper";

// Custom error classes for better error handling
export class RedditServiceError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RedditServiceError';
    }
}

export class RedditInitializationError extends RedditServiceError {
    constructor(message: string) {
        super(message);
        this.name = 'RedditInitializationError';
    }
}

export class RedditAuthenticationError extends RedditServiceError {
    constructor(message: string) {
        super(message);
        this.name = 'RedditAuthenticationError';
    }
}

export class RedditRateLimitError extends RedditServiceError {
    constructor(message: string, public retryAfter?: number) {
        super(message);
        this.name = 'RedditRateLimitError';
    }
}

export class RedditNotFoundError extends RedditServiceError {
    constructor(message: string) {
        super(message);
        this.name = 'RedditNotFoundError';
    }
}

export class RedditInvalidIdError extends RedditServiceError {
    constructor(message: string) {
        super(message);
        this.name = 'RedditInvalidIdError';
    }
}

export class RedditApiError extends RedditServiceError {
    constructor(
        message: string,
        public statusCode?: number,
        public endpoint?: string
    ) {
        super(message);
        this.name = 'RedditApiError';
    }
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

export class RedditService extends Service implements IRedditService {
    private static readonly MAX_RETRIES = 3;
    private static readonly RETRY_DELAY = 1000; // 1 second
    private static readonly MIN_POLL_INTERVAL = 2000; // 2 seconds
    private static readonly MAX_POLL_INTERVAL = 300000; // 5 minutes
    private static readonly SUBMISSION_ID_REGEX = /^[a-z0-9]{6,}$/i;
    private static readonly COMMENT_ID_REGEX = /^[a-z0-9]{7,}$/i;

    public static override get serviceType(): ServiceType {
        return ServiceType.REDDIT;
    }

    get serviceType(): ServiceType {
        return ServiceType.REDDIT;
    }

    private wrapper: SnoowrapWrapper | null = null;
    private initialized: boolean = false;

    protected constructor() {
        super();
        elizaLogger.debug("🏗️ RedditService instance created");
    }

    public isInitialized(): boolean {
        return this.initialized;
    }

    public static override getInstance<T extends Service>(): T {
        elizaLogger.debug("�� Getting RedditService instance");
        return super.getInstance<T>();
    }

    private cleanSubmissionId(submissionId: string): string {
        elizaLogger.debug(`🔍 Processing submission ID/URL: "${submissionId}"`);
        
        // Check for subreddit ID prefix and reject
        if (submissionId.startsWith('t5_')) {
            elizaLogger.error(`Invalid submission ID: "${submissionId}" appears to be a subreddit ID (t5_ prefix)`);
            throw new RedditInvalidIdError(
                `Invalid submission ID: "${submissionId}" appears to be a subreddit ID (t5_ prefix). ` +
                `Subreddit IDs cannot be used as submission IDs.`
            );
        }
        
        // Remove t3_ prefix (submission prefix)
        const withoutPrefix = submissionId.replace(/^t3_/, '');
        if (withoutPrefix !== submissionId) {
            elizaLogger.debug(`Removed t3_ prefix: "${submissionId}" -> "${withoutPrefix}"`);
        }
        
        // Extract just the ID part if it's a full path
        const matches = withoutPrefix.match(/[a-z0-9]{6,}/i);
        if (matches) {
            elizaLogger.debug(`URL/ID processing:`, {
                original: submissionId,
                withoutPrefix,
                extractedId: matches[0],
                allMatches: matches
            });
            return matches[0];
        }
        
        elizaLogger.debug(`No ID pattern found, returning as is: "${withoutPrefix}"`);
        return withoutPrefix;
    }

    private validateSubmissionId(submissionId: string): string {
        this.validateInput(submissionId, 'submission ID');
        
        // Clean the ID first
        const cleanId = this.cleanSubmissionId(submissionId);
        elizaLogger.debug(`Validating submission ID:`, {
            original: submissionId,
            cleaned: cleanId,
            isValid: RedditService.SUBMISSION_ID_REGEX.test(cleanId)
        });
        
        if (!RedditService.SUBMISSION_ID_REGEX.test(cleanId)) {
            throw new RedditInvalidIdError(
                `Invalid submission ID format: ${submissionId}. Expected format: alphanumeric string (e.g., "abc123"). ` +
                `Cleaned ID: ${cleanId}`
            );
        }
        
        return cleanId;
    }

    private validateCommentId(commentId: string): void {
        this.validateInput(commentId, 'comment ID');
        if (!RedditService.COMMENT_ID_REGEX.test(commentId)) {
            throw new RedditInvalidIdError(
                `Invalid comment ID format: ${commentId}. Expected format: alphanumeric string (e.g., "abc123def")`
            );
        }
    }

    private handleApiError(error: any, context: string): never {
        if (error?.name === 'StatusCodeError') {
            const statusCode = error.statusCode;
            const endpoint = error.options?.uri || 'unknown endpoint';
            const message = error.error?.message || error.message;

            switch (statusCode) {
                case 401:
                    throw new RedditAuthenticationError('Authentication failed. Please check your credentials.');
                case 403:
                    throw new RedditAuthenticationError('Access forbidden. Please check your permissions.');
                case 404:
                    throw new RedditNotFoundError(`Resource not found at ${endpoint}`);
                case 429:
                    const retryAfter = parseInt(error.response?.headers?.['retry-after'] || '60', 10);
                    throw new RedditRateLimitError(`Rate limit exceeded for ${endpoint}`, retryAfter);
                default:
                    throw new RedditApiError(
                        `API error (${statusCode}) during ${context}: ${message}`,
                        statusCode,
                        endpoint
                    );
            }
        }
        throw error;
    }

    private validatePollInterval(interval: number): number {
        if (typeof interval !== 'number' || !Number.isFinite(interval)) {
            elizaLogger.warn(`Invalid poll interval: ${interval}, using default ${RedditService.MIN_POLL_INTERVAL}ms`);
            return RedditService.MIN_POLL_INTERVAL;
        }
        
        const validInterval = Math.max(
            RedditService.MIN_POLL_INTERVAL,
            Math.min(interval, RedditService.MAX_POLL_INTERVAL)
        );
        
        if (validInterval !== interval) {
            elizaLogger.warn(`Adjusted poll interval from ${interval}ms to ${validInterval}ms`);
        }
        
        return validInterval;
    }

    private async retryOperation<T>(
        operation: () => Promise<T>,
        context: string,
        retries = RedditService.MAX_RETRIES
    ): Promise<T> {
        let lastError: Error | null = null;
        
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                elizaLogger.debug(`🔄 Attempt ${attempt}/${retries} for operation: ${context}`);
                const result = await operation();
                if (attempt > 1) {
                    elizaLogger.info(`✓ Operation succeeded after ${attempt} attempts: ${context}`);
                }
                return result;
            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                
                // Don't retry on validation errors or authentication errors
                if (error instanceof RedditInvalidIdError || 
                    error instanceof RedditAuthenticationError) {
                    elizaLogger.error(`❌ Non-retryable error for ${context}:`, error);
                    throw error;
                }

                if (error instanceof RedditRateLimitError) {
                    const delay = this.validatePollInterval(
                        error.retryAfter ? error.retryAfter * 1000 : RedditService.RETRY_DELAY
                    );
                    elizaLogger.warn(`⏳ Rate limited, waiting ${delay}ms before retry ${attempt}/${retries}`, {
                        context,
                        retryAfter: error.retryAfter,
                        attempt,
                        maxRetries: retries
                    });
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else if (attempt < retries) {
                    const delay = this.validatePollInterval(RedditService.RETRY_DELAY);
                    elizaLogger.warn(`⚠️ Operation failed, attempt ${attempt}/${retries}:`, {
                        context,
                        error: lastError.message,
                        nextRetryIn: delay
                    });
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    elizaLogger.error(`❌ Operation failed after ${retries} attempts:`, {
                        context,
                        error: lastError.message,
                        lastAttempt: attempt
                    });
                    break;
                }
            }
        }
        
        throw lastError || new RedditServiceError(`Failed after ${retries} attempts: ${context}`);
    }

    private validateInitialization(): void {
        if (!this.wrapper) {
            throw new RedditInitializationError("Reddit service not initialized");
        }
    }

    private validateInput(value: string, name: string): void {
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
            throw new RedditServiceError(`Invalid ${name}: must be a non-empty string`);
        }
    }

    public async initialize(runtime: IAgentRuntime): Promise<void> {
        if (this.initialized) {
            elizaLogger.debug("ℹ️ Reddit service already initialized");
            return;
        }

        elizaLogger.debug("��� Initializing Reddit service...");
        try {
            const env = await validateRedditEnv(runtime);
            elizaLogger.debug("✓ Environment variables validated");

            const client = new Snoowrap({
                userAgent: env.REDDIT_USER_AGENT,
                clientId: env.REDDIT_CLIENT_ID,
                clientSecret: env.REDDIT_CLIENT_SECRET,
                refreshToken: env.REDDIT_REFRESH_TOKEN
            });

            elizaLogger.debug("🔑 Created Snoowrap client with credentials");
            this.wrapper = new SnoowrapWrapper(client);

            // Verify credentials by getting current user info
            const currentUser = await this.retryOperation(
                async () => {
                    const user = await this.wrapper!.getCurrentUser();
                    if (!user) {
                        throw new RedditAuthenticationError("Failed to get current user info - user is null");
                    }
                    return user;
                },
                "initialize service"
            );

            elizaLogger.debug("👤 [BOT] Reddit bot user details:", {
                name: currentUser.name,
                id: currentUser.id,
                created_utc: new Date(currentUser.created_utc * 1000).toISOString(),
                comment_karma: currentUser.comment_karma,
                link_karma: currentUser.link_karma
            });

            this.initialized = true;
            elizaLogger.success("✅ Reddit service initialized successfully");
            elizaLogger.success(`🤖 [READY] Bot user: u/${currentUser.name}`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            elizaLogger.error("❌ Failed to initialize Reddit service:", errorMessage);
            elizaLogger.error("Please ensure the following environment variables are set correctly:");
            elizaLogger.error("- REDDIT_USER_AGENT");
            elizaLogger.error("- REDDIT_CLIENT_ID");
            elizaLogger.error("- REDDIT_CLIENT_SECRET");
            elizaLogger.error("- REDDIT_REFRESH_TOKEN");
            
            if (error instanceof RedditAuthenticationError) {
                throw new RedditInitializationError(
                    "Failed to authenticate with Reddit. Please check your credentials."
                );
            }
            throw error instanceof RedditServiceError 
                ? error 
                : new RedditInitializationError(errorMessage);
        }
    }

    private convertToComment(raw: RawRedditComment): RedditComment {
        return {
            id: raw.id,
            body: raw.body,
            author: raw.author.name,
            created_utc: raw.created_utc,
            subreddit: raw.subreddit.display_name,
            parent_id: raw.parent_id,
            link_id: raw.link_id
        };
    }

    private convertToSubmission(raw: RawRedditSubmission): RedditSubmission {
        return {
            id: raw.id,
            title: raw.title,
            selftext: raw.selftext,
            author: raw.author.name,
            created_utc: raw.created_utc,
            subreddit: raw.subreddit.display_name,
            url: raw.url,
            is_self: raw.is_self
        };
    }

    public async search(query: string, options: SearchOptions = {}): Promise<SubmissionResponse[]> {
        elizaLogger.debug(`🔍 Searching Reddit for: ${query}`);
        try {
            this.validateInitialization();
            this.validateInput(query, 'search query');

            const results = await this.retryOperation(
                () => this.wrapper!.search(query, options),
                `search for "${query}"`
            );

            return results.map(raw => ({
                success: true,
                data: this.convertToSubmission(raw)
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            elizaLogger.error(`❌ Search failed for query "${query}":`, errorMessage);
            return [{ success: false, error: errorMessage }];
        }
    }

    public async getSubmission(submissionId: string): Promise<SubmissionResponse> {
        elizaLogger.info(`🔍 Getting submission: "${submissionId}"`);
        try {
            this.validateInitialization();
            elizaLogger.info(`🔄 Validating submission ID: "${submissionId}"`);
            const cleanId = this.validateSubmissionId(submissionId);
            
            elizaLogger.info(`📝 Submission ID processing:`, {
                original: submissionId,
                cleaned: cleanId,
                changed: cleanId !== submissionId
            });
            
            const raw = await this.retryOperation(
                async () => {
                    try {
                        elizaLogger.info(`🌐 Fetching submission with ID: "${cleanId}"`);
                        const submission = await this.wrapper!.getSubmission(cleanId);
                        if (!submission) {
                            throw new RedditNotFoundError(`Submission ${cleanId} not found`);
                        }
                        return submission;
                    } catch (error) {
                        elizaLogger.error(`❌ API error for submission "${cleanId}":`, error);
                        this.handleApiError(error, `get submission ${cleanId}`);
                    }
                },
                `get submission ${cleanId}`
            );
            
            return {
                success: true,
                data: this.convertToSubmission(raw)
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            elizaLogger.error(`❌ Failed to get submission ${submissionId}:`, errorMessage);
            return { 
                success: false, 
                error: errorMessage,
                details: error instanceof RedditApiError ? {
                    statusCode: error.statusCode,
                    endpoint: error.endpoint
                } : undefined
            };
        }
    }

    public async getSubredditPosts(options: RedditActionOptions): Promise<SubmissionResponse[]> {
        elizaLogger.debug(`🔍 Getting posts from r/${options.subreddit}`);
        try {
            this.validateInitialization();
            this.validateInput(options.subreddit, 'subreddit');

            // Clean subreddit name - remove t5_ prefix if present
            const subredditName = options.subreddit.replace(/^t5_/, '');
            if (subredditName !== options.subreddit) {
                elizaLogger.debug(`Removed t5_ prefix from subreddit: "${options.subreddit}" -> "${subredditName}"`);
            }

            const results = await this.retryOperation(
                () => this.wrapper!.getSubredditPosts(
                    subredditName,
                    options.sort,
                    options.limit
                ),
                `get posts from r/${subredditName}`
            );

            return results.map(raw => ({
                success: true,
                data: this.convertToSubmission(raw)
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            elizaLogger.error(`❌ Failed to get posts from r/${options.subreddit}:`, errorMessage);
            return [{ success: false, error: errorMessage }];
        }
    }

    public async getComment(commentId: string): Promise<CommentResponse> {
        elizaLogger.debug(`🔍 Getting comment: ${commentId}`);
        try {
            this.validateInitialization();
            this.validateCommentId(commentId);
            
            const raw = await this.retryOperation(
                async () => {
                    try {
                        const comment = await this.wrapper!.getComment(commentId);
                        if (!comment) {
                            throw new RedditNotFoundError(`Comment ${commentId} not found`);
                        }
                        return comment;
                    } catch (error) {
                        this.handleApiError(error, `get comment ${commentId}`);
                    }
                },
                `get comment ${commentId}`
            );
            
            return {
                success: true,
                data: this.convertToComment(raw)
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            elizaLogger.error(`❌ Failed to get comment ${commentId}:`, errorMessage);
            return { 
                success: false, 
                error: errorMessage,
                details: error instanceof RedditApiError ? {
                    statusCode: error.statusCode,
                    endpoint: error.endpoint
                } : undefined
            };
        }
    }

    public async getComments(submissionId: string): Promise<CommentResponse[]> {
        elizaLogger.debug(`🔍 Getting comments for submission: ${submissionId}`);
        try {
            this.validateInitialization();
            const cleanId = this.validateSubmissionId(submissionId);
            
            elizaLogger.debug(`📥 Fetching comments for submission ${cleanId}`);
            const comments = await this.retryOperation(
                async () => {
                    try {
                        const commentList = await this.wrapper!.getComments(cleanId);
                        if (!commentList || commentList.length === 0) {
                            elizaLogger.debug(`ℹ️ No comments found for submission ${cleanId}`);
                            throw new RedditNotFoundError(`No comments found for submission ${cleanId}`);
                        }
                        elizaLogger.debug(`✓ Retrieved ${commentList.length} comments for submission ${cleanId}`);
                        return commentList;
                    } catch (error) {
                        this.handleApiError(error, `get comments for submission ${cleanId}`);
                    }
                },
                `get comments for submission ${cleanId}`
            );
            
            const responses = comments.map(raw => ({
                success: true,
                data: this.convertToComment(raw)
            }));

            elizaLogger.debug(`✓ Successfully processed ${responses.length} comments for submission ${cleanId}`);
            return responses;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            elizaLogger.error(`❌ Failed to get comments for submission ${submissionId}:`, {
                error: errorMessage,
                details: error instanceof RedditApiError ? {
                    statusCode: error.statusCode,
                    endpoint: error.endpoint
                } : undefined
            });
            return [{ 
                success: false, 
                error: errorMessage,
                details: error instanceof RedditApiError ? {
                    statusCode: error.statusCode,
                    endpoint: error.endpoint
                } : undefined
            }];
        }
    }

    public async replyToComment(commentId: string, text: string): Promise<CommentResponse> {
        elizaLogger.debug(`📝 Replying to comment: ${commentId}`);
        try {
            this.validateInitialization();
            this.validateCommentId(commentId);
            this.validateInput(text, 'reply text');
            
            const raw = await this.retryOperation(
                async () => {
                    try {
                        const reply = await this.wrapper!.replyToComment(commentId, text);
                        if (!reply) {
                            throw new RedditNotFoundError(`Failed to reply to comment ${commentId}`);
                        }
                        return reply;
                    } catch (error) {
                        this.handleApiError(error, `reply to comment ${commentId}`);
                    }
                },
                `reply to comment ${commentId}`
            );
            
            return {
                success: true,
                data: this.convertToComment(raw)
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            elizaLogger.error(`❌ Failed to reply to comment ${commentId}:`, errorMessage);
            return { 
                success: false, 
                error: errorMessage,
                details: error instanceof RedditApiError ? {
                    statusCode: error.statusCode,
                    endpoint: error.endpoint
                } : undefined
            };
        }
    }

    public async replyToSubmission(submissionId: string, text: string): Promise<CommentResponse> {
        elizaLogger.debug(`📝 Replying to submission: ${submissionId}`);
        try {
            this.validateInitialization();
            this.validateInput(submissionId, 'submission ID');
            this.validateInput(text, 'reply text');
            
            const raw = await this.retryOperation(
                async () => {
                    const reply = await this.wrapper!.replyToSubmission(submissionId, text);
                    if (!reply) {
                        throw new RedditNotFoundError(`Failed to reply to submission ${submissionId}`);
                    }
                    return reply;
                },
                `reply to submission ${submissionId}`
            );
            
            return {
                success: true,
                data: this.convertToComment(raw)
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            elizaLogger.error(`❌ Failed to reply to submission ${submissionId}:`, errorMessage);
            return { success: false, error: errorMessage };
        }
    }

    public async getCurrentUser(): Promise<RedditUser> {
        elizaLogger.debug("🔍 Getting current user info");
        try {
            this.validateInitialization();
            
            const raw = await this.retryOperation(
                async () => {
                    const user = await this.wrapper!.getCurrentUser();
                    if (!user) {
                        throw new RedditAuthenticationError("Failed to get current user");
                    }
                    return user;
                },
                "get current user info"
            );
            
            return raw;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            elizaLogger.error("❌ Failed to get current user info:", errorMessage);
            throw error instanceof RedditAuthenticationError 
                ? error 
                : new RedditServiceError(errorMessage);
        }
    }

    public async getUserInfo(username: string): Promise<RedditUser> {
        elizaLogger.debug(`🔍 Getting info for user: ${username}`);
        try {
            this.validateInitialization();
            this.validateInput(username, 'username');
            
            const raw = await this.retryOperation(
                async () => {
                    const user = await this.wrapper!.getUser(username);
                    if (!user) {
                        throw new RedditNotFoundError(`User ${username} not found`);
                    }
                    return user;
                },
                `get info for user ${username}`
            );
            
            return raw;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            elizaLogger.error(`❌ Failed to get info for user ${username}:`, errorMessage);
            throw error instanceof RedditNotFoundError 
                ? error 
                : new RedditServiceError(errorMessage);
        }
    }

    public async getUserMentions(username: string): Promise<CommentResponse[]> {
        elizaLogger.debug(`🔍 Getting mentions for user: ${username}`);
        try {
            this.validateInitialization();
            this.validateInput(username, 'username');
            
            elizaLogger.debug(`📥 Fetching mentions for u/${username}`);
            const mentions = await this.retryOperation(
                async () => {
                    try {
                        const mentionList = await this.wrapper!.getUserMentions(username);
                        if (!mentionList || mentionList.length === 0) {
                            elizaLogger.debug(`ℹ️ No mentions found for u/${username}`);
                            return [];
                        }
                        elizaLogger.debug(`✓ Retrieved ${mentionList.length} mentions for u/${username}`);
                        return mentionList;
                    } catch (error) {
                        this.handleApiError(error, `get mentions for user ${username}`);
                    }
                },
                `get mentions for user ${username}`
            );
            
            const responses = mentions.map(raw => ({
                success: true,
                data: this.convertToComment(raw)
            }));

            elizaLogger.debug(`✓ Successfully processed ${responses.length} mentions for u/${username}`);
            return responses;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            elizaLogger.error(`❌ Failed to get mentions for user ${username}:`, {
                error: errorMessage,
                details: error instanceof RedditApiError ? {
                    statusCode: error.statusCode,
                    endpoint: error.endpoint
                } : undefined
            });
            return [{ 
                success: false, 
                error: errorMessage,
                details: error instanceof RedditApiError ? {
                    statusCode: error.statusCode,
                    endpoint: error.endpoint
                } : undefined
            }];
        }
    }

    public async getUser(username: string): Promise<RedditUser> {
        elizaLogger.debug(`🔍 Getting info for user: ${username}`);
        try {
            this.validateInitialization();
            this.validateInput(username, 'username');
            
            const user = await this.retryOperation(
                async () => {
                    const user = await this.wrapper!.getUser(username);
                    if (!user) {
                        throw new RedditNotFoundError(`User ${username} not found`);
                    }
                    return user;
                },
                `get user info for ${username}`
            );
            
            return user;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            elizaLogger.error(`❌ Failed to get user info for ${username}:`, errorMessage);
            throw error instanceof RedditNotFoundError 
                ? error 
                : new RedditServiceError(errorMessage);
        }
    }

    /**
     * Get subreddit information
     * @param name - The name of the subreddit
     * @returns Subreddit information
     */
    public async getSubredditInfo(name: string): Promise<RawRedditContent | null> {
        elizaLogger.debug(`🔍 Getting info for subreddit: ${name}`);
        try {
            this.validateInitialization();
            this.validateInput(name, 'subreddit');
            
            const raw = await this.retryOperation(
                async () => {
                    const subreddit = await this.wrapper!.getSubreddit(name);
                    if (!subreddit) {
                        throw new RedditNotFoundError(`Subreddit ${name} not found`);
                    }
                    return subreddit;
                },
                `get subreddit info for ${name}`
            );
            
            return {
                id: raw.id,
                author: { name: name },
                created_utc: raw.created_utc,
                subreddit: { display_name: name }
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            elizaLogger.error(`❌ Failed to get subreddit info for ${name}:`, errorMessage);
            throw error instanceof RedditNotFoundError 
                ? error 
                : new RedditServiceError(errorMessage);
        }
    }

    public async getUserComments(username: string): Promise<CommentResponse[]> {
        elizaLogger.debug(`🔍 Getting comments for user: ${username}`);
        try {
            this.validateInitialization();
            if (!username) {
                throw new Error('Username is required to get user comments');
            }
            if (!this.wrapper) {
                throw new Error('Reddit wrapper is not initialized');
            }
            
            elizaLogger.debug(`📥 Fetching comments for u/${username}`);
            const rawComments = await this.retryOperation(
                async () => {
                    const comments = await this.wrapper!.getUserComments(username);
                    elizaLogger.debug(`✓ Retrieved ${comments?.length || 0} comments for u/${username}`);
                    return comments || [];
                },
                `Getting comments for user ${username}`
            );
            
            const responses: CommentResponse[] = rawComments.map(comment => ({
                success: true,
                data: {
                    id: comment.id,
                    author: comment.author.name,
                    body: comment.body,
                    created_utc: comment.created_utc,
                    subreddit: comment.subreddit.display_name,
                    parent_id: comment.parent_id
                }
            }));
            
            elizaLogger.debug(`✓ Successfully processed ${responses.length} comments for u/${username}`);
            return responses;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            elizaLogger.error(`❌ Error getting comments for user ${username}:`, {
                error: errorMessage,
                details: error instanceof RedditApiError ? {
                    statusCode: error.statusCode,
                    endpoint: error.endpoint
                } : undefined
            });
            throw error;
        }
    }

    public cleanup(): void {
        elizaLogger.debug("🧹 Cleaning up Reddit service");
        this.wrapper = null;
    }
}
