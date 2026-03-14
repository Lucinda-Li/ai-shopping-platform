# app/services/shopping_search.py
import httpx
import os
from app.schemas import SearchFilters

SERPAPI_KEY = os.getenv("SERPAPI_KEY")  # Reads the key from your .env file

def build_query(filters: SearchFilters) -> str:
    """
    Combines the search bar text and filters into one search string.
    Example: query="jacket", gender="women", color="black"
             → "jacket women black"
    """
    parts = [filters.query]

    if filters.gender:
        parts.append(filters.gender)
    if filters.color:
        parts.append(filters.color)

    return " ".join(parts)


def extract_price(price_str: str):
    """
    Converts a price string like "$49.99" into a float 49.99
    Returns None if the string can't be converted.
    """
    try:
        return float(price_str.replace("$", "").replace(",", "").strip())
    except:
        return None


async def search_clothes(filters: SearchFilters) -> list:
    query = build_query(filters)

    # These are the parameters sent to SerpApi
    params = {
        "engine": "google_shopping",  # Tells SerpApi to search Google Shopping
        "q": query,                   # The search query string
        "api_key": SERPAPI_KEY,
        "num": 40,                    # Fetch 40 results so we have room to filter by price
    }

    # Make the HTTP request to SerpApi
    async with httpx.AsyncClient() as client:
        response = await client.get("https://serpapi.com/search", params=params)
        response.raise_for_status()   # Throws an error if the request failed
        data = response.json()

    # SerpApi returns results inside the "shopping_results" key
    raw_results = data.get("shopping_results", [])

    results = []
    for item in raw_results:
        price = extract_price(item.get("price", ""))

        # Filter out items that don't match the price range
        if filters.min_price and price and price < filters.min_price:
            continue
        if filters.max_price and price and price > filters.max_price:
            continue

        # SerpApi 有时用 link，有时用 product_link，优先用 link
        product_link = item.get("link") or item.get("product_link") or ""
        results.append({
            "title":     item.get("title"),       # Product name
            "price":     item.get("price"),       # Price as a string e.g. "$49.99"
            "store":     item.get("source"),      # Store name e.g. "nordstrom.com"
            "image_url": item.get("thumbnail"),   # Product image URL
            "link":      product_link,            # Link to buy the product
            "rating":    item.get("rating"),      # Star rating e.g. 4.5
            "reviews":   item.get("reviews"),     # Number of reviews
        })

    # Return only up to the requested limit
    return results[:filters.limit]