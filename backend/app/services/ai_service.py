import os
import json
import google.generativeai as genai
from typing import Dict, Any, List
from app.prompts.templates import TRIP_PLANNER_SYSTEM_PROMPT, CHAT_ASSISTANT_SYSTEM_PROMPT

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def generate_trip_itinerary(
    source: str,
    destination: str,
    days: int,
    budget: str,
    style: str,
    interests: List[str],
    weather_info: Dict[str, Any],
    rag_context: List[Dict[str, Any]],
    places_info: Dict[str, Any]
) -> Dict[str, Any]:
    """Generates a structured travel itinerary using Gemini, with a robust simulated fallback."""
    
    # Format RAG and Places Context for the LLM
    context_str = ""
    if rag_context:
        context_str += "RAG Context retrieved from Local Travel Guides:\n"
        for idx, doc in enumerate(rag_context):
            context_str += f"- [{doc['metadata'].get('source', 'Guide')}]: {doc['text']}\n"
    
    places_str = f"Available local attractions: {', '.join([a['name'] for a in places_info.get('attractions', [])])}\n"
    places_str += f"Suggested local hotels: {', '.join([h['name'] for h in places_info.get('hotels', [])])}\n"
    places_str += f"Suggested local restaurants: {', '.join([r['name'] for r in places_info.get('restaurants', [])])}\n"

    prompt = f"""
    Create a {days}-day travel itinerary from {source} to {destination}.
    Travel Details:
    - Days: {days}
    - Budget Level: {budget}
    - Travel Style: {style}
    - Personal Interests: {', '.join(interests)}
    
    Weather Situation in {destination}:
    - Temp: {weather_info.get('temperature')}°C, Condition: {weather_info.get('condition')} ({weather_info.get('description')}), Humidity: {weather_info.get('humidity')}%
    
    {context_str}
    {places_str}
    
    Generate the day-by-day activities matching these parameters and write a budget breakdown. Return ONLY valid JSON.
    """

    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=TRIP_PLANNER_SYSTEM_PROMPT
            )
            response = model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            text_response = response.text.strip()
            # Parse to verify correct structure
            parsed_json = json.loads(text_response)
            parsed_json["is_simulated"] = False
            return parsed_json
        except Exception as e:
            print(f"AIService: Gemini generation failed: {e}. Falling back to simulation.")

    # Simulated Fallback Itinerary Generator (Works immediately out of the box!)
    return generate_mock_itinerary(destination, days, budget, style, interests, weather_info, places_info)


def ask_chat_assistant(query: str, chat_history: List[Dict[str, str]], destination: str, rag_context: List[Dict[str, Any]]) -> str:
    """Answers user queries grounded in RAG contexts using Gemini."""
    
    context_str = "No specific local travel guide documents retrieved for this query."
    if rag_context:
        context_str = "RAG Context retrieved from Local Travel Guides:\n"
        for idx, doc in enumerate(rag_context):
            context_str += f"Source document: {doc['metadata'].get('source', 'Guide')}\nContent: {doc['text']}\n\n"

    # Format history
    history_str = ""
    for msg in chat_history[-6:]:  # Keep last 6 messages
        role = "User" if msg["role"] == "user" else "Assistant"
        history_str += f"{role}: {msg['content']}\n"

    prompt = f"""
    The user is asking about: {destination}
    User Query: {query}
    
    {context_str}
    
    Chat History:
    {history_str}
    
    Answer the query accurately. Be engaging, friendly, and cite sources from the RAG Context (e.g. "[paris.md]") if you used them.
    """

    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=CHAT_ASSISTANT_SYSTEM_PROMPT
            )
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"AIService: Gemini Chat failed: {e}")
            
    # Mock Chat Assistant responses (Grounded in the RAG guides)
    query_lower = query.lower()
    if "culture" in query_lower or "etiquette" in query_lower or "tip" in query_lower:
        if "paris" in destination.lower():
            return "In **Paris**, always greet shopkeepers and waiters with a polite *'Bonjour'* or *'Bonsoir'*. Also, tipping is not required in France as service is included (service compris), but leaving 1-2 Euros is appreciated. [Source: paris.md]"
        elif "tokyo" in destination.lower():
            return "In **Tokyo**, tipping is strictly non-existent and can be considered offensive. staff will chase you down to return it. Also, use both hands when handing over cards or money. [Source: tokyo.md]"
        elif "new york" in destination.lower():
            return "In **New York**, tipping is standard. Tip 18% to 22% of the pre-tax bill in restaurants. [Source: newyork.md]"
        elif "rome" in destination.lower():
            return "In **Rome**, when visiting churches, both men and women must cover their shoulders and knees. Also, do not order a cappuccino after 11 AM! [Source: rome.md]"
            
    if "food" in query_lower or "eat" in query_lower or "restaurant" in query_lower or "dine" in query_lower:
        if "paris" in destination.lower():
            return "Here are food recommendations for **Paris**:\n- **Boulangerie Utopie**: Famous for pastries.\n- **Chez L'Ami Jean**: Try their legendary rice pudding.\nMake sure to try Steak Frites and Duck Confit! [Source: paris.md]"
        elif "tokyo" in destination.lower():
            return "Here are food recommendations for **Tokyo**:\n- **Afuri Ramen**: Try their refreshing Yuzu Shio Ramen.\n- **Sushi Dai**: Located in Toyosu Fish Market.\nTry Monjayaki on Monja Street! [Source: tokyo.md]"
        elif "new york" in destination.lower():
            return "Here are food recommendations for **New York**:\n- **Joe's Pizza**: Classic slice.\n- **Russ & Daughters**: Legendary bagels with lox.\n- **Katz's Delicatessen**: Outstanding pastrami! [Source: newyork.md]"
        elif "rome" in destination.lower():
            return "Here are food recommendations for **Rome**:\n- **Da Enzo al 29**: Famous for carbonara and cacio e pepe.\n- **Pizzarium**: Incredible pizza by the slice.\nTry artisanal gelato at Gelateria del Teatro! [Source: rome.md]"

    return f"Here are some helpful suggestions for your query in **{destination}**. Make sure to check out local transit options like the subway/metro, try some of the signature street foods, and visit major attractions early in the morning to beat the crowds! If you have a specific question about museums, local culture, or safety, let me know!"


def generate_mock_itinerary(
    destination: str,
    days: int,
    budget: str,
    style: str,
    interests: List[str],
    weather_info: Dict[str, Any],
    places_info: Dict[str, Any]
) -> Dict[str, Any]:
    """Fallback generator that creates beautiful, structured itineraries matching the parameters."""
    
    # Calculate costs based on budget level
    multiplier = 1.0
    if budget.lower() == "budget":
        multiplier = 0.5
    elif budget.lower() == "luxury":
        multiplier = 2.5
        
    hotel_cost = int(120 * multiplier * days)
    food_cost = int(50 * multiplier * days)
    transport_cost = int(15 * multiplier * days)
    activities_cost = int(30 * multiplier * days)
    misc_cost = int(20 * multiplier * days)
    total_cost = hotel_cost + food_cost + transport_cost + activities_cost + misc_cost
    
    # Gather places details
    attractions = [a["name"] for a in places_info.get("attractions", [])]
    hotels = [h["name"] for h in places_info.get("hotels", [])]
    restaurants = [r["name"] for r in places_info.get("restaurants", [])]
    
    # Build list of days
    itinerary_days = []
    
    # Define generic activities in case we don't have enough specific ones
    generic_morning = ["Explore the local historic downtown", "Visit the main museum and heritage site", "Stroll through the central park"]
    generic_afternoon = ["Take a guided food tour around local eateries", "Enjoy a scenic boat cruise or walking excursion", "Shop at the famous local market square"]
    generic_evening = ["Watch the sunset from a panoramic viewpoint", "Enjoy live local music at a cozy cafe", "Relax with a fine dinner and evening stroll"]

    for d in range(1, days + 1):
        # We try to weave in real attractions if we have them
        morning_title = attractions[(d-1) % len(attractions)] if attractions else generic_morning[(d-1) % len(generic_morning)]
        afternoon_title = restaurants[(d-1) % len(restaurants)] if restaurants else generic_afternoon[(d-1) % len(generic_afternoon)]
        evening_title = generic_evening[(d-1) % len(generic_evening)]
        
        if restaurants and d <= len(restaurants):
            afternoon_title = f"Lunch at {restaurants[d-1]} followed by shopping"
            
        itinerary_days.append({
            "day": d,
            "theme": f"Discovering {destination} - Day {d}",
            "activities": [
                {
                    "time": "Morning",
                    "title": morning_title,
                    "description": f"Kickstart your day in {destination} experiencing local heritage and key landmarks. The weather will be around {weather_info.get('temperature')}°C, making it suitable for walking tours."
                },
                {
                    "time": "Afternoon",
                    "title": afternoon_title,
                    "description": f"Dive deep into the local culinary scene. Sample famous treats, walk through popular shopping avenues, and enjoy the ambient environment."
                },
                {
                    "time": "Evening",
                    "title": evening_title,
                    "description": f"Wind down your day with stunning evening skylines, comfortable dining, and local entertainment recommended for {style} travelers."
                }
            ]
        })
        
    return {
        "destination": destination,
        "days": days,
        "budget_category": budget,
        "travel_style": style,
        "total_cost_estimate": total_cost,
        "budget_breakdown": {
            "hotels": hotel_cost,
            "food": food_cost,
            "transport": transport_cost,
            "activities": activities_cost,
            "miscellaneous": misc_cost
        },
        "local_tips": [
            f"Given the {weather_info.get('condition').lower()} weather, carry a light jacket and comfortable walking shoes.",
            f"If you're traveling {style}, check out local traveler passes to save on transit and activity fees.",
            "Always keep some small change for tipping or local vendors."
        ],
        "transport_suggestions": "We recommend using local trains and walking to explore details. Taxis are also readily available.",
        "itinerary": itinerary_days,
        "is_simulated": True
    }
