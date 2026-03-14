from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles  # 新增
from app.routes import tryon                 # 新增
import os                                    # 新增

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

@app.get("/")
def root():
    return {"message": "FastAPI backend is running"}