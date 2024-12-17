"""Web Researcher Tool

This tool provides functionality for researching information from the web,
including searching for documentation, examples, and best practices.
"""

import os
import json
from typing import Dict, List, Optional, Any
import requests
from bs4 import BeautifulSoup
from phi.tools.tool import Tool

class WebResearcher(Tool):
    """Web researcher tool for gathering information from the internet."""
    
    def __init__(self):
        """Initialize the web researcher tool."""
        super().__init__(
            name="web_researcher",
            description="Research information from the web including documentation, examples, and best practices",
            type="web_researcher"
        )
        self._session = requests.Session()
        self._session.headers.update({
            'User-Agent': 'Mozilla/5.0 (compatible; WebResearcherBot/1.0)'
        })

    async def run(self, tool_input: Dict[str, Any]) -> Dict[str, Any]:
        """Run the web researcher with the given input."""
        action = tool_input.get("action")
        
        try:
            if action == "search":
                results = await self.search(
                    query=tool_input["query"],
                    num_results=tool_input.get("num_results", 5)
                )
                return {"success": True, "results": results}
                
            elif action == "get_page_content":
                content = await self.get_page_content(
                    url=tool_input["url"],
                    selector=tool_input.get("selector")
                )
                return {"success": True, "content": content}
                
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

    async def search(self, query: str, num_results: int = 5) -> List[Dict[str, str]]:
        """Search the web for information."""
        # This is a placeholder - in a real implementation, you would use a proper search API
        results = []
        try:
            # Simulate search results for demonstration
            results.append({
                "title": "Example Search Result",
                "url": "https://example.com",
                "snippet": "This is a placeholder search result."
            })
        except Exception as e:
            raise Exception(f"Search failed: {str(e)}")
        return results[:num_results]

    async def get_page_content(self, url: str, selector: Optional[str] = None) -> str:
        """Get the content of a webpage."""
        try:
            response = self._session.get(url)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.decompose()
                
            if selector:
                elements = soup.select(selector)
                content = "\n".join(element.get_text(strip=True) for element in elements)
            else:
                content = soup.get_text(strip=True)
                
            return content
            
        except Exception as e:
            raise Exception(f"Failed to get page content: {str(e)}")

    def _clean_text(self, text: str) -> str:
        """Clean and normalize text content."""
        # Remove extra whitespace
        text = " ".join(text.split())
        return text