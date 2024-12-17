# Eliza Installation Guide

This guide will help you set up the Eliza environment with the correct versions of Node.js, Python, and PostgreSQL.

## Prerequisites

- Linux/Ubuntu system
- Basic command line knowledge
- Git installed

## 1. System Dependencies

First, install required system packages:

```bash
# Install system dependencies
sudo apt-get update
sudo apt-get install -y \
    python3-dev \
    python3-pip \
    build-essential \
    gcc \
    libpq-dev \
    python3.11-dev  # Specific Python version dev package
```

## 2. Conda Environment Setup

Now set up the Python environment using Conda:

```bash
# If you get any conda activation errors, deactivate all environments first
conda deactivate  # Run this multiple times until you can't deactivate anymore

# Initialize conda
conda init bash

# Close and reopen your terminal, then create the environment
conda create -n eve-app python=3.11

# Activate the environment
conda activate eve-app

# Install required Python packages
conda install -c conda-forge numpy pandas pytest psycopg2-binary python-dotenv
pip install aiohttp  # Install aiohttp separately if conda install fails
```

## 2. Node.js Setup

We need Node.js version 23.3.0 for compatibility:

```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load nvm
source ~/.nvm/nvm.sh

# Install Node.js 23.3.0
nvm install 23.3.0

# Set as default
nvm alias default 23.3.0

# Use Node.js 23.3.0
nvm use 23.3.0

# Verify installation
node -v  # Should show v23.3.0
```

## 3. PostgreSQL Database Setup

Set up the PostgreSQL database with the required schema:

```bash
# Install PostgreSQL if not already installed
sudo apt update && sudo apt install -y postgresql postgresql-contrib

# Create user and database
sudo -u postgres psql -c "CREATE USER eve_ai WITH PASSWORD 'dest0lokitsct';"
sudo -u postgres createdb eve_ai
sudo -u postgres psql -c "ALTER DATABASE eve_ai OWNER TO eve_ai;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE eve_ai TO eve_ai;"

# Install vector extension and create schema
sudo -u postgres psql -d eve_ai -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Grant necessary permissions
sudo -u postgres psql -d eve_ai -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO eve_ai;"
sudo -u postgres psql -d eve_ai -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO eve_ai;"
```

## 4. Environment Configuration

Create a `.env` file in your project root:

```bash
# Postgres Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=eve_ai
DB_PASSWORD=dest0lokitsct
DB_NAME=eve_ai
```

## 5. Running the Application

After setting up everything, you can run the application:

```bash
# Install pnpm if not installed
npm install -g pnpm

# Setup pnpm global directory
pnpm setup
source ~/.bashrc  # or restart your terminal

# Install dependencies
pnpm install

# Install Vite locally in the project
pnpm add -D vite

# Build the packages
pnpm run build

# Start the agent
pnpm run start --characters="../characters/eve.character.json"
```

## Troubleshooting

### Conda Activation Issues
If you encounter conda activation errors:
1. Run `conda deactivate` multiple times until you can't deactivate anymore
2. Run `conda init bash`
3. Close and reopen your terminal
4. Try `conda activate eve-app` again

### Node.js Version Issues
If you get Node.js version warnings:
1. Verify nvm is installed: `command -v nvm`
2. Load nvm: `source ~/.nvm/nvm.sh`
3. Switch to correct version: `nvm use 23.3.0`

### Database Connection Issues
If you have database connection problems:
1. Verify PostgreSQL is running: `sudo systemctl status postgresql`
2. Check user permissions: `sudo -u postgres psql -c "\du"`
3. Test connection: `psql -U eve_ai -d eve_ai -h localhost`

### Build Issues
If you encounter build errors like "spawn ENOENT" with vite:
1. Make sure Vite is installed globally: `pnpm add -g vite`
2. Clean the build cache: `pnpm clean`
3. Reinstall dependencies: `pnpm install`
4. Try building again: `pnpm run build`

If issues persist, you can try building packages individually:
```bash
cd packages/adapter-sqljs && pnpm run build
cd ../adapter-supabase && pnpm run build
cd ../eliza-client && pnpm run build
```

### PNPM Global Installation Issues
If you encounter "Unable to find the global bin directory" error:
1. Run `pnpm setup` to create global directories
2. Run `source ~/.bashrc` or restart your terminal
3. Verify setup with `echo $PNPM_HOME`
4. Make sure `$PNPM_HOME` is in your PATH
5. For persistent setup, add to your `.bashrc`:
   ```bash
   export PNPM_HOME="/home/$(whoami)/.local/share/pnpm"
   export PATH="$PNPM_HOME:$PATH"
   ```

### Python Package Build Issues
If you encounter build errors with Python packages like aiohttp:
1. Make sure you have the system dependencies installed:
   ```bash
   sudo apt-get install python3-dev python3.11-dev build-essential gcc
   ```
2. Try installing the package with pip instead of conda:
   ```bash
   pip install aiohttp
   ```
3. If using conda, you can try:
   ```bash
   conda install -c conda-forge aiohttp
   ```
4. For specific "longintrepr.h" errors, ensure Python development headers are installed:
   ```bash
   sudo apt-get install python3.11-dev
   ```
