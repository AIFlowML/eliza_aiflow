# Project Development Guide

## Core Architecture

### Memory and Database System

The memory system leverages Eliza's core functionality while adding multi-agent support:

#### Standard Eliza Memory Integration

1. **Core Memory Managers**
   ```typescript
   interface IAgentRuntime {
       messageManager: IMemoryManager;    // Conversation history
       descriptionManager: IMemoryManager; // User profiles
       loreManager: IMemoryManager;       // Character knowledge
   }
   ```

2. **Database Adapters**
   ```typescript
   // Using standard SQLite adapter
   import { SqliteDatabaseAdapter } from "@ai16z/adapter-sqlite";

   function initializeDatabase(dataDir: string) {
       const filePath = process.env.SQLITE_FILE ??
           path.resolve(dataDir, "db.sqlite");
       return new SqliteDatabaseAdapter(new Database(filePath));
   }
   ```

### Multi-Agent Architecture

#### Agent Orchestrator

```typescript
class AgentOrchestrator {
    private agents: Map<string, IAgentRuntime>;
    private messageBuffer: Map<string, Memory[]>;

    // Core functionality
    async routeMessage(fromAgentId: string, toAgentId: string, message: Memory);
    async broadcast(fromAgentId: string, message: Memory);
    async shareKnowledge(fromAgentId: string, toAgentId: string, memoryId: string);
    async processBufferedMessages(agentId: string);
}
```

#### Memory Types

```typescript
interface Memory {
    id: UUID;
    content: {
        text: string;
        type?: 'incoming' | 'outgoing' | 'broadcast' | 'shared_knowledge';
        sentTo?: string;
        receivedFrom?: string;
        sharedFrom?: string;
    };
    userId: UUID;
    roomId: UUID;
    agentId: UUID;
    createdAt: number;
}
```

## Implementation Checklist

### Core Setup
- [ ] Initialize project with proper dependencies
  ```bash
  pnpm init
  pnpm add @ai16z/eliza @ai16z/adapter-sqlite better-sqlite3
  ```
- [ ] Configure TypeScript
  ```bash
  pnpm add -D typescript @types/node @types/better-sqlite3
  ```
- [ ] Set up test environment
  ```bash
  pnpm add -D jest @types/jest ts-jest
  ```

### Database Implementation
- [ ] Verify SQLite adapter integration
- [ ] Test database initialization
- [ ] Validate memory table schema
- [ ] Implement memory isolation
- [ ] Set up proper indexes

### Memory Management
- [ ] Verify standard memory managers
- [ ] Test memory isolation
- [ ] Implement memory sharing
- [ ] Add memory type tracking
- [ ] Test vector search functionality

### Multi-Agent Features
- [ ] Implement agent orchestrator
- [ ] Add message routing
- [ ] Set up broadcast functionality
- [ ] Implement knowledge sharing
- [ ] Add message buffering

### Testing Strategy
- [ ] Unit tests for core functionality
- [ ] Integration tests for multi-agent features
- [ ] End-to-end tests for complete workflows
- [ ] Performance tests for memory operations

## Testing Implementation

### 1. Unit Tests

```typescript
// tests/unit/memory.test.ts
import { MemoryManager, AgentRuntime } from "@ai16z/eliza";
import { SqliteDatabaseAdapter } from "@ai16z/adapter-sqlite";

describe("Memory Management", () => {
    let runtime: AgentRuntime;
    let db: SqliteDatabaseAdapter;

    beforeEach(async () => {
        db = new SqliteDatabaseAdapter(":memory:");
        await db.init();
        runtime = new AgentRuntime({
            databaseAdapter: db,
            // ... other required config
        });
    });

    test("memory isolation between agents", async () => {
        const memory = {
            id: "test-id",
            content: { text: "Test memory" },
            userId: "user-1",
            roomId: "room-1",
            agentId: runtime.agentId
        };

        await runtime.messageManager.createMemory(memory);

        const retrieved = await runtime.messageManager.getMemoryById(memory.id);
        expect(retrieved?.agentId).toBe(runtime.agentId);
    });
});
```

### 2. Integration Tests

```typescript
// tests/integration/orchestrator.test.ts
import { AgentOrchestrator } from "../../src/orchestrator";
import { AgentRuntime } from "@ai16z/eliza";

describe("Agent Orchestrator", () => {
    let orchestrator: AgentOrchestrator;
    let agent1: AgentRuntime;
    let agent2: AgentRuntime;

    beforeEach(async () => {
        orchestrator = new AgentOrchestrator();
        // Initialize agents with in-memory SQLite
        agent1 = await createTestAgent("agent1");
        agent2 = await createTestAgent("agent2");

        orchestrator.registerAgent(agent1);
        orchestrator.registerAgent(agent2);
    });

    test("message routing between agents", async () => {
        const message = {
            id: "test-msg",
            content: { text: "Hello agent2" },
            userId: "user-1",
            roomId: "room-1",
            agentId: agent1.agentId
        };

        await orchestrator.routeMessage(
            agent1.agentId,
            agent2.agentId,
            message
        );

        // Verify message in both agents' memory
        const sent = await agent1.messageManager.getMemoryById(message.id);
        expect(sent?.content.type).toBe("outgoing");

        const received = await agent2.messageManager.getMemories({
            roomId: "room-1",
            count: 1
        });
        expect(received[0].content.type).toBe("incoming");
    });
});
```

### 3. End-to-End Tests

```typescript
// tests/e2e/multi_agent.test.ts
describe("Multi-Agent System", () => {
    test("complete workflow", async () => {
        // 1. Initialize system
        const { orchestrator, agents } = await initializeTestSystem();

        // 2. Send user message
        await handleUserInput("@agent1 Hello!", "user-1");

        // 3. Verify agent response
        const response = await agents[0].messageManager.getMemories({
            roomId: "room-1",
            count: 1
        });
        expect(response[0].content.text).toContain("Hello");

        // 4. Test inter-agent communication
        await handleUserInput("@all Broadcast message", "user-1");

        // 5. Verify broadcast received
        for (const agent of agents) {
            const messages = await agent.messageManager.getMemories({
                roomId: "global",
                count: 1
            });
            expect(messages[0].content.type).toBe("broadcast");
        }
    });
});
```

## Best Practices

### Memory Management
1. Always use standard Eliza memory managers
2. Maintain proper memory isolation through agentId
3. Use explicit memory sharing when needed
4. Implement cleanup strategies for old memories

### Database Operations
1. Use connection pooling for production
2. Implement proper error handling
3. Use transactions for atomic operations
4. Regular database maintenance

### Testing
1. Write tests before implementation
2. Use in-memory SQLite for tests
3. Test edge cases and error conditions
4. Implement performance benchmarks

### Performance
1. Implement proper indexing
2. Use caching where appropriate
3. Monitor memory usage
4. Optimize vector searches

## Monitoring and Debugging

### Logging Strategy
```typescript
// Use Eliza's built-in logger
import { elizaLogger } from "@ai16z/eliza";

elizaLogger.info("Agent initialized", { agentId, roomId });
elizaLogger.error("Message routing failed", { error, fromAgent, toAgent });
```

### Performance Monitoring
```typescript
interface PerformanceMetrics {
    messageLatency: number;
    memoryUsage: number;
    databaseConnections: number;
    vectorSearchTime: number;
}
```

## Development Workflow

1. **Feature Implementation**
   - Write tests first
   - Implement feature
   - Verify with Eliza core
   - Run test suite
   - Document changes

2. **Code Review Process**
   - Check test coverage
   - Verify memory isolation
   - Review error handling
   - Check performance impact

3. **Deployment Steps**
   - Run full test suite
   - Verify database migrations
   - Check memory cleanup
   - Monitor system health

## Support and Resources

### Documentation
- Eliza Framework Docs
- Database Adapter Docs
- Memory System Docs
- Testing Guidelines

### Tools
- Test Runners
- Performance Monitoring
- Database Management
- Memory Analysis

This architecture ensures proper integration with Eliza's core functionality while enabling robust multi-agent support.