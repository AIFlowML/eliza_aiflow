import { elizaLogger } from "@ai16z/eliza";

/**
 * Sanitize content for Reddit
 * Removes or escapes problematic characters
 */
export function sanitizeContent(content: string): string {
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
export function validateMessageLength(message: string): boolean {
    const MIN_LENGTH = 1;
    const MAX_LENGTH = 10000; // Reddit's max comment length
    
    const length = message.length;
    if (length < MIN_LENGTH || length > MAX_LENGTH) {
        elizaLogger.warn(`Message length (${length}) outside acceptable range (${MIN_LENGTH}-${MAX_LENGTH})`);
        return false;
    }
    
    return true;
}

/**
 * Format error messages for logging
 */
export function formatError(error: unknown): string {
    if (error instanceof Error) {
        return `${error.name}: ${error.message}`;
    }
    return String(error);
} 