import { elizaLogger } from "@ai16z/eliza";
/**
 * Type guard to check if a response has data
 * @param response - The response to check
 */
export function hasResponseData(response) {
    return response.success && response.data !== undefined;
}
/**
 * Event types
 */
export var RedditEventType;
(function (RedditEventType) {
    RedditEventType["NEW_POST"] = "new_post";
    RedditEventType["NEW_COMMENT"] = "new_comment";
    RedditEventType["MENTION"] = "mention";
})(RedditEventType || (RedditEventType = {}));
/**
 * Type guard to check if an object is a RedditComment
 * @param obj - Object to check
 */
export function isRedditComment(obj) {
    elizaLogger.debug('Type checking RedditComment:', obj);
    if (!obj || typeof obj !== 'object')
        return false;
    const comment = obj;
    const isValid = typeof comment.id === 'string'
        && typeof comment.body === 'string'
        && typeof comment.author === 'string'
        && typeof comment.parent_id === 'string'
        && typeof comment.created_utc === 'number'
        && typeof comment.subreddit === 'string';
    elizaLogger.debug(`RedditComment validation result: ${isValid}`);
    return isValid;
}
/**
 * Type guard to check if an object is a RedditSubmission
 * @param obj - Object to check
 */
export function isRedditSubmission(obj) {
    elizaLogger.debug('Type checking RedditSubmission:', obj);
    const isValid = obj
        && typeof obj.id === 'string'
        && typeof obj.title === 'string'
        && typeof obj.author === 'string'
        && typeof obj.is_self === 'boolean';
    elizaLogger.debug(`RedditSubmission validation result: ${isValid}`);
    return isValid;
}
/**
 * Type guard to check if an object is a RedditUser
 * @param obj - Object to check
 */
export function isRedditUser(obj) {
    elizaLogger.debug('Type checking RedditUser:', obj);
    const isValid = obj
        && typeof obj.id === 'string'
        && typeof obj.name === 'string'
        && typeof obj.created_utc === 'number';
    elizaLogger.debug(`RedditUser validation result: ${isValid}`);
    return isValid;
}
//# sourceMappingURL=reddit-types.js.map