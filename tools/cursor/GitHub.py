import os
import requests
import sys

# GitHub API configuration
GITHUB_API_BASE = "https://api.github.com"
REPO_OWNER = "ai16z"
REPO_NAME = "eliza"

# GitHub Personal Access Token (optional for higher rate limits)
TOKEN = os.getenv("GITHUB_TOKEN")

HEADERS = {
    "Authorization": f"Bearer {TOKEN}" if TOKEN else "",
    "Accept": "application/vnd.github+json"
}


def fetch_all_issues():
    """Fetch all open issues from the repository."""
    url = f"{GITHUB_API_BASE}/repos/{REPO_OWNER}/{REPO_NAME}/issues"
    params = {"state": "open"}
    print(f"Fetching all open issues from {REPO_OWNER}/{REPO_NAME}...")
    response = requests.get(url, headers=HEADERS, params=params)

    if response.status_code != 200:
        print(f"Error fetching issues: {response.json()}")
        sys.exit(1)

    issues = response.json()
    if not issues:
        print("No open issues found.")
        sys.exit(0)

    print(f"Found {len(issues)} open issue(s).")
    return issues


def fetch_issue_by_number(issue_number):
    """Fetch a specific issue by its number."""
    url = f"{GITHUB_API_BASE}/repos/{REPO_OWNER}/{REPO_NAME}/issues/{issue_number}"
    print(f"Fetching issue #{issue_number} from {REPO_OWNER}/{REPO_NAME}...")
    response = requests.get(url, headers=HEADERS)

    if response.status_code != 200:
        print(f"Error fetching issue: {response.json()}")
        sys.exit(1)

    return response.json()


def create_markdown(issue, output_dir="issues"):
    """Create a markdown file for the issue."""
    os.makedirs(output_dir, exist_ok=True)
    issue_number = issue.get("number")
    title = issue.get("title", "No Title")
    body = issue.get("body", "No description provided.")
    labels = ", ".join(label["name"] for label in issue.get("labels", []))

    filename = os.path.join(output_dir, f"issue_{issue_number}.md")
    with open(filename, "w") as f:
        f.write(f"# {title}\n\n")
        f.write(f"**Issue Number**: {issue_number}\n")
        f.write(f"**Labels**: {labels}\n\n")
        f.write(f"## Description\n\n{body}\n")

    print(f"Markdown saved: {filename}")
    return filename


def main():
    print("GitHub Issue Fetcher")
    print("====================")
    print("This script fetches open issues or a specific issue from the GitHub repository.")
    print()

    if len(sys.argv) == 2 and sys.argv[1] != "all":
        issue_link = sys.argv[1]
        try:
            issue_number = int(issue_link.split("/")[-1])
        except ValueError:
            print("Invalid issue link or number. Please provide a valid GitHub issue link.")
            sys.exit(1)

        issue = fetch_issue_by_number(issue_number)
        markdown_file = create_markdown(issue)
        print(f"Issue #{issue_number} processed and saved to {markdown_file}.")
    elif len(sys.argv) == 2 and sys.argv[1] == "all":
        issues = fetch_all_issues()
        for issue in issues:
            create_markdown(issue)
        print("All open issues have been processed and saved as markdown files.")
    else:
        print("Usage:")
        print("  - To fetch all issues: python tools/GitHub.py all")
        print("  - To fetch a specific issue: python tools/GitHub.py <issue_link>")
        sys.exit(1)


if __name__ == "__main__":
    main()