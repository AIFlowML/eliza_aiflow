#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${RED}Stopping PostgreSQL container...${NC}"
docker-compose down -v

echo -e "${GREEN}Cleanup completed successfully!${NC}"
