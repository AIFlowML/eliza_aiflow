# Building Clients for Eliza Framework

This guide provides comprehensive instructions for building new clients that integrate with the Eliza framework. It covers both library-based implementations (like Slack and Discord) and direct API integrations.

## Table of Contents
1. [Client Structure](#client-structure)
2. [Core Components](#core-components)
3. [Environment Configuration](#environment-configuration)
4. [Implementation Steps](#implementation-steps)
5. [Testing and Validation](#testing-and-validation)
6. [Integration Points](#integration-points)
7. [Reference Implementations](#reference-implementations)
8. [Software Flow Map](#software-flow-map)
9. [Integration Testing Examples](#integration-testing-examples)

## Initial Service Specification

Before starting development, please provide the following information:

1. **Service Location**: Specify the target folder where the client code will be placed (e.g., `/packages/client-[platform]`)
2. **Service Documentation**: Provide links to:
   - API documentation (for direct API clients)
   - SDK/Library documentation (for library-based clients)
   - Authentication requirements
   - Rate limiting information
   - Webhook specifications (if applicable)

If the documentation is not easily accessible in a structured format, we can create a script to convert it into a more usable format using tools like:
- Repository to text conversion
- API documentation to structured text
- PDF/HTML documentation parsing

## Client Structure

### Library-Based Client Structure
```
client-[platform]/
├── src/
│   ├── index.ts                # Main entry point and client interface
│   ├── environment.ts          # Environment configuration
│   ├── client.ts               # Main client implementation
│   ├── actions/                # Platform-specific actions
│   │   ├── chat.ts
│   │   ├── media.ts
│   │   └── state.ts
│   ├── providers/              # State management
│   │   ├── channelState.ts
│   │   └── userState.ts
│   ├── __tests__/             # Unit tests
│   │   ├── client.test.ts     # Client implementation tests
│   │   ├── actions.test.ts    # Action tests
│   │   └── providers.test.ts  # State provider tests
│   └── types.ts               # Type definitions
├── package.json
└── tsconfig.json
```

### Direct API Client Structure
```
client-[platform]/
├── src/
│   ├── index.ts                # Main entry point
│   ├── environment.ts          # Environment configuration
│   ├── api.ts                  # API endpoints and methods
│   ├── client.ts               # Client implementation
│   ├── endpoints/              # API endpoint implementations
│   │   ├── messages.ts
│   │   ├── users.ts
│   │   └── webhooks.ts
│   ├── __tests__/             # Unit tests
│   │   ├── api.test.ts        # API endpoint tests
│   │   ├── client.test.ts     # Client implementation tests
│   │   └── webhooks.test.ts   # Webhook handler tests
│   └── types.ts               # Type definitions
├── package.json
└── tsconfig.json
```

## Core Components

### 1. Client Interface
Every client must implement the `ElizaClient` interface:

```typescript
// For Library-based Clients (e.g., Slack, Discord)
export const LibraryClientInterface: ElizaClient = {
    start: async (runtime: IAgentRuntime) => {
        const client = new LibraryClient(runtime);
        await client.start();
        return client;
    }
};

// For Direct API Clients
export const DirectClientInterface: ElizaClient = {
    start: async (runtime: IAgentRuntime) => {
        const client = new DirectClient(runtime);
        await client.initialize();
        return client;
    }
};
```

### 2. Main Client Class
Choose between two implementation approaches:

#### Library-based Implementation:
```typescript
export class LibraryClient extends EventEmitter {
    private runtime: IAgentRuntime;
    private client: PlatformSDK;
    private messageManager: MessageManager;

    constructor(runtime: IAgentRuntime) {
        super();
        this.runtime = runtime;
        this.initialize();
    }

    private async initialize() {
        const config = await validateConfig(this.runtime);
        this.client = new PlatformSDK(config.API_TOKEN);
        this.messageManager = new MessageManager(this.client, this.runtime);
        this.setupEventListeners();
        this.registerActionsAndProviders();
    }
}
```

#### Direct API Implementation:
```typescript
export class DirectClient extends EventEmitter {
    private runtime: IAgentRuntime;
    private apiClient: AxiosInstance;
    private messageManager: MessageManager;

    constructor(runtime: IAgentRuntime) {
        super();
        this.runtime = runtime;
        this.initialize();
    }

    private async initialize() {
        const config = await validateConfig(this.runtime);
        this.apiClient = axios.create({
            baseURL: config.API_BASE_URL,
            headers: {
                'Authorization': `Bearer ${config.API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        this.messageManager = new MessageManager(this.apiClient, this.runtime);
        this.setupWebhooks();
        this.registerActionsAndProviders();
    }
}
```

## Environment Configuration

### Configuration Schema
Use Zod for runtime validation:

```typescript
// For Library-based Clients
export const libraryEnvSchema = z.object({
    API_TOKEN: z.string().min(1, "API token is required"),
    CLIENT_ID: z.string().min(1, "Client ID is required"),
    CLIENT_SECRET: z.string().min(1, "Client secret is required"),
    SERVER_PORT: z.string().optional().transform(val => val ? parseInt(val) : 3000),
});

// For Direct API Clients
export const directEnvSchema = z.object({
    API_BASE_URL: z.string().url("Valid API URL is required"),
    API_TOKEN: z.string().min(1, "API token is required"),
    WEBHOOK_SECRET: z.string().min(1, "Webhook secret is required"),
    SERVER_PORT: z.string().optional().transform(val => val ? parseInt(val) : 3000),
});
```

### Validation Implementation
```typescript
export async function validateConfig(runtime: IAgentRuntime): Promise<Config> {
    try {
        const config = {
            API_TOKEN: runtime.getSetting("API_TOKEN") || process.env.API_TOKEN,
            API_BASE_URL: runtime.getSetting("API_BASE_URL") || process.env.API_BASE_URL,
            // Add other required settings
        };
        
        // Use appropriate schema based on implementation type
        return isLibraryBased ? 
            libraryEnvSchema.parse(config) : 
            directEnvSchema.parse(config);
    } catch (error) {
        handleValidationError(error);
    }
}
```

## Implementation Steps

### 1. Initialize Project
```bash
# Create project directory
mkdir client-[platform]
cd client-[platform]

# Initialize package
pnpm init

# Install core dependencies
pnpm add @ai16z/eliza @ai16z/plugin-node
pnpm add -D typescript tsup @types/node

# Install platform-specific dependencies
# For library-based clients:
pnpm add @platform/client-sdk @platform/events-api

# For direct API clients:
pnpm add axios express @types/express
```

### 2. Message Handling
Implement a MessageManager for your platform:

```typescript
export class MessageManager {
    constructor(
        private client: PlatformClient | AxiosInstance,
        private runtime: IAgentRuntime
    ) {}

    async handleMessage(message: PlatformMessage): Promise<void> {
        const memory = await this.createMemory(message);
        const state = await this.runtime.composeState(memory);
        
        if (await this.shouldRespond(message)) {
            const response = await this.generateResponse(memory, state);
            await this.sendResponse(response);
        }
    }

    private async createMemory(message: PlatformMessage): Promise<Memory> {
        return {
            id: stringToUuid(message.id),
            userId: stringToUuid(message.sender.id),
            agentId: this.runtime.agentId,
            roomId: stringToUuid(message.channel.id),
            content: {
                text: message.text,
                attachments: await this.processAttachments(message.attachments),
                source: 'platform_name'
            }
        };
    }
}
```

### 3. Actions and Providers
Required actions for most platforms:

```typescript
// chat_with_attachments.ts
export default {
    name: "CHAT_WITH_ATTACHMENTS",
    description: "Handle messages with media attachments",
    handler: async (runtime: IAgentRuntime, message: Memory) => {
        // Implementation
    }
};

// summarize_conversation.ts
export default {
    name: "SUMMARIZE_CONVERSATION",
    description: "Summarize chat history",
    handler: async (runtime: IAgentRuntime, message: Memory) => {
        // Implementation
    }
};
```

State providers:
```typescript
export const platformStateProvider: Provider = {
    get: async (runtime: IAgentRuntime, message: Memory) => {
        // Return platform-specific state
        return {
            channelType: message.content.channelType,
            userRole: message.content.userRole,
            // Other platform-specific state
        };
    }
};
```

### 4. Platform Service
Create a service for platform-specific features:

```typescript
export class PlatformService extends Service {
    static serviceType = ServiceType.CUSTOM;

    async initialize(runtime: IAgentRuntime) {
        // Initialize platform-specific features
        await this.setupPlatformSDK();
        await this.registerWebhooks();
    }

    private async setupPlatformSDK() {
        // Platform-specific setup
    }
}
```

## Testing Guidelines

Following the example from the Akash client (`@packages/client-akash`), implement comprehensive tests for your client:

### 1. Test Structure
```typescript
// src/__tests__/client.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { YourClient } from '../client';
import { stringToUuid } from '@ai16z/eliza';
import type { IAgentRuntime } from '@ai16z/eliza';

describe('YourClient', () => {
  let client: YourClient;
  let mockRuntime: IAgentRuntime;

  beforeEach(() => {
    mockRuntime = {
      agentId: stringToUuid('test-agent'),
      getSetting: vi.fn((key: string) => {
        const settings = {
          'API_KEY': 'test-key',
          'API_URL': 'http://localhost:3000'
        };
        return settings[key];
      })
    } as IAgentRuntime;

    client = new YourClient(mockRuntime);
  });

  // Test cases here
});
```

### 2. Required Test Cases

1. **Client Initialization**
```typescript
it('should initialize with correct settings', () => {
  expect(client.apiKey).toBe('test-key');
  expect(client.apiUrl).toBe('http://localhost:3000');
});
```

2. **API Methods**
```typescript
it('should send messages correctly', async () => {
  const mockResponse = { id: '123', status: 'sent' };
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockResponse)
  });

  const result = await client.sendMessage({
    channel: 'test-channel',
    text: 'Hello'
  });
  
  expect(result).toEqual(mockResponse);
});
```

3. **Error Handling**
```typescript
it('should handle API errors', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 429,
    statusText: 'Rate Limited'
  });

  await expect(client.sendMessage({
    channel: 'test-channel',
    text: 'Hello'
  })).rejects.toThrow('Rate Limited');
});
```

4. **Webhook Handlers** (if applicable)
```typescript
it('should validate webhook signatures', () => {
  const payload = JSON.stringify({ event: 'message' });
  const signature = 'valid-signature';
  
  expect(client.validateWebhook(payload, signature)).toBe(true);
});
```

5. **State Management**
```typescript
it('should maintain conversation state', async () => {
  await client.updateState('channel-1', { lastMessageId: '123' });
  const state = await client.getState('channel-1');
  
  expect(state).toEqual({ lastMessageId: '123' });
});
```

### 3. Test Coverage Requirements

Ensure your tests cover:
- All public methods in your client
- All API endpoint implementations
- Error cases and edge conditions
- Webhook validation and processing
- State management and persistence
- Rate limiting and retry logic
- Authentication and authorization

Use the following command to check test coverage:
```bash
npm run test:coverage
```

Aim for:
- Line coverage: >90%
- Branch coverage: >85%
- Function coverage: >95%

## Integration Points

### 1. Agent Integration
Update `agent/src/index.ts`:
```typescript
import { PlatformClientInterface } from "@ai16z/client-platform";

// Add to initializeClients function
case Clients.PLATFORM:
    await PlatformClientInterface.start(runtime);
    break;
```

### 2. Core Types Integration
Update `packages/core/src/types.ts`:
```typescript
export enum Clients {
    // Add your platform
    PLATFORM = "platform",
}

export interface Character {
    // Add platform-specific templates
    templates?: {
        platformMessageHandlerTemplate?: string;
        platformShouldRespondTemplate?: string;
    }
}
```

### 3. Character Configuration
Update character JSON (e.g., `eve.character.json`):
```json
{
    "clients": ["platform"],
    "templates": {
        "platformMessageHandlerTemplate": "...",
        "platformShouldRespondTemplate": "..."
    },
    "settings": {
        "secrets": {
            "PLATFORM_API_TOKEN": "..."
        }
    }
}
```

### 4. Environment Configuration
Add to `.env`:
```bash
# Platform-specific configuration
PLATFORM_API_TOKEN=your_token_here
PLATFORM_CLIENT_ID=your_client_id
PLATFORM_CLIENT_SECRET=your_client_secret
PLATFORM_WEBHOOK_SECRET=your_webhook_secret
```

## Reference Implementations

For detailed implementation examples, refer to:

1. **Library-based Implementations**:
   - Slack Client: `/packages/client-slack`
   - Discord Client: `/packages/client-discord`

2. **Direct API Implementation**:
   - Direct API Client: `/packages/client-direct`

## Software Flow Map

### Library-Based Client Flow (e.g., Slack)
```mermaid
graph TD
    A[Incoming Message] --> B[Slack Event Handler]
    B --> C{Message Type?}
    C -->|Text| D[Message Processor]
    C -->|Media| E[Media Handler]
    C -->|Interactive| F[Action Handler]
    
    D --> G[ElizaClient.processMessage]
    E --> H[ElizaClient.processMedia]
    F --> I[ElizaClient.handleAction]
    
    G --> J[State Manager]
    H --> J
    I --> J
    
    J --> K[Response Generator]
    K --> L[Slack API Client]
    L --> M[Send Response]
    
    subgraph "State Management"
        N[Channel State] --> J
        O[User State] --> J
        P[Conversation History] --> J
    end
    
    subgraph "Error Handling"
        Q[Rate Limiter]
        R[Retry Manager]
        S[Error Logger]
    end
    
    L --> Q
    Q --> R
    R --> S
```

### Direct API Client Flow
```mermaid
graph TD
    A[API Request] --> B[API Gateway]
    B --> C[Request Validator]
    C --> D{Endpoint Type}
    
    D -->|Messages| E[Message Handler]
    D -->|Media| F[Media Handler]
    D -->|State| G[State Handler]
    
    E --> H[ElizaClient.processMessage]
    F --> I[ElizaClient.processMedia]
    G --> J[ElizaClient.updateState]
    
    H --> K[State Manager]
    I --> K
    J --> K
    
    K --> L[Response Generator]
    L --> M[API Response]
    
    subgraph "State Management"
        N[API State] --> K
        O[Session State] --> K
        P[Request Context] --> K
    end
    
    subgraph "Security"
        Q[Auth Manager]
        R[Rate Limiter]
        S[Token Validator]
    end
    
    B --> Q
    Q --> R
    R --> S
```

## Integration Testing Examples

### 1. Slack Client Integration Test
```typescript
// integration-tests/slack-client.test.ts
import { ElizaClient, IAgentRuntime } from '@ai16z/eliza';
import { SlackClient } from '../src/client';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    // Create a mock runtime with real Slack credentials
    const runtime: IAgentRuntime = {
        agentId: 'test-agent',
        getSetting: (key: string) => process.env[key],
        // ... other runtime properties
    };

    // Initialize the Slack client
    const client = new SlackClient(runtime);
    
    console.log('🚀 Starting Slack Integration Tests');
    
    try {
        // Test 1: Send a message
        console.log('\n📝 Testing message sending...');
        const messageResult = await client.sendMessage({
            channel: process.env.SLACK_TEST_CHANNEL!,
            text: 'Hello from integration test!'
        });
        console.log('✅ Message sent:', messageResult);

        // Test 2: Send a message with attachments
        console.log('\n🖼️ Testing message with attachments...');
        const attachmentResult = await client.sendMessage({
            channel: process.env.SLACK_TEST_CHANNEL!,
            text: 'Message with attachment',
            attachments: [{
                title: 'Test Attachment',
                text: 'This is a test attachment',
                color: '#36a64f'
            }]
        });
        console.log('✅ Message with attachment sent:', attachmentResult);

        // Test 3: Get channel history
        console.log('\n📚 Testing channel history...');
        const history = await client.getChannelHistory(
            process.env.SLACK_TEST_CHANNEL!,
            { limit: 5 }
        );
        console.log('✅ Channel history retrieved:', history);

        // Test 4: React to message
        console.log('\n👍 Testing message reaction...');
        const reactionResult = await client.addReaction({
            channel: process.env.SLACK_TEST_CHANNEL!,
            timestamp: messageResult.ts,
            reaction: 'thumbsup'
        });
        console.log('✅ Reaction added:', reactionResult);

        // Test 5: Update message
        console.log('\n✏️ Testing message update...');
        const updateResult = await client.updateMessage({
            channel: process.env.SLACK_TEST_CHANNEL!,
            timestamp: messageResult.ts,
            text: 'Updated message from integration test!'
        });
        console.log('✅ Message updated:', updateResult);

    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

main();
```

### 2. Direct API Client Integration Test
```typescript
// integration-tests/api-client.test.ts
import { ElizaClient, IAgentRuntime } from '@ai16z/eliza';
import { DirectAPIClient } from '../src/client';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    // Create a mock runtime with real API credentials
    const runtime: IAgentRuntime = {
        agentId: 'test-agent',
        getSetting: (key: string) => process.env[key],
        // ... other runtime properties
    };

    // Initialize the API client
    const client = new DirectAPIClient(runtime);
    
    console.log('🚀 Starting API Integration Tests');
    
    try {
        // Test 1: Create a conversation
        console.log('\n📝 Testing conversation creation...');
        const conversation = await client.createConversation({
            userId: 'test-user',
            initialMessage: 'Hello from integration test!'
        });
        console.log('✅ Conversation created:', conversation);

        // Test 2: Send a message
        console.log('\n💬 Testing message sending...');
        const messageResult = await client.sendMessage({
            conversationId: conversation.id,
            content: 'Test message with some context',
            metadata: {
                source: 'integration-test',
                timestamp: new Date().toISOString()
            }
        });
        console.log('✅ Message sent:', messageResult);

        // Test 3: Upload media
        console.log('\n📎 Testing media upload...');
        const mediaResult = await client.uploadMedia({
            conversationId: conversation.id,
            file: Buffer.from('Test file content'),
            filename: 'test.txt',
            mimeType: 'text/plain'
        });
        console.log('✅ Media uploaded:', mediaResult);

        // Test 4: Get conversation history
        console.log('\n📚 Testing conversation history...');
        const history = await client.getConversationHistory({
            conversationId: conversation.id,
            limit: 10
        });
        console.log('✅ History retrieved:', history);

        // Test 5: Update conversation state
        console.log('\n🔄 Testing state update...');
        const stateResult = await client.updateConversationState({
            conversationId: conversation.id,
            state: {
                lastInteraction: new Date().toISOString(),
                messageCount: history.messages.length
            }
        });
        console.log('✅ State updated:', stateResult);

    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

main();
```

### Running Integration Tests

1. Create a `.env` file with your credentials:
```bash
# For Slack
SLACK_BOT_TOKEN=xoxb-your-token
SLACK_TEST_CHANNEL=C1234567890

# For Direct API
API_KEY=your-api-key
API_BASE_URL=https://api.example.com
```

2. Run the tests:
```bash
# For Slack
npm run test:integration:slack

# For Direct API
npm run test:integration:api
```

Add these scripts to your `package.json`:
```json
{
  "scripts": {
    "test:integration:slack": "ts-node integration-tests/slack-client.test.ts",
    "test:integration:api": "ts-node integration-tests/api-client.test.ts"
  }
}
```

These integration tests will help you verify that your client works correctly with real services. They test the full flow of operations and help catch issues that might not be apparent in unit tests.

Remember to:
1. Never commit sensitive credentials
2. Use a test environment when possible
3. Clean up test data after running tests
4. Document any specific setup required for each platform

## Best Practices

1. **Error Handling**
```typescript
try {
    await this.client.sendMessage(channel, text);
} catch (error) {
    if (error.code === 'RATE_LIMIT') {
        await this.handleRateLimit(error);
    } else if (error.code === 'AUTH_ERROR') {
        await this.refreshAuth();
    }
    throw error;
}
```

2. **Rate Limiting**
```typescript
export class RateLimiter {
    private async handleRateLimit(error: RateLimitError) {
        const delay = this.calculateBackoff(error);
        await wait(delay);
        return this.retryRequest();
    }
}
```

3. **Security**
```typescript
export class SecurityManager {
    validateWebhook(request: Request) {
        const signature = request.headers['x-signature'];
        const timestamp = request.headers['x-timestamp'];
        return this.verifySignature(signature, timestamp, request.body);
    }
}
```

4. **Logging**
```typescript
export const logger = {
    info: (message: string, context?: any) => {
        elizaLogger.log(`[PLATFORM] ${message}`, context);
    },
    error: (message: string, error: Error) => {
        elizaLogger.error(`[PLATFORM] ${message}`, {
            error: error.message,
            stack: error.stack
        });
    }
};
```

## Testing

1. **Unit Tests**
```typescript
describe('PlatformClient', () => {
    it('should initialize with valid config', async () => {
        const client = new PlatformClient(mockRuntime);
        await expect(client.initialize()).resolves.not.toThrow();
    });
});
```

2. **Integration Tests**
```typescript
describe('MessageHandling', () => {
    it('should process incoming messages', async () => {
        const message = createMockMessage();
        await client.messageManager.handleMessage(message);
        expect(mockRuntime.messageManager.createMemory).toHaveBeenCalled();
    });
});
```

## Conclusion

Building a client for the Eliza framework requires:
1. Choosing between library-based or direct API implementation
2. Setting up proper environment configuration
3. Implementing core messaging functionality
4. Adding platform-specific actions and providers
5. Integrating with the Eliza framework's core components

For rapid development, use the provided code snippets and reference implementations as templates.