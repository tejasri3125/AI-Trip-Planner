
import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Any
from app.models.database import get_db
from app.models.models import SavedTrip, User
from app.utils.auth_utils import get_current_user
from app.services.weather_service import get_weather
from app.services.places_service import get_places_for_destination
from app.rag.rag_pipeline import rag_pipeline
from app.services.ai_service import generate_trip_itinerary

router = APIRouter(prefix="/trips", tags=["Trips"])

class TripPlanRequest(BaseModel):
    source: str
    destination: str
    days: int
    budget: str
    style: str
    interests: List[str]

class SaveTripRequest(BaseModel):
    source: str
    destination: str
    days: int
    budget: str
    style: str
    interests: List[str]
    itinerary_json: str  # Stringified JSON representing the plan

# Schema for response
class SavedTripResponse(BaseModel):
    id: int
    source: str
    destination: str
    days: int
    budget: str
    style: str
    interests: str
    itinerary_json: str
    created_at: Any

    class Config:
        from_attributes = True

@router.post("/plan-trip")
def plan_trip(request: TripPlanRequest):
    try:
        # 1. Fetch weather
        weather_info = get_weather(request.destination)
        
        # 2. Fetch attractions and hotels
        places_info = get_places_for_destination(request.destination)
        
        # 3. Retrieve RAG context (search for details matching destination & interests)
        query = f"Culture, food, attractions, and safety tips for {request.destination} with interests: {', '.join(request.interests)}"
        rag_context = rag_pipeline.search(query, destination=request.destination, top_k=3)
        
        # 4. Generate itinerary via Gemini
        itinerary = generate_trip_itinerary(
            source=request.source,
            destination=request.destination,
            days=request.days,
            budget=request.budget,
            style=request.style,
            interests=request.interests,
            weather_info=weather_info,
            rag_context=rag_context,
            places_info=places_info
        )
        
        # 5. Return complete plan
        return {
            "itinerary": itinerary,
            "weather": weather_info,
            "places": places_info,
            "rag_citations": [doc["metadata"].get("source") for doc in rag_context]
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate travel plan: {str(e)}"
        )

@router.post("/save-trip", response_model=SavedTripResponse)
def save_trip(request: SaveTripRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Save the trip connected to this user
    interests_str = ",".join(request.interests)
    db_trip = SavedTrip(
        user_id=current_user.id,
        source=request.source,
        destination=request.destination,
        days=request.days,
        budget=request.budget,
        style=request.style,
        interests=interests_str,
        itinerary_json=request.itinerary_json
    )
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

@router.get("/saved-trips", response_model=List[SavedTripResponse])
def get_saved_trips(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trips = db.query(SavedTrip).filter(SavedTrip.user_id == current_user.id).order_by(SavedTrip.created_at.desc()).all()
    return trips

@router.delete("/trip/{id}", status_code=status.HTTP_200_OK)
def delete_trip(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(SavedTrip).filter(SavedTrip.id == id, SavedTrip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found or unauthorized to delete."
        )
    db.delete(trip)
    db.commit()
    return {"message": "Trip successfully deleted"}
