import os
import random
from typing import List, Dict, Any

# Map coordinates for cities to display on Leaflet
CITY_COORDINATES = {
    "paris": [48.8566, 2.3522],
    "tokyo": [35.6762, 139.6503],
    "new york": [40.7128, -74.0060],
    "nyc": [40.7128, -74.0060],
    "rome": [41.9028, 12.4964]
}

# Image URLs from Unsplash for visual excellence
PLACE_IMAGES = {
    "hotel": [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80"
    ],
    "attraction": [
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1522083165195-342750297f46?auto=format&fit=crop&w=600&q=80"
    ],
    "restaurant": [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80"
    ]
}

def get_places_for_destination(destination: str) -> Dict[str, List[Dict[str, Any]]]:
    """Generates rich attractions, hotels, and restaurants with ratings, prices, images, and coordinates."""
    dest_lower = destination.lower().strip()
    
    # Get base coordinates
    coords = CITY_COORDINATES.get(dest_lower, [48.8566, 2.3522])
    lat, lng = coords[0], coords[1]
    
    # Check for curated mock details
    if "paris" in dest_lower:
        return {
            "hotels": [
                {
                    "name": "Hotel Regina Louvre",
                    "rating": 4.7,
                    "price": "$$$",
                    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
                    "address": "2 Place des Pyramides, 75001 Paris",
                    "lat": 48.8632, "lng": 2.3315,
                    "description": "Elegant luxury hotel overlooking the Louvre and Tuileries Gardens."
                },
                {
                    "name": "Les Jardins du Marais",
                    "rating": 4.3,
                    "price": "$$",
                    "image": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
                    "address": "74 Rue Amelot, 75011 Paris",
                    "lat": 48.8598, "lng": 2.3688,
                    "description": "Charming boutique hotel with a large, beautiful private courtyard."
                }
            ],
            "attractions": [
                {
                    "name": "Eiffel Tower",
                    "rating": 4.8,
                    "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80",
                    "address": "Champ de Mars, 5 Avenue Anatole France, 75007 Paris",
                    "lat": 48.8584, "lng": 2.2945,
                    "opening_hours": "09:00 AM - 11:45 PM",
                    "description": "The iconic wrought-iron lattice tower on the Champ de Mars."
                },
                {
                    "name": "Louvre Museum",
                    "rating": 4.7,
                    "image": "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=600&q=80",
                    "address": "Rue de Rivoli, 75001 Paris",
                    "lat": 48.8606, "lng": 2.3376,
                    "opening_hours": "09:00 AM - 06:00 PM (Closed Tuesday)",
                    "description": "The world's largest art museum and a historic monument in Paris."
                }
            ],
            "restaurants": [
                {
                    "name": "Chez L'Ami Jean",
                    "rating": 4.6,
                    "price": "$$$",
                    "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
                    "address": "27 Rue Malar, 75007 Paris",
                    "lat": 48.8592, "lng": 2.3060,
                    "description": "Renowned bistro famous for classic Basque fare and legendary rice pudding."
                },
                {
                    "name": "Boulangerie Utopie",
                    "rating": 4.8,
                    "price": "$",
                    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
                    "address": "20 Rue Jean-Pierre Timbaud, 75011 Paris",
                    "lat": 48.8658, "lng": 2.3692,
                    "description": "Artisanal bakery known for spectacular sourdough, baguettes, and pastries."
                }
            ]
        }

    elif "tokyo" in dest_lower:
        return {
            "hotels": [
                {
                    "name": "Park Hyatt Tokyo",
                    "rating": 4.8,
                    "price": "$$$$",
                    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80",
                    "address": "3-7-1-2 Nishi-Shinjuku, Shinjuku, Tokyo 163-1055",
                    "lat": 35.6852, "lng": 139.6912,
                    "description": "Ultra-luxury hotel with stunning city views, featured in Lost in Translation."
                },
                {
                    "name": "Shibuya Stream Excel Hotel Tokyu",
                    "rating": 4.5,
                    "price": "$$",
                    "image": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
                    "address": "3-21-3 Shibuya, Tokyo 150-0002",
                    "lat": 35.6575, "lng": 139.7032,
                    "description": "Trendy, industrial-chic hotel located directly above the Shibuya Stream canal."
                }
            ],
            "attractions": [
                {
                    "name": "Senso-ji Temple",
                    "rating": 4.7,
                    "image": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
                    "address": "2-3-1 Asakusa, Taito City, Tokyo 111-0032",
                    "lat": 35.7148, "lng": 139.7967,
                    "opening_hours": "06:00 AM - 05:00 PM",
                    "description": "Tokyo's oldest and one of its most significant Buddhist temples."
                },
                {
                    "name": "Shibuya Sky",
                    "rating": 4.8,
                    "image": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80",
                    "address": "2-24-12 Shibuya, Tokyo 150-0002",
                    "lat": 35.6585, "lng": 139.7018,
                    "opening_hours": "10:00 AM - 10:30 PM",
                    "description": "Stunning open-air observation deck sitting 229 meters above Shibuya."
                }
            ],
            "restaurants": [
                {
                    "name": "Afuri Ramen Shinjuku",
                    "rating": 4.4,
                    "price": "$$",
                    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80",
                    "address": "1-1-5 Nishi-Shinjuku, Shinjuku, Tokyo 160-0023",
                    "lat": 35.6925, "lng": 139.6995,
                    "description": "Popular ramen joint famous for its refreshing chicken broth infused with Yuzu citrus."
                },
                {
                    "name": "Sushi Dai",
                    "rating": 4.7,
                    "price": "$$$",
                    "image": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
                    "address": "6-5-1 Toyosu, Koto City, Tokyo 135-0061",
                    "lat": 35.6445, "lng": 139.7915,
                    "description": "World-famous sushi bar located in the Toyosu Fish Market offering top-tier omakase."
                }
            ]
        }
    
    # Generic randomized coordinate-offset generator for other cities
    # Ensure stable output using random.seed based on city name
    hash_val = sum(ord(c) for c in dest_lower)
    random.seed(hash_val)
    
    hotel_names = [f"Grand {destination} Hotel", f"{destination} Boutique Inn", f"The Vista {destination}"]
    attraction_names = [f"Historic {destination} Square", f"{destination} Botanical Gardens", f"{destination} Royal Palace"]
    restaurant_names = [f"La Taberna {destination}", f"The Cozy Fork", f"Local Kitchen {destination}"]
    
    hotels = []
    for i, name in enumerate(hotel_names[:2]):
        lat_offset = random.uniform(-0.015, 0.015)
        lng_offset = random.uniform(-0.015, 0.015)
        hotels.append({
            "name": name,
            "rating": round(random.uniform(4.0, 4.9), 1),
            "price": random.choice(["$", "$$", "$$$"]),
            "image": PLACE_IMAGES["hotel"][i % len(PLACE_IMAGES["hotel"])],
            "address": f"{random.randint(10, 250)} Central Ave, {destination}",
            "lat": lat + lat_offset,
            "lng": lng + lng_offset,
            "description": f"A wonderful lodging option in the heart of {destination} with great amenities."
        })
        
    attractions = []
    for i, name in enumerate(attraction_names[:2]):
        lat_offset = random.uniform(-0.015, 0.015)
        lng_offset = random.uniform(-0.015, 0.015)
        attractions.append({
            "name": name,
            "rating": round(random.uniform(4.3, 4.9), 1),
            "image": PLACE_IMAGES["attraction"][i % len(PLACE_IMAGES["attraction"])],
            "address": f"{random.randint(1, 100)} Sightseeing Rd, {destination}",
            "lat": lat + lat_offset,
            "lng": lng + lng_offset,
            "opening_hours": "09:00 AM - 05:00 PM",
            "description": f"A must-visit cultural or natural landmark when exploring {destination}."
        })
        
    restaurants = []
    for i, name in enumerate(restaurant_names[:2]):
        lat_offset = random.uniform(-0.015, 0.015)
        lng_offset = random.uniform(-0.015, 0.015)
        restaurants.append({
            "name": name,
            "rating": round(random.uniform(4.2, 4.8), 1),
            "price": random.choice(["$", "$$", "$$$"]),
            "image": PLACE_IMAGES["restaurant"][i % len(PLACE_IMAGES["restaurant"])],
            "address": f"{random.randint(5, 120)} Dining St, {destination}",
            "lat": lat + lat_offset,
            "lng": lng + lng_offset,
            "description": f"Experience authentic local flavors prepared by passionate chefs in {destination}."
        })
        
    return {
        "hotels": hotels,
        "attractions": attractions,
        "restaurants": restaurants
    }
