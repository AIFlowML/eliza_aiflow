#!/bin/bash

# Set default environment variables if not already set
export MODEL_PROVIDER=${MODEL_PROVIDER:-"openai"}
export EMBEDDING_MODEL=${EMBEDDING_MODEL:-"text-embedding-ada-002"}

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL environment variable is not set"
    exit 1
fi

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install @ai16z/adapter-postgres @ai16z/eliza glob yargs
fi

# Run the memory loading script
echo "Starting memory loading process..."
node "$SCRIPT_DIR/add_to_memory.js"

# Check the exit status
if [ $? -eq 0 ]; then
    echo "Memory loading completed successfully"
else
    echo "Memory loading failed"
    exit 1
fi
