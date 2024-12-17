# Eliza Installation Script

This installation script provides a robust solution for installing and building Eliza packages, handling common issues with npm registries and package downloads.

## Features

- Multi-source package downloads (CDN and Registry fallbacks)
- Automatic mirror switching for failed downloads
- Intelligent handling of 304 and 404 errors
- Package-specific source handling
- Detailed logging and error reporting
- Cross-platform support (Linux and MacOS)

## Prerequisites

- Bash 4.0 or higher
- Node.js 23.3.0 or higher
- curl
- System build tools (build-essential on Linux, xcode-select on MacOS)

## Usage

### Basic Installation

```bash
./install_and_build.sh

```

## Package Testing

### Setting Up missing_packages.txt

The `missing_packages.txt` file is used to test specific packages against different mirrors. Create this file in the `scripts/Eliza_Installation` directory.

#### File Format
- One package per line
- Use the format `packagename@version`
- No spaces or extra characters

Example `missing_packages.txt`:
```txt
protobufjs@7.4.0
eventemitter2@5.0.1
fs-constants@1.0.0
cssesc@3.0.0
buffer-alloc-unsafe@1.1.0
```

#### How to Populate

1. From Failed Installations:
   - Check the installation logs for 404 or 304 errors
   - Extract the package names and versions from error messages
   - Add them to `missing_packages.txt`

2. From pnpm Debug Logs:
   ```bash
   # Extract failed packages from pnpm debug log
   grep "ERR_PNPM_FETCH" pnpm-debug.log | grep -o '[^/]*@[0-9]*\.[0-9]*\.[0-9]*' >> missing_packages.txt
   ```

3. Manually from Error Messages:
   When you see errors like:
   ```
   ERR_PNPM_FETCH_404 GET https://registry.npmjs.org/protobufjs/-/protobufjs-7.4.0.tgz
   ```
   Add to missing_packages.txt:
   ```
   protobufjs@7.4.0
   ```

### Testing Mirrors

After populating `missing_packages.txt`, run the test script:
```bash
./test_mirror.sh
# or explicitly specify the file
./test_mirror.sh missing_packages.txt
```

The script will:
1. Read packages from the file
2. Test each package against all configured mirrors
3. Provide a success rate for each mirror
4. Help identify the most reliable mirror for your packages

### Using Test Results

Based on the test results:
1. Choose the mirror with the highest success rate
2. Update the registry configuration in `install_and_build.sh`
3. Retry the installation with the optimal mirror

Example test output:
```
=== Summary ===

Registry Success Rates:
https://mirrors.cloud.tencent.com/npm
Success: 4 Failure: 0 Rate: 100%

https://registry.npmjs.org
Success: 1 Failure: 3 Rate: 25%

https://registry.npmmirror.com
Success: 2 Failure: 2 Rate: 50%
```

## Extra Utility Scripts

The `extra` directory contains additional utility scripts to help with common setup and maintenance tasks.

### Environment Cleanup and Setup

`cleanup_and_setup.sh` provides a fresh start by cleaning the environment and reinstalling dependencies:

```bash
./extra/cleanup_and_setup.sh
```

Features:
- Removes all node_modules directories
- Cleans lock files (pnpm-lock.yaml, package-lock.json, yarn.lock)
- Sets proper directory permissions
- Reinstalls pnpm globally
- Cleans pnpm store and cache
- Performs fresh installation with correct permissions

Use this script when:
- Experiencing permission issues
- Need to clean up corrupted installations
- Want to ensure a fresh start

### Database Installation

`database_install.sh` sets up the PostgreSQL database with the required schema:

```bash
./extra/database_install.sh
```

Features:
- Creates database user and database
- Installs vector extension
- Sets up complete schema including:
  - accounts table
  - rooms table
  - participants table
  - memories table with vector support
  - relationships table
  - goals table
- Configures proper permissions and constraints

Prerequisites:
- PostgreSQL installed and running
- Sudo access for database operations

### Project Structure Fix

`fix_structure.sh` ensures correct project directory structure:

```bash
./extra/fix_structure.sh
```

Features:
- Creates necessary project directories
- Sets up client directory structure
- Validates package.json configuration

Use this script when:
- Setting up a new project
- Fixing missing directories
- Validating project structure
