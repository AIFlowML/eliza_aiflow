"""Test file for Web Research tool

Usage:
    python test_web_research.py "your search query here" [num_results]
Example:
    python test_web_research.py "Python async await examples" 5
"""

import sys
from tools.web_researcher_sync import WebResearcherSync

def research_topic(query: str, num_results: int = 3):
    researcher = WebResearcherSync()

    print(f"\nSearching for: {query}")
    print(f"Number of results: {num_results}")

    # Perform the search
    print("\nSearching...")
    results = researcher.search(query, num_results=num_results)

    # Display results
    for i, result in enumerate(results, 1):
        print(f"\nResult {i}:")
        print(f"Title: {result['title']}")
        print(f"URL: {result['url']}")
        print(f"Snippet: {result['snippet']}")

        # Get more detailed content for relevant pages
        if any(domain in result['url'] for domain in [
            'github.com', 'readthedocs.io', 'docs.python.org',
            'stackoverflow.com', 'medium.com', 'dev.to'
        ]):
            print("\nDetailed content:")
            try:
                content = researcher.get_page_content(result['url'])
                print(content[:500] + "..." if len(content) > 500 else content)
            except Exception as e:
                print(f"Error fetching detailed content: {str(e)}")
        print("-" * 80)

def print_usage():
    print(__doc__)
    print("\nError: Please provide a search query.")
    print("Example: python test_web_research.py 'Python async await examples' 5")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print_usage()
        sys.exit(1)

    query = sys.argv[1]
    num_results = int(sys.argv[2]) if len(sys.argv) > 2 else 3

    research_topic(query, num_results)