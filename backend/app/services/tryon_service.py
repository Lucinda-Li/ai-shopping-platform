import os
import uuid
import requests
import fal_client
from dotenv import load_dotenv

load_dotenv()

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

os.environ["FAL_KEY"] = os.getenv("FAL_KEY")


def recommend_size(height: float, weight: float) -> str:
    bmi = weight / (height / 100) ** 2
    if bmi < 18.5:
        return "S"
    elif bmi < 22:
        return "M"
    elif bmi < 26:
        return "L"
    else:
        return "XL"


def image_to_base64(path: str) -> str:
    import base64
    with open(path, "rb") as f:
        return "data:image/png;base64," + base64.b64encode(f.read()).decode()


async def generate_tryon(user_image, cloth_image, height: float, weight: float, size: str):

    # 1. 保存图片
    user_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}_user.png")
    cloth_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}_cloth.png")

    with open(user_path, "wb") as f:
        f.write(await user_image.read())
    with open(cloth_path, "wb") as f:
        f.write(await cloth_image.read())

    # 2. 调用 fal.ai 试穿模型
    result = fal_client.run(
        "fal-ai/fashn/tryon/v1.5",
        arguments={
            "model_image": image_to_base64(user_path),
            "garment_image": image_to_base64(cloth_path),
            "category": "tops"
        }
    )

    output_url = result["images"][0]["url"]

    # 3. 下载结果图片
    img_data = requests.get(output_url).content
    base_id = str(uuid.uuid4())
    result_filename = f"{base_id}_front.png"
    result_path = os.path.join(OUTPUT_DIR, result_filename)

    with open(result_path, "wb") as f:
        f.write(img_data)

    return {
        "status": "success",
        "images": {
            "front": f"/outputs/{result_filename}",
        },
        "recommended_size": recommend_size(height, weight),
        "bmi": round(weight / (height / 100) ** 2, 1)
    }
