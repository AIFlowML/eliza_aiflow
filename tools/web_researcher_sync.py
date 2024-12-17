"""Web Researcher Tool - Synchronous Version"""

import os
import json
from typing import Dict, List, Optional, Any
import requests
from bs4 import BeautifulSoup
from urllib.parse import unquote, urlparse

class WebResearcherSync:
    """Web researcher tool for gathering information from the internet."""

    def __init__(self):
        """Initialize the web researcher tool."""
        self._session = requests.Session()
        self._session.headers.update({
            'User-Agent': 'Mozilla/5.0 (compatible; WebResearcherBot/1.0)'
        })

    def search(self, query: str, num_results: int = 5) -> List[Dict[str, str]]:
        """Search the web for information."""
        try:
            # Use DuckDuckGo search
            url = f"https://html.duckduckgo.com/html/?q={query}"
            response = self._session.get(url)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, 'html.parser')
            results = []

            # Find search results
            for result in soup.select('.result'):
                title_elem = result.select_one('.result__title')
                snippet_elem = result.select_one('.result__snippet')
                link_elem = result.select_one('.result__url')

                if title_elem and link_elem:
                    # Extract and clean the URL
                    url = link_elem.get('href', '')
                    if url.startswith('//duckduckgo.com/l/?uddg='):
                        # Extract and decode the actual URL from DuckDuckGo redirect
                        encoded_url = url.split('uddg=')[1].split('&')[0]
                        url = unquote(encoded_url)
                    elif not url.startswith(('http://', 'https://')):
                        url = 'https://' + url.lstrip('/')

                    results.append({
                        "title": title_elem.get_text(strip=True),
                        "url": url,
                        "snippet": snippet_elem.get_text(strip=True) if snippet_elem else ""
                    })

                if len(results) >= num_results:
                    break

            return results

        except Exception as e:
            print(f"Search failed: {str(e)}")
            return []

    def get_page_content(self, url: str, selector: Optional[str] = None) -> str:
        """Get the content of a webpage."""
        try:
            # Ensure URL has a scheme
            if not url.startswith(('http://', 'https://')):
                url = 'https://' + url.lstrip('/')

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

            return self._clean_text(content)

        except Exception as e:
            print(f"Failed to get page content: {str(e)}")
            return ""

    def _clean_text(self, text: str) -> str:
        """Clean and normalize text content."""
        # Remove extra whitespace
        text = " ".join(text.split())
        return text