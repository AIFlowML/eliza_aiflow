#!/bin/bash

# Colors for pretty output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print header
print_header() {
    echo -e "\n${BLUE}=== Testing NPM Package Mirrors ===${NC}"
    echo -e "${YELLOW}Testing availability of packages across different mirrors${NC}\n"
}

# Function to print section
print_section() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

# Function to load packages from file or use defaults
load_packages() {
    if [ -f "$1" ]; then
        mapfile -t PACKAGES < "$1"
        echo -e "${YELLOW}Loaded packages from $1${NC}"
    else
        PACKAGES=(
            "eventemitter2@5.0.1"
            "fs-constants@1.0.0"
            "cssesc@3.0.0"
            "buffer-alloc-unsafe@1.1.0"
        )
        echo -e "${YELLOW}Using default package list${NC}"
    fi
}

# Registry configuration
REGISTRIES=(
    "https://registry.npmjs.org"
    "https://registry.npmmirror.com"
    "https://mirrors.cloud.tencent.com/npm"
    "https://mirrors.huaweicloud.com/repository/npm"
)

# Results tracking
declare -A REGISTRY_SUCCESS
declare -A REGISTRY_FAILURE

# Initialize results
init_results() {
    for registry in "${REGISTRIES[@]}"; do
        REGISTRY_SUCCESS[$registry]=0
        REGISTRY_FAILURE[$registry]=0
    done
}

# Test package availability
test_package() {
    local pkg=$1
    local pkg_name=${pkg%@*}
    local pkg_version=${pkg#*@}
    
    print_section "Testing package: ${YELLOW}$pkg${NC}"
    
    for registry in "${REGISTRIES[@]}"; do
        echo -e "\n${BLUE}Trying $registry...${NC}"
        local url="${registry}/${pkg_name}/-/${pkg_name}-${pkg_version}.tgz"
        
        if curl -sL --connect-timeout 5 -I "$url" 2>&1 | grep -q "200 OK"; then
            echo -e "${GREEN}✓ SUCCESS: $registry works for $pkg${NC}"
            ((REGISTRY_SUCCESS[$registry]++))
        else
            echo -e "${RED}✗ FAILED: $registry failed for $pkg${NC}"
            ((REGISTRY_FAILURE[$registry]++))
        fi
    done
    echo -e "\n${BLUE}-------------------${NC}"
}

# Print summary
print_summary() {
    print_section "Summary"
    
    echo -e "\n${YELLOW}Registry Success Rates:${NC}"
    for registry in "${REGISTRIES[@]}"; do
        local total=$((REGISTRY_SUCCESS[$registry] + REGISTRY_FAILURE[$registry]))
        local success_rate=$(( REGISTRY_SUCCESS[$registry] * 100 / total ))
        echo -e "${BLUE}$registry${NC}"
        echo -e "Success: ${GREEN}${REGISTRY_SUCCESS[$registry]}${NC} Failure: ${RED}${REGISTRY_FAILURE[$registry]}${NC} Rate: ${YELLOW}${success_rate}%${NC}"
    done
}

# Main execution
print_header
init_results

# Load packages from file if provided
if [ $# -eq 1 ]; then
    load_packages "$1"
else
    load_packages "missing_packages.txt"
fi

# Test each package
for pkg in "${PACKAGES[@]}"; do
    test_package "$pkg"
done

# Print summary
print_summary