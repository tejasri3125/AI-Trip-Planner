import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load env variables before other imports
load_dotenv()

from app.models.database import init_db
from app.api import auth, trips, weather, places, chat

# Initialize SQLite database
init_db()

app = FastAPI(
    title="TripPlanner AI API",
    description="Backend API for TripPlanner AI, providing AI itinerary generation, weather integration, places suggestions, RAG, and trip management.",
    version="1.0.0"
)

# CORS configurations
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*"  # Allow all for robustness during setup/deployment
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api")
app.include_router(trips.router, prefix="/api")
app.include_router(weather.router, prefix="/api")
app.include_router(places.router, prefix="/api")
app.include_router(chat.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Welcome to the TripPlanner AI API!",
        "documentation": "/docs"
    }
