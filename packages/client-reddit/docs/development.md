import { elizaLogger, IAgentRuntime } from "@ai16z/eliza";
# Reddit Client Development Guide

## Project Structure
```
eliza_aiflow/packages/client-reddit/
├── src/
│   ├── services/
│   │   └── reddit.service.ts       # Main Reddit service implementation
│   ├── providers/
│   │   ├── reddit-client.provider.ts  # Reddit client provider
│   │   └── get-refresh-token.ts    # OAuth token retrieval
│   ├── types/
│   │   └── reddit-types.ts         # Type definitions
│   ├── environment.ts              # Environment configuration
│   └── test-client.ts             # Test client implementation
├── package.json
└── docs/
    └── development.md             # This file
```

## Development Process

### 1. Environment Setup
First, set up your environment variables in `.env`:
```env
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USER_AGENT=ElizaRedditBot/1.0.0
REDDIT_APP_NAME=ElizaRedditClient
```

### 2. OAuth Authentication Flow
1. Run the token retrieval script:
```bash
pnpm run get-token
```
2. Follow the OAuth flow in your browser
3. Add the received refresh token to your `.env`:
```env
REDDIT_REFRESH_TOKEN=your_refresh_token
```

### 3. Testing the Client
Run the test client to verify functionality:
```bash
pnpm run test-client
```

## TypeScript Best Practices

### Avoiding Circular Dependencies
When working with Snoowrap and Promises, follow these patterns to avoid circular type references:

1. **Promise Chain Pattern**
   - Prefer Promise chains over async/await for complex type transformations
   - Use explicit type annotations in Promise callbacks
   ```typescript
   return somePromise.then((result: SpecificType) => {
     // Process result
   });
   ```

2. **Type Casting Chain**
   - Cast complex types through intermediate steps
   - Use unknown as a safe intermediate type
   ```typescript
   const result = rawValue as unknown as FinalType;
   ```

3. **Snoowrap Type Handling**
   - Import specific types from snoowrap
   - Handle Listings with Array.from()
   ```typescript
   import type { Submission, Comment, Listing } from "snoowrap";
   const comments = Array.from(listing as Listing<Comment>);
   ```

4. **Reply Content Handling**
   - Cast reply content through ReplyableContent
   ```typescript
   const replyContent = reply as ReplyableContent<Submission>;
   const comment = replyContent as unknown as Comment;
   ```

5. **Promise Resolution**
   - Use Promise.resolve() for early returns
   - Handle type conversions after Promise resolution
   ```typescript
   if (condition) {
     return Promise.resolve(null);
   }
   ```

6. **Type Safety with Generics**
   - Use explicit generic types with Promises
   - Avoid implicit any types
   ```typescript
   Promise<Submission | null>
   Promise<{ post: Submission; comments: Comment[] }>
   ```

### Error Handling
1. Wrap Promise chains in try/catch blocks
2. Use elizaLogger for error reporting
3. Return null for non-critical failures
4. Throw errors for critical failures

## Component Overview

### 1. Environment Configuration (`environment.ts`)
- Manages environment variables
- Validates required credentials
- Provides OAuth configuration

### 2. Reddit Service (`reddit.service.ts`)
- Implements core Reddit functionality
- Handles API interactions
- Manages Snoowrap instance

### 3. Client Provider (`reddit-client.provider.ts`)
- Manages Reddit client initialization
- Handles OAuth configuration
- Provides client instance

### 4. Token Retrieval (`get-refresh-token.ts`)
- Implements OAuth flow
- Retrieves refresh token
- Sets up temporary server for callback

### 5. Test Client (`test-client.ts`)
- Tests Reddit client functionality
- Verifies user authentication
- Tests subreddit retrieval

## Development Notes

### Avoiding Circular Dependencies
To prevent circular dependencies:
1. Use proper type assertions
2. Separate interface definitions
3. Follow unidirectional data flow

### Type Safety
- Use TypeScript interfaces for Reddit API responses
- Implement proper type guards
- Handle Promise types correctly

### Error Handling
- Implement comprehensive error handling
- Log meaningful error messages
- Provide clear user feedback

## Testing Flow

1. **Get OAuth Token**
   ```bash
   pnpm run get-token
   ```
   - Initiates OAuth flow
   - Opens browser for authentication
   - Saves refresh token

2. **Test Client**
   ```bash
   pnpm run test-client
   ```
   - Verifies authentication
   - Tests basic functionality
   - Validates environment setup

## Troubleshooting

### Common Issues
1. **Circular Dependencies**
   - Use proper type assertions
   - Break circular references
   - Use interface segregation

2. **Environment Variables**
   - Verify .env file location
   - Check variable names
   - Validate values

3. **OAuth Issues**
   - Verify client credentials
   - Check refresh token
   - Validate redirect URI

### Debug Process
1. Check environment variables
2. Verify OAuth configuration
3. Test client initialization
4. Validate API responses

## Development Commands

```bash
# Install dependencies
pnpm install

# Build the project
pnpm run build

# Get OAuth token
pnpm run get-token

# Test client
pnpm run test-client

# Run linter
pnpm run lint
```

## Best Practices

1. **Code Organization**
   - Keep related code together
   - Use clear file naming
   - Follow module pattern

2. **Error Handling**
   - Implement proper error boundaries
   - Log meaningful messages
   - Handle edge cases

3. **Type Safety**
   - Use TypeScript features
   - Define clear interfaces
   - Implement type guards

4. **Testing**
   - Write unit tests
   - Test edge cases
   - Validate error handling

## Next Steps

1. Implement additional Reddit API features
2. Add comprehensive error handling
3. Improve type safety
4. Add unit tests
5. Document API endpoints

## Integrating ai16z/eliza Framework

### Framework Components Overview
The ai16z/eliza framework provides several key components for building AI-powered actions:

1. **Core Components**
- `Memory`: Stores conversation history and context
- `State`: Manages current conversation state
- `Content`: Represents message content
- `Action`: Defines an action that can be taken
- `ModelClass`: Specifies the LLM model to use

2. **Helper Functions**
- `composeContext`: Creates context for LLM prompts
- `generateText`: Generates text using LLM
- `trimTokens`: Manages token limits
- `parseJSONObjectFromText`: Parses LLM JSON responses

### Integration Pattern (Based on chat_with_attachments.ts)

1. **Action Structure**
typescript
const actionName: Action = {
    name: "ACTION_NAME",
    similes: ["SIMILAR_ACTION_1", "SIMILAR_ACTION_2"],
    description: "What this action does",
    validate: async (runtime, message, state) => boolean,
    handler: async (runtime, message, state, options, callback) => Content,
    examples: ActionExample[][]
};
```

2. **Template Definition**
```typescript
export const actionTemplate = `
# Context
{{contextVariables}}

# Instructions
Clear instructions for the LLM

# Format
Expected response format
`;
```

3. **Memory Creation**
```typescript
const memory: Memory = {
    id: stringToUuid(uniqueId),
    userId: stringToUuid(userId),
    agentId: runtime.agentId,
    roomId: stringToUuid(roomId),
    content: {
        text: messageText,
        source: sourceSystem,
        id: messageId,
        timestamp: new Date().toISOString()
    },
    createdAt: Date.now(),
    embedding: []
};

// Save to runtime
await runtime.messageManager.createMemory(memory);
```

4. **State Management**
```typescript
// Create initial state
const state = await runtime.composeState(memory);

// Add custom state data
const customState = {
    ...state,
    customField1: value1,
    customField2: value2
};

// Update with recent messages
const updatedState = await runtime.updateRecentMessageState(customState);
```

5. **LLM Integration**
```typescript
// Prepare context
const context = composeContext({
    state: updatedState,
    template: trimTokens(actionTemplate, chunkSize + 500, "gpt-4")
});

// Generate response
const response = await generateText({
    runtime,
    context,
    modelClass: ModelClass.SMALL
});

// Parse response if needed
const parsedResponse = parseJSONObjectFromText(response);
```

6. **Callback Handling**
```typescript
const callbackData: Content = {
    text: "",
    action: "ACTION_RESPONSE",
    source: message.content.source
};

// Update callback data
callbackData.text = response;
await callback(callbackData);
```

### Best Practices

1. **Memory Management**
- Create unique IDs using stringToUuid
- Store all relevant context in memory
- Include source and timestamp information

2. **State Handling**
- Always compose state from memory
- Add domain-specific state fields
- Update state with recent messages

3. **LLM Interaction**
- Use appropriate templates for each task
- Handle token limits with trimTokens
- Use proper model class based on task complexity

4. **Error Handling**
- Validate runtime availability
- Handle LLM response parsing errors
- Provide meaningful error messages

5. **Performance**
- Cache frequently used data
- Minimize state updates
- Use appropriate model sizes

### Integration Checklist

1. [ ] Define action structure
2. [ ] Create templates
3. [ ] Implement memory management
4. [ ] Set up state handling
5. [ ] Configure LLM integration
6. [ ] Add error handling
7. [ ] Implement callbacks
8. [ ] Add validation
9. [ ] Include examples

### Testing

1. **Unit Tests**
- Test memory creation
- Test state management
- Test LLM integration
- Test error handling

2. **Integration Tests**
- Test full action flow
- Test with different inputs
- Test error scenarios

### Common Pitfalls

1. **Memory Management**
- Not using proper UUID format
- Missing required memory fields
- Not cleaning up old memories

2. **State Handling**
- Not updating state properly
- Missing critical context
- State mutation issues

3. **LLM Integration**
- Token limit issues
- Unclear templates
- Poor error handling

4. **Performance**
- Unnecessary state updates
- Large memory objects
- Inefficient token usage

### Example Implementation

See chat_with_attachments.ts for a complete reference implementation showing how to:
- Structure an action
- Handle memory and state
- Integrate LLM capabilities
- Manage callbacks
- Handle errors
- Implement validation
```
</```rewritten_file>