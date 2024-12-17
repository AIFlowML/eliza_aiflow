#!/bin/bash

# Set error handling
set -e
set -o pipefail

# Script configuration
WORKSPACE_ROOT="/mnt/LLM/eve_predict"
INSTALL_DIR="${WORKSPACE_ROOT}/scripts/Eliza_Installation"
PACKAGES_DIR="${WORKSPACE_ROOT}/packages"
LOG_DIR="${INSTALL_DIR}/logs"
LOG_FILE="${LOG_DIR}/installation.log"
ERROR_LOG="${LOG_DIR}/installation_errors.log"
DEBUG_LOG="${LOG_DIR}/debug.log"
CONFIG_DIR="${INSTALL_DIR}/config"
TEMP_DIR="${INSTALL_DIR}/temp"
CACHE_DIR="${INSTALL_DIR}/cache"
MAX_RETRIES=3
RETRY_DELAY=10
REQUIRED_NODE_VERSION="23.3.0"
INSTALL_TIMEOUT=300  # 5 minutes timeout for installations

# Console colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Pretty logging functions
function log_message() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case "$level" in
        "INFO")
            echo -e "${BLUE}[${timestamp}] ℹ️  ${CYAN}${message}${NC}" | tee -a "$LOG_FILE"
            ;;
        "SUCCESS")
            echo -e "${BLUE}[${timestamp}] ������� ${GREEN}${message}${NC}" | tee -a "$LOG_FILE"
            ;;
        "WARN")
            echo -e "${BLUE}[${timestamp}] ⚠️  ${YELLOW}${message}${NC}" | tee -a "$LOG_FILE"
            ;;
        "ERROR")
            echo -e "${BLUE}[${timestamp}] ❌ ${RED}${message}${NC}" | tee -a "$LOG_FILE"
            echo -e "${BLUE}[${timestamp}] ${RED}${message}${NC}" >> "$ERROR_LOG"
            ;;
        "DEBUG")
            echo -e "${BLUE}[${timestamp}] 🔍 ${CYAN}${message}${NC}" >> "$DEBUG_LOG"
            ;;
    esac
}

# Function to print section headers
function print_section() {
    local title=$1
    echo -e "\n${BLUE}=== ${BOLD}${title}${NC} ${BLUE}===${NC}"
}

# Function to print progress
function print_progress() {
    local current=$1
    local total=$2
    local message=$3
    local percentage=$((current * 100 / total))
    local filled=$((percentage / 2))
    local unfilled=$((50 - filled))
    
    printf "${BLUE}[${timestamp}] ${CYAN}Progress: ["
    printf "%${filled}s" | tr ' ' '█'
    printf "%${unfilled}s" | tr ' ' '.'
    printf "] ${percentage}%% ${message}${NC}\r"
}

# Create necessary directories
mkdir -p "$LOG_DIR" "$CONFIG_DIR" "$TEMP_DIR" "$CACHE_DIR"

# Platform detection and configuration
PLATFORM="unknown"
if [[ "$OSTYPE" == "darwin"* ]]; then
    PLATFORM="macos"
    PNPM_STORE_PATH="$HOME/Library/pnpm/store/v3"
    PLATFORM_DEPS=("xcode-select" "pkg-config" "python3")
elif [[ "$OSTYPE" == "linux"* ]]; then
    PLATFORM="linux"
    PNPM_STORE_PATH="${INSTALL_DIR}/pnpm-store"  # Localized pnpm store
    PLATFORM_DEPS=("build-essential" "python3" "make" "g++" "pkg-config" "python3-dev")
fi

# Initialize log files with installation info
cat > "$LOG_FILE" << EOL
=== Eliza Installation Log ===
Started at: $(date)
Platform: $PLATFORM
Node Version Required: $REQUIRED_NODE_VERSION
Workspace: $WORKSPACE_ROOT
Installation Directory: $INSTALL_DIR
=========================
EOL

cat > "$ERROR_LOG" << EOL
=== Eliza Installation Error Log ===
Started at: $(date)
Platform: $PLATFORM
=========================
EOL

cat > "$DEBUG_LOG" << EOL
=== Eliza Installation Debug Log ===
Started at: $(date)
Platform: $PLATFORM
Configuration:
- PNPM Store: $PNPM_STORE_PATH
- Temp Directory: $TEMP_DIR
- Config Directory: $CONFIG_DIR
=========================
EOL

# Function to check if a package is installed
check_package() {
    local pkg=$1
    dpkg-query -W -f='${Status}' "$pkg" 2>/dev/null | grep -q "ok installed"
}

# Function to check system requirements
check_system_requirements() {
    log_message "INFO" "Checking system requirements..."
    
    # Check available memory
    local mem_available=$(free -m | awk '/^Mem:/{print $7}')
    if [ "$mem_available" -lt 2048 ]; then
        log_message "ERROR" "Insufficient memory available: ${mem_available}MB (minimum 2GB required)"
        exit 1
    fi
    
    # Check disk space
    local disk_space=$(df -m "$WORKSPACE_ROOT" | awk 'NR==2 {print $4}')
    if [ "$disk_space" -lt 5120 ]; then
        log_message "ERROR" "Insufficient disk space: ${disk_space}MB (minimum 5GB required)"
        exit 1
    fi
    
    # Check for required system packages
    if [ "$PLATFORM" = "linux" ]; then
        local missing_packages=()
        for pkg in "${PLATFORM_DEPS[@]}"; do
            if ! check_package "$pkg"; then
                missing_packages+=("$pkg")
            fi
        done
        
        if [ ${#missing_packages[@]} -gt 0 ]; then
            log_message "ERROR" "Required packages not installed: ${missing_packages[*]}"
            log_message "INFO" "Please install using: sudo apt-get install ${missing_packages[*]}"
            exit 1
        else
            log_message "INFO" "All required system packages are installed"
        fi
    fi
}

# Function to check Node.js version with timeout
check_node_version() {
    log_message "INFO" "Checking Node.js version..."
    
    if ! command -v node &> /dev/null; then
        log_message "ERROR" "Node.js is not installed"
        if [ "$PLATFORM" = "linux" ]; then
            log_message "INFO" "Installing Node.js using n..."
            # Install n version manager if not present
            if ! command -v n &> /dev/null; then
                curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n
                bash n lts
                # Add n to PATH
                export N_PREFIX="$HOME/n"
                export PATH="$N_PREFIX/bin:$PATH"
            fi
            timeout 300 n "$REQUIRED_NODE_VERSION" || {
                log_message "ERROR" "Node.js installation timed out"
                exit 1
            }
        else
            log_message "ERROR" "Please install Node.js version $REQUIRED_NODE_VERSION"
            exit 1
        fi
    fi
    
    local current_version=$(node -v | cut -d 'v' -f 2)
    if [ "$current_version" != "$REQUIRED_NODE_VERSION" ]; then
        log_message "WARN" "Node.js version mismatch. Required: $REQUIRED_NODE_VERSION, Current: $current_version"
        if [ "$PLATFORM" = "linux" ]; then
            log_message "INFO" "Installing correct Node.js version..."
            timeout 300 n "$REQUIRED_NODE_VERSION" || {
                log_message "ERROR" "Node.js version update timed out"
                exit 1
            }
        else
            log_message "ERROR" "Please install Node.js version $REQUIRED_NODE_VERSION"
            exit 1
        fi
    fi
}

# Function to setup pnpm with timeout
setup_pnpm() {
    log_message "INFO" "Setting up pnpm..."
    
    # Install or update pnpm with timeout
    if ! command -v pnpm &> /dev/null; then
        log_message "INFO" "Installing pnpm..."
        timeout 300 npm install -g pnpm@9.14.4 || {
            log_message "ERROR" "pnpm installation timed out"
            exit 1
        }
    else
        local pnpm_version=$(pnpm -v)
        if [ "$pnpm_version" != "9.14.4" ]; then
            log_message "INFO" "Updating pnpm to 9.14.4..."
            timeout 300 npm install -g pnpm@9.14.4 || {
                log_message "ERROR" "pnpm update timed out"
                exit 1
            }
        fi
    fi
    
    # Configure pnpm with Tencent mirror
    log_message "DEBUG" "Configuring pnpm..."
    
    # Force Tencent mirror configuration
    local mirror="https://mirrors.cloud.tencent.com/npm"
    
    # Set both global and project-level configurations
    pnpm config set registry "$mirror" -g
    pnpm config set registry "$mirror"
    
    # Create or update .npmrc in workspace root
    cat > "$WORKSPACE_ROOT/.npmrc" << EOL
registry=$mirror
strict-peer-dependencies=false
auto-install-peers=true
node-linker=hoisted
store-dir=$PNPM_STORE_PATH
shamefully-hoist=true
network-timeout=100000
fetch-retries=5
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
EOL
    
    # Also set npm registry to ensure consistency
    npm config set registry "$mirror"
    
    # Additional pnpm settings
    pnpm config set store-dir "$PNPM_STORE_PATH"
    pnpm config set shamefully-hoist true
    pnpm config set strict-peer-dependencies false
    pnpm config set network-timeout 100000
    pnpm config set fetch-retries 5
    pnpm config set fetch-retry-mintimeout 20000
    pnpm config set fetch-retry-maxtimeout 120000
}

# Function to clean installation
clean_installation() {
    log_message "INFO" "Cleaning previous installation..."
    
    # Remove node_modules and lock files
    find "$WORKSPACE_ROOT" -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
    find "$WORKSPACE_ROOT" -name ".pnpm" -type d -exec rm -rf {} + 2>/dev/null || true
    rm -f "$WORKSPACE_ROOT/pnpm-lock.yaml"
    
    # Clean pnpm store
    if [ -d "$PNPM_STORE_PATH" ]; then
        log_message "INFO" "Cleaning pnpm store..."
        timeout 300 pnpm store prune || {
            log_message "WARN" "pnpm store prune timed out, continuing anyway"
        }
    fi
    
    # Clean installation specific directories
    rm -rf "${TEMP_DIR:?}"/* 2>/dev/null || true
    rm -rf "${CACHE_DIR:?}"/* 2>/dev/null || true
    mkdir -p "$TEMP_DIR" "$CACHE_DIR"
    
    # Clear npm cache
    log_message "INFO" "Clearing npm cache..."
    npm cache clean --force || log_message "WARN" "Failed to clean npm cache"
}

# Check for associative array support
if [ "${BASH_VERSION%%.*}" -lt 4 ]; then
    log_message "ERROR" "This script requires Bash version 4 or higher for associative array support"
    log_message "INFO" "Current Bash version: $BASH_VERSION"
    exit 1
fi

# Function to test mirror availability
function test_mirror() {
    local mirror=$1
    local test_url="${mirror}/react"
    
    if curl -s --connect-timeout 5 -I "$test_url" >/dev/null 2>&1; then
        log_message "DEBUG" "Mirror $mirror is responsive"
        return 0
    fi
    return 1
}

# Function to get best working registry
function get_best_registry() {
    # Prioritize Tencent mirror as it works best for our packages
    local registries=(
        "https://mirrors.cloud.tencent.com/npm"  # Primary choice
        "https://registry.npmmirror.com"
        "https://registry.npmjs.org"
        "https://mirrors.huaweicloud.com/repository/npm"
    )
    
    # Return only the URL, no debug messages
    for registry in "${registries[@]}"; do
        if curl -s --connect-timeout 5 -I "$registry" >/dev/null 2>&1; then
            echo "$registry"
            return 0
        fi
    done
    
    # If all fail, return Tencent mirror as fallback
    echo "https://mirrors.cloud.tencent.com/npm"
}

# Function to switch registry on 304 errors
function switch_registry_on_304() {
    local current_registry=$1
    local registries=(
        "https://registry.npmjs.org"
        "https://registry.npmmirror.com"
        "https://mirrors.cloud.tencent.com/npm"
        "https://mirrors.huaweicloud.com/repository/npm"
    )
    
    for registry in "${registries[@]}"; do
        if [ "$registry" != "$current_registry" ] && curl -s --connect-timeout 5 -I "$registry" >/dev/null 2>&1; then
            echo "$registry"
            return 0
        fi
    done
    
    return 1
}

# Function to download package with fallback
function download_package() {
    local package=$1
    local version=$2
    local temp_dir=$3
    local success=0
    
    local cdns=(
        "https://cdn.jsdelivr.net/npm"
        "https://unpkg.com"
        "https://npm.elemecdn.com"
    )
    
    # Try CDNs first
    for cdn in "${cdns[@]}"; do
        log_message "DEBUG" "Trying CDN: $cdn"
        
        local file_paths=(
            "index.js"
            "dist/index.js"
            "${package}.js"
        )
        
        for path in "${file_paths[@]}"; do
            local url="${cdn}/${package}@${version}/${path}"
            local target="${temp_dir}/${path##*/}"
            mkdir -p "$(dirname "$target")"
            
            if curl -sL --connect-timeout 10 --max-time 30 --retry 3 \
                -H "Cache-Control: no-cache" \
                -o "$target" "$url" && [ -s "$target" ]; then
                log_message "SUCCESS" "Downloaded from CDN: $url"
                return 0
            fi
        done
    done
    
    # Fallback to registry
    local registry=$(get_best_registry)
    local tarball_url="${registry}/${package}/-/${package}-${version}.tgz"
    local target="${temp_dir}/${package}-${version}.tgz"
    
    if curl -sL --connect-timeout 10 --max-time 30 --retry 3 \
        -H "Cache-Control: no-cache" \
        -o "$target" "$tarball_url" && [ -s "$target" ]; then
        log_message "SUCCESS" "Downloaded from registry: $tarball_url"
        tar -xzf "$target" -C "$temp_dir"
        return 0
    fi
    
    return 1
}

# Function to install package from downloaded files
install_package() {
    local package=$1
    local version=$2
    local source_dir=$3
    
    # Create package.json for the downloaded files
    cat > "${source_dir}/package.json" << EOL
{
    "name": "${package}",
    "version": "${version}",
    "main": "index.js"
}
EOL

    # Try to install the package
    if pnpm add "file:${source_dir}" --ignore-workspace-root-check --force; then
        log_message "SUCCESS" "Installed ${package}@${version} from local files"
        return 0
    fi
    
    return 1
}

# Function to handle failed package downloads
handle_failed_package() {
    local package=$1
    local version=$2
    
    log_message "WARN" "Attempting to resolve download issues for $package@$version"
    
    local pkg_temp_dir="${TEMP_DIR}/${package}"
    mkdir -p "$pkg_temp_dir"
    
    if download_package "$package" "$version" "$pkg_temp_dir"; then
        if install_package "$package" "$version" "$pkg_temp_dir"; then
            rm -rf "$pkg_temp_dir"
            return 0
        fi
    fi
    
    rm -rf "$pkg_temp_dir"
    return 1
}

# Function to handle 304 errors for specific packages
function handle_304_errors() {
    local output_file=$1
    local current_registry=$2
    local failed_packages=()
    
    # Extract failed package information
    while IFS= read -r line; do
        if [[ $line =~ GET[[:space:]]${current_registry}/([^/]+)/-/([^[:space:]]+)\.tgz[[:space:]]error[[:space:]]\(ERR_PNPM_FETCH_304\) ]]; then
            local pkg_path="${BASH_REMATCH[1]}"
            local pkg_file="${BASH_REMATCH[2]}"
            failed_packages+=("$pkg_path:$pkg_file")
        fi
    done < "$output_file"
    
    if [ ${#failed_packages[@]} -eq 0 ]; then
        return 1
    fi
    
    log_message "INFO" "Found ${#failed_packages[@]} packages with 304 errors"
    
    # Try each registry for failed packages
    local registries=(
        "https://mirrors.cloud.tencent.com/npm"  # Primary choice
        "https://registry.npmmirror.com"
        "https://registry.npmjs.org"
        "https://mirrors.huaweicloud.com/repository/npm"
    )
    
    for registry in "${registries[@]}"; do
        if [ "$registry" = "$current_registry" ]; then
            continue
        fi
        
        log_message "INFO" "Trying registry: $registry"
        local success=true
        
        # Test registry with failed packages
        for pkg_info in "${failed_packages[@]}"; do
            local pkg_path=${pkg_info%:*}
            local pkg_file=${pkg_info#*:}
            local test_url="${registry}/${pkg_path}/-/${pkg_file}.tgz"
            
            if ! curl -sL --connect-timeout 5 -I "$test_url" 2>&1 | grep -q "200 OK"; then
                success=false
                break
            fi
        done
        
        if [ "$success" = true ]; then
            log_message "SUCCESS" "Found working registry: $registry"
            pnpm config set registry "$registry"
            return 0
        fi
    done
    
    return 1
}

# Function to handle specific package sources
function get_package_specific_source() {
    local package=$1
    local version=$2
    
    # Special handling for protobufjs
    if [ "$package" = "protobufjs" ]; then
        echo "cdn:https://cdn.jsdelivr.net/npm"
        return 0
    fi
    
    return 1
}

# Update the find_package_source function
function find_package_source() {
    local package=$1
    local version=$2
    
    log_message "INFO" "Looking for package: $package@$version"
    
    # Check for package-specific source first
    local specific_source=$(get_package_specific_source "$package" "$version")
    if [ -n "$specific_source" ]; then
        echo "$specific_source"
        return 0
    fi
    
    # Try CDNs first
    local cdns=(
        "https://cdn.jsdelivr.net/npm"  # Move jsdelivr to first position
        "https://unpkg.com"
        "https://npm.elemecdn.com"
    )
    
    for cdn in "${cdns[@]}"; do
        local url="${cdn}/${package}@${version}"
        if curl -sL --connect-timeout 5 -I "$url" 2>&1 | grep -q "200 OK"; then
            echo "cdn:$cdn"
            return 0
        fi
    done
    
    # Try registries
    local registries=(
        "https://mirrors.cloud.tencent.com/npm"
        "https://registry.npmmirror.com"
        "https://registry.npmjs.org"
        "https://mirrors.huaweicloud.com/repository/npm"
    )
    
    for registry in "${registries[@]}"; do
        local url="${registry}/${package}/-/${package}-${version}.tgz"
        if curl -sL --connect-timeout 5 -I "$url" 2>&1 | grep -q "200 OK"; then
            echo "registry:$registry"
            return 0
        fi
    done
    
    return 1
}

# Function to handle 404 errors
function handle_404_errors() {
    local output_file=$1
    local current_registry=$2
    local failed_packages=()
    
    # Extract failed package information from 404 errors
    while IFS= read -r line; do
        if [[ $line =~ ERR_PNPM_FETCH_404.*GET[[:space:]]${current_registry}/([^/]+)/-/([^-]+)-([0-9]+\.[0-9]+\.[0-9]+)\.tgz ]]; then
            local pkg_name="${BASH_REMATCH[1]}"
            local pkg_version="${BASH_REMATCH[3]}"
            failed_packages+=("$pkg_name:$pkg_version")
            log_message "DEBUG" "Found 404 error for $pkg_name@$pkg_version"
        fi
    done < "$output_file"
    
    if [ ${#failed_packages[@]} -eq 0 ]; then
        return 1
    fi
    
    log_message "INFO" "Found ${#failed_packages[@]} packages with 404 errors"
    
    # Try to find alternative sources for each package
    local found_alternative=false
    for pkg_info in "${failed_packages[@]}"; do
        local pkg_name=${pkg_info%:*}
        local pkg_version=${pkg_info#*:}
        
        log_message "INFO" "Looking for alternative source for $pkg_name@$pkg_version"
        local source=$(find_package_source "$pkg_name" "$pkg_version")
        
        if [ -n "$source" ]; then
            local source_type=${source%:*}
            local source_url=${source#*:}
            
            if [ "$source_type" = "registry" ]; then
                log_message "SUCCESS" "Found working registry for $pkg_name: $source_url"
                pnpm config set registry "$source_url"
                found_alternative=true
            elif [ "$source_type" = "cdn" ]; then
                log_message "SUCCESS" "Found working CDN for $pkg_name: $source_url"
                # Add CDN-specific handling if needed
                found_alternative=true
            fi
        else
            log_message "ERROR" "No alternative source found for $pkg_name@$pkg_version"
        fi
    done
    
    [ "$found_alternative" = true ]
    return $?
}

# Update the colorize_pnpm_output function
function colorize_pnpm_output() {
    while IFS= read -r line; do
        if [[ $line == Progress:* ]]; then
            echo -e "${CYAN}${line}${NC}"
        elif [[ $line == Scope:* ]]; then
            echo -e "${BLUE}${line}${NC}"
        elif [[ $line == *"postinstall"* && ! $line == *"Skipping playwright"* ]]; then
            echo -e "${YELLOW}${line}${NC}"
        elif [[ $line == *"Skipping playwright"* ]]; then
            # Just show as info instead of warning
            echo -e "${BLUE}${line}${NC}"
        elif [[ $line == "Done"* ]]; then
            echo -e "${GREEN}${line}${NC}"
        elif [[ $line == *"error"* || $line == *"ERR"* ]]; then
            echo -e "${RED}${line}${NC}"
        elif [[ $line == "-"* ]]; then
            echo -e "${BLUE}${line}${NC}"
        else
            echo -e "${CYAN}${line}${NC}"
        fi
    done
}

# Update the install_dependencies function with correct pnpm flags
function install_dependencies() {
    log_message "INFO" "Installing project dependencies..."
    
    # Force Tencent mirror
    local current_registry="https://mirrors.cloud.tencent.com/npm"
    log_message "INFO" "Using registry: $current_registry"
    
    # Create temporary .npmrc for this installation
    cat > "${WORKSPACE_ROOT}/.npmrc" << EOL
registry=$current_registry
strict-peer-dependencies=false
auto-install-peers=true
node-linker=hoisted
store-dir=$PNPM_STORE_PATH
shamefully-hoist=true
network-timeout=100000
fetch-retries=5
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
EOL
    
    # Use the temporary .npmrc for installation
    local attempt=1
    while [ $attempt -le $MAX_RETRIES ]; do
        log_message "INFO" "Installation attempt $attempt of $MAX_RETRIES"
        
        # Show real-time output while capturing it
        log_message "INFO" "Running pnpm install..."
        
        # Use tee to show output in real-time while capturing it
        local temp_output="${TEMP_DIR}/pnpm_output_${attempt}.log"
        
        # Correct pnpm install command without --config flag
        if timeout $INSTALL_TIMEOUT pnpm install 2>&1 | colorize_pnpm_output | tee "$temp_output"; then
            install_status=${PIPESTATUS[0]}
            if [ $install_status -eq 0 ]; then
                log_message "SUCCESS" "Dependencies installed successfully"
                rm -f "$temp_output"
                return 0
            fi
        fi
        
        # Check for specific errors in the output
        if [ -f "$temp_output" ]; then
            if grep -q "ERR_PNPM_FETCH_404" "$temp_output"; then
                log_message "WARN" "Detected 404 errors, attempting to resolve..."
                if handle_404_errors "$temp_output" "$current_registry"; then
                    log_message "INFO" "Retrying with alternative sources..."
                    if timeout $INSTALL_TIMEOUT pnpm install --force 2>&1 | tee "$temp_output"; then
                        install_status=${PIPESTATUS[0]}
                        if [ $install_status -eq 0 ]; then
                            log_message "SUCCESS" "Dependencies installed successfully with alternative sources"
                            rm -f "$temp_output"
                            return 0
                        fi
                    fi
                fi
            elif grep -q "ERR_PNPM_FETCH_304" "$temp_output"; then
                log_message "WARN" "Detected 304 errors, attempting to resolve..."
                if handle_304_errors "$temp_output" "$current_registry"; then
                    # Try immediate reinstall with new registry
                    log_message "INFO" "Retrying with new registry..."
                    if timeout $INSTALL_TIMEOUT pnpm install --force 2>&1 | tee "$temp_output"; then
                        install_status=${PIPESTATUS[0]}
                        if [ $install_status -eq 0 ]; then
                            log_message "SUCCESS" "Dependencies installed successfully with new registry"
                            rm -f "$temp_output"
                            return 0
                        fi
                    fi
                else
                    log_message "WARN" "Could not find working registry for failed packages"
                fi
            fi
            
            # If failed and not first attempt, try with force and ignore scripts
            if [ $attempt -gt 1 ]; then
                log_message "INFO" "Attempting force installation..."
                if timeout $INSTALL_TIMEOUT pnpm install --force --ignore-scripts 2>&1 | tee "$temp_output"; then
                    install_status=${PIPESTATUS[0]}
                    if [ $install_status -eq 0 ]; then
                        log_message "SUCCESS" "Dependencies installed successfully with force option"
                        rm -f "$temp_output"
                        return 0
                    fi
                fi
            fi
        fi
        
        # Clean up temp file
        rm -f "$temp_output"
        
        attempt=$((attempt + 1))
        if [ $attempt -le $MAX_RETRIES ]; then
            local wait_time=$((RETRY_DELAY * attempt))
            log_message "INFO" "Waiting ${wait_time} seconds before next attempt..."
            sleep $wait_time
        fi
    done
    
    log_message "ERROR" "Failed to install dependencies after $MAX_RETRIES attempts"
    return 1
}

# Function to build packages with timeout
build_packages() {
    log_message "INFO" "Building packages..."
    
    # First build core packages
    if [ -d "$PACKAGES_DIR/core" ]; then
        log_message "INFO" "Building core package..."
        (cd "$PACKAGES_DIR/core" && timeout 300 pnpm run build) || {
            log_message "ERROR" "Core package build timed out"
            exit 1
        }
    fi
    
    # Then build all packages
    log_message "INFO" "Building all packages..."
    
    # Check if eliza-docs actually exists in the workspace
    if [ -d "$PACKAGES_DIR/eliza-docs" ]; then
        log_message "INFO" "Found eliza-docs package, excluding from build..."
        timeout 600 pnpm run build --filter=\!eliza-docs || {
            log_message "ERROR" "Package build timed out"
            exit 1
        }
    else
        log_message "INFO" "Building all packages..."
        timeout 600 pnpm run build || {
            log_message "ERROR" "Package build timed out"
            exit 1
        }
    fi
}

# Main function
main() {
    print_section "Starting Eliza Installation on $PLATFORM"
    log_message "INFO" "Installation directory: $INSTALL_DIR"
    
    print_section "System Requirements Check"
    check_system_requirements
    
    print_section "Node.js Version Check"
    check_node_version
    
    print_section "PNPM Setup"
    setup_pnpm
    
    if [ "$1" = "--clean" ]; then
        print_section "Cleaning Previous Installation"
        clean_installation
    fi
    
    print_section "Installing Dependencies"
    install_dependencies
    
    print_section "Building Packages"
    build_packages
    
    print_section "Installation Complete"
    log_message "SUCCESS" "Installation process completed successfully"
}

# Execute main function with any provided flags
main "$1"

# Generate installation summary
echo -e "\n${BLUE}=== ${BOLD}Installation Summary${NC} ${BLUE}===${NC}"
echo -e "${CYAN}=====================${NC}"

# Count actual errors (excluding playwright skip message)
error_count=$(grep -v "Skipping playwright" "$ERROR_LOG" | grep -c "ERROR")
warning_count=$(grep -c "WARN" "$LOG_FILE")
success_count=$(grep -c "Building .* completed successfully" "$LOG_FILE")

echo -e "${YELLOW}Total Errors:${NC} $error_count"
echo -e "${YELLOW}Total Warnings:${NC} $warning_count"
echo -e "${YELLOW}Successful Builds:${NC} $success_count"

# Check for actual errors
if [ "$error_count" -gt 0 ]; then
    echo -e "\n${RED}Installation completed with errors. Check logs for details:${NC}"
    echo -e "${CYAN}- Full log:${NC} $LOG_FILE"
    echo -e "${RED}- Error log:${NC} $ERROR_LOG"
    echo -e "${BLUE}- Debug log:${NC} $DEBUG_LOG"
    exit 1
else
    if [ "$warning_count" -gt 0 ]; then
        echo -e "\n${YELLOW}Installation completed with warnings:${NC}"
        echo -e "${CYAN}- Check full log for details:${NC} $LOG_FILE"
    else
        echo -e "\n${GREEN}Installation completed successfully with no warnings!${NC}"
    fi
    exit 0
fi