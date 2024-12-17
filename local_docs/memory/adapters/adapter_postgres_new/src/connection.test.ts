import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Pool } from 'pg';

describe('PostgreSQL Connection Tests', () => {
    let pool: Pool;

    beforeAll(() => {
        pool = new Pool({
            host: 'localhost',
            port: 5533,
            user: 'AI',
            password: 'AI',
            database: 'eliza_test'
        });
    });

    afterAll(async () => {
        await pool.end();
    });

    it('should connect to PostgreSQL', async () => {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT NOW()');
            expect(result.rows).toHaveLength(1);
            expect(result.rows[0]).toHaveProperty('now');
        } finally {
            client.release();
        }
    });

    it('should create and query a test table', async () => {
        const client = await pool.connect();
        try {
            // Create a test table
            await client.query(`
                CREATE TABLE IF NOT EXISTS test_table (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Insert test data
            const insertResult = await client.query(
                'INSERT INTO test_table (name) VALUES ($1) RETURNING *',
                ['Test Entry']
            );
            expect(insertResult.rows[0].name).toBe('Test Entry');

            // Query the data
            const queryResult = await client.query(
                'SELECT * FROM test_table WHERE name = $1',
                ['Test Entry']
            );
            expect(queryResult.rows).toHaveLength(1);
            expect(queryResult.rows[0].name).toBe('Test Entry');

            // Clean up
            await client.query('DROP TABLE test_table');
        } finally {
            client.release();
        }
    });

    it('should handle vector operations', async () => {
        const client = await pool.connect();
        try {
            // Verify pgvector extension
            const extensionResult = await client.query(`
                SELECT EXISTS (
                    SELECT 1 FROM pg_extension WHERE extname = 'vector'
                );
            `);
            expect(extensionResult.rows[0].exists).toBe(true);

            // Create a test table with vector column
            await client.query(`
                CREATE TABLE IF NOT EXISTS vector_test (
                    id SERIAL PRIMARY KEY,
                    embedding vector(3)
                )
            `);

            // Insert a test vector
            const testVector = [1.0, 2.0, 3.0];
            const insertResult = await client.query(
                'INSERT INTO vector_test (embedding) VALUES ($1) RETURNING *',
                [testVector]
            );
            expect(insertResult.rows).toHaveLength(1);

            // Query using vector operations
            const queryResult = await client.query(`
                SELECT * FROM vector_test
                ORDER BY embedding <-> $1
                LIMIT 1
            `, [[1.0, 2.0, 3.0]]);
            
            expect(queryResult.rows).toHaveLength(1);

            // Clean up
            await client.query('DROP TABLE vector_test');
        } finally {
            client.release();
        }
    });

    it('should handle concurrent connections', async () => {
        const numQueries = 5;
        const queries = Array(numQueries).fill(0).map(async () => {
            const client = await pool.connect();
            try {
                const result = await client.query('SELECT NOW()');
                return result.rows[0];
            } finally {
                client.release();
            }
        });

        const results = await Promise.all(queries);
        expect(results).toHaveLength(numQueries);
        results.forEach(row => {
            expect(row).toHaveProperty('now');
        });
    });
});
