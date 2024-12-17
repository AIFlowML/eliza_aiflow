import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { PostgresDatabaseAdapter } from './index';
import { Memory, UUID } from '@ai16z/eliza';
import { v4 as uuidv4 } from 'uuid';

describe('PostgresDatabaseAdapter', () => {
    let adapter: PostgresDatabaseAdapter;
    const testConfig = {
        host: 'localhost',
        port: 5533,
        user: 'AI',
        password: 'AI',
        database: 'eliza_test'
    };

    beforeAll(async () => {
        adapter = new PostgresDatabaseAdapter(testConfig);
        await adapter.init();
    });

    afterAll(async () => {
        await adapter.close();
    });

    describe('Room Operations', () => {
        let roomId: UUID;

        beforeEach(async () => {
            roomId = await adapter.createRoom();
        });

        afterEach(async () => {
            try {
                await adapter.removeRoom(roomId);
            } catch (error) {
                console.error('Error cleaning up room:', error);
            }
        });

        it('should create a room', async () => {
            const newRoomId = await adapter.createRoom();
            expect(newRoomId).toBeDefined();
            await adapter.removeRoom(newRoomId);
        });

        it('should get a room', async () => {
            const result = await adapter.getRoom(roomId);
            expect(result).toBe(roomId);
        });

        it('should remove a room', async () => {
            await adapter.removeRoom(roomId);
            const result = await adapter.getRoom(roomId);
            expect(result).toBeNull();
        });
    });

    describe('Memory Operations', () => {
        let roomId: UUID;
        let testMemory: Memory;

        beforeEach(async () => {
            roomId = await adapter.createRoom();
            testMemory = {
                id: uuidv4() as UUID,
                content: { text: 'Test memory' },
                embedding: Array(384).fill(0.1),
                roomId,
                timestamp: Date.now(),
            };
        });

        afterEach(async () => {
            await adapter.removeRoom(roomId);
        });

        it('should create and retrieve a memory', async () => {
            await adapter.createMemory(testMemory, 'test_table');
            const memories = await adapter.getMemories({
                roomId,
                tableName: 'test_table'
            });

            expect(memories).toHaveLength(1);
            expect(memories[0].content).toEqual(testMemory.content);
        });

        it('should handle unique memory constraint', async () => {
            const duplicateMemory = { ...testMemory, id: uuidv4() as UUID };
            
            await adapter.createMemory(testMemory, 'test_table', true);
            await adapter.createMemory(duplicateMemory, 'test_table', true);

            const memories = await adapter.getMemories({
                roomId,
                tableName: 'test_table',
                unique: true
            });

            expect(memories).toHaveLength(1);
        });

        it('should search memories by vector similarity', async () => {
            await adapter.createMemory(testMemory, 'test_table');

            const searchResults = await adapter.searchMemories({
                embedding: testMemory.embedding,
                roomId,
                tableName: 'test_table',
                match_count: 1,
                match_threshold: 0.9,
                unique: true
            });

            expect(searchResults).toHaveLength(1);
            expect(searchResults[0].id).toBe(testMemory.id);
        });
    });

    describe('Participant Operations', () => {
        let roomId: UUID;
        let userId: UUID;

        beforeEach(async () => {
            roomId = await adapter.createRoom();
            userId = uuidv4() as UUID;
        });

        afterEach(async () => {
            await adapter.removeRoom(roomId);
        });

        it('should add a participant to a room', async () => {
            const result = await adapter.addParticipant(userId, roomId);
            expect(result).toBe(true);

            const participants = await adapter.getParticipantsForRoom(roomId);
            expect(participants).toContain(userId);
        });

        it('should remove a participant from a room', async () => {
            await adapter.addParticipant(userId, roomId);
            const result = await adapter.removeParticipant(userId, roomId);
            expect(result).toBe(true);

            const participants = await adapter.getParticipantsForRoom(roomId);
            expect(participants).not.toContain(userId);
        });

        it('should handle duplicate participant additions', async () => {
            await adapter.addParticipant(userId, roomId);
            const result = await adapter.addParticipant(userId, roomId);
            expect(result).toBe(false);
        });
    });

    describe('Error Handling', () => {
        it('should handle invalid room ID', async () => {
            const invalidId = uuidv4() as UUID;
            await expect(adapter.getRoom(invalidId)).resolves.toBeNull();
        });

        it('should handle invalid memory search parameters', async () => {
            const roomId = await adapter.createRoom();
            await expect(
                adapter.searchMemories({
                    embedding: [],
                    roomId,
                    tableName: 'test_table',
                    match_count: 0,
                    match_threshold: -1,
                    unique: true
                })
            ).rejects.toThrow();
        });
    });
});
