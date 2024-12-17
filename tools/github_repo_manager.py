"""
GitHub Repository Manager Tool

This tool provides functionality for managing GitHub repositories,
including creating/updating repositories, managing branches,
handling pull requests, and more.
"""

import os
import json
import base64
from datetime import datetime
from typing import Dict, List, Optional, Union, Any
from dataclasses import dataclass, asdict
import requests
from github import Github, GithubException
from github.Repository import Repository
from github.PullRequest import PullRequest
from github.Commit import Commit
from github.ContentFile import ContentFile
from github.Branch import Branch
from github.Issue import Issue
from github.Label import Label
from github.Milestone import Milestone
from github.Project import Project
from github.ProjectColumn import ProjectColumn
from phi.tools.tool import Tool

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

@dataclass
class RepoStats:
    """Statistics about a repository."""
    name: str
    description: str
    stars: int
    forks: int
    open_issues: int
    created_at: str
    updated_at: str
    language: str
    topics: List[str]
    visibility: str
    default_branch: str
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return asdict(self)

@dataclass
class BranchProtectionRule:
    """Branch protection rule configuration."""
    required_approvals: int = 1
    enforce_admins: bool = False
    require_ci: bool = True
    allow_force_push: bool = False
    allow_deletions: bool = False

class GitHubRepoManager(Tool):
    """GitHub repository management tool."""
    
    def __init__(self):
        """Initialize the GitHub repository manager."""
        super().__init__(
            name="github_repo_manager",
            description="Manage GitHub repositories, branches, pull requests, and more",
            type="function",
            function={
                "name": "github_repo_manager",
                "description": "Manage GitHub repositories, branches, pull requests, and more",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "action": {
                            "type": "string",
                            "enum": ["create_repository", "get_repository", "create_branch", "protect_branch", "create_file"],
                            "description": "The action to perform"
                        },
                        "name": {
                            "type": "string",
                            "description": "Repository name (for create_repository)"
                        },
                        "description": {
                            "type": "string",
                            "description": "Repository description (for create_repository)"
                        },
                        "private": {
                            "type": "boolean",
                            "description": "Whether the repository is private (for create_repository)"
                        },
                        "full_name": {
                            "type": "string",
                            "description": "Full repository name in format owner/repo (for get_repository)"
                        },
                        "repository": {
                            "type": "string",
                            "description": "Repository name or full name (for branch operations)"
                        },
                        "branch_name": {
                            "type": "string",
                            "description": "Name of the branch (for branch operations)"
                        },
                        "path": {
                            "type": "string",
                            "description": "File path (for create_file)"
                        },
                        "content": {
                            "type": "string",
                            "description": "File content (for create_file)"
                        },
                        "message": {
                            "type": "string",
                            "description": "Commit message (for create_file)"
                        }
                    },
                    "required": ["action"]
                }
            }
        )
        load_env()  # Load environment variables
        token = os.getenv("GITHUB_ACCESS_TOKEN")
        if not token:
            raise ValueError("GITHUB_ACCESS_TOKEN env var not set")
        
        self._token = token
        self._github = Github(self._token)
        self._user = self._github.get_user()

    async def run(self, tool_input: Dict[str, Any]) -> Dict[str, Any]:
        """Run the GitHub repo manager with the given input."""
        action = tool_input.get("action")
        
        try:
            if action == "create_repository":
                repo = await self.create_repository(
                    name=tool_input["name"],
                    description=tool_input.get("description", ""),
                    private=tool_input.get("private", False),
                    auto_init=tool_input.get("auto_init", True),
                    gitignore_template=tool_input.get("gitignore_template", "Python"),
                    topics=tool_input.get("topics")
                )
                return {"success": True, "repository": repo.full_name}
                
            elif action == "get_repository":
                repo = await self.get_repository(tool_input["full_name"])
                stats = await self.get_repository_stats(repo)
                return {"success": True, "repository": stats.to_dict()}
                
            elif action == "create_branch":
                branch = await self.create_branch(
                    repo=tool_input["repository"],
                    branch_name=tool_input["branch_name"],
                    base_branch=tool_input.get("base_branch")
                )
                return {"success": True, "branch": branch.name}
                
            elif action == "protect_branch":
                await self.protect_branch(
                    repo=tool_input["repository"],
                    branch_name=tool_input["branch_name"],
                    protection=BranchProtectionRule(**tool_input.get("protection", {}))
                )
                return {"success": True, "message": f"Branch {tool_input['branch_name']} protected"}
                
            elif action == "create_file":
                file = await self.create_file(
                    repo=tool_input["repository"],
                    path=tool_input["path"],
                    content=tool_input["content"],
                    message=tool_input["message"],
                    branch=tool_input.get("branch")
                )
                return {"success": True, "file": file.path}
                
            elif action == "get_issues":
                issues = await self.get_repository_issues(tool_input["repository"])
                return {"success": True, "issues": issues}
                
            else:
                return {
                    "success": False,
                    "error": f"Invalid action: {action}"
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    async def create_repository(
        self,
        name: str,
        description: str = "",
        private: bool = False,
        auto_init: bool = True,
        gitignore_template: str = "Python",
        topics: Optional[List[str]] = None
    ) -> Repository:
        """Create a new repository."""
        repo = self._user.create_repo(
            name=name,
            description=description,
            private=private,
            auto_init=auto_init,
            gitignore_template=gitignore_template
        )
        
        if topics:
            repo.replace_topics(topics)
            
        return repo

    async def get_repository(self, full_name: str) -> Repository:
        """Get a repository by full name (owner/repo)."""
        return self._github.get_repo(full_name)

    async def get_repository_stats(self, repo: Repository) -> RepoStats:
        """Get repository statistics."""
        return RepoStats(
            name=repo.name,
            description=repo.description or "",
            stars=repo.stargazers_count,
            forks=repo.forks_count,
            open_issues=repo.open_issues_count,
            created_at=repo.created_at.isoformat(),
            updated_at=repo.updated_at.isoformat(),
            language=repo.language or "",
            topics=repo.get_topics(),
            visibility=repo.visibility,
            default_branch=repo.default_branch
        )

    async def create_branch(
        self,
        repo: Union[str, Repository],
        branch_name: str,
        base_branch: Optional[str] = None
    ) -> Branch:
        """Create a new branch in the repository."""
        if isinstance(repo, str):
            repo = await self.get_repository(repo)
            
        if not base_branch:
            base_branch = repo.default_branch
            
        base_ref = repo.get_git_ref(f"heads/{base_branch}")
        repo.create_git_ref(f"refs/heads/{branch_name}", base_ref.object.sha)
        return repo.get_branch(branch_name)

    async def protect_branch(
        self,
        repo: Union[str, Repository],
        branch_name: str,
        protection: BranchProtectionRule
    ) -> None:
        """Set branch protection rules."""
        if isinstance(repo, str):
            repo = await self.get_repository(repo)
            
        branch = repo.get_branch(branch_name)
        branch.edit_protection(
            strict=True,
            require_code_owner_reviews=False,
            required_approving_review_count=protection.required_approvals,
            enforce_admins=protection.enforce_admins,
            require_ci=protection.require_ci,
            allow_force_pushes=protection.allow_force_push,
            allow_deletions=protection.allow_deletions
        )

    async def create_file(
        self,
        repo: Union[str, Repository],
        path: str,
        content: str,
        message: str,
        branch: Optional[str] = None
    ) -> ContentFile:
        """Create a file in the repository."""
        if isinstance(repo, str):
            repo = await self.get_repository(repo)
            
        if not branch:
            branch = repo.default_branch
            
        content_bytes = content.encode('utf-8')
        content_b64 = base64.b64encode(content_bytes).decode('utf-8')
        
        return repo.create_file(
            path=path,
            message=message,
            content=content_b64,
            branch=branch
        )[1]  # Returns (commit, content)

    async def get_repository_issues(self, repo: Union[str, Repository]) -> List[Dict[str, Any]]:
        """Get all issues from a repository."""
        if isinstance(repo, str):
            repo = await self.get_repository(repo)
            
        issues = []
        for issue in repo.get_issues(state='all'):
            issues.append({
                'number': issue.number,
                'title': issue.title,
                'state': issue.state,
                'created_at': issue.created_at.isoformat(),
                'updated_at': issue.updated_at.isoformat(),
                'body': issue.body,
                'labels': [label.name for label in issue.labels]
            })
        return issues