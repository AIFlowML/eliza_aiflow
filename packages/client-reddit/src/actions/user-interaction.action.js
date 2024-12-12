import { elizaLogger, generateText, generateMessageResponse, generateShouldRespond, ModelClass, stringToUuid, getEmbeddingZeroVector, composeContext } from "@ai16z/eliza";
import { RedditService } from "../services/reddit.service";
import { isRedditUser, hasResponseData } from "../types/reddit-types";
import { PostContentAction } from "./post-content.action";
import { RetrieveDataAction } from "./retrieve-data.action";
import { validateRedditEnv } from "../environment";
/**
 * Action for autonomous Reddit interaction with enhanced safety features
 */
export class UserInteractionAction {
    constructor() {
        this.name = 'REDDIT_USER_INTERACTION';
        this.description = 'Handles user interactions on Reddit including mentions, comments, and post responses';
        this.similes = ['respond to user', 'handle mention', 'process comment'];
        this.examples = [
            [{
                    user: 'user',
                    content: {
                        text: 'respond to user mention in subreddit',
                        source: 'reddit'
                    }
                }],
            [{
                    user: 'user',
                    content: {
                        text: 'process new comment in thread',
                        source: 'reddit'
                    }
                }],
            [{
                    user: 'user',
                    content: {
                        text: 'handle user interaction in post',
                        source: 'reddit'
                    }
                }]
        ];
        this.currentUser = null;
        this.isShutdown = false;
        this.runtime = null;
        this.env = null;
        this.processedPosts = new Set();
        this.processedComments = new Set();
        this.WARNING_THRESHOLD = 5;
        this.ERROR_THRESHOLD = 10;
        this.SAFETY_RESET_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
        // Default interaction limits
        this.limits = {
            maxDailyComments: 50,
            maxDailyPosts: 5,
            commentCooldownMinutes: 5,
            postCooldownMinutes: 30,
            maxCommentsPerPost: 2,
            maxCommentsPerThread: 3,
            operatingHours: {
                start: 9, // 9 AM
                end: 22 // 10 PM
            }
        };
        this.defaultConfig = {
            name: "",
            allowedTopics: [],
            forbiddenTopics: [],
            allowedPostTypes: ['text'],
            minimumKarma: 100,
            minimumAccountAgeDays: 30,
            customRules: []
        };
        this.subredditConfigs = new Map();
        this.service = RedditService.getInstance();
        this.postAction = PostContentAction.getInstance();
        this.retrieveAction = RetrieveDataAction.getInstance();
        this.stats = this.initializeStats();
        this.safetyStats = this.initializeSafetyStats();
    }
    static getInstance() {
        if (!UserInteractionAction.instance) {
            UserInteractionAction.instance = new UserInteractionAction();
        }
        return UserInteractionAction.instance;
    }
    /**
     * Initialize the action with the runtime
     * @param runtime - The agent runtime instance
     */
    async initialize(runtime) {
        elizaLogger.debug("🔄 Initializing UserInteractionAction");
        this.runtime = runtime;
        try {
            await this.service.initialize(runtime);
            await this.postAction.initialize(runtime);
            await this.retrieveAction.initialize(runtime);
            const env = await validateRedditEnv(runtime);
            this.env = env;
            elizaLogger.debug("Getting current user information");
            const user = await this.service.getCurrentUser();
            if (!isRedditUser(user)) {
                throw new Error("Invalid user data received");
            }
            this.currentUser = user;
            elizaLogger.info(`✅ Initialized as user: ${this.currentUser?.name || 'unknown'}`);
            this.checkAndResetDailyStats();
            this.validateSafetyStatus();
            await this.validateSubredditAccess();
        }
        catch (error) {
            elizaLogger.error("❌ Failed to initialize:", error);
            throw error;
        }
    }
    /**
     * Get user mentions for a subreddit
     */
    async getUserMentions(subreddit) {
        elizaLogger.debug(`🔍 Getting mentions for subreddit: r/${subreddit}`);
        try {
            // First get the subreddit info to validate it exists
            const subredditInfo = await this.service.getSubredditInfo(subreddit);
            elizaLogger.debug(`📊 Subreddit info response:`, subredditInfo);
            if (!subredditInfo) {
                elizaLogger.warn(`⚠️ Subreddit r/${subreddit} not found`);
                return [];
            }
            // Get mentions using the bot's username, not the subreddit name
            if (!this.currentUser?.name) {
                elizaLogger.error(`❌ Cannot get mentions: Bot username not initialized`);
                return [];
            }
            elizaLogger.debug(`🤖 Getting mentions for bot user: u/${this.currentUser.name}`);
            const mentions = await this.service.getUserMentions(this.currentUser.name);
            elizaLogger.debug(`📨 Found ${mentions.length} mentions for bot`);
            // Filter mentions to only include those from the specified subreddit
            const subredditMentions = mentions.filter(mention => {
                const isFromSubreddit = mention.success &&
                    mention.data?.subreddit?.toLowerCase() === subreddit.toLowerCase();
                elizaLogger.debug(`🔍 Mention filtering:`, {
                    mentionId: mention.data?.id,
                    subreddit: mention.data?.subreddit,
                    isFromSubreddit
                });
                return isFromSubreddit;
            });
            elizaLogger.info(`✅ Found ${subredditMentions.length} mentions in r/${subreddit}`);
            return subredditMentions;
        }
        catch (error) {
            elizaLogger.error(`❌ Failed to get mentions for subreddit r/${subreddit}:`, error);
            throw error;
        }
    }
    /**
     * Validate access to the subreddit and configure it
     */
    async validateSubredditAccess() {
        if (!this.env || !this.runtime) {
            throw new Error("Environment or runtime not initialized");
        }
        try {
            const subreddit = this.env.REDDIT_SUBREDDIT;
            elizaLogger.debug(`🔍 Validating access to r/${subreddit}`);
            // Get subreddit info
            elizaLogger.debug(`📡 Fetching subreddit info for r/${subreddit}`);
            const subredditInfo = await this.service.getSubredditInfo(subreddit);
            if (!subredditInfo) {
                elizaLogger.error(`❌ Failed to get information for r/${subreddit}`);
                throw new Error(`Failed to get information for r/${subreddit}`);
            }
            elizaLogger.debug(`📊 Subreddit info:`, {
                id: subredditInfo.id,
                name: subreddit,
                created: new Date(subredditInfo.created_utc * 1000).toISOString()
            });
            // Get moderators using the new getUserMentions method
            elizaLogger.debug(`👥 Getting moderators for r/${subreddit}`);
            if (!this.currentUser?.name) {
                elizaLogger.error(`❌ Current user not initialized`);
                throw new Error("Current user not initialized");
            }
            elizaLogger.debug(`🤖 Current bot user: u/${this.currentUser.name}`);
            const moderators = await this.getUserMentions(subreddit);
            elizaLogger.debug(`📋 Retrieved ${moderators.length} moderator entries`);
            const moderatorNames = moderators
                .filter(mod => mod.success && mod.data)
                .map(mod => mod.data.author);
            elizaLogger.debug(`👥 Moderator list:`, moderatorNames);
            const isModerator = moderatorNames.includes(this.currentUser.name);
            if (!isModerator) {
                elizaLogger.warn(`⚠️ Bot u/${this.currentUser.name} is not a moderator of r/${subreddit}`);
            }
            else {
                elizaLogger.info(`✅ Bot u/${this.currentUser.name} has moderator access to r/${subreddit}`);
            }
            await this.configureSubredditWithContext(subreddit);
        }
        catch (error) {
            elizaLogger.error(`❌ Failed to validate subreddit access:`, {
                subreddit: this.env.REDDIT_SUBREDDIT,
                error: error instanceof Error ? error.message : error
            });
            this.recordSafetyViolation('error', 'subreddit-access');
            throw error;
        }
    }
    /**
     * Configure a subreddit with context
     * @param subreddit - The subreddit name to configure
     */
    async configureSubredditWithContext(subreddit) {
        if (!this.runtime) {
            throw new Error("Runtime not initialized");
        }
        try {
            // Initial state composition
            let state = await this.runtime.composeState({
                content: { text: '', source: 'reddit' },
                userId: stringToUuid('system'),
                agentId: this.runtime.agentId,
                roomId: stringToUuid(subreddit)
            }, {
                subreddit,
                env: this.env
            });
            // Update state with recent messages
            state = await this.runtime.updateRecentMessageState(state);
            const configContext = composeContext({
                state,
                template: `Configure the subreddit r/${subreddit} with appropriate settings based on its rules and content guidelines.`
            });
            const config = await generateText({
                runtime: this.runtime,
                context: configContext,
                modelClass: ModelClass.SMALL
            });
            // Parse the configuration and apply it
            try {
                const parsedConfig = JSON.parse(config);
                this.configureSubreddit({
                    name: subreddit,
                    ...parsedConfig
                });
            }
            catch (error) {
                elizaLogger.error("Failed to parse subreddit configuration:", error);
                // Fall back to default configuration
                this.configureSubreddit({
                    name: subreddit,
                    allowedTopics: this.env?.REDDIT_TOPIC ? [this.env.REDDIT_TOPIC] : [],
                    forbiddenTopics: ["politics", "nsfw"],
                    allowedPostTypes: ["text", "link"],
                    minimumKarma: 50,
                    minimumAccountAgeDays: 30,
                    customRules: []
                });
            }
        }
        catch (error) {
            elizaLogger.error(`Failed to configure subreddit ${subreddit}:`, error);
            throw error;
        }
    }
    /**
     * Configure a subreddit for autonomous interaction
     */
    configureSubreddit(config) {
        try {
            this.validateSubredditConfig(config);
            const fullConfig = { ...this.defaultConfig, ...config };
            this.subredditConfigs.set(config.name, fullConfig);
            elizaLogger.info(`✅ Configured subreddit: r/${config.name}`, {
                allowedTopics: fullConfig.allowedTopics,
                forbiddenTopics: fullConfig.forbiddenTopics,
                allowedPostTypes: fullConfig.allowedPostTypes,
                minimumKarma: fullConfig.minimumKarma,
                minimumAccountAgeDays: fullConfig.minimumAccountAgeDays
            });
        }
        catch (error) {
            elizaLogger.error(`❌ Failed to configure subreddit ${config.name}:`, error);
            this.recordSafetyViolation('error', 'configuration');
            throw error;
        }
    }
    validateSubredditConfig(config) {
        if (!config.name || config.name.trim().length === 0) {
            throw new Error("Subreddit name is required");
        }
        if (config.minimumKarma && config.minimumKarma < 0) {
            throw new Error("Minimum karma must be non-negative");
        }
        if (config.minimumAccountAgeDays && config.minimumAccountAgeDays < 0) {
            throw new Error("Minimum account age must be non-negative");
        }
        if (config.allowedTopics && config.allowedTopics.some(topic => topic.trim().length === 0)) {
            throw new Error("Empty topics are not allowed");
        }
        elizaLogger.debug(`✓ Validated config for r/${config.name}`);
    }
    validateSafetyStatus() {
        const now = Date.now();
        if (now - this.safetyStats.lastResetTime > this.SAFETY_RESET_INTERVAL) {
            elizaLogger.info("🔄 Resetting safety stats");
            this.safetyStats = this.initializeSafetyStats();
            return;
        }
        if (this.safetyStats.warningCount >= this.WARNING_THRESHOLD) {
            elizaLogger.warn(`⚠️ Warning threshold reached (${this.safetyStats.warningCount}/${this.WARNING_THRESHOLD})`);
        }
        if (this.safetyStats.errorCount >= this.ERROR_THRESHOLD) {
            elizaLogger.error(`🛑 Error threshold reached (${this.safetyStats.errorCount}/${this.ERROR_THRESHOLD})`);
            this.initiateEmergencyShutdown();
        }
    }
    recordSafetyViolation(type, context) {
        const now = Date.now();
        if (type === 'warning') {
            this.safetyStats.warningCount++;
            this.safetyStats.lastWarningTime = now;
            elizaLogger.warn(`⚠️ Safety warning in ${context} (${this.safetyStats.warningCount}/${this.WARNING_THRESHOLD})`);
        }
        else {
            this.safetyStats.errorCount++;
            this.safetyStats.lastErrorTime = now;
            elizaLogger.error(`🛑 Safety error in ${context} (${this.safetyStats.errorCount}/${this.ERROR_THRESHOLD})`);
        }
        this.validateSafetyStatus();
    }
    initiateEmergencyShutdown() {
        if (this.isShutdown)
            return;
        elizaLogger.error("🚨 EMERGENCY SHUTDOWN INITIATED");
        elizaLogger.error("Reason: Safety thresholds exceeded");
        elizaLogger.error(`Warnings: ${this.safetyStats.warningCount}`);
        elizaLogger.error(`Errors: ${this.safetyStats.errorCount}`);
        elizaLogger.error("Blocked Posts:", Array.from(this.safetyStats.blockedPosts));
        elizaLogger.error("Blocked Users:", Array.from(this.safetyStats.blockedUsers));
        elizaLogger.error("Topic Violations:", Object.fromEntries(this.safetyStats.topicViolations));
        this.isShutdown = true;
        this.cleanup();
        throw new Error("Emergency shutdown due to safety violations");
    }
    /**
     * Check if we're allowed to interact right now
     */
    canInteract(subreddit) {
        this.checkAndResetDailyStats();
        // Check operating hours
        const hour = new Date().getHours();
        if (hour < this.limits.operatingHours.start || hour >= this.limits.operatingHours.end) {
            elizaLogger.debug(`Outside operating hours (${hour}), allowed: ${this.limits.operatingHours.start}-${this.limits.operatingHours.end}`);
            return false;
        }
        // Check if subreddit is configured
        if (!this.subredditConfigs.has(subreddit)) {
            elizaLogger.debug(`Subreddit r/${subreddit} not configured`);
            return false;
        }
        elizaLogger.debug(`Can interact with r/${subreddit}`);
        return true;
    }
    /**
     * Check if we can comment right now
     */
    canComment(postId) {
        if (this.stats.dailyComments >= this.limits.maxDailyComments) {
            elizaLogger.debug(`Daily comment limit reached (${this.stats.dailyComments}/${this.limits.maxDailyComments})`);
            return false;
        }
        const timeSinceLastComment = Date.now() - this.stats.lastCommentTime;
        if (timeSinceLastComment < this.limits.commentCooldownMinutes * 60 * 1000) {
            elizaLogger.debug(`Comment cooldown period not elapsed (${Math.floor(timeSinceLastComment / 1000)}s/${this.limits.commentCooldownMinutes * 60}s)`);
            return false;
        }
        const postComments = this.stats.commentsPerPost.get(postId) || 0;
        if (postComments >= this.limits.maxCommentsPerPost) {
            elizaLogger.debug(`Max comments reached for post ${postId} (${postComments}/${this.limits.maxCommentsPerPost})`);
            return false;
        }
        elizaLogger.debug(`Can comment on post ${postId}`);
        return true;
    }
    /**
     * Monitor a subreddit for interaction opportunities
     */
    async monitorSubreddit(subreddit) {
        if (this.isShutdown) {
            elizaLogger.error("🛑 Cannot monitor: System is in shutdown state");
            return;
        }
        if (!this.runtime) {
            throw new Error("Runtime not initialized");
        }
        elizaLogger.debug(`🔍 Starting to monitor r/${subreddit}`);
        if (!this.canInteract(subreddit)) {
            return;
        }
        const config = this.subredditConfigs.get(subreddit);
        try {
            const posts = await this.retrieveAction.getSubredditPosts({
                subreddit: config.name,
                sort: "new",
                limit: 10
            });
            elizaLogger.info(`📊 Processing ${posts.length} posts from r/${subreddit}`);
            for (const post of posts) {
                if (!hasResponseData(post)) {
                    elizaLogger.debug(`Skipping post without data`);
                    continue;
                }
                if (this.safetyStats.blockedPosts.has(post.data.id)) {
                    elizaLogger.debug(`Skipping blocked post ${post.data.id}`);
                    continue;
                }
                if (this.safetyStats.blockedUsers.has(post.data.author)) {
                    elizaLogger.debug(`Skipping post from blocked user ${post.data.author}`);
                    continue;
                }
                if (this.processedPosts.has(post.data.id)) {
                    elizaLogger.debug(`Already processed post ${post.data.id}`);
                    continue;
                }
                try {
                    await this.processPost(post, config);
                }
                catch (error) {
                    elizaLogger.error(`Error processing post ${post.data.id}:`, error);
                    this.safetyStats.blockedPosts.add(post.data.id);
                    this.recordSafetyViolation('warning', 'post-processing');
                }
            }
        }
        catch (error) {
            elizaLogger.error(`Error monitoring r/${subreddit}:`, error);
            this.recordSafetyViolation('error', 'monitoring');
        }
    }
    /**
     * Process a post for potential interaction
     * @param post - The Reddit submission response
     * @param config - The subreddit configuration
     */
    async processPost(post, config) {
        if (!hasResponseData(post)) {
            elizaLogger.debug('Skipping post without data');
            return;
        }
        const postData = post.data;
        // First check if we should interact with this post at all
        if (!this.shouldInteractWithPost(postData, config)) {
            elizaLogger.debug('Skipping post based on interaction rules');
            return;
        }
        // Get all comments for the post
        const commentResponses = await this.service.getComments(postData.id);
        elizaLogger.debug(`Found ${commentResponses.length} comments for post ${postData.id}`);
        // Then handle the post itself
        if (this.shouldCommentOnPost(postData, commentResponses)) {
            const memory = await this.createMemoryFromPost(postData);
            await this.runtime?.messageManager.createMemory(memory);
            const state = await this.composeState(memory);
            // Check if we should respond using AI-based decision
            const shouldRespond = await this.shouldRespondToPost(postData, state);
            if (shouldRespond && this.canComment(postData.id)) {
                const response = await this.generateResponse(memory, state);
                await this.replyToPost(postData.id, response.text);
                elizaLogger.debug(`Decided to respond to post ${postData.id}`);
            }
            else {
                elizaLogger.debug(`Decided not to respond to post ${postData.id}`);
            }
        }
        // Then process each comment if we can still comment
        if (this.canComment(postData.id)) {
            for (const commentResponse of commentResponses) {
                if (hasResponseData(commentResponse)) {
                    await this.handleComment(commentResponse.data);
                    // Add a small delay between processing comments to avoid rate limits
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
    }
    async replyToPost(postId, text) {
        try {
            // Check if we can comment before proceeding
            if (!this.canComment(postId)) {
                elizaLogger.debug('Cannot comment due to limits');
                return;
            }
            // Post the comment
            await this.service.replyToComment(postId, text);
            // Update stats
            this.updateCommentStats(postId);
            elizaLogger.info(`Successfully replied to post ${postId}`);
        }
        catch (error) {
            elizaLogger.error(`Failed to reply to post ${postId}:`, error);
            this.recordSafetyViolation('warning', 'post-reply');
        }
    }
    /**
     * Determine if we should interact with a post
     * @param post - The Reddit submission
     * @param config - The subreddit configuration
     * @returns Whether we should interact with the post
     */
    shouldInteractWithPost(post, config) {
        elizaLogger.debug(`Checking if should interact with post ${post.id}`);
        const postType = this.getPostType(post);
        if (!config.allowedPostTypes.includes(postType)) {
            elizaLogger.debug(`Post type ${postType} not allowed`);
            return false;
        }
        const postContent = `${post.title} ${post.selftext}`.toLowerCase();
        if (config.forbiddenTopics.some(topic => postContent.includes(topic.toLowerCase()))) {
            elizaLogger.debug(`Post contains forbidden topics`);
            return false;
        }
        if (!config.allowedTopics.some(topic => postContent.includes(topic.toLowerCase()))) {
            elizaLogger.debug(`Post doesn't match any allowed topics`);
            return false;
        }
        elizaLogger.debug(`Post ${post.id} is suitable for interaction`);
        return true;
    }
    /**
     * Determine if we should comment on a post
     * @param post - The Reddit submission
     * @param comments - Array of comment responses
     * @returns Whether we should comment on the post
     */
    shouldCommentOnPost(post, comments) {
        // Skip if user is blocked
        if (this.safetyStats.blockedUsers.has(post.author)) {
            elizaLogger.debug(`Skipping post from blocked user ${post.author}`);
            return false;
        }
        // Check operating hours
        const hour = new Date().getHours();
        if (hour < this.limits.operatingHours.start || hour >= this.limits.operatingHours.end) {
            elizaLogger.debug('Outside operating hours, skipping comment');
            return false;
        }
        // Check if we've already commented
        const ourComments = comments.filter(c => hasResponseData(c) &&
            c.data.author === this.currentUser?.name);
        if (ourComments.length >= this.limits.maxCommentsPerPost) {
            elizaLogger.debug(`Already reached comment limit for post ${post.id}`);
            return false;
        }
        // Check thread depth
        const threadComments = this.stats.commentsPerPost.get(post.id) || 0;
        if (threadComments >= this.limits.maxCommentsPerThread) {
            elizaLogger.debug(`Thread comment limit reached for ${post.id}`);
            return false;
        }
        return true;
    }
    /**
     * Determine if we should reply to a comment
     * @param comment - The Reddit comment
     * @param config - The subreddit configuration
     * @returns Whether we should reply to the comment
     */
    shouldReplyToComment(comment) {
        // Skip if user is blocked
        if (this.safetyStats.blockedUsers.has(comment.author)) {
            elizaLogger.debug(`Skipping comment from blocked user ${comment.author}`);
            return false;
        }
        // Check operating hours
        const hour = new Date().getHours();
        if (hour < this.limits.operatingHours.start || hour >= this.limits.operatingHours.end) {
            elizaLogger.debug('Outside operating hours, skipping reply');
            return false;
        }
        // Check thread depth limits
        const postId = comment.link_id?.replace('t3_', '') || comment.id;
        const threadComments = this.stats.commentsPerPost.get(postId) || 0;
        if (threadComments >= this.limits.maxCommentsPerThread) {
            elizaLogger.debug(`Thread comment limit reached for ${postId}`);
            return false;
        }
        return true;
    }
    /**
     * Update interaction statistics
     */
    updateCommentStats(postId) {
        this.stats.dailyComments++;
        this.stats.lastCommentTime = Date.now();
        const postComments = this.stats.commentsPerPost.get(postId) || 0;
        this.stats.commentsPerPost.set(postId, postComments + 1);
        elizaLogger.debug(`Updated comment stats for post ${postId}`, {
            dailyComments: this.stats.dailyComments,
            postComments: postComments + 1
        });
    }
    /**
     * Reset daily stats if it's a new day
     */
    checkAndResetDailyStats() {
        const now = new Date();
        const lastReset = new Date(this.stats.lastReset);
        if (now.getDate() !== lastReset.getDate() ||
            now.getMonth() !== lastReset.getMonth() ||
            now.getFullYear() !== lastReset.getFullYear()) {
            this.stats = this.initializeStats();
        }
    }
    /**
     * Initialize interaction statistics
     */
    initializeStats() {
        return {
            dailyComments: 0,
            dailyPosts: 0,
            lastCommentTime: 0,
            lastPostTime: 0,
            commentsPerPost: new Map(),
            lastReset: Date.now()
        };
    }
    initializeSafetyStats() {
        return {
            warningCount: 0,
            errorCount: 0,
            lastWarningTime: 0,
            lastErrorTime: 0,
            blockedPosts: new Set(),
            blockedUsers: new Set(),
            topicViolations: new Map(),
            lastResetTime: Date.now()
        };
    }
    /**
     * Get the type of a post
     * @param post - The Reddit submission
     * @returns The type of the post
     */
    getPostType(post) {
        if (post.is_video)
            return 'video';
        if (post.is_self)
            return 'text';
        if (post.url?.match(/\.(jpg|jpeg|png|gif)$/i))
            return 'image';
        return 'link';
    }
    cleanup() {
        elizaLogger.info("🧹 Cleaning up UserInteractionAction");
        if (this.isShutdown) {
            elizaLogger.warn("Cleanup called during shutdown state");
        }
        this.service.cleanup();
        this.postAction.cleanup();
        this.retrieveAction.cleanup();
        this.dumpSafetyStats();
    }
    dumpSafetyStats() {
        elizaLogger.info("📊 Final Safety Statistics:");
        elizaLogger.info(`Warnings: ${this.safetyStats.warningCount}`);
        elizaLogger.info(`Errors: ${this.safetyStats.errorCount}`);
        elizaLogger.info(`Blocked Posts: ${this.safetyStats.blockedPosts.size}`);
        elizaLogger.info(`Blocked Users: ${this.safetyStats.blockedUsers.size}`);
        elizaLogger.info(`Topic Violations: ${this.safetyStats.topicViolations.size}`);
    }
    /**
     * Create a memory object from a Reddit submission
     * @param post - The Reddit submission
     * @returns A memory object
     */
    async createMemoryFromPost(post) {
        const roomId = stringToUuid(`${post.subreddit}-${this.runtime?.agentId}`);
        const userId = stringToUuid(`${post.author}-${this.runtime?.agentId}`);
        const postId = stringToUuid(`${post.id}-${this.runtime?.agentId}`);
        const content = {
            text: `${post.title}\n\n${post.selftext}`,
            source: 'reddit',
            id: post.id,
            timestamp: new Date(post.created_utc * 1000).toISOString()
        };
        return {
            id: postId,
            userId,
            agentId: this.runtime?.agentId ? stringToUuid(this.runtime.agentId) : stringToUuid('reddit-bot'),
            roomId,
            content,
            createdAt: post.created_utc * 1000,
            embedding: getEmbeddingZeroVector()
        };
    }
    /**
     * Create a memory object from a Reddit comment
     * @param comment - The Reddit comment
     * @returns A memory object
     */
    async createMemoryFromComment(comment) {
        if (!this.runtime) {
            throw new Error("Runtime not initialized");
        }
        const content = {
            text: comment.body,
            source: 'reddit',
            metadata: {
                id: comment.id,
                author: comment.author,
                subreddit: comment.subreddit,
                created_utc: comment.created_utc,
                parent_id: comment.parent_id,
                link_id: comment.link_id
            }
        };
        const memory = {
            id: stringToUuid(comment.id),
            userId: stringToUuid(comment.author),
            agentId: this.runtime.agentId,
            roomId: stringToUuid(comment.subreddit),
            content,
            embedding: await getEmbeddingZeroVector(),
            createdAt: comment.created_utc * 1000
        };
        return memory;
    }
    async composeState(memory) {
        if (!this.runtime)
            throw new Error("Runtime not initialized");
        const state = await this.runtime.composeState(memory);
        // Add Reddit-specific state
        return {
            ...state,
            subreddit: this.env?.REDDIT_SUBREDDIT || '',
            allowedTopics: this.env?.REDDIT_TOPIC ? [this.env.REDDIT_TOPIC] : [],
            customRules: [],
            currentUser: this.currentUser?.name,
            isModerated: false,
            messageDirections: "Be helpful and follow subreddit rules",
            postDirections: "Create engaging and relevant content",
            bio: Array.isArray(this.runtime.character.bio) ? this.runtime.character.bio.join('. ') : String(this.runtime.character.bio || "I am a helpful Reddit bot."),
            lore: Array.isArray(this.runtime.character.lore) ? this.runtime.character.lore.join('. ') : "",
            recentMessages: "",
            recentMessagesData: []
        };
    }
    /**
     * Check if we should respond to a post
     * @param post - The Reddit submission
     * @param state - The current state
     * @returns Whether we should respond to the post
     */
    async shouldRespondToPost(post, state) {
        if (!this.runtime)
            throw new Error("Runtime not initialized");
        // Skip if already processed
        if (this.processedPosts.has(post.id))
            return false;
        const postMemory = await this.createMemoryFromPost(post);
        // Save memory
        await this.runtime.messageManager.createMemory(postMemory);
        // Update state with recent messages
        state = await this.runtime.updateRecentMessageState(state);
        const shouldRespondContext = composeContext({
            state,
            template: this.runtime.character.templates?.shouldRespondTemplate || 'Analyze if we should respond to this Reddit post.'
        });
        const response = await generateShouldRespond({
            runtime: this.runtime,
            context: shouldRespondContext,
            modelClass: ModelClass.SMALL
        });
        return response === 'RESPOND';
    }
    async generateResponse(memory, state) {
        if (!this.runtime)
            throw new Error("Runtime not initialized");
        // Update state with recent messages
        state = await this.runtime.updateRecentMessageState(state);
        const responseContext = composeContext({
            state,
            template: this.runtime.character.templates?.messageHandlerTemplate || 'Generate a response to this Reddit message.'
        });
        const response = await generateMessageResponse({
            runtime: this.runtime,
            context: responseContext,
            modelClass: ModelClass.SMALL
        });
        // If response includes a CONTINUE action but there's no direct mention or thread context,
        // remove the action to prevent automatic continuation
        if (response.action === 'CONTINUE' &&
            !memory.content.text?.toLowerCase().includes(this.currentUser?.name?.toLowerCase() || '') &&
            !state.recentMessages?.includes(String(memory.id))) {
            elizaLogger.debug("Removing CONTINUE action - not a direct interaction");
            delete response.action;
        }
        return response;
    }
    async handleComment(comment) {
        // Skip if we've already processed this comment
        if (this.processedComments.has(comment.id)) {
            elizaLogger.debug(`Already processed comment ${comment.id}`);
            return;
        }
        if (this.shouldReplyToComment(comment)) {
            const commentMemory = await this.createMemoryFromComment(comment);
            const commentState = await this.composeState(commentMemory);
            // Add comment memory to runtime
            if (this.runtime) {
                await this.runtime.messageManager.createMemory(commentMemory);
                const response = await this.generateResponse(commentMemory, commentState);
                await this.replyToComment(comment.id, response.text);
                this.processedComments.add(comment.id);
                elizaLogger.debug(`Successfully processed comment ${comment.id}`);
            }
        }
    }
    async replyToComment(commentId, text) {
        try {
            // Check if we can comment before proceeding
            if (!this.canComment(commentId)) {
                elizaLogger.debug('Cannot comment due to limits');
                return;
            }
            // Post the comment
            await this.service.replyToComment(commentId, text);
            // Update stats
            this.updateCommentStats(commentId);
            elizaLogger.info(`Successfully replied to comment ${commentId}`);
        }
        catch (error) {
            elizaLogger.error(`Failed to reply to comment ${commentId}:`, error);
            this.recordSafetyViolation('warning', 'comment-reply');
        }
    }
    async validate(runtime) {
        try {
            await this.service.initialize(runtime);
            const env = await validateRedditEnv(runtime);
            return !!env;
        }
        catch (error) {
            elizaLogger.error('Failed to validate Reddit user interaction action:', error);
            return false;
        }
    }
    async handler(runtime, message) {
        try {
            if (!this.runtime || !this.env || !this.currentUser) {
                return {
                    success: false,
                    error: 'Action not properly initialized'
                };
            }
            elizaLogger.debug(`🤖 Processing user interaction`, {
                messageId: message.id,
                source: message.content.source
            });
            // Create state from memory
            const actorsInfo = {
                user: {
                    id: message.userId,
                    name: message.content.source === 'reddit' ? message.userId : 'unknown',
                    role: 'user'
                },
                assistant: {
                    id: message.agentId,
                    name: this.currentUser?.name || 'unknown',
                    role: 'assistant'
                }
            };
            const state = {
                runtime,
                message,
                bio: '',
                lore: '',
                messageDirections: '',
                postDirections: '',
                conversationHistory: [],
                knowledgeContext: '',
                modelClass: ModelClass.SMALL,
                roomId: stringToUuid(message.roomId || ''),
                actors: JSON.stringify(actorsInfo), // Serialize actors info to string
                recentMessages: '', // Empty string as we don't have recent messages yet
                recentMessagesData: [message] // Include current message in history
            };
            // Generate response using the provided context
            const context = await composeContext({
                state,
                template: 'You are responding to a Reddit {{source}} from user {{user}}. {{content}}'
            });
            const response = await generateText({
                runtime,
                context,
                modelClass: ModelClass.SMALL
            });
            elizaLogger.info(`✓ Generated response for user interaction`, {
                responseLength: response.length
            });
            return {
                success: true,
                response: response
            };
        }
        catch (error) {
            elizaLogger.error('❌ Error handling user interaction:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
}
UserInteractionAction.instance = null;
//# sourceMappingURL=user-interaction.action.js.map