from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.tryon_service import generate_tryon

router = APIRouter()


@router.post("/tryon")
async def try_on(
    user_image: UploadFile = File(...),
    cloth_image: UploadFile = File(None),
    cloth_image_url: str = Form(None),
    height: float = Form(...),
    weight: float = Form(...),
    size: str = Form(...),
):
    if not cloth_image and not cloth_image_url:
        raise HTTPException(
            status_code=400,
            detail="Provide either cloth_image (file) or cloth_image_url",
        )
    try:
        result = await generate_tryon(
            user_image=user_image,
            cloth_image=cloth_image,
            cloth_image_url=cloth_image_url,
            height=height,
            weight=weight,
            size=size,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))