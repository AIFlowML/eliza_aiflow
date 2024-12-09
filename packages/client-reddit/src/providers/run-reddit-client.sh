#!/bin/bash

# Navigate to the package directory
cd "$(dirname "$0")"/../../

# Build the project
echo "🏗️  Building the project..."
pnpm run build

# Run get-refresh-token script
echo "🔑 Getting refresh token..."
pnpm run get-token

# Run test client (which uses reddit-client.provider)
echo "🚀 Running test client..."
pnpm run test-client

echo "✅ All done!" 