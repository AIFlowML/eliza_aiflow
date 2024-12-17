# scripts/create_pr.py

from tools.github_llm import GithubLLM

def create_installation_pr():
    # Initialize GitHub client
    github = GithubLLM()
    
    # Repository details
    repo_name = "AIFlowML/eliza_aiflow"
    branch_name = "add-installation-script-fix-playwright-linux"
    
    # PR Content
    pr_title = "feat: add Eliza installation script and fix Playwright Linux support"
    pr_body = """
# Eliza Installation Script and Playwright Linux Fix

## Changes
- Add robust installation script with multi-mirror support
- Fix Playwright installation on Linux platforms
- Add mirror testing capabilities
- Add missing packages tracking

## New Features
1. Installation Script (`scripts/Eliza_Installation/`)
   - Multi-source package downloads
   - Automatic mirror switching for 304/404 errors
   - Mirror testing tool
   - Missing packages tracking
   - Detailed logging system

2. Playwright Fix (`packages/plugin-node/scripts/postinstall.js`)
   - Enable Playwright installation on Linux
   - Remove unnecessary platform restrictions

## Testing Done
- Tested Playwright installation on Linux
- Verified package installation with multiple mirrors
- Tested mirror fallback system
- Verified error handling and recovery

## Documentation
Added comprehensive documentation in `scripts/Eliza_Installation/README.md`
"""

    try:
        # First, verify the branch exists
        print(f"Checking branch {branch_name}...")
        branch_info = github.get_branch_info(repo_name, branch_name)
        print(f"Branch info: {branch_info}")

        # Create the PR
        print("\nCreating pull request...")
        result = github.create_pull_request(
            repo_name=repo_name,
            title=pr_title,
            body=pr_body,
            head=branch_name,
            base="main"
        )
        print(f"\nPull request created: {result}")
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    create_installation_pr()