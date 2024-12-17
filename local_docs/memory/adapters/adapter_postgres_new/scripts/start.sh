#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Error: Docker is not running. Please start Docker first.${NC}"
        exit 1
    fi
}

# Function to check if port is available
check_port() {
    if lsof -Pi :5533 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${RED}Error: Port 5533 is already in use.${NC}"
        echo -e "You can either:"
        echo -e "1. Stop the process using port 5533"
        echo -e "2. Modify the port in docker-compose.yml"
        exit 1
    fi
}

# Main script
echo -e "${BLUE}=== PostgreSQL Adapter Setup ===${NC}"

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"
check_docker
check_port

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    pnpm install
fi

# Start PostgreSQL container
echo -e "${YELLOW}Starting PostgreSQL container...${NC}"
docker-compose up -d

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}Waiting for PostgreSQL to be ready...${NC}"
for i in {1..30}; do
    if docker exec adapter_postgres_new-postgres-1 pg_isready -U AI > /dev/null 2>&1; then
        break
    fi
    echo -n "."
    sleep 1
done
echo ""

# Create vector extension
echo -e "${YELLOW}Setting up database...${NC}"
docker exec adapter_postgres_new-postgres-1 psql -U AI -d eliza_test -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Verify vector extension
echo -e "${YELLOW}Verifying setup...${NC}"
if docker exec adapter_postgres_new-postgres-1 psql -U AI -d eliza_test -c "\dx vector;" | grep -q "vector"; then
    echo -e "${GREEN}Vector extension installed successfully!${NC}"
else
    echo -e "${RED}Failed to verify vector extension.${NC}"
    exit 1
fi

# Test vector operations
echo -e "${YELLOW}Testing vector operations...${NC}"
docker exec adapter_postgres_new-postgres-1 psql -U AI -d eliza_test -c "
DROP TABLE IF EXISTS test_vectors;
CREATE TABLE test_vectors (id serial primary key, embedding vector(3));
INSERT INTO test_vectors (embedding) VALUES ('[1,2,3]');
SELECT * FROM test_vectors;
"

echo -e "${GREEN}Setup completed successfully!${NC}"

# Show available commands
echo -e "\n${BLUE}=== Available Commands ===${NC}"
echo -e "Run tests:                    ${GREEN}pnpm test${NC}"
echo -e "Run specific test:            ${GREEN}pnpm test src/connection.test.ts${NC}"
echo -e "Run tests with coverage:      ${GREEN}pnpm test:coverage${NC}"
echo -e "Stop and cleanup:             ${GREEN}./scripts/cleanup.sh${NC}"
echo -e "Connect to database:          ${GREEN}docker exec -it adapter_postgres_new-postgres-1 psql -U AI -d eliza_test${NC}"

# Monitor container logs
echo -e "\n${YELLOW}Showing container logs (press Ctrl+C to exit)...${NC}"
docker logs -f adapter_postgres_new-postgres-1
