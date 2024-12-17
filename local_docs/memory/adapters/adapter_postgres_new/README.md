# PostgreSQL Adapter for Eliza

This is an enhanced PostgreSQL adapter for the Eliza framework, featuring improved stability, performance optimizations, and comprehensive testing.

## Features

- Full PostgreSQL support with pgvector for vector similarity search
- Optimized query performance with proper indexing
- Comprehensive error handling and logging
- Transaction support for data consistency
- Connection pooling for better resource management
- Support for vector embeddings with configurable dimensions
- Automatic schema initialization and migration

## Installation

```bash
npm install @ai16z/adapter-postgres-next
```

## Quick Start

1. Start the PostgreSQL database using Docker:

```bash
docker-compose up -d
```

2. Use the adapter in your Eliza application:

```typescript
import { PostgresDatabaseAdapter } from '@ai16z/adapter-postgres-next';

const adapter = new PostgresDatabaseAdapter({
    host: 'localhost',
    port: 5533,
    user: 'AI',
    password: 'AI',
    database: 'eliza_test'
});

await adapter.init();
```

## Development

### Prerequisites

- Docker and Docker Compose
- Node.js 16 or higher
- pnpm (recommended) or npm

### Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up the test database:
```bash
# Make the script executable
chmod +x scripts/setup_test_db.sh

# Run the setup script
./scripts/setup_test_db.sh
```

This script will:
- Start the PostgreSQL container
- Create necessary extensions
- Verify vector operations
- Prepare the database for testing

### Manual Database Verification

If you want to verify the database setup manually, you can use these commands:

1. Check if the container is running:
```bash
docker ps
```

2. Connect to the database:
```bash
docker exec -it adapter_postgres_new-postgres-1 psql -U AI -d eliza_test
```

3. Verify vector extension:
```sql
SELECT * FROM pg_extension WHERE extname = 'vector';
```

4. Test vector operations:
```sql
CREATE TABLE test_vectors (id serial primary key, embedding vector(3));
INSERT INTO test_vectors (embedding) VALUES ('[1,2,3]');
SELECT * FROM test_vectors;
```

### Running Tests

The test suite includes:

- Unit tests for all adapter operations
- Integration tests with a real PostgreSQL instance
- Vector similarity search tests
- Error handling tests

Run all tests:
```bash
pnpm test
```

Run specific test file:
```bash
pnpm test src/connection.test.ts
```

Run tests with coverage:
```bash
pnpm test:coverage
```

Watch mode for development:
```bash
pnpm test:watch
```

### Cleanup

To stop the database and clean up all data:

```bash
# Make the script executable
chmod +x scripts/cleanup.sh

# Run the cleanup script
./scripts/cleanup.sh
```

## Configuration

The adapter accepts all standard PostgreSQL connection options plus additional settings:

```typescript
interface PostgresConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    parseInputs?: boolean;  // Automatically parse JSON inputs
    // ... other pg.PoolConfig options
}
```

## Database Schema

The adapter manages several tables:

- `accounts`: User and agent accounts
- `rooms`: Chat rooms or conversation contexts
- `memories`: Vector-enabled memory storage
- `goals`: Task and objective tracking
- `logs`: System event logging
- `participants`: Room participation tracking
- `cache`: Temporary data storage

Key features of the schema:

- Vector similarity search using pgvector
- Automatic cleanup with CASCADE deletions
- Optimized indexes for common queries
- JSON/JSONB support for flexible data storage

## Performance Optimizations

1. Connection Pooling
   - Efficient connection reuse
   - Automatic connection management
   - Connection error handling

2. Query Optimization
   - Prepared statements
   - Proper indexing
   - Transaction management

3. Vector Search
   - HNSW index for fast similarity search
   - Configurable vector dimensions
   - Optimized distance calculations

## Error Handling

The adapter implements comprehensive error handling:

- Connection errors
- Query errors
- Transaction failures
- Data validation errors

All errors are properly logged using the Eliza logger.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Add tests for your changes
5. Run the test suite
6. Submit a pull request

## Troubleshooting

### Common Issues

1. **Container won't start**
   - Check if port 5533 is already in use
   - Verify Docker is running
   - Check Docker logs: `docker logs adapter_postgres_new-postgres-1`

2. **Vector operations fail**
   - Verify pgvector extension: `SELECT * FROM pg_extension WHERE extname = 'vector';`
   - Check vector dimensions match your configuration

3. **Connection issues**
   - Verify container is running: `docker ps`
   - Check connection settings match docker-compose.yml
   - Try connecting manually using psql

### Getting Help

If you encounter issues:

1. Check the troubleshooting steps above
2. Look for similar issues in the repository
3. Run the test database setup script with verbose output
4. Include relevant logs and error messages in bug reports

## License

MIT
