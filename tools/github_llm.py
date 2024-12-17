"""
GitHub LLM Tool - Simplified version for LLM interactions
"""

import os
import json
from typing import Optional, List
from datetime import datetime, timedelta
from github import Github
from github.Repository import Repository
from github.PullRequest import PullRequest
from github.Commit import Commit
from github.Issue import Issue
from github.GithubException import GithubException

def load_env():
    """Load environment variables from .env file."""
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()

class GithubLLM:
    def __init__(self, access_token: Optional[str] = None):
        """Initialize GitHub client with access token.

        Args:
            access_token (str, optional): GitHub access token. If not provided, will try to get from GITHUB_ACCESS_TOKEN env var.
        """
        load_env()  # Load environment variables
        self.access_token = access_token or os.getenv("GITHUB_ACCESS_TOKEN")
        if not self.access_token:
            raise ValueError("GitHub access token not provided and GITHUB_ACCESS_TOKEN not found in environment")

        self.client = Github(self.access_token)

    def search_repositories(self, query: str, sort: str = "stars", order: str = "desc", per_page: int = 5) -> str:
        """Search for repositories on GitHub.

        Args:
            query (str): The search query keywords
            sort (str, optional): Sort field ('stars', 'forks', 'updated'). Defaults to 'stars'.
            order (str, optional): Sort order ('asc' or 'desc'). Defaults to 'desc'.
            per_page (int, optional): Results per page. Defaults to 5.

        Returns:
            str: JSON string containing search results
        """
        try:
            repositories = self.client.search_repositories(query=query, sort=sort, order=order)
            repo_list = []
            for repo in repositories[:per_page]:
                repo_info = {
                    "full_name": repo.full_name,
                    "description": repo.description,
                    "url": repo.html_url,
                    "stars": repo.stargazers_count,
                    "forks": repo.forks_count,
                    "language": repo.language,
                }
                repo_list.append(repo_info)
            return json.dumps(repo_list, indent=2)
        except GithubException as e:
            return json.dumps({"error": str(e)})

    def get_repository(self, repo_name: str) -> str:
        """Get details of a specific repository.

        Args:
            repo_name (str): Repository name in format 'owner/repo'

        Returns:
            str: JSON string containing repository details
        """
        try:
            repo = self.client.get_repo(repo_name)
            repo_info = {
                "name": repo.full_name,
                "description": repo.description,
                "url": repo.html_url,
                "stars": repo.stargazers_count,
                "forks": repo.forks_count,
                "open_issues": repo.open_issues_count,
                "language": repo.language,
                "license": repo.license.name if repo.license else None,
                "default_branch": repo.default_branch,
            }
            return json.dumps(repo_info, indent=2)
        except GithubException as e:
            return json.dumps({"error": str(e)})

    def list_issues(self, repo_name: str, state: str = "open") -> str:
        """List issues for a repository.

        Args:
            repo_name (str): Repository name in format 'owner/repo'
            state (str, optional): Issue state ('open', 'closed', 'all'). Defaults to 'open'.

        Returns:
            str: JSON string containing list of issues
        """
        try:
            repo = self.client.get_repo(repo_name)
            issues = repo.get_issues(state=state)
            issue_list = []
            for issue in issues:
                if not issue.pull_request:  # Filter out pull requests
                    issue_info = {
                        "number": issue.number,
                        "title": issue.title,
                        "user": issue.user.login,
                        "created_at": issue.created_at.isoformat(),
                        "state": issue.state,
                        "url": issue.html_url,
                    }
                    issue_list.append(issue_info)
            return json.dumps(issue_list, indent=2)
        except GithubException as e:
            return json.dumps({"error": str(e)})

    def get_recent_activity(self, repo_name: str, days: int = 7) -> str:
        """Get recent activity in a repository.

        Args:
            repo_name (str): Repository name in format 'owner/repo'
            days (int, optional): Number of days to look back. Defaults to 7.

        Returns:
            str: JSON string containing recent activity
        """
        try:
            repo = self.client.get_repo(repo_name)
            cutoff_date = datetime.now() - timedelta(days=days)

            # Get recent issues
            issues = repo.get_issues(state='all', since=cutoff_date)
            recent_issues = []
            for issue in issues:
                if not issue.pull_request:
                    issue_info = {
                        "type": "issue",
                        "number": issue.number,
                        "title": issue.title,
                        "state": issue.state,
                        "created_at": issue.created_at.isoformat(),
                        "url": issue.html_url
                    }
                    recent_issues.append(issue_info)

            # Get recent commits
            commits = repo.get_commits(since=cutoff_date)
            recent_commits = []
            for commit in commits:
                commit_info = {
                    "type": "commit",
                    "sha": commit.sha,
                    "message": commit.commit.message,
                    "author": commit.commit.author.name,
                    "date": commit.commit.author.date.isoformat(),
                    "url": commit.html_url
                }
                recent_commits.append(commit_info)

            activity = {
                "repository": repo.full_name,
                "period": f"Last {days} days",
                "issues": recent_issues,
                "commits": recent_commits
            }

            return json.dumps(activity, indent=2)
        except GithubException as e:
            return json.dumps({"error": str(e)})