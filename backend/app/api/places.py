from fastapi import APIRouter, HTTPException, status
from app.services.places_service import get_places_for_destination

router = APIRouter(prefix="/places", tags=["Places"])

@router.get("")
def fetch_places(destination: str):
    if not destination:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Destination name is required"
        )
    return get_places_for_destination(destination)
