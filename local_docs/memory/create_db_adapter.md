# Creating a New Database Adapter for Eliza

This guide walks through the process of creating a new database adapter for the Eliza memory system. We'll create a simple in-memory adapter as an example, which you can use as a template for implementing other database backends.

## 1. Understanding the Interface

Every database adapter must implement the `IDatabaseAdapter` interface. Here are the key components:

### Core Properties
- `db`: The underlying database instance

### Essential Methods
```typescript
interface IDatabaseAdapter {
    // Memory Management
    createMemory(memory: Memory, tableName: string, unique?: boolean): Promise<void>;
    getMemories(params: {
        roomId: string;
        tableName: string;
        agentId?: string;
        count?: number;
        start?: number;
        end?: number;
        unique?: boolean;
    }): Promise<Memory[]>;
    removeMemory(memoryId: string, tableName: string): Promise<void>;
    
    // Vector Search
    searchMemories(params: {
        embedding: number[];
        roomId: string;
        tableName: string;
        match_count: number;
        match_threshold: number;
        unique: boolean;
    }): Promise<Memory[]>;
    
    // Room Management
    createRoom(roomId?: string): Promise<string>;
    removeRoom(roomId: string): Promise<void>;
    getRoom(roomId: string): Promise<string>;
    
    // Participant Management
    addParticipant(userId: string, roomId: string): Promise<boolean>;
    removeParticipant(userId: string, roomId: string): Promise<boolean>;
    getParticipantsForRoom(roomId: string): Promise<string[]>;
}
```

## 2. Creating a Simple In-Memory Adapter

Here's a step-by-step example of creating a simple in-memory adapter:

```typescript
import { IDatabaseAdapter, Memory, Actor, Goal, Account, Relationship } from './types';

class InMemoryAdapter implements IDatabaseAdapter {
    private memories: Map<string, Memory[]>;
    private rooms: Set<string>;
    private participants: Map<string, Set<string>>; // roomId -> Set<userId>
    
    constructor() {
        this.memories = new Map();
        this.rooms = new Set();
        this.participants = new Map();
    }

    // Memory Management
    async createMemory(memory: Memory, tableName: string, unique?: boolean): Promise<void> {
        const key = `${tableName}:${memory.roomId}`;
        if (!this.memories.has(key)) {
            this.memories.set(key, []);
        }
        
        if (unique) {
            // Remove duplicates based on content
            const existing = this.memories.get(key)!;
            const isDuplicate = existing.some(m => m.content === memory.content);
            if (!isDuplicate) {
                existing.push(memory);
            }
        } else {
            this.memories.get(key)!.push(memory);
        }
    }

    async getMemories(params: {
        roomId: string;
        tableName: string;
        agentId?: string;
        count?: number;
        start?: number;
        end?: number;
        unique?: boolean;
    }): Promise<Memory[]> {
        const key = `${params.tableName}:${params.roomId}`;
        if (!this.memories.has(key)) {
            return [];
        }

        let memories = this.memories.get(key)!;
        
        // Filter by agentId if specified
        if (params.agentId) {
            memories = memories.filter(m => m.agentId === params.agentId);
        }

        // Apply pagination
        const start = params.start || 0;
        const end = params.end || memories.length;
        memories = memories.slice(start, end);

        // Apply count limit
        if (params.count) {
            memories = memories.slice(0, params.count);
        }

        return memories;
    }

    // Vector Search Implementation
    async searchMemories(params: {
        embedding: number[];
        roomId: string;
        tableName: string;
        match_count: number;
        match_threshold: number;
        unique: boolean;
    }): Promise<Memory[]> {
        const key = `${params.tableName}:${params.roomId}`;
        if (!this.memories.has(key)) {
            return [];
        }

        const memories = this.memories.get(key)!;
        
        // Implement cosine similarity search
        const results = memories
            .map(memory => ({
                memory,
                similarity: this.cosineSimilarity(params.embedding, memory.embedding)
            }))
            .filter(result => result.similarity >= params.match_threshold)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, params.match_count)
            .map(result => result.memory);

        return results;
    }

    // Room Management
    async createRoom(roomId?: string): Promise<string> {
        const newRoomId = roomId || this.generateUUID();
        this.rooms.add(newRoomId);
        this.participants.set(newRoomId, new Set());
        return newRoomId;
    }

    async removeRoom(roomId: string): Promise<void> {
        this.rooms.delete(roomId);
        this.participants.delete(roomId);
        
        // Clean up memories
        for (const [key] of this.memories) {
            if (key.includes(roomId)) {
                this.memories.delete(key);
            }
        }
    }

    // Helper Methods
    private cosineSimilarity(a: number[], b: number[]): number {
        if (a.length !== b.length) return 0;
        
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        
        for (let i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    private generateUUID(): string {
        // Simple UUID implementation for example
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
```

## 3. Key Implementation Considerations

When implementing a new database adapter, consider these aspects:

### Performance
- Implement efficient vector similarity search
- Use appropriate indexes for fast retrieval
- Consider caching frequently accessed data
- Implement batch operations where possible

### Consistency
- Ensure atomic operations where needed
- Handle concurrent access appropriately
- Maintain data integrity across operations

### Error Handling
- Implement robust error handling
- Provide meaningful error messages
- Handle edge cases gracefully

### Memory Management
- Implement cleanup mechanisms
- Handle memory limits appropriately
- Consider persistence requirements

## 4. Testing Your Adapter

Create comprehensive tests for your adapter:

```typescript
describe('DatabaseAdapter', () => {
    let adapter: IDatabaseAdapter;
    
    beforeEach(() => {
        adapter = new YourDatabaseAdapter();
    });
    
    describe('Memory Operations', () => {
        it('should create and retrieve memories', async () => {
            const memory = {
                id: 'test-id',
                roomId: 'room-1',
                content: 'test content',
                embedding: [0.1, 0.2, 0.3],
                timestamp: Date.now()
            };
            
            await adapter.createMemory(memory, 'test_table');
            const memories = await adapter.getMemories({
                roomId: 'room-1',
                tableName: 'test_table'
            });
            
            expect(memories).toHaveLength(1);
            expect(memories[0]).toEqual(memory);
        });
    });
    
    describe('Vector Search', () => {
        it('should find similar memories', async () => {
            // Add test implementation
        });
    });
});
```

## 5. Integration

To integrate your new adapter:

1. Register your adapter in the factory:
```typescript
class DatabaseAdapterFactory {
    static create(type: string, config: any): IDatabaseAdapter {
        switch (type) {
            case 'in-memory':
                return new InMemoryAdapter();
            case 'your-adapter':
                return new YourDatabaseAdapter(config);
            default:
                throw new Error(`Unknown adapter type: ${type}`);
        }
    }
}
```

2. Configure the adapter in your application:
```typescript
const adapter = DatabaseAdapterFactory.create('your-adapter', {
    // Your configuration options
});

const memoryManager = new MemoryManager(adapter);
```

## 6. Best Practices

1. **Modularity**: Keep your adapter implementation modular and focused
2. **Configuration**: Make your adapter configurable for different environments
3. **Logging**: Implement comprehensive logging for debugging
4. **Documentation**: Document your adapter's specific features and limitations
5. **Error Handling**: Implement proper error handling and recovery
6. **Testing**: Create comprehensive test coverage
7. **Performance**: Optimize for your specific use case

## 7. Common Pitfalls to Avoid

1. Not handling edge cases properly
2. Insufficient error handling
3. Poor performance with large datasets
4. Memory leaks in long-running operations
5. Lack of proper cleanup mechanisms
6. Inadequate testing of concurrent operations
7. Missing documentation of implementation details

## 8. Example Configuration

```typescript
interface AdapterConfig {
    connectionString?: string;
    maxConnections?: number;
    timeout?: number;
    retryAttempts?: number;
    cacheSize?: number;
}

class YourDatabaseAdapter implements IDatabaseAdapter {
    constructor(config: AdapterConfig) {
        // Initialize with configuration
    }
}
```

This guide provides a foundation for creating new database adapters for Eliza. Adapt and extend this template based on your specific database backend requirements.
