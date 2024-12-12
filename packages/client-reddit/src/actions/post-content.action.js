import { elizaLogger, composeContext, generateShouldRespond, ModelClass, stringToUuid, getEmbeddingZeroVector } from "@ai16z/eliza";
import { RedditService } from "../services/reddit.service";
import { hasResponseData } from "../types/reddit-types";
/**
 * Action for interacting with Reddit posts and comments
 */
export class PostContentAction {
    constructor() {
        this.interactions = new Map();
        this.runtime = null;
        this.MAX_RESPONSES_PER_POST = 2;
        this.INTERACTION_COOLDOWN = 5 * 60 * 1000; // 5 minutes in milliseconds
        this.service = RedditService.getInstance();
    }
    static getInstance() {
        if (!PostContentAction.instance) {
            PostContentAction.instance = new PostContentAction();
        }
        return PostContentAction.instance;
    }
    async composeState(subreddit) {
        if (!this.runtime)
            throw new Error("Runtime not initialized");
        // Initial state composition
        let state = await this.runtime.composeState({
            content: { text: '', source: 'reddit' },
            userId: stringToUuid('system'),
            agentId: this.runtime.agentId,
            roomId: stringToUuid(subreddit)
        }, {
            subreddit,
            interactions: Array.from(this.interactions.values())
        });
        // Update state with recent messages
        state = await this.runtime.updateRecentMessageState(state);
        return state;
    }
    async createMemory(content) {
        if (!this.runtime)
            throw new Error("Runtime not initialized");
        return {
            id: stringToUuid(`${content.id}-${this.runtime.agentId}`),
            userId: stringToUuid(`${content.author}-${this.runtime.agentId}`),
            agentId: stringToUuid(this.runtime.agentId),
            roomId: stringToUuid(`${content.subreddit}-${this.runtime.agentId}`),
            content: {
                text: content.text,
                source: 'reddit',
                id: content.id,
                timestamp: new Date(content.created_utc * 1000).toISOString()
            },
            createdAt: content.created_utc * 1000,
            embedding: getEmbeddingZeroVector()
        };
    }
    initialize(runtime) {
        elizaLogger.debug("🔄 Initializing PostContent action");
        this.runtime = runtime;
        return this.service.initialize(runtime);
    }
    /**
     * Find a post by URL or search criteria
     * @param criteria - URL or search query
     * @returns The found post or null
     */
    async findPost(criteria) {
        elizaLogger.debug(`🔍 Finding post with criteria: ${criteria}`);
        try {
            // If criteria is a URL, get the post directly
            if (criteria.startsWith('http')) {
                const postId = this.extractPostId(criteria);
                return this.service.getSubmission(postId);
            }
            // Otherwise, search for posts
            const results = await this.service.search(criteria, {
                sort: 'relevance',
                time: 'week',
                limit: 1
            });
            return results[0] || null;
        }
        catch (error) {
            elizaLogger.error(`Error finding post: ${error}`);
            return null;
        }
    }
    /**
     * Read a post and its comments
     * @param postId - The ID of the post to read
     * @returns The post and its comments
     */
    async readPost(postId) {
        elizaLogger.debug(`🔍 Reading post: ${postId}`);
        try {
            const postResponse = await this.service.getSubmission(postId);
            if (!hasResponseData(postResponse)) {
                elizaLogger.warn(`Post ${postId} not found`);
                return null;
            }
            const commentsResponse = await this.service.getComments(postId);
            const comments = commentsResponse
                .filter(hasResponseData)
                .map(response => response.data);
            if (this.runtime) {
                // Create memory for the post
                const memory = await this.createMemory({
                    text: `${postResponse.data.title}\n\n${postResponse.data.selftext}`,
                    id: postResponse.data.id,
                    created_utc: postResponse.data.created_utc,
                    author: postResponse.data.author,
                    subreddit: postResponse.data.subreddit
                });
                await this.runtime.messageManager.createMemory(memory);
            }
            return {
                post: postResponse.data,
                comments
            };
        }
        catch (error) {
            elizaLogger.error(`Error reading post: ${error}`);
            return null;
        }
    }
    /**
     * Check replies to a comment
     * @param commentId - The ID of the comment to check
     * @returns Array of reply comments
     */
    async checkReplies(commentId) {
        elizaLogger.debug(`🔍 Checking replies to comment: ${commentId}`);
        try {
            const commentResponse = await this.service.getComment(commentId);
            if (!hasResponseData(commentResponse) || !commentResponse.data.link_id) {
                return [];
            }
            const repliesResponse = await this.service.getComments(commentResponse.data.link_id.replace('t3_', ''));
            return repliesResponse
                .filter(hasResponseData)
                .map(response => response.data)
                .filter(comment => comment.parent_id === `t1_${commentId}`);
        }
        catch (error) {
            elizaLogger.error(`Error checking replies: ${error}`);
            return [];
        }
    }
    /**
     * Monitor a comment for replies
     * @param commentId - The ID of the comment to monitor
     * @param interval - Check interval in milliseconds
     * @returns Array of reply comments
     */
    async monitorComment(commentId, interval = 60000) {
        elizaLogger.debug(`🔍 Starting to monitor comment: ${commentId}`);
        return new Promise((resolve) => {
            let checkCount = 0;
            const maxChecks = 5; // Monitor for 5 intervals
            const replies = [];
            const checkInterval = setInterval(async () => {
                checkCount++;
                elizaLogger.debug(`Check ${checkCount} of ${maxChecks} for comment ${commentId}`);
                const newReplies = await this.checkReplies(commentId);
                if (newReplies.length > 0) {
                    replies.push(...newReplies);
                    clearInterval(checkInterval);
                    resolve(replies);
                }
                else if (checkCount >= maxChecks) {
                    clearInterval(checkInterval);
                    resolve(replies);
                }
            }, interval);
        });
    }
    /**
     * Comment on a post
     * @param postId - The ID of the post to comment on
     * @param content - The comment content
     * @returns The created comment or null
     */
    async commentOnPost(postId, content) {
        elizaLogger.debug(`💬 Commenting on post: ${postId}`);
        // Check if we've already interacted with this post
        const interaction = this.interactions.get(postId);
        if (interaction && interaction.responseCount >= this.MAX_RESPONSES_PER_POST) {
            elizaLogger.warn(`Maximum responses (${this.MAX_RESPONSES_PER_POST}) reached for post ${postId}`);
            return null;
        }
        try {
            const postResponse = await this.service.getSubmission(postId);
            if (!hasResponseData(postResponse)) {
                return null;
            }
            const state = await this.composeState(postResponse.data.subreddit);
            const commentContext = composeContext({
                state,
                template: `Analyze if we should comment on this post in r/${postResponse.data.subreddit}`
            });
            const shouldRespond = await generateShouldRespond({
                runtime: this.runtime,
                context: commentContext,
                modelClass: ModelClass.SMALL
            });
            if (shouldRespond === 'RESPOND') {
                const commentResponse = await this.service.replyToSubmission(postId, content);
                if (!hasResponseData(commentResponse)) {
                    return null;
                }
                // Track this interaction
                this.interactions.set(postId, {
                    postId,
                    commentId: commentResponse.data.id,
                    responseCount: interaction ? interaction.responseCount + 1 : 1,
                    lastInteractionTime: Date.now()
                });
                return commentResponse.data;
            }
            return null;
        }
        catch (error) {
            elizaLogger.error(`Error commenting on post: ${error}`);
            return null;
        }
    }
    /**
     * Reply to a comment
     * @param commentId - The ID of the comment to reply to
     * @param content - The reply content
     * @returns The created reply comment or null
     */
    async replyToComment(commentId, content) {
        elizaLogger.debug(`💬 Replying to comment: ${commentId}`);
        try {
            const commentResponse = await this.service.getComment(commentId);
            if (!hasResponseData(commentResponse) || !commentResponse.data.link_id) {
                return null;
            }
            const postId = commentResponse.data.link_id.replace('t3_', '');
            // Check interaction limits
            const interaction = this.interactions.get(postId);
            if (!interaction) {
                elizaLogger.warn(`No tracked interaction found for post ${postId}`);
                return null;
            }
            if (interaction.responseCount >= this.MAX_RESPONSES_PER_POST) {
                elizaLogger.warn(`Maximum responses (${this.MAX_RESPONSES_PER_POST}) reached for post ${postId}`);
                return null;
            }
            // Check cooldown
            const timeSinceLastInteraction = Date.now() - interaction.lastInteractionTime;
            if (timeSinceLastInteraction < this.INTERACTION_COOLDOWN) {
                elizaLogger.warn(`Cooldown period not elapsed for post ${postId}`);
                return null;
            }
            const state = await this.composeState(commentResponse.data.subreddit);
            const replyContext = composeContext({
                state,
                template: `Analyze if we should reply to this comment in r/${commentResponse.data.subreddit}`
            });
            const shouldRespond = await generateShouldRespond({
                runtime: this.runtime,
                context: replyContext,
                modelClass: ModelClass.SMALL
            });
            if (shouldRespond === 'RESPOND') {
                const replyResponse = await this.service.replyToComment(commentId, content);
                if (!hasResponseData(replyResponse)) {
                    return null;
                }
                // Update interaction tracking
                this.interactions.set(postId, {
                    ...interaction,
                    responseCount: interaction.responseCount + 1,
                    lastInteractionTime: Date.now()
                });
                return replyResponse.data;
            }
            return null;
        }
        catch (error) {
            elizaLogger.error(`Error replying to comment: ${error}`);
            return null;
        }
    }
    extractPostId(url) {
        const matches = url.match(/comments\/([a-z0-9]+)\//i);
        if (!matches || !matches[1]) {
            throw new Error(`Could not extract post ID from URL: ${url}`);
        }
        return matches[1];
    }
    cleanup() {
        elizaLogger.debug("🧹 Cleaning up PostContent action");
        this.interactions.clear();
        this.service.cleanup();
        this.runtime = null;
    }
}
PostContentAction.instance = null;
//# sourceMappingURL=post-content.action.js.map