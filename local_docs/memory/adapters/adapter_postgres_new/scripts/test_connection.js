import pg from 'pg';
const { Pool } = pg;

// Configuration
const config = {
    host: 'localhost',
    port: 5533,
    user: 'AI',
    password: 'AI',
    database: 'eliza_test',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
};

// Colors for console output
const colors = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

async function runTests() {
    const pool = new Pool(config);
    console.log(`${colors.blue}Starting PostgreSQL connection tests...${colors.reset}\n`);

    try {
        // Test 1: Basic Connection
        console.log(`${colors.yellow}Test 1: Testing basic connection...${colors.reset}`);
        const client = await pool.connect();
        console.log(`${colors.green}✓ Successfully connected to PostgreSQL${colors.reset}\n`);

        // Test 2: Vector Extension
        console.log(`${colors.yellow}Test 2: Checking vector extension...${colors.reset}`);
        const extensionResult = await client.query(
            "SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector')"
        );
        if (extensionResult.rows[0].exists) {
            console.log(`${colors.green}✓ Vector extension is installed${colors.reset}\n`);
        } else {
            throw new Error('Vector extension is not installed');
        }

        // Test 3: Create Test Table with UUID
        console.log(`${colors.yellow}Test 3: Creating test table with vector column...${colors.reset}`);
        await client.query(`
            DROP TABLE IF EXISTS js_test_vectors;
            CREATE TABLE js_test_vectors (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT,
                embedding vector(384),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log(`${colors.green}✓ Test table created successfully${colors.reset}\n`);

        // Test 4: Insert Vector Data
        console.log(`${colors.yellow}Test 4: Inserting test vectors...${colors.reset}`);
        // Create a test vector and format it for PostgreSQL
        const testVector = Array(384).fill(0).map((_, i) => i / 384);
        const vectorString = `[${testVector.join(',')}]`;
        
        await client.query(`
            INSERT INTO js_test_vectors (name, embedding) 
            VALUES ($1, $2::vector)
        `, ['test_entry', vectorString]);
        console.log(`${colors.green}✓ Test vector inserted successfully${colors.reset}\n`);

        // Test 5: Vector Similarity Search
        console.log(`${colors.yellow}Test 5: Testing vector similarity search...${colors.reset}`);
        const searchResult = await client.query(`
            SELECT name, embedding <-> $1::vector as distance
            FROM js_test_vectors
            ORDER BY distance
            LIMIT 2
        `, [vectorString]);
        console.log(`${colors.green}✓ Vector similarity search successful${colors.reset}`);
        console.log('Results:');
        searchResult.rows.forEach(row => {
            console.log(`  - Name: ${row.name}, Distance: ${row.distance}`);
        });
        console.log();

        // Test 6: Test Pool Concurrency
        console.log(`${colors.yellow}Test 6: Testing connection pool...${colors.reset}`);
        const concurrentQueries = Array(10).fill(0).map(() => 
            pool.query('SELECT NOW()')
        );
        await Promise.all(concurrentQueries);
        console.log(`${colors.green}✓ Connection pool handling concurrent queries successfully${colors.reset}\n`);

        // Test 7: Clean Up
        console.log(`${colors.yellow}Test 7: Cleaning up...${colors.reset}`);
        await client.query('DROP TABLE js_test_vectors');
        console.log(`${colors.green}✓ Cleanup successful${colors.reset}\n`);

        // Final status
        console.log(`${colors.green}All tests completed successfully! 🎉${colors.reset}`);

    } catch (error) {
        console.error(`${colors.red}Error during testing:${colors.reset}`, error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run the tests
runTests().catch(console.error);
