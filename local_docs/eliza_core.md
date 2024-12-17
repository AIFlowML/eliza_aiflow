# Eliza Framework Core Documentation

## Overview

The Eliza framework is a modular system for creating and managing AI agents. It consists of four main components:
1. Agents - Core runtime environments for autonomous interactions
2. Actions - Behavioral building blocks for agent responses
3. Character Files - Configuration files defining agent personalities
4. Providers - Modules for injecting dynamic context

## 1. Agents

### Core Concepts

Agents run in a runtime environment (`AgentRuntime`) that implements the `IAgentRuntime` interface:

```typescript
interface IAgentRuntime {
  // Core identification
  agentId: UUID;
  serverUrl: string;
  token: string;

  // Configuration
  character: Character;
  modelProvider: ModelProviderName;

  // Components
  actions: Action[];
  evaluators: Evaluator[];
  providers: Provider[];

  // Memory Systems
  databaseAdapter: IDatabaseAdapter;
  messageManager: IMemoryManager;
  descriptionManager: IMemoryManager;
  loreManager: IMemoryManager;
}
```

### Memory Systems

Agents use multiple memory types:
- **Message History**: Recent conversations (messageManager)
- **Factual Memory**: Context-based facts (descriptionManager)
- **Knowledge Base**: Static character knowledge (loreManager)
- **RAG Integration**: Vector search for contextual recall

### State Management

Agents maintain state through the State interface:

```typescript
interface State {
  userId?: UUID;
  agentId?: UUID;
  roomId: UUID;
  bio: string;
  lore: string;
  agentName?: string;
  senderName?: string;
  actors: string;
  actorsData?: Actor[];
  recentMessages: string;
  recentMessagesData: Memory[];
  goals?: string;
  goalsData?: Goal[];
  actions?: string;
  actionNames?: string;
  providers?: string;
}
```

## 2. Actions

### Structure

Actions define how agents respond to messages:

```typescript
interface Action {
  name: string;
  similes: string[];
  description: string;
  examples: ActionExample[][];
  handler: Handler;
  validate: Validator;
}
```

### Built-in Actions

1. **CONTINUE**
   - Maintains conversation flow
   - Limited to 3 consecutive continues
   - Used when more context is needed

2. **IGNORE**
   - Gracefully disengages from conversations
   - Handles inappropriate interactions
   - Manages natural conversation endings

3. **NONE**
   - Default response action
   - Used for standard conversational replies

4. **TAKE_ORDER**
   - Records trading/purchase orders
   - Processes user conviction levels
   - Validates symbols and addresses

## 3. Character Files

### Core Structure

Character files are JSON configurations defining agent personality:

```typescript
interface Character {
  name: string;
  modelProvider: ModelProviderName;
  clients: Client[];
  settings?: {
    secrets?: Record<string, string>;
    voice?: {
      model: string;
      url?: string;
    };
    model?: string;
    embeddingModel?: string;
  };
  bio: string | string[];
  lore: string[];
  messageExamples: MessageExample[][];
  postExamples: string[];
  topics?: string[];
  adjectives?: string[];
  style?: {
    all?: string[];
    chat?: string[];
    post?: string[];
  };
}
```

### Key Components

1. **Core Identity**
   - name: Display name
   - modelProvider: AI model provider
   - clients: Supported platforms

2. **Personality**
   - bio: Character background
   - lore: Backstory elements
   - topics: Areas of expertise
   - adjectives: Personality traits

3. **Interaction Style**
   - messageExamples: Sample conversations
   - postExamples: Sample social posts
   - style: Communication guidelines

4. **Technical Settings**
   - settings.secrets: API keys
   - settings.voice: Voice model configuration
   - settings.model: Specific model selection

## 4. Providers

### Purpose

Providers inject dynamic context into agent interactions:
- Real-time information
- External system integration
- Contextual data formatting

### Structure

```typescript
interface Provider {
  get: (
    runtime: IAgentRuntime,
    message: Memory,
    state?: State,
  ) => Promise<string>;
}
```

### Built-in Providers

1. **Time Provider**
   - Provides temporal context
   - Current time and date information

2. **Facts Provider**
   - Maintains conversation facts
   - Uses RAG for relevant fact retrieval

3. **Boredom Provider**
   - Manages conversation dynamics
   - Tracks engagement levels
   - Adapts responses based on interaction patterns

## Best Practices

### 1. Memory Management
- Use appropriate memory managers for different data types
- Implement regular memory cleanup
- Cache frequently accessed data
- Use immutable state patterns

### 2. Action Implementation
- Keep actions focused and single-purpose
- Implement proper validation
- Provide clear examples
- Handle errors gracefully

### 3. Character Design
- Create detailed, consistent personalities
- Provide diverse interaction examples
- Balance knowledge and personality
- Consider platform-specific behavior

### 4. Provider Development
- Implement robust caching
- Handle API failures gracefully
- Validate input/output data
- Consider rate limiting

## Example: Basic Agent Setup

```typescript
import { AgentRuntime, ModelProviderName } from "@ai16z/eliza";

// Create runtime
const runtime = new AgentRuntime({
  token: "auth-token",
  modelProvider: ModelProviderName.ANTHROPIC,
  character: characterConfig,
  databaseAdapter: new DatabaseAdapter(),
  conversationLength: 32,
  serverUrl: "http://localhost:7998",
  actions: customActions,
  evaluators: customEvaluators,
  providers: customProviders,
});

// Process messages
await runtime.processActions(message, responses, state, async (newMessages) => {
  return [message];
});

// Manage state
const state = await runtime.composeState(message, {
  additionalContext: "custom-context",
});

// Handle memory
const memoryManager = runtime.getMemoryManager("messages");
await memoryManager.createMemory({
  id: messageId,
  content: { text: "Message content" },
  userId: userId,
  roomId: roomId,
});
```

## Integration Points

### 1. WebSocket Communication
```typescript
const ws = new WebSocket(import.meta.env.VITE_WS_URL);
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // Handle message
};
```

### 2. HTTP API Endpoints
```typescript
async function sendMessage(agentId: string, message: string) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/${agentId}/message`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: message,
        timestamp: Date.now(),
      }),
    }
  );
  return response.json();
}
```

### 3. Memory Integration
```typescript
const memoryManager = runtime.getMemoryManager("messages");
const recentMessages = await memoryManager.getMemories({
  roomId: message.roomId,
  count: 10,
  unique: true,
});
```

This documentation is designed to be LLM-friendly, providing clear structure and examples for each core component of the Eliza framework. 