// Mock types until we have proper access to @ai16z/eliza
export type UUID = string;

export interface Memory {
    id: UUID;
    content: any;
    embedding?: number[];
    roomId: UUID;
    userId?: UUID;
    agentId?: UUID;
    timestamp?: number;
}

export interface IDatabaseAdapter {
    init(): Promise<void>;
    createMemory(memory: Memory, tableName: string, unique?: boolean): Promise<void>;
    getMemories(params: {
        roomId: UUID;
        tableName: string;
        agentId?: UUID;
        count?: number;
        start?: number;
        end?: number;
        unique?: boolean;
    }): Promise<Memory[]>;
    searchMemories(params: {
        embedding: number[];
        roomId: UUID;
        tableName: string;
        match_count: number;
        match_threshold: number;
        unique: boolean;
    }): Promise<Memory[]>;
    createRoom(roomId?: UUID): Promise<UUID>;
    removeRoom(roomId: UUID): Promise<void>;
    getRoom(roomId: UUID): Promise<UUID | null>;
    addParticipant(userId: UUID, roomId: UUID): Promise<boolean>;
    removeParticipant(userId: UUID, roomId: UUID): Promise<boolean>;
    getParticipantsForRoom(roomId: UUID): Promise<UUID[]>;
    close(): Promise<void>;
}

export const elizaLogger = {
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
    success: console.log
};
