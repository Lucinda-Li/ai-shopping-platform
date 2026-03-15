from pydantic import BaseModel
from typing import Optional

class SearchFilters(BaseModel):
    query: str                            # The text from the search bar
    gender: Optional[str] = None         # "men", "women", "kids" — optional
    color: Optional[str] = None          # "blue", "black", etc. — optional
    min_price: Optional[float] = None    # e.g. 20.0 — optional
    max_price: Optional[float] = None    # e.g. 100.0 — optional
    style: Optional[str] = None 
    limit: int = 40