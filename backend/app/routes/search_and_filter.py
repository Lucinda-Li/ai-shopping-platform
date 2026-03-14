from fastapi import APIRouter, HTTPException
from app.schemas import SearchFilters
from app.services.search_and_filter_service import search_clothes

router = APIRouter()

@router.post("/search")
async def search(filters: SearchFilters):
    """
    Receives search filters from the frontend,
    calls SerpApi, and returns matching products.
    """
    try:
        results = await search_clothes(filters)
        return {
            "results": results,
            "count": len(results)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))