# Eliza AI Flow Development Commands

## Project Setup and Build Commands

### Clean Project
```bash
# Clean all builds and node_modules
cd /Users/ilessio/dev-agents/gaia_local/eliza_aiflow # or your local folder
rm -rf node_modules && rm -rf packages/*/node_modules && rm -rf packages/*/dist && rm -rf agent/node_modules && rm -rf agent/dist
```

### Install and Build
```bash
# Full rebuild (after cleaning)
pnpm install && pnpm -r run build

# Quick rebuild (without cleaning)
pnpm run build
```

## Development Server Commands

### Start Development Server with Characters

```bash
# Start with single character (Director)
pnpm dev --characters="../characters/eve.character.json"

# Start with core team (Director + Submission)
pnpm dev --characters="../characters/director.character.json,../characters/submission.character.json"

# Start with full grant system team
pnpm dev --characters="../characters/director.character.json,../characters/submission.character.json,../characters/evaluation.character.json,../characters/milestone.character.json,../characters/distribution.character.json"
```

## Git Repository Management

### Initial Setup
```bash
# Check current remotes
git remote -v

# Add private repository
git remote add private git@github.com:AIFlowML/gaia_hack_grant.git

# Add upstream repository (if needed)
git remote add upstream git@github.com:ai16z/eliza.git
```

### Current Remote Configuration
```bash
origin    git@github.com:AIFlowML/eliza_aiflow.git (public fork for PRs)
private   git@github.com:AIFlowML/gaia_hack_grant.git (private development)
upstream  git@github.com:ai16z/eliza.git (original repository)
```

### Development Workflow

#### Working with Private Repository
```bash
# Push to private repo (main branch)
git push private main

# Push all branches to private
git push --all private
```

#### Working with Public Fork
```bash
# Push to public fork for PRs
git push origin gaia-hackathon

# Create new feature branch
git checkout -b feature/new-feature
git push origin feature/new-feature
```

## Access Points

- Client UI: http://localhost:5173
- Agent Service: http://localhost:7998

## Common Development Tasks

### Rebuild Specific Packages
```bash
# Build core package
cd packages/core && pnpm run build

# Build client
cd client && pnpm run build

# Build agent
cd agent && pnpm run build
```

### Troubleshooting Commands
```bash
# Clean and rebuild everything
pnpm run clean && pnpm install && pnpm run build

# Check git status
git status

# Verify character files
git ls-tree -r HEAD --name-only | grep "character.json"
```

## Notes
- Always push sensitive files (like character configurations) to the private repository only
- Use the public fork for submitting PRs to the main project
- Keep the gaia-hackathon branch in sync with the private main branch

## Development Commands

### Start Development Server
```bash
# Start the development server with Eve character
pnpm run start --characters="../characters/eve.character.json"

# Build and start the server with Eve character
pnpm run build && pnpm run start --characters="../characters/eve.character.json"
```

### Build Commands

```bash
# Build specific packages in sequence
# Note: Use this when you need to rebuild core, client-reddit, and agent
cd /Users/ilessio/dev-agents/eliza_aiflow && \
cd packages/core && pnpm run build && \
cd ../client-reddit && pnpm run build && \
cd ../../agent && pnpm run build
```

### Clean and Rebuild Commands

```bash
# Clean all node_modules and dist folders
# Note: Use this when you need a fresh start
cd /Users/ilessio/dev-agents/eliza_aiflow && \
rm -rf node_modules && \
rm -rf packages/*/node_modules && \
rm -rf packages/*/dist

# Full rebuild after cleaning
# Note: Use this to reinstall dependencies and rebuild all packages
cd /Users/ilessio/dev-agents/eliza_aiflow && \
pnpm install && pnpm -r run build

# Quick rebuild (without cleaning)
# Note: Use this for regular rebuilds during development
cd /Users/ilessio/dev-agents/eliza_aiflow && pnpm run build

# Clean and rebuild in one command
# Note: Use this for a complete reset and rebuild
cd /Users/ilessio/dev-agents/eliza_aiflow && \
rm -rf node_modules && \
rm -rf packages/*/node_modules && \
rm -rf packages/*/dist && \
rm -rf agent/node_modules && \
rm -rf agent/dist && \
pnpm install && pnpm -r run build

# Alternative clean and rebuild using npm scripts
# Note: Use this if you prefer using predefined scripts
pnpm run clean && pnpm install && pnpm run build
```

### Development Tools

```bash
# Ngrok
# Note: Used for exposing local server to the internet
# TODO: Add specific ngrok command configuration

### Token Management
# Location of token refresh logic
# Path: /Users/ilessio/dev-agents/eliza_aiflow/packages/client-reddit/src/providers/get-refresh-token.ts
```

Note: Replace `/Users/ilessio/dev-agents/eliza_aiflow` with your actual project path when using these commands.