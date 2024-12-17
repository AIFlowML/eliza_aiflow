# Eliza Framework Guide for LLMs

## Quick Reference

### Key Components
1. Core Runtime
2. Character System
3. Action System
4. Memory System
5. Provider System

### Environment Setup
```bash
# Required
Node.js 23+
pnpm
Git

# Optional
VS Code
Docker (for database)
CUDA Toolkit (for GPU)
```

## 1. Initial Setup

### Environment Configuration
```bash
# Core API Keys
OPENAI_API_KEY=sk-your-key    # OpenAI features
ANTHROPIC_API_KEY=your-key    # Claude models
TOGETHER_API_KEY=your-key     # Together.ai models

# Default Settings
XAI_MODEL=gpt-4o-mini        # Default model
X_SERVER_URL=                # Model API endpoint (optional)
```

### Client Configuration
```bash
# Discord
DISCORD_APPLICATION_ID=
DISCORD_API_TOKEN=

# Twitter
TWITTER_USERNAME=
TWITTER_PASSWORD=
TWITTER_EMAIL=
TWITTER_COOKIES=
TWITTER_DRY_RUN=false

# Telegram
TELEGRAM_BOT_TOKEN=
```

## 2. Character System

### Basic Character File
```json
{
  "name": "AgentName",
  "clients": ["discord", "twitter"],
  "modelProvider": "openai",
  "settings": {
    "secrets": {
      "OPENAI_API_KEY": "character-specific-key"
    },
    "imageSettings": {
      "steps": 20,
      "width": 1024,
      "height": 1024
    }
  },
  "bio": "Character background",
  "lore": ["Backstory elements"],
  "messageExamples": [
    [
      {
        "user": "{{user1}}",
        "content": { "text": "Example input" }
      },
      {
        "user": "AgentName",
        "content": { "text": "Example response" }
      }
    ]
  ]
}
```

### Loading Characters
```bash
# Default character
pnpm start

# Specific character
pnpm start --characters="characters/your-character.json"

# Multiple characters
pnpm start --characters="characters/char1.json,characters/char2.json"
```

## 3. Advanced Features

### Video Processing
```typescript
import { VideoService } from "@ai16z/eliza/plugin-node";

const videoService = new VideoService();
const result = await videoService.processVideo(url, runtime);
```

### Image Processing
```typescript
import { ImageDescriptionService } from "@ai16z/eliza/plugin-node";

const imageService = new ImageDescriptionService();
const description = await imageService.describeImage(imageUrl, "gpu", runtime);
```

### Speech Generation
```typescript
class SpeechService extends Service implements ISpeechService {
  async generate(runtime: IAgentRuntime, text: string): Promise<Readable> {
    if (runtime.getSetting("ELEVENLABS_XI_API_KEY")) {
      return textToSpeech(runtime, text);
    }
    return defaultSpeechGeneration(text);
  }
}
```

## 4. Development Workflow

### Running Development Server
```bash
# Start development
pnpm run dev

# With specific character
pnpm run dev --characters="characters/my-character.json"
```

### Testing
```bash
# Run all tests
pnpm test

# Specific test file
pnpm test tests/specific.test.ts

# With coverage
pnpm test:coverage
```

### Database Development
```typescript
// SQLite (Development)
import { SqliteDatabaseAdapter } from "@ai16z/eliza/adapters";
const db = new SqliteDatabaseAdapter("./dev.db");

// In-Memory (Testing)
import { SqlJsDatabaseAdapter } from "@ai16z/eliza/adapters";
const db = new SqlJsDatabaseAdapter(new Database(":memory:"));
```

## 5. Plugin Development

### Basic Plugin Structure
```typescript
const customPlugin: Plugin = {
  name: "custom-plugin",
  description: "Custom Plugin for Eliza",
  actions: [/* Custom actions */],
  evaluators: [/* Custom evaluators */],
  providers: [/* Custom providers */]
};
```

### Custom Action
```typescript
export const customAction: Action = {
  name: "CUSTOM_ACTION",
  similes: ["ALTERNATIVE_NAME"],
  validate: async (runtime: IAgentRuntime, message: Memory) => {
    return true;
  },
  handler: async (runtime: IAgentRuntime, message: Memory) => {
    // Implementation
    return true;
  }
};
```

## 6. Memory Management

### Memory Types
1. Message History (recent conversations)
2. Factual Memory (context-based facts)
3. Knowledge Base (static knowledge)
4. RAG Integration (vector search)

### Memory Operations
```typescript
class MemoryManager {
  async getMemories({
    agentId,
    roomId,
    count
  }: {
    agentId: string;
    roomId: string;
    count: number;
  }): Promise<Memory[]> {
    // Memory retrieval logic
  }

  async createMemory(
    memory: Memory,
    allowDuplicates: boolean = false
  ): Promise<void> {
    // Memory storage logic
  }
}
```

## 7. Debugging

### VS Code Configuration
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Eliza",
      "program": "${workspaceFolder}/src/index.ts",
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "DEBUG": "eliza:*"
      }
    }
  ]
}
```

### Debug Logging
```typescript
const debug = require("debug")("eliza:dev");

debug("Operation details: %O", {
  operation: "functionName",
  params: parameters,
  result: result
});
```

## Best Practices

### 1. Character Design
- Create detailed, consistent personalities
- Provide diverse interaction examples
- Balance knowledge and personality
- Consider platform-specific behavior

### 2. Memory Management
- Use appropriate memory managers for data types
- Implement regular cleanup
- Cache frequently accessed data
- Use immutable state patterns

### 3. Action Implementation
- Keep actions focused and single-purpose
- Implement proper validation
- Provide clear examples
- Handle errors gracefully

### 4. Provider Development
- Implement robust caching
- Handle API failures gracefully
- Validate input/output data
- Consider rate limiting

### 5. Testing
- Write comprehensive unit tests
- Use in-memory databases for testing
- Mock external services
- Test error conditions

### 6. Performance
- Enable GPU acceleration when available
- Use appropriate caching strategies
- Implement rate limiting
- Monitor memory usage

This guide is designed to be LLM-friendly, providing clear structure and examples for each component of the Eliza framework.