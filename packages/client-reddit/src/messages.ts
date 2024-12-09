import { elizaLogger, Memory, IAgentRuntime, Content, State, ModelClass, generateMessageResponse, generateShouldRespond, stringToUuid, getEmbeddingZeroVector, composeContext } from "@ai16z/eliza";
import { RedditService } from "./services/reddit.service";
import { RedditSubmission, RedditComment } from "./types/reddit-types";

/**
 * Sanitize content for Reddit
 * Removes or escapes problematic characters
 */
function sanitizeContent(content: string): string {
    if (!content) return '';
    
    return content
        .replace(/[^\w\s.,!?-]/g, "") // Remove special characters
        .replace(/\s+/g, " ")         // Normalize whitespace
        .trim();
}

/**
 * Validate message length for Reddit
 * Returns true if the message is within acceptable limits
 */
function validateMessageLength(message: string): boolean {
    const MIN_LENGTH = 1;
    const MAX_LENGTH = 10000; // Reddit's max comment length
    
    const length = message.length;
    if (length < MIN_LENGTH || length > MAX_LENGTH) {
        elizaLogger.warn(`Message length (${length}) outside acceptable range (${MIN_LENGTH}-${MAX_LENGTH})`);
        return false;
    }
    
    return true;
}

export class MessageManager {
    private service: RedditService;
    private runtime: IAgentRuntime;

    constructor(runtime: IAgentRuntime) {
        this.runtime = runtime;
        this.service = RedditService.getInstance();
    }

    public async handleSubmission(submission: RedditSubmission): Promise<void> {
        try {
            elizaLogger.debug(`Processing submission: ${submission.id}`);
            const content = sanitizeContent(`${submission.title}\n\n${submission.selftext}`);
            
            if (!validateMessageLength(content)) {
                elizaLogger.warn(`Submission content length invalid: ${submission.id}`);
                return;
            }

            const memory = await this.createMemoryFromSubmission(submission);
            const state = await this.composeState(memory);

            // Save memory
            await this.runtime.messageManager.createMemory(memory);

            // Check if we should respond
            const shouldRespond = await this.shouldRespondToSubmission(state);
            if (shouldRespond) {
                // Generate and process response
                await this.generateAndProcessResponse(memory, state);
            }
        } catch (error) {
            elizaLogger.error(`Error handling submission: ${error}`);
        }
    }

    public async handleComment(comment: RedditComment, isMention: boolean = false): Promise<void> {
        try {
            elizaLogger.debug(`Processing comment: ${comment.id}`);
            const content = sanitizeContent(comment.body);
            
            if (!validateMessageLength(content)) {
                elizaLogger.warn(`Comment content length invalid: ${comment.id}`);
                return;
            }

            const memory = await this.createMemoryFromComment(comment);
            const state = await this.composeState(memory);

            // Save memory
            await this.runtime.messageManager.createMemory(memory);

            // Always respond to mentions, otherwise check if we should respond
            const shouldRespond = isMention || await this.shouldRespondToComment(state);
            if (shouldRespond) {
                // Generate and process response
                await this.generateAndProcessResponse(memory, state);
            }
        } catch (error) {
            elizaLogger.error(`Error handling comment: ${error}`);
        }
    }

    private async createMemoryFromSubmission(submission: RedditSubmission): Promise<Memory> {
        const roomId = stringToUuid(`${submission.subreddit}-${this.runtime.agentId}`);
        const userId = stringToUuid(`${submission.author}-${this.runtime.agentId}`);
        const submissionId = stringToUuid(`${submission.id}-${this.runtime.agentId}`);

        const content: Content = {
            text: `${submission.title}\n\n${submission.selftext}`,
            source: 'reddit',
            id: submission.id,
            timestamp: new Date(submission.created_utc * 1000).toISOString()
        };

        return {
            id: submissionId,
            userId,
            agentId: stringToUuid(this.runtime.agentId),
            roomId,
            content,
            createdAt: submission.created_utc * 1000,
            embedding: getEmbeddingZeroVector()
        };
    }

    private async createMemoryFromComment(comment: RedditComment): Promise<Memory> {
        const roomId = stringToUuid(`${comment.subreddit}-${this.runtime.agentId}`);
        const userId = stringToUuid(`${comment.author}-${this.runtime.agentId}`);
        const commentId = stringToUuid(`${comment.id}-${this.runtime.agentId}`);

        const content: Content = {
            text: comment.body,
            source: 'reddit',
            id: comment.id,
            timestamp: new Date(comment.created_utc * 1000).toISOString(),
            inReplyTo: comment.parent_id ? stringToUuid(`${comment.parent_id}-${this.runtime.agentId}`) : undefined
        };

        return {
            id: commentId,
            userId,
            agentId: stringToUuid(this.runtime.agentId),
            roomId,
            content,
            createdAt: comment.created_utc * 1000,
            embedding: getEmbeddingZeroVector()
        };
    }

    private async composeState(memory: Memory): Promise<State> {
        let state = await this.runtime.composeState(memory);
        state = await this.runtime.updateRecentMessageState(state);
        return state;
    }

    private async shouldRespondToSubmission(state: State): Promise<boolean> {
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

    private async shouldRespondToComment(state: State): Promise<boolean> {
        const shouldRespondContext = composeContext({
            state,
            template: this.runtime.character.templates?.shouldRespondTemplate || 'Analyze if we should respond to this Reddit comment.'
        });

        const response = await generateShouldRespond({
            runtime: this.runtime,
            context: shouldRespondContext,
            modelClass: ModelClass.SMALL
        });

        return response === 'RESPOND';
    }

    private async generateAndProcessResponse(memory: Memory, state: State): Promise<void> {
        const responseContext = composeContext({
            state,
            template: this.runtime.character.templates?.messageHandlerTemplate || 'Generate a response to this Reddit message.'
        });

        const responseContent = await generateMessageResponse({
            runtime: this.runtime,
            context: responseContext,
            modelClass: ModelClass.SMALL
        });

        try {
            if (responseContent.text) {
                // Create response memory first
                const responseMemory: Memory = {
                    id: stringToUuid(`${Date.now()}-${this.runtime.agentId}`),
                    userId: this.runtime.agentId,
                    agentId: this.runtime.agentId,
                    roomId: memory.roomId,
                    content: {
                        ...responseContent,
                        inReplyTo: memory.id
                    },
                    createdAt: Date.now(),
                    embedding: getEmbeddingZeroVector()
                };

                // Post the response using the service
                const parentId = String(memory.content.id);
                try {
                    if (memory.content.inReplyTo) {
                        await this.service.replyToComment(parentId, String(responseContent.text));
                    } else {
                        await this.service.replyToSubmission(parentId, String(responseContent.text));
                    }

                    // Save response memory
                    await this.runtime.messageManager.createMemory(responseMemory);
                } catch (error) {
                    elizaLogger.error('Failed to send response:', error);
                }
            }
        } catch (error) {
            elizaLogger.error("Error sending response:", error);
        }
    }
}
