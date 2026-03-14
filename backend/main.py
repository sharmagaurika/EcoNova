from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from app.routers import parse, log

app = FastAPI(
    title="Carbon Race API",
    description="Backend API for tracking carbon footprints.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(parse.router)
app.include_router(log.router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "Carbon Race API is active and recording data."
    }
