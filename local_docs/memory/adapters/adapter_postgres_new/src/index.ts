import {
    IDatabaseAdapter,
    Memory,
    UUID,
    elizaLogger,
    Account,
    Actor,
    GoalStatus,
    DatabaseAdapter,
    IDatabaseCacheAdapter,
    Participant,
    Goal,
    Room,
    Relationship
} from '@ai16z/eliza';
import { Pool, PoolConfig, PoolClient } from "pg";
import format from "pg-format";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PostgresConfig extends PoolConfig {
    parseInputs?: boolean;
    maxPoolSize?: number;
    minPoolSize?: number;
    idleTimeoutMs?: number;
    connectionTimeoutMs?: number;
    maxUses?: number;
}

/**
 * PostgreSQL adapter for Eliza memory storage with vector support
 *
 * This adapter implements the IDatabaseAdapter interface and provides:
 * - Vector-based similarity search for memories
 * - Full CRUD operations for memories and accounts
 * - Connection pooling and automatic reconnection
 * - Schema initialization and migration support
 * - Robust error handling and logging
 *
 * @implements {IDatabaseAdapter}
 */
export class PostgresDatabaseAdapterV2
    extends DatabaseAdapter<Pool>
    implements IDatabaseCacheAdapter, IDatabaseAdapter {
    updateGoal(goal: Goal): Promise<void> {
        throw new Error('Method not implemented.');
    }
    removeGoal(goalId: UUID): Promise<void> {
        throw new Error('Method not implemented.');
    }
    removeAllGoals(roomId: UUID): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getRoomsForParticipants(userIds: UUID[]): Promise<UUID[]> {
        throw new Error('Method not implemented.');
    }
    getParticipantsForAccount(userId: unknown): Promise<Participant[]> {
        throw new Error('Method not implemented.');
    }
    getParticipantUserState(roomId: UUID, userId: UUID): Promise<'FOLLOWED' | 'MUTED' | null> {
        throw new Error('Method not implemented.');
    }
    setParticipantUserState(roomId: UUID, userId: UUID, state: 'FOLLOWED' | 'MUTED' | null): Promise<void> {
        throw new Error('Method not implemented.');
    }
    createRelationship(params: { userA: UUID; userB: UUID; }): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    getRelationship(params: { userA: UUID; userB: UUID; }): Promise<Relationship | null> {
        throw new Error('Method not implemented.');
    }
    getRelationships(params: { userId: UUID; }): Promise<Relationship[]> {
        throw new Error('Method not implemented.');
    }
    private pool: Pool;
    private readonly parseInputs: boolean;
    private initialized: boolean = false;
    private readonly maxRetries: number = 3;
    private readonly baseDelay: number = 1000; // 1 second
    private readonly maxDelay: number = 10000; // 10 seconds
    private readonly jitterMax: number = 1000; // 1 second

    constructor(config: PostgresConfig) {
        super({
            failureThreshold: 5,
            resetTimeout: 60000,
            halfOpenMaxAttempts: 3,
        });

        const poolConfig: PoolConfig = {
            // Default pool configuration optimized for high-concurrency
            max: config.maxPoolSize || 20, // Maximum number of clients
            min: config.minPoolSize || 4,  // Minimum number of idle clients
            idleTimeoutMillis: config.idleTimeoutMs || 30000, // How long a client can be idle before being closed
            connectionTimeoutMillis: config.connectionTimeoutMs || 5000, // How long to wait for a connection
            maxUses: config.maxUses || 7500, // Maximum number of times to use a client before recycling
            application_name: 'eliza_postgres_adapter',
            statement_timeout: 30000, // 30 seconds
            query_timeout: 30000, // 30 seconds
            keepAlive: true,
            keepAliveInitialDelayMillis: 10000,
            ...config,
        };

        elizaLogger.debug('Initializing PostgresDatabaseAdapterV2 with config:', {
            ...poolConfig,
            password: '[REDACTED]'
        });

        this.pool = new Pool(poolConfig);
        this.parseInputs = config.parseInputs ?? true;

        // Handle pool errors
        this.pool.on('error', (err) => {
            elizaLogger.error('Unexpected error on idle client', err);
            this.handlePoolError(err);
        });

        this.pool.on('connect', (client) => {
            elizaLogger.debug('New client connected to pool');
            client.on('error', (err) => {
                elizaLogger.error('Client error', err);
            });
        });

        this.setupPoolErrorHandling();
    }

    private handlePoolError(error: Error): void {
        elizaLogger.error('Pool error occurred:', error);
        if (error.message.includes('connection terminated unexpectedly')) {
            this.initialized = false;
            void this.init().catch(err => {
                elizaLogger.error('Failed to reinitialize pool after error:', err);
            });
        }
    }

    private setupPoolErrorHandling(): void {
        process.on('SIGINT', async () => {
            await this.cleanup();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            await this.cleanup();
            process.exit(0);
        });

        process.on('beforeExit', async () => {
            await this.cleanup();
        });
    }

    private async cleanup(): Promise<void> {
        try {
            await this.pool.end();
            elizaLogger.info('Database pool cleaned up successfully');
        } catch (error) {
            elizaLogger.error('Error cleaning up database pool:', error);
        }
    }

    /**
     * Initialize the database connection and schema
     * Creates necessary tables and extensions if they don't exist
     *
     * @throws {Error} If connection fails or schema initialization fails
     */
    async init(): Promise<void> {
        elizaLogger.debug('Starting database initialization');
        if (this.initialized) {
            elizaLogger.debug('Database already initialized, skipping');
            return;
        }

        try {
            await this.testConnection();
            await this.initializeSchema();
            this.initialized = true;
            elizaLogger.success("PostgreSQL database initialized successfully");
        } catch (error) {
            elizaLogger.error("Failed to initialize PostgreSQL database:", {
                error: error instanceof Error ? error.message : String(error)
            });
            throw error;
        }
    }

    /**
     * Test the database connection
     */
    private async testConnection(): Promise<void> {
        try {
            const client = await this.pool.connect();
            await client.query('SELECT NOW()');
            client.release();
            elizaLogger.debug("PostgreSQL connection test successful");
        } catch (error) {
            elizaLogger.error("PostgreSQL connection test failed:", {
                error: error instanceof Error ? error.message : String(error)
            });
            throw error;
        }
    }

    /**
     * Initialize database schema
     */
    private async initializeSchema(): Promise<void> {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');

            // Check if schema exists
            const { rows } = await client.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables
                    WHERE table_name = 'rooms'
                );
            `);

            if (!rows[0].exists) {
                const schema = fs.readFileSync(
                    path.resolve(__dirname, "../schema.sql"),
                    "utf8"
                );
                await client.query(schema);
            }

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Wrapper for database operations with proper error handling
     */
    private async withDatabase<T>(
        operation: (client: PoolClient) => Promise<T>,
        operationName: string
    ): Promise<T> {
        const client = await this.pool.connect();
        try {
            const result = await operation(client);
            return result;
        } catch (error) {
            elizaLogger.error(`Error in ${operationName}:`, {
                error: error instanceof Error ? error.message : String(error)
            });
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Create a new memory entry with vector support
     *
     * @param memory - Memory object to create
     * @param tableName - Name of the table to store the memory in
     * @param unique - Whether to enforce uniqueness constraints
     */
    async createMemory(memory: Memory, tableName: string, unique = true): Promise<void> {
        elizaLogger.debug('Creating memory', { memory: { ...memory, embedding: '[TRUNCATED]' }, tableName, unique });
        return this.withDatabase(async (client) => {
            await client.query('BEGIN');
            try {
                if (unique) {
                    const existing = await client.query(
                        format('SELECT id FROM %I WHERE content @> $1::jsonb AND "roomId" = $2', tableName),
                        [JSON.stringify(memory.content), memory.roomId]
                    );
                    if (existing.rows.length > 0) {
                        elizaLogger.debug('Duplicate memory found, skipping creation', {
                            existingId: existing.rows[0].id,
                            newId: memory.id
                        });
                        await client.query('COMMIT');
                        return;
                    }
                }

                const query = format(
                    'INSERT INTO %I (id, "roomId", "agentId", content, embedding, "createdAt") ' +
                    'VALUES ($1, $2, $3, $4, $5, $6)',
                    tableName
                );

                await client.query(query, [
                    memory.id,
                    memory.roomId,
                    memory.agentId,
                    memory.content,
                    memory.embedding,
                    memory.createdAt || new Date()
                ]);
                await client.query('COMMIT');
                elizaLogger.debug('Memory created successfully', { id: memory.id });
            } catch (error) {
                await client.query('ROLLBACK');
                elizaLogger.error('Error creating memory', {
                    error: error instanceof Error ? error.message : String(error),
                    memory: { id: memory.id, roomId: memory.roomId }
                });
                throw error;
            }
        }, 'createMemory');
    }

    /**
     * Retrieve memories based on parameters
     */
    async getMemories(params: {
        roomId: UUID;
        tableName: string;
        agentId?: UUID;
        count?: number;
        start?: number;
        end?: number;
        unique?: boolean;
    }): Promise<Memory[]> {
        return this.withDatabase(async (client) => {
            let query = `
                SELECT * FROM memories
                WHERE type = $1 AND "roomId" = $2
            `;
            const values: any[] = [params.tableName, params.roomId];
            let paramCount = 2;

            if (params.unique) {
                query += ` AND "unique" = true`;
            }

            if (params.agentId) {
                paramCount++;
                query += ` AND "agentId" = $${paramCount}`;
                values.push(params.agentId);
            }

            if (params.start) {
                paramCount++;
                query += ` AND "createdAt" >= to_timestamp($${paramCount})`;
                values.push(params.start / 1000);
            }

            if (params.end) {
                paramCount++;
                query += ` AND "createdAt" <= to_timestamp($${paramCount})`;
                values.push(params.end / 1000);
            }

            query += ` ORDER BY "createdAt" DESC`;

            if (params.count) {
                paramCount++;
                query += ` LIMIT $${paramCount}`;
                values.push(params.count);
            }

            const { rows } = await client.query(query, values);
            return rows.map(row => ({
                ...row,
                content: typeof row.content === 'string' ? JSON.parse(row.content) : row.content
            }));
        }, 'getMemories');
    }

    /**
     * Search memories using vector similarity
     *
     * @param params - Search parameters including embedding and thresholds
     * @returns Promise<Memory[]> - Array of matching memories
     */
    async searchMemories(params: {
        embedding: number[];
        roomId: UUID;
        tableName: string;
        match_count?: number;
        match_threshold?: number;
    }): Promise<Memory[]> {
        elizaLogger.debug('Searching memories with vector similarity', {
            ...params,
            embedding: '[TRUNCATED]'
        });

        return this.withDatabase(async (client) => {
            const query = format(
                'SELECT * FROM %I WHERE "roomId" = $1 AND embedding <-> $2 < $3 ORDER BY embedding <-> $2 LIMIT $4',
                params.tableName
            );

            const { rows } = await client.query<Memory>(query, [
                params.roomId,
                params.embedding,
                params.match_threshold || 0.3,
                params.match_count || 10
            ]);

            elizaLogger.debug('Memory search results', {
                count: rows.length,
                threshold: params.match_threshold,
                roomId: params.roomId
            });

            return rows;
        }, 'searchMemories');
    }

    /**
     * Remove a memory by ID and table name
     *
     * @param memoryId - UUID of the memory to remove
     * @param tableName - Name of the table containing the memory
     * @returns Promise<void>
     */
    async removeMemory(memoryId: UUID, tableName: string): Promise<void> {
        elizaLogger.debug('Removing memory', { memoryId, tableName });
        return this.withDatabase(async (client) => {
            const query = format(
                'DELETE FROM %I WHERE id = $1',
                tableName
            );
            await client.query(query, [memoryId]);
            elizaLogger.debug('Memory removed successfully', { memoryId, tableName });
        }, 'removeMemory');
    }

    /**
     * Create a new room
     */
    async createRoom(roomId?: UUID): Promise<UUID> {
        elizaLogger.debug('Creating room', { roomId });
        return this.withDatabase(async (client) => {
            // Ensure UUID format
            const newRoomId = (roomId || v4()) as UUID;
            await client.query(
                'INSERT INTO rooms (id) VALUES ($1)',
                [newRoomId]
            );
            return newRoomId;
        }, 'createRoom');
    }

    /**
     * Remove a room and all associated data
     */
    async removeRoom(roomId: UUID): Promise<void> {
        return this.withDatabase(async (client) => {
            await client.query('BEGIN');
            try {
                await client.query('DELETE FROM memories WHERE "roomId" = $1', [roomId]);
                await client.query('DELETE FROM participants WHERE "roomId" = $1', [roomId]);
                await client.query('DELETE FROM goals WHERE "roomId" = $1', [roomId]);
                await client.query('DELETE FROM rooms WHERE id = $1', [roomId]);
                await client.query('COMMIT');
            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            }
        }, 'removeRoom');
    }

    /**
     * Get a room ID by ID
     */
    async getRoom(roomId: UUID): Promise<UUID | null> {
        elizaLogger.debug('Getting room', { roomId });
        return this.withDatabase(async (client) => {
            const { rows } = await client.query<{ id: UUID }>(
                'SELECT id FROM rooms WHERE id = $1',
                [roomId]
            );
            if (rows.length === 0) {
                elizaLogger.debug('Room not found', { roomId });
                return null;
            }
            return rows[0].id;
        }, 'getRoom');
    }

    /**
     * Get full room details by ID
     */
    async getRoomDetails(roomId: UUID): Promise<Room | null> {
        elizaLogger.debug('Getting room details', { roomId });
        return this.withDatabase(async (client) => {
            const { rows } = await client.query<Room>(
                'SELECT r.*, COALESCE(json_agg(p.*) FILTER (WHERE p.id IS NOT NULL), \'[]\') as participants FROM rooms r ' +
                'LEFT JOIN participants p ON r.id = p."roomId" ' +
                'WHERE r.id = $1 ' +
                'GROUP BY r.id',
                [roomId]
            );
            if (rows.length === 0) {
                elizaLogger.debug('Room not found', { roomId });
                return null;
            }
            return rows[0];
        }, 'getRoomDetails');
    }

    /**
     * Add a participant to a room
     */
    async addParticipant(userId: UUID, roomId: UUID): Promise<boolean> {
        return this.withDatabase(async (client) => {
            try {
                await client.query(
                    'INSERT INTO participants ("userId", "roomId") VALUES ($1, $2)',
                    [userId, roomId]
                );
                return true;
            } catch (error) {
                if (error instanceof Error && error.message.includes('duplicate key')) {
                    return false;
                }
                throw error;
            }
        }, 'addParticipant');
    }

    /**
     * Remove a participant from a room
     */
    async removeParticipant(userId: UUID, roomId: UUID): Promise<boolean> {
        return this.withDatabase(async (client) => {
            const result = await client.query<{ rowCount?: number }>(
                'DELETE FROM participants WHERE "userId" = $1 AND "roomId" = $2',
                [userId, roomId]
            );
            const deleted = (result.rowCount ?? 0) > 0;
            elizaLogger.debug('Delete participant result:', { userId, roomId, rowCount: result.rowCount });
            return deleted;
        }, 'removeParticipant');
    }

    /**
     * Get all participants in a room
     */
    async getParticipantsForRoom(roomId: UUID): Promise<UUID[]> {
        elizaLogger.debug('Getting participants for room', { roomId });
        return this.withDatabase(async (client) => {
            const { rows } = await client.query<{ userId: UUID }>(
                'SELECT "userId" FROM participants WHERE "roomId" = $1',
                [roomId]
            );
            const participants = rows.map(row => row.userId);
            elizaLogger.debug('Retrieved room participants', {
                roomId,
                participantCount: participants.length
            });
            return participants;
        }, 'getParticipantsForRoom');
    }

    /**
     * Close the database connection
     */
    async close(): Promise<void> {
        await this.pool.end();
    }

    /**
     * Get a cached value by key and agent ID
     */
    async getCache(params: { key: string; agentId: UUID }): Promise<string | undefined> {
        elizaLogger.debug('Getting cache', params);
        return this.withDatabase(async (client) => {
            const { rows } = await client.query(
                'SELECT value FROM cache WHERE key = $1 AND "agentId" = $2',
                [params.key, params.agentId]
            );
            const value = rows[0]?.value;
            elizaLogger.debug('Cache get result', { ...params, found: !!value });
            return value;
        }, 'getCache');
    }

    /**
     * Set a cached value by key and agent ID
     */
    async setCache(params: { key: string; agentId: UUID; value: string }): Promise<boolean> {
        elizaLogger.debug('Setting cache', params);
        return this.withDatabase(async (client) => {
            try {
                await client.query(
                    'INSERT INTO cache (key, "agentId", value) VALUES ($1, $2, $3) ON CONFLICT (key, "agentId") DO UPDATE SET value = $3',
                    [params.key, params.agentId, params.value]
                );
                elizaLogger.debug('Cache set successfully', { key: params.key });
                return true;
            } catch (error) {
                elizaLogger.error('Error setting cache', { error, ...params });
                return false;
            }
        }, 'setCache');
    }

    /**
     * Delete a cached value by key and agent ID
     */
    async deleteCache(params: { key: string; agentId: UUID }): Promise<boolean> {
        elizaLogger.debug('Deleting cache', params);
        return this.withDatabase(async (client) => {
            const { rowCount } = await client.query(
                'DELETE FROM cache WHERE key = $1 AND "agentId" = $2',
                [params.key, params.agentId]
            );
            const deleted = (rowCount ?? 0) > 0;
            elizaLogger.debug('Cache delete result', { ...params, deleted });
            return deleted;
        }, 'deleteCache');
    }

    /**
     * Get account by ID
     */
    async getAccountById(userId: UUID): Promise<Account | null> {
        elizaLogger.debug('Getting account', { userId });
        return this.withDatabase(async (client) => {
            const { rows } = await client.query(
                'SELECT * FROM accounts WHERE id = $1',
                [userId]
            );
            if (rows.length === 0) {
                elizaLogger.debug('Account not found', { userId });
                return null;
            }
            const account = rows[0];
            return {
                ...account,
                details: typeof account.details === 'string' ? JSON.parse(account.details) : account.details,
            };
        }, 'getAccountById');
    }

    /**
     * Create a new account
     */
    async createAccount(account: Account): Promise<boolean> {
        elizaLogger.debug('Creating account', { accountId: account.id });
        return this.withDatabase(async (client) => {
            try {
                await client.query(
                    'INSERT INTO accounts (id, name, username, email, "avatarUrl", details) VALUES ($1, $2, $3, $4, $5, $6)',
                    [
                        account.id,
                        account.name,
                        account.username || '',
                        account.email || '',
                        account.avatarUrl || '',
                        JSON.stringify(account.details || {}),
                    ]
                );
                elizaLogger.debug('Account created successfully', { accountId: account.id });
                return true;
            } catch (error) {
                elizaLogger.error('Error creating account', { error, accountId: account.id });
                return false;
            }
        }, 'createAccount');
    }

    /**
     * Get memories by room IDs
     */
    async getMemoriesByRoomIds(params: { roomIds: UUID[]; agentId?: UUID; tableName: string }): Promise<Memory[]> {
        elizaLogger.debug('Getting memories by room IDs', params);
        return this.withDatabase(async (client) => {
            const query = format(
                'SELECT * FROM %I WHERE "roomId" = ANY($1)' + (params.agentId ? ' AND "agentId" = $2' : ''),
                params.tableName
            );
            const values = params.agentId ? [params.roomIds, params.agentId] : [params.roomIds];
            const { rows } = await client.query<Memory>(query, values);
            elizaLogger.debug('Retrieved memories', { count: rows.length });
            return rows;
        }, 'getMemoriesByRoomIds');
    }

    /**
     * Get memory by ID
     */
    async getMemoryById(id: UUID): Promise<Memory | null> {
        elizaLogger.debug('Getting memory by ID', { id });
        return this.withDatabase(async (client) => {
            const { rows } = await client.query<Memory>(
                'SELECT * FROM memories WHERE id = $1',
                [id]
            );
            if (rows.length === 0) {
                elizaLogger.debug('Memory not found', { id });
                return null;
            }
            return rows[0];
        }, 'getMemoryById');
    }

    /**
     * Get cached embeddings
     */
    async getCachedEmbeddings(params: {
        query_table_name: string;
        query_threshold: number;
        query_input: string;
        query_field_name: string;
        query_field_sub_name: string;
        query_match_count: number;
    }): Promise<{ embedding: number[]; levenshtein_score: number; }[]> {
        elizaLogger.debug('Getting cached embeddings', params);
        return this.withDatabase(async (client) => {
            const { rows } = await client.query(
                format(
                    'SELECT embedding, levenshtein(%I, $1) as levenshtein_score FROM %I WHERE levenshtein(%I, $1) <= $2 ORDER BY levenshtein_score ASC LIMIT $3',
                    params.query_field_name,
                    params.query_table_name,
                    params.query_field_name
                ),
                [params.query_input, params.query_threshold, params.query_match_count]
            );
            return rows;
        }, 'getCachedEmbeddings');
    }

    /**
     * Log a message
     */
    async log(params: {
        body: { [key: string]: unknown };
        userId: UUID;
        roomId: UUID;
        type: string;
    }): Promise<void> {
        elizaLogger.debug('Logging message', params);
        await this.withDatabase(async (client) => {
            await client.query(
                'INSERT INTO logs (body, "userId", "roomId", type) VALUES ($1, $2, $3, $4)',
                [params.body, params.userId, params.roomId, params.type]
            );
        }, 'log');
    }

    /**
     * Get actor details
     */
    async getActorDetails(params: { roomId: UUID }): Promise<Actor[]> {
        elizaLogger.debug('Getting actor details', params);
        return this.withDatabase(async (client) => {
            const { rows } = await client.query<Actor>(
                'SELECT * FROM actors WHERE "roomId" = $1',
                [params.roomId]
            );
            return rows;
        }, 'getActorDetails');
    }

    /**
     * Update goal status
     */
    async updateGoalStatus(params: { goalId: UUID; status: GoalStatus }): Promise<void> {
        elizaLogger.debug('Updating goal status', params);
        await this.withDatabase(async (client) => {
            await client.query(
                'UPDATE goals SET status = $1 WHERE id = $2',
                [params.status, params.goalId]
            );
        }, 'updateGoalStatus');
    }

    /**
     * Get participant by ID
     */
    async getParticipant(participantId: UUID): Promise<Participant | null> {
        elizaLogger.debug('Getting participant', { participantId });
        return this.withDatabase(async (client) => {
            const { rows } = await client.query(
                'SELECT * FROM participants WHERE id = $1',
                [participantId]
            );
            if (rows.length === 0) return null;
            return rows[0];
        }, 'getParticipant');
    }

    /**
     * Create a new participant
     */
    async createParticipant(participant: { id: UUID; userId: UUID; roomId: UUID }): Promise<void> {
        elizaLogger.debug('Creating participant', { participantId: participant.id });
        await this.withDatabase(async (client) => {
            await client.query(
                'INSERT INTO participants (id, "userId", "roomId") VALUES ($1, $2, $3)',
                [participant.id, participant.userId, participant.roomId]
            );
        }, 'createParticipant');
    }

    /**
     * Get goal by ID
     */
    async getGoal(goalId: UUID): Promise<Goal | null> {
        elizaLogger.debug('Getting goal', { goalId });
        return this.withDatabase(async (client) => {
            const { rows } = await client.query(
                'SELECT * FROM goals WHERE id = $1',
                [goalId]
            );
            if (rows.length === 0) return null;
            return rows[0];
        }, 'getGoal');
    }

    /**
     * Create a new goal
     */
    async createGoal(goal: Goal): Promise<void> {
        elizaLogger.debug('Creating goal', { goalId: goal.id });
        await this.withDatabase(async (client) => {
            await client.query(
                `INSERT INTO goals (id, "roomId", "userId", name, status, objectives)
                VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    goal.id ?? v4(),
                    goal.roomId,
                    goal.userId,
                    goal.name,
                    goal.status,
                    JSON.stringify(goal.objectives)
                ]
            );
        }, 'createGoal');
    }

    /**
     * Get all goals for a room
     */
    async getGoalsForRoom(roomId: UUID): Promise<Goal[]> {
        elizaLogger.debug('Getting goals for room', { roomId });
        return this.withDatabase(async (client) => {
            const { rows } = await client.query<Goal>(
                'SELECT * FROM goals WHERE "roomId" = $1',
                [roomId]
            );
            return rows;
        }, 'getGoalsForRoom');
    }

    /**
     * Get all participants in a room
     */
    async getParticipantsInRoom(roomId: UUID): Promise<Participant[]> {
        elizaLogger.debug('Getting participants in room', { roomId });
        return this.withDatabase(async (client) => {
            const { rows } = await client.query<Participant>(
                'SELECT p.* FROM participants p JOIN room_participants rp ON p.id = rp."participantId" WHERE rp."roomId" = $1',
                [roomId]
            );
            return rows;
        }, 'getParticipantsInRoom');
    }

    /**
     * Add a participant to a room
     */
    async addParticipantToRoom(roomId: UUID, participantId: UUID): Promise<void> {
        elizaLogger.debug('Adding participant to room', { roomId, participantId });
        await this.withDatabase(async (client) => {
            await client.query(
                'INSERT INTO room_participants ("roomId", "participantId") VALUES ($1, $2) ON CONFLICT DO NOTHING',
                [roomId, participantId]
            );
        }, 'addParticipantToRoom');
    }

    /**
     * Remove a participant from a room
     */
    async removeParticipantFromRoom(roomId: UUID, participantId: UUID): Promise<void> {
        elizaLogger.debug('Removing participant from room', { roomId, participantId });
        await this.withDatabase(async (client) => {
            await client.query(
                'DELETE FROM room_participants WHERE "roomId" = $1 AND "participantId" = $2',
                [roomId, participantId]
            );
        }, 'removeParticipantFromRoom');
    }

    /**
     * Get all rooms for a participant
     */
    async getRoomsForParticipant(participantId: UUID): Promise<UUID[]> {
        elizaLogger.debug('Getting rooms for participant', { participantId });
        return this.withDatabase(async (client) => {
            const { rows } = await client.query<{ id: UUID }>(
                'SELECT r.id FROM rooms r JOIN room_participants rp ON r.id = rp."roomId" WHERE rp."participantId" = $1',
                [participantId]
            );
            return rows.map(row => row.id);
        }, 'getRoomsForParticipant');
    }

    /**
     * Search memories by embedding vector similarity
     * @param embedding The embedding vector to search with
     * @param params Search parameters including thresholds and filters
     */
    async searchMemoriesByEmbedding(
        embedding: number[],
        params: {
            match_threshold?: number;
            count?: number;
            roomId?: UUID;
            agentId?: UUID;
            unique?: boolean;
            tableName: string;
        }
    ): Promise<Memory[]> {
        elizaLogger.debug('Searching memories by embedding', { ...params, embedding: '[TRUNCATED]' });
        return this.withDatabase(async (client) => {
            const threshold = params.match_threshold || 0.3;
            const limit = params.count || 10;

            let query = format(
                'WITH ranked_memories AS (' +
                '  SELECT *, embedding <-> $1 as distance ' +
                '  FROM %I ' +
                '  WHERE ($2::uuid IS NULL OR "roomId" = $2) ' +
                '    AND ($3::uuid IS NULL OR "agentId" = $3) ' +
                ') ' +
                'SELECT * FROM ranked_memories ' +
                'WHERE distance < $4 ' +
                'ORDER BY distance ASC ' +
                'LIMIT $5',
                params.tableName
            );

            const { rows } = await client.query<Memory & { distance: number }>(
                query,
                [
                    embedding,
                    params.roomId || null,
                    params.agentId || null,
                    threshold,
                    limit
                ]
            );

            elizaLogger.debug('Memory search results', {
                count: rows.length,
                threshold,
                minDistance: rows[0]?.distance,
                maxDistance: rows[rows.length - 1]?.distance
            });

            return rows.map(row => {
                const { distance, ...memory } = row;
                return memory;
            });
        }, 'searchMemoriesByEmbedding');
    }

    /**
     * Remove all memories for a specific room and table
     */
    async removeAllMemories(roomId: UUID, tableName: string): Promise<void> {
        elizaLogger.debug('Removing all memories', { roomId, tableName });
        await this.withDatabase(async (client) => {
            await client.query(
                format('DELETE FROM %I WHERE "roomId" = $1', tableName),
                [roomId]
            );
        }, 'removeAllMemories');
    }

    /**
     * Count memories
     */
    async countMemories(roomId: UUID, unique?: boolean, tableName: string = 'memories'): Promise<number> {
        elizaLogger.debug('Counting memories', { roomId, unique, tableName });
        return this.withDatabase(async (client) => {
            let query = format('SELECT COUNT(*) as count FROM %I WHERE "roomId" = $1', tableName);
            const values = [roomId];

            if (unique) {
                query += ' AND unique = true';
            }

            const { rows } = await client.query(query, values);
            return parseInt(rows[0].count);
        }, 'countMemories');
    }

    /**
     * Get all goals
     */
    async getGoals(): Promise<Goal[]> {
        elizaLogger.debug('Getting all goals');
        return this.withDatabase(async (client) => {
            const { rows } = await client.query<Goal>('SELECT * FROM goals');
            return rows;
        }, 'getGoals');
    }
}
