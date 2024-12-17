import sys
import requests
from bs4 import BeautifulSoup

def search_web(query, num_results=5):
    """Perform a web search using a public search engine (DuckDuckGo)."""
    url = f"https://html.duckduckgo.com/html?q={query}"
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        print("Error fetching search results.")
        sys.exit(1)

    soup = BeautifulSoup(response.text, "html.parser")
    results = []
    for link in soup.find_all("a", class_="result__a", limit=num_results):
        results.append(link.get("href"))

    return results


def main():
    if len(sys.argv) < 2:
        print("Usage: python web_search.py <query>")
        sys.exit(1)

    query = " ".join(sys.argv[1:])
    print(f"Searching for: {query}")
    results = search_web(query)

    if not results:
        print("No results found.")
        sys.exit(0)

    print("\nTop Search Results:")
    for i, result in enumerate(results, 1):
        print(f"{i}. {result}")

    # Save results for further reference
    with open("search_results.txt", "w") as f:
        f.write("\n".join(results))
    print("\nSearch results saved to search_results.txt")


if __name__ == "__main__":
    main()