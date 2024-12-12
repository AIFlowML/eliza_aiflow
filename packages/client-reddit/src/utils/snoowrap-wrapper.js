import { elizaLogger } from '@ai16z/eliza';
/**
 * Wrapper for Snoowrap that breaks circular references and extracts essential data
 * This class provides a simplified interface to interact with Reddit's API through Snoowrap
 */
export class SnoowrapWrapper {
    constructor(client) {
        this.client = client;
    }
    /**
     * Extracts basic data common to both submissions and comments
     * @param obj - The Reddit object to extract data from
     * @returns Basic data object or null if input is invalid
     */
    extractBasicData(obj) {
        if (!obj)
            return null;
        return {
            id: obj.id,
            author: {
                name: obj.author?.name || '[deleted]'
            },
            created_utc: obj.created_utc,
            subreddit: {
                display_name: obj.subreddit?.display_name || '[unknown]'
            }
        };
    }
    /**
     * Extracts relevant data from a Reddit comment
     * @param obj - The comment object to extract data from
     * @returns Formatted comment data or null if invalid
     */
    extractCommentData(obj) {
        const basic = this.extractBasicData(obj);
        if (!basic)
            return null;
        return {
            ...basic,
            body: obj?.body || '',
            parent_id: obj?.parent_id || '',
            link_id: obj?.link_id || ''
        };
    }
    /**
     * Extracts relevant data from a Reddit submission
     * @param obj - The submission object to extract data from
     * @returns Formatted submission data or null if invalid
     */
    extractSubmissionData(obj) {
        const basic = this.extractBasicData(obj);
        if (!basic)
            return null;
        return {
            ...basic,
            title: obj?.title || '',
            selftext: obj?.selftext || '',
            url: obj?.url || '',
            is_self: !!obj?.is_self
        };
    }
    /**
     * Extracts relevant data from a Reddit user
     * @param obj - The user object to extract data from
     * @returns Formatted user data or null if invalid
     */
    extractUserData(obj) {
        if (!obj)
            return null;
        return {
            id: obj.id,
            name: obj.name,
            created_utc: obj.created_utc,
            comment_karma: obj.comment_karma,
            link_karma: obj.link_karma
        };
    }
    /**
     * Retrieves a submission by its ID
     * @param id - The Reddit submission ID
     * @returns The submission data or null if not found
     */
    async getSubmission(id) {
        try {
            elizaLogger.debug(`Fetching submission with ID: ${id}`);
            return new Promise((resolve) => {
                this.client.getSubmission(id)
                    .fetch()
                    .then((submission) => {
                    resolve(this.extractSubmissionData(submission));
                })
                    .catch((error) => {
                    elizaLogger.error(`Failed to get submission ${id}:`, error);
                    resolve(null);
                });
            });
        }
        catch (error) {
            elizaLogger.error(`Failed to get submission ${id}:`, error);
            return null;
        }
    }
    /**
     * Retrieves a comment by its ID
     * @param id - The Reddit comment ID
     * @returns The comment data or null if not found
     */
    async getComment(id) {
        try {
            elizaLogger.debug(`Fetching comment with ID: ${id}`);
            return new Promise((resolve) => {
                this.client.getComment(id)
                    .fetch()
                    .then((comment) => {
                    resolve(this.extractCommentData(comment));
                })
                    .catch((error) => {
                    elizaLogger.error(`Failed to get comment ${id}:`, error);
                    resolve(null);
                });
            });
        }
        catch (error) {
            elizaLogger.error(`Failed to get comment ${id}:`, error);
            return null;
        }
    }
    /**
     * Get all comments for a submission, including replies
     * @param submissionId - The ID of the submission to get comments for
     * @returns Array of comments
     */
    async getComments(submissionId) {
        try {
            elizaLogger.debug(`🔍 Fetching comments for submission: ${submissionId}`);
            return new Promise((resolve) => {
                this.client.getSubmission(submissionId)
                    .expandReplies({ limit: Infinity, depth: Infinity })
                    .then(async (submission) => {
                    try {
                        const processedComments = [];
                        const processComment = (comment, depth = 0) => {
                            const processedComment = this.extractCommentData(comment);
                            if (processedComment) {
                                const indent = '  '.repeat(depth);
                                elizaLogger.debug(`${indent}📝 Found comment:`, {
                                    id: processedComment.id,
                                    author: processedComment.author.name,
                                    parent_id: processedComment.parent_id,
                                    link_id: processedComment.link_id,
                                    body: processedComment.body.slice(0, 100) + (processedComment.body.length > 100 ? '...' : ''),
                                    created_utc: new Date(processedComment.created_utc * 1000).toISOString()
                                });
                                processedComments.push(processedComment);
                                // Process replies recursively
                                if (comment.replies && Array.isArray(comment.replies)) {
                                    elizaLogger.debug(`${indent}↳ Found ${comment.replies.length} replies`);
                                    comment.replies.forEach(reply => processComment(reply, depth + 1));
                                }
                            }
                        };
                        // Process all top-level comments and their replies
                        elizaLogger.debug(`📊 Processing top-level comments for submission ${submissionId}`);
                        submission.comments.forEach(comment => processComment(comment));
                        elizaLogger.debug(`✅ Retrieved ${processedComments.length} total comments for submission ${submissionId}`, {
                            submission_id: submissionId,
                            total_comments: processedComments.length,
                            comment_ids: processedComments.map(c => c.id),
                            comment_structure: processedComments.map(c => ({
                                id: c.id,
                                author: c.author.name,
                                parent_id: c.parent_id,
                                link_id: c.link_id
                            }))
                        });
                        resolve(processedComments);
                    }
                    catch (error) {
                        elizaLogger.error(`❌ Failed to process comments for submission ${submissionId}:`, error);
                        resolve([]);
                    }
                })
                    .catch((error) => {
                    elizaLogger.error(`❌ Failed to fetch submission ${submissionId}:`, error);
                    resolve([]);
                });
            });
        }
        catch (error) {
            elizaLogger.error(`❌ Failed to get comments for submission ${submissionId}:`, error);
            return [];
        }
    }
    /**
     * Replies to a comment
     * @param id - The ID of the comment to reply to
     * @param text - The reply text
     * @returns The created comment data or null if failed
     */
    async replyToComment(id, text) {
        try {
            elizaLogger.debug(`Replying to comment: ${id}`);
            return this.client.getComment(id)
                .reply(text)
                .then((reply) => {
                return this.extractCommentData(reply);
            })
                .catch((error) => {
                elizaLogger.error(`Failed to reply to comment ${id}:`, error);
                return null;
            });
        }
        catch (error) {
            elizaLogger.error(`Failed to reply to comment ${id}:`, error);
            return null;
        }
    }
    /**
     * Replies to a submission
     * @param id - The ID of the submission to reply to
     * @param text - The reply text
     * @returns The created comment data or null if failed
     */
    async replyToSubmission(id, text) {
        try {
            elizaLogger.debug(`Replying to submission: ${id}`);
            return this.client.getSubmission(id)
                .reply(text)
                .then((reply) => {
                return this.extractCommentData(reply);
            })
                .catch((error) => {
                elizaLogger.error(`Failed to reply to submission ${id}:`, error);
                return null;
            });
        }
        catch (error) {
            elizaLogger.error(`Failed to reply to submission ${id}:`, error);
            return null;
        }
    }
    /**
     * Gets the currently authenticated user
     * @returns The user data or null if not authenticated
     */
    async getCurrentUser() {
        try {
            elizaLogger.debug('Fetching current user');
            return new Promise((resolve) => {
                this.client.getMe()
                    .then((user) => {
                    resolve(this.extractUserData(user));
                })
                    .catch((error) => {
                    elizaLogger.error('Failed to get current user:', error);
                    resolve(null);
                });
            });
        }
        catch (error) {
            elizaLogger.error('Failed to get current user:', error);
            return null;
        }
    }
    /**
     * Gets a user by username
     * @param username - The Reddit username
     * @returns The user data or null if not found
     */
    async getUser(username) {
        try {
            elizaLogger.debug(`Fetching user: ${username}`);
            return this.client.getUser(username)
                .fetch()
                .then((user) => {
                return this.extractUserData(user);
            })
                .catch((error) => {
                elizaLogger.error(`Failed to get user ${username}:`, error);
                return null;
            });
        }
        catch (error) {
            elizaLogger.error(`Failed to get user ${username}:`, error);
            return null;
        }
    }
    /**
     * Searches Reddit for submissions
     * @param query - The search query
     * @param options - Search options (sort, time, limit)
     * @returns Array of matching submissions
     */
    async search(query, options = {}) {
        try {
            elizaLogger.debug(`Searching Reddit for: ${query}`);
            const results = await Promise.resolve(this.client.search({
                query,
                sort: options.sort,
                time: options.time,
                limit: options.limit
            }));
            return results
                .map(item => this.extractSubmissionData(item))
                .filter((item) => item !== null);
        }
        catch (error) {
            elizaLogger.error(`Failed to search for ${query}:`, error);
            return [];
        }
    }
    /**
     * Gets posts from a subreddit
     * @param subreddit - The subreddit name
     * @param sort - Sort method ('hot', 'new', or 'top')
     * @param limit - Maximum number of posts to retrieve
     * @returns Array of subreddit posts
     */
    async getSubredditPosts(subreddit, sort = 'new', // Default to 'new' to catch all recent posts
    limit = 100 // Increased default limit
    ) {
        try {
            elizaLogger.debug(`Fetching ${sort} posts from r/${subreddit} (limit: ${limit})`);
            const sub = this.client.getSubreddit(subreddit);
            const method = sort === 'new' ? 'getNew' : sort === 'top' ? 'getTop' : 'getHot';
            const posts = await Promise.resolve(sub[method]({ limit }));
            const formattedPosts = posts
                .map(item => this.extractSubmissionData(item))
                .filter((post) => post !== null);
            elizaLogger.debug(`✅ Retrieved ${formattedPosts.length} posts from r/${subreddit}`);
            return formattedPosts;
        }
        catch (error) {
            elizaLogger.error(`Error getting posts from r/${subreddit}:`, error);
            throw error;
        }
    }
    /**
     * Gets mentions for a user from their inbox
     * @param username - The Reddit username to get mentions for
     * @returns Array of comments that mention the user
     */
    async getUserMentions(username) {
        try {
            elizaLogger.debug(`Fetching mentions for user: ${username}`);
            const inbox = await this.client.getInbox({ filter: 'mentions' });
            const mentions = await Promise.resolve(inbox);
            const processedMentions = Array.from(mentions)
                .map((mention) => {
                if ('body' in mention) {
                    return this.extractCommentData(mention);
                }
                return null;
            })
                .filter((mention) => mention !== null);
            elizaLogger.debug(`Found ${processedMentions.length} mentions for ${username}`);
            return processedMentions;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            elizaLogger.error(`Failed to get mentions for ${username}:`, errorMessage);
            return [];
        }
    }
    /**
     * Gets a subreddit by name
     * @param name - The subreddit name
     * @returns The subreddit data or null if not found
     */
    async getSubreddit(name) {
        try {
            elizaLogger.debug(`Fetching subreddit: ${name}`);
            return new Promise((resolve) => {
                this.client.getSubreddit(name)
                    .fetch()
                    .then((subreddit) => {
                    if (!subreddit) {
                        resolve(null);
                        return;
                    }
                    resolve({
                        id: subreddit.id,
                        author: { name: name },
                        created_utc: subreddit.created_utc,
                        subreddit: { display_name: name }
                    });
                })
                    .catch((error) => {
                    elizaLogger.error(`Failed to get subreddit ${name}:`, error);
                    resolve(null);
                });
            });
        }
        catch (error) {
            elizaLogger.error(`Failed to get subreddit ${name}:`, error);
            return null;
        }
    }
    /**
     * Gets comments for a specific user
     * @param username - The username to get comments for
     * @returns Array of formatted comment data
     */
    async getUserComments(username) {
        try {
            const userRef = this.client.getUser(username);
            const commentsListing = await userRef.getComments();
            const comments = await commentsListing.fetchAll();
            const formattedComments = comments
                .map((comment) => this.extractCommentData(comment))
                .filter((comment) => comment !== null);
            return formattedComments;
        }
        catch (error) {
            elizaLogger.error(`Error getting comments for user ${username}:`, error);
            throw error;
        }
    }
}
//# sourceMappingURL=snoowrap-wrapper.js.map