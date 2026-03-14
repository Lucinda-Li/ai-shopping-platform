from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles  # 新增
from app.routes import tryon                 # 新增                                   
from dotenv import load_dotenv
import os

# Build absolute path to .env file relative to this file's location
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, "..", ".env"))  # goes one level up from app/ to backend/

print("SERPAPI KEY loaded:", os.getenv("SERPAPI_KEY"))  # debug line

from app.routes.search_and_filter import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not os.path.exists("outputs"):
    os.makedirs("outputs")                                       # 新增
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")      # 新增

app.include_router(tryon.router)             # 新增
app.include_router(router, prefix="/api")

@app.get("/")
def root():
    return {"message": "FastAPI backend is running"}