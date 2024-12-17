"""Dependency Manager Tool

This tool provides functionality for managing project dependencies,
including checking versions, finding updates, and handling requirements.
"""

import os
import json
from typing import Dict, List, Optional, Any
import subprocess
import pkg_resources
from phi.tools.tool import Tool

class DependencyManager(Tool):
    """Dependency management tool."""
    
    def __init__(self):
        """Initialize the dependency manager tool."""
        super().__init__(
            name="dependency_manager",
            description="Manage project dependencies and requirements",
            type="dependency_manager"
        )

    async def run(self, tool_input: Dict[str, Any]) -> Dict[str, Any]:
        """Run the dependency manager with the given input."""
        action = tool_input.get("action")
        
        try:
            if action == "check_dependencies":
                results = await self.check_dependencies(
                    requirements_file=tool_input.get("requirements_file", "requirements.txt")
                )
                return {"success": True, "results": results}
                
            elif action == "find_updates":
                results = await self.find_updates(
                    requirements_file=tool_input.get("requirements_file", "requirements.txt")
                )
                return {"success": True, "results": results}
                
            elif action == "add_dependency":
                await self.add_dependency(
                    package=tool_input["package"],
                    version=tool_input.get("version"),
                    requirements_file=tool_input.get("requirements_file", "requirements.txt")
                )
                return {"success": True, "message": f"Added {tool_input['package']} to requirements"}
                
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

    async def check_dependencies(self, requirements_file: str = "requirements.txt") -> Dict[str, Any]:
        """Check installed dependencies against requirements."""
        if not os.path.exists(requirements_file):
            raise FileNotFoundError(f"Requirements file not found: {requirements_file}")
            
        results = {
            "missing": [],
            "outdated": [],
            "incompatible": []
        }
        
        # Read requirements
        with open(requirements_file) as f:
            requirements = [line.strip() for line in f if line.strip() and not line.startswith("#")]
            
        # Check each requirement
        for req in requirements:
            try:
                # Parse requirement
                requirement = pkg_resources.Requirement.parse(req)
                
                try:
                    # Check if package is installed
                    dist = pkg_resources.get_distribution(requirement.name)
                    
                    # Check version compatibility
                    if dist.version not in requirement.specifier:
                        results["incompatible"].append({
                            "package": requirement.name,
                            "required": str(requirement.specifier),
                            "installed": dist.version
                        })
                        
                except pkg_resources.DistributionNotFound:
                    results["missing"].append({
                        "package": requirement.name,
                        "required": str(requirement.specifier)
                    })
                    
            except Exception as e:
                print(f"Error checking {req}: {str(e)}")
                
        return results

    async def find_updates(self, requirements_file: str = "requirements.txt") -> List[Dict[str, str]]:
        """Find available updates for dependencies."""
        if not os.path.exists(requirements_file):
            raise FileNotFoundError(f"Requirements file not found: {requirements_file}")
            
        updates = []
        
        # Read requirements
        with open(requirements_file) as f:
            requirements = [line.strip() for line in f if line.strip() and not line.startswith("#")]
            
        # Check each requirement
        for req in requirements:
            try:
                # Parse requirement
                requirement = pkg_resources.Requirement.parse(req)
                
                try:
                    # Get installed version
                    dist = pkg_resources.get_distribution(requirement.name)
                    
                    # Check PyPI for latest version
                    result = subprocess.run(
                        ["pip", "index", "versions", requirement.name],
                        capture_output=True,
                        text=True
                    )
                    
                    if result.returncode == 0:
                        # Parse output to find latest version
                        lines = result.stdout.split("\n")
                        for line in lines:
                            if "Available versions:" in line:
                                latest = line.split(":")[-1].strip().split(",")[0].strip()
                                if latest != dist.version:
                                    updates.append({
                                        "package": requirement.name,
                                        "current": dist.version,
                                        "latest": latest
                                    })
                                break
                                
                except pkg_resources.DistributionNotFound:
                    pass  # Skip if package is not installed
                    
            except Exception as e:
                print(f"Error checking updates for {req}: {str(e)}")
                
        return updates

    async def add_dependency(
        self,
        package: str,
        version: Optional[str] = None,
        requirements_file: str = "requirements.txt"
    ) -> None:
        """Add a dependency to requirements.txt."""
        # Format requirement string
        req = package
        if version:
            req += f"=={version}"
            
        # Read existing requirements
        existing = set()
        if os.path.exists(requirements_file):
            with open(requirements_file) as f:
                existing = {line.strip() for line in f if line.strip() and not line.startswith("#")}
                
        # Add new requirement if not already present
        if req not in existing:
            with open(requirements_file, "a") as f:
                f.write(f"\n{req}")
                
        # Install the package
        subprocess.run(["pip", "install", req], check=True)

    def _parse_requirement(self, req_str: str) -> Dict[str, str]:
        """Parse a requirement string into package name and version spec."""
        parts = req_str.split("==")
        if len(parts) == 2:
            return {"name": parts[0], "version": parts[1]}
        return {"name": parts[0], "version": None}