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

import { 
    elizaLogger,
    generateShouldRespond,
    generateMessageResponse,
    composeContext
} from "@ai16z/eliza";
import {
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
    Content,
    Action,
    Handler,
    HandlerCallback
} from "@ai16z/eliza";
import { PostContentAction } from "./post-content.action";
import { RedditService } from "../services/reddit.service";
import { RedditComment } from "../types/reddit-types";
import { 
    redditMessageHandlerTemplate, 
    redditShouldRespondTemplate,
    redditCommentExamples 
} from "../templates";

/**
 * Extended Reddit comment interface with link_id
 */
interface CommentWithLinkId extends RedditComment {
  link_id: string;
}

/**
 * Reddit Comment Action Configuration
 * Handles commenting on Reddit posts with proper validation and rate limiting
 */
export const commentAction: Action = {
  name: "REDDIT_COMMENT",
  similes: ["REPLY", "RESPOND"],
  description: "Comment on a Reddit post following community guidelines and rate limits",

  /**
   * Validates if the action should be executed
   * @param runtime - Agent runtime environment
   * @param message - Memory object containing message data
   * @param state - Current state object
   * @returns boolean indicating if action should proceed
   */
  validate: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State | undefined
  ): Promise<boolean> => {
    elizaLogger.debug("🔍 Validating comment action...");
    elizaLogger.debug(`Runtime agent ID: ${runtime.agentId}`);
    elizaLogger.debug(`Memory content: ${JSON.stringify(message.content)}`);
    
    // Check source
    if (message.content.source !== "reddit") {
      elizaLogger.debug("❌ Invalid source - not from Reddit");
      return false;
    }

    // Validate content structure
    if (!message.content || typeof message.content !== 'object') {
      elizaLogger.debug("❌ Invalid memory content structure");
      return false;
    }

    const postId = message.content.id;
    if (!postId) {
      elizaLogger.debug("❌ No post ID found in memory content");
      return false;
    }

    // Check if we have a valid state
    if (!state) {
      elizaLogger.debug("⚠️ No state provided, will create new state in handler");
    } else {
      elizaLogger.debug(`Current state: ${JSON.stringify(state)}`);
    }

    // Check for keywords in message text that indicate a comment request
    const keywords = ["comment", "reply", "respond", "answer", "write"];
    const hasCommentIntent = keywords.some(keyword => 
      message.content.text.toLowerCase().includes(keyword.toLowerCase())
    );

    if (!hasCommentIntent) {
      elizaLogger.debug("❌ Message does not indicate comment intent");
      return false;
    }

    elizaLogger.debug(`✅ Validation passed for post ID: ${postId}`);
    return true;
  },

  /**
   * Handles the comment action execution
   * @param runtime - Agent runtime environment
   * @param message - Memory object containing message data
   * @param state - Current state object
   * @param _options - Additional options (unused)
   * @param callback - Callback function for updates
   * @returns Content object with action results
   */
  handler: (async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State | undefined,
    _options: any,
    callback: HandlerCallback
  ): Promise<Content> => {
    elizaLogger.debug("🚀 Starting comment handler...");

    // Initialize services
    const postAction = PostContentAction.getInstance();
    const service = RedditService.getInstance();
    await Promise.all([
      postAction.initialize(runtime),
      service.initialize(runtime)
    ]);

    // Create callback data structure
    const callbackData: Content = {
      text: "",
      action: "REDDIT_COMMENT_RESPONSE",
      source: message.content.source
    };

    // Ensure we have a state, or create one
    const currentState = state ?? await runtime.composeState(message) as State;
    elizaLogger.debug(`Using state: ${JSON.stringify(currentState)}`);

    try {
      // Extract post ID from content
      const postId = message.content.id;
      if (!postId) {
        elizaLogger.error("❌ No post ID found in message content");
        throw new Error("No post ID provided");
      }

      elizaLogger.debug(`📝 Attempting to read post: ${postId}`);

      // Get the post using PostContentAction
      const postData = await postAction.readPost(String(postId));
      if (!postData) {
        elizaLogger.error("❌ Failed to read post");
        throw new Error("Failed to read post");
      }

      const { post } = postData;
      elizaLogger.debug(`✅ Successfully read post: ${post.title}`);

      // Update state with post information
      const updatedState = {
        ...currentState,
        postTitle: post.title,
        postContent: post.selftext,
        author: post.author,
        subreddit: post.subreddit,
        messageDirections: "Be helpful and follow subreddit rules",
        bio: Array.isArray(runtime.character.bio) ? 
          runtime.character.bio.join('. ') : 
          String(runtime.character.bio || "I am a helpful Reddit bot.")
      };

      // Check if we should respond
      elizaLogger.debug("🤔 Checking if we should respond...");
      const shouldRespond = await generateShouldRespond({
        runtime,
        context: composeContext({
          state: updatedState,
          template: redditShouldRespondTemplate
        }),
        modelClass: ModelClass.SMALL
      });

      if (shouldRespond !== "RESPOND") {
        elizaLogger.debug(`❌ LLM decided not to comment: ${shouldRespond}`);
        callbackData.text = `Decided not to comment: ${shouldRespond}`;
        await callback(callbackData);
        return callbackData;
      }

      // Generate the response
      elizaLogger.debug("💭 Generating comment response...");
      const response = await generateMessageResponse({
        runtime,
        context: composeContext({
          state: updatedState,
          template: redditMessageHandlerTemplate
        }),
        modelClass: ModelClass.SMALL
      });

      if (!response.text) {
        elizaLogger.error("❌ Failed to generate comment text");
        throw new Error("Failed to generate comment text");
      }

      // Submit the comment using PostContentAction
      elizaLogger.debug("📤 Submitting comment to Reddit...");
      const result = await postAction.commentOnPost(String(postId), response.text);
      
      if (!result) {
        throw new Error("Failed to post comment");
      }

      const comment = result as CommentWithLinkId;
      elizaLogger.debug(`✅ Successfully commented on post ${postId} with comment ID: ${comment.id}`);

      // Update callback data
      callbackData.text = response.text;
      callbackData.id = comment.id;
      callbackData.timestamp = new Date().toISOString();

      await callback(callbackData);
      return callbackData;

    } catch (error: unknown) {
      elizaLogger.error("❌ Error in comment handler:", error);
      if (error instanceof Error) {
        callbackData.text = `Error: ${error.message}`;
      } else {
        callbackData.text = "An unknown error occurred";
      }
      await callback(callbackData);
      return callbackData;
    }
  }) as Handler,
  examples: redditCommentExamples
};

// Export the action
export default commentAction;
