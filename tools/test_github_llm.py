from tools.github_llm import GithubLLM

def test_github_llm():
    # Initialize the GitHub LLM tool
    github = GithubLLM()

    # Test repository info
    print("\nTesting get_repository:")
    repo_info = github.get_repository('AIFlowML/eliza_aiflow')
    print(repo_info)

    # Test repository search
    print("\nTesting search_repositories:")
    search_results = github.search_repositories('language:python machine learning', per_page=3)
    print(search_results)

    # Test listing issues
    print("\nTesting list_issues:")
    issues = github.list_issues('AIFlowML/eliza_aiflow')
    print(issues)

    # Test recent activity
    print("\nTesting get_recent_activity:")
    activity = github.get_recent_activity('AIFlowML/eliza_aiflow', days=30)
    print(activity)

if __name__ == "__main__":
    test_github_llm()