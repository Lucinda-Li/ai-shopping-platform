from fastapi import APIRouter, UploadFile, File, Form
from app.services.tryon_service import generate_tryon

router = APIRouter()

@router.post("/tryon")
async def try_on(
    user_image: UploadFile = File(...),
    cloth_image: UploadFile = File(...),
    height: float = Form(...),
    weight: float = Form(...),
    size: str = Form(...)
):

    result = await generate_tryon(
        user_image,
        cloth_image,
        height,
        weight,
        size
    )

    return result