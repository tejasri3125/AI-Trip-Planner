import os
import requests
import random
from typing import Dict, Any

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

def get_weather(city: str) -> Dict[str, Any]:
    """Fetches real weather from OpenWeather if key exists, otherwise generates high-quality mock weather."""
    if OPENWEATHER_API_KEY:
        try:
            url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                data = response.json()
                return {
                    "temperature": round(data["main"]["temp"], 1),
                    "condition": data["weather"][0]["main"],
                    "description": data["weather"][0]["description"].capitalize(),
                    "humidity": data["main"]["humidity"],
                    "wind_speed": round(data["wind"]["speed"] * 3.6, 1),  # Convert m/s to km/h
                    "rain_probability": 20 if "rain" not in data else 80,
                    "is_mock": False
                }
        except Exception as e:
            print(f"WeatherService: API call failed: {e}. Falling back to simulation.")

    # Simulated/Mock Weather Generator
    # Base temperatures and weather trends for popular cities
    city_lower = city.lower()
    
    # Defaults
    base_temp = 20.0
    condition = "Partly Cloudy"
    description = "scattered clouds"
    humidity = 60
    wind_speed = 12.5
    rain_prob = 15
    
    if "paris" in city_lower:
        base_temp = 18.5
        condition = "Sunny"
        description = "clear sky"
        humidity = 55
        wind_speed = 10.0
        rain_prob = 10
    elif "tokyo" in city_lower:
        base_temp = 22.0
        condition = "Pleasant"
        description = "gentle breeze"
        humidity = 65
        wind_speed = 8.5
        rain_prob = 20
    elif "new york" in city_lower or "nyc" in city_lower:
        base_temp = 15.0
        condition = "Windy"
        description = "moderate wind"
        humidity = 50
        wind_speed = 22.0
        rain_prob = 30
    elif "rome" in city_lower:
        base_temp = 24.5
        condition = "Clear"
        description = "clear sky"
        humidity = 45
        wind_speed = 7.0
        rain_prob = 5
    else:
        # Generate some randomized but stable values
        hash_val = sum(ord(c) for c in city_lower)
        random.seed(hash_val)
        base_temp = round(random.uniform(15.0, 28.0), 1)
        conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"]
        condition = random.choice(conditions)
        descriptions = {
            "Sunny": "clear sky",
            "Partly Cloudy": "scattered clouds",
            "Cloudy": "broken clouds",
            "Light Rain": "drizzle"
        }
        description = descriptions[condition]
        humidity = random.randint(40, 85)
        wind_speed = round(random.uniform(5.0, 25.0), 1)
        rain_prob = 80 if condition == "Light Rain" else random.randint(5, 40)
        
    return {
        "temperature": base_temp,
        "condition": condition,
        "description": description,
        "humidity": humidity,
        "wind_speed": wind_speed,
        "rain_probability": rain_prob,
        "is_mock": True
    }
