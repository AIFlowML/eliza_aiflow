#!/bin/bash

# Exit on error
set -e

# Check for required environment variables
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL environment variable is not set"
    exit 1
fi

if [ -z "$MODEL_PROVIDER" ]; then
    echo "Warning: MODEL_PROVIDER not set, using default (openai)"
fi

if [ -z "$EMBEDDING_MODEL" ]; then
    echo "Warning: EMBEDDING_MODEL not set, using default (text-embedding-ada-002)"
fi

# Create output directory if it doesn't exist
mkdir -p json

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run the memory dump script
echo "Starting memory dump..."
node dump_from_memory.js

echo "Memory dump completed. Check the json directory for output files."
