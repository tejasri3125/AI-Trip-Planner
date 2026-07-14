from fastapi import APIRouter, HTTPException, status
from app.services.weather_service import get_weather

router = APIRouter(prefix="/weather", tags=["Weather"])

@router.get("")
def fetch_weather(city: str):
    if not city:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="City name is required"
        )
    return get_weather(city)
