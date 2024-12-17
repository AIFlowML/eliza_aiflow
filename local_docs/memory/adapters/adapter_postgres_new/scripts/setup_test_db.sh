#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting PostgreSQL container...${NC}"
docker-compose up -d

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}Waiting for PostgreSQL to be ready...${NC}"
sleep 5

# Create vector extension
echo -e "${YELLOW}Creating vector extension...${NC}"
docker exec adapter_postgres_new-postgres-1 psql -U AI -d eliza_test -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Verify vector extension
echo -e "${YELLOW}Verifying vector extension...${NC}"
docker exec adapter_postgres_new-postgres-1 psql -U AI -d eliza_test -c "SELECT * FROM pg_extension WHERE extname = 'vector';"

# Test vector operations
echo -e "${YELLOW}Testing vector operations...${NC}"
docker exec adapter_postgres_new-postgres-1 psql -U AI -d eliza_test -c "
DROP TABLE IF EXISTS test_vectors;
CREATE TABLE test_vectors (id serial primary key, embedding vector(3));
INSERT INTO test_vectors (embedding) VALUES ('[1,2,3]');
SELECT * FROM test_vectors;
"

echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${GREEN}You can now run 'pnpm test' to execute the test suite.${NC}"
