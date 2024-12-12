/**
 * Reddit Comment Action
 * Handles commenting on Reddit posts with proper validation, rate limiting, and content generation.
 *
 * Features:
 * - Validates comment requests based on source and content
 * - Checks for comment intent using keywords
 * - Generates appropriate responses using LLM
 * - Follows subreddit rules and rate limits
 * - Provides detailed logging and error handling
 *
 * @module commentAction
 */
import { Action } from "@ai16z/eliza";
/**
 * Reddit Comment Action Configuration
 * Handles commenting on Reddit posts with proper validation and rate limiting
 */
export declare const commentAction: Action;
export default commentAction;
