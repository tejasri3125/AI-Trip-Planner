# TripPlanner AI - Full-Stack AI Travel Planner

TripPlanner AI is a production-ready, full-stack travel planning platform that generates personalized day-by-day itineraries using Retrieval-Augmented Generation (RAG) and integrates live weather forecasting, interactive geocoded maps, hotel recommendations, and cost breakdown estimations.

The application is built on a **FastAPI backend** (Python, ChromaDB, LangChain, Google Gemini) and a **React 19 frontend** (Vite, Tailwind CSS, Leaflet Maps, Lucide Icons).

---

## Key Features

1. **AI-Powered Day-by-Day Itineraries**: Generates morning, afternoon, and evening travel schedules customized to the user's source, destination, budget, style, and personal interests.
2. **Retrieval-Augmented Generation (RAG)**: Integrates destination culture, safety, dining, and custom tips from localized vector search indices (ChromaDB) before sending context prompts to Gemini.
3. **Live Weather Insights**: Uses the OpenWeather API to check local weather metrics (temperature, humidity, precipitation chance, wind speed). Features a realistic fallback simulator when API keys are not supplied.
4. **Interactive Leaflet Maps**: Draws live markers and geolocates hotels, restaurants, and attractions on an interactive Leaflet map without requiring credit-card-restricted Google Maps API access.
5. **Local Authentication**: Safe JWT-based sign-in and account registration storing user details on SQLite/PostgreSQL.
6. **Trip Saving & History**: Allows authenticated users to save their customized itineraries and manage them via a history dashboard.
7. **Voice Input (Speech-to-Text)**: Standard browser speech recognition (Web Speech API) transcribes verbal interest lists or destination parameters directly to the input fields.
8. **PDF Export**: Print-optimized stylesheet allows printing the entire formatted itinerary layout or exporting it to a PDF with one click.
9. **Interactive Chat Assistant**: Direct conversational interface with an AI Travel Assistant grounded in local RAG travel documents.

---

## Project Structure

```
tripplanner-ai/
│
├── backend/
│   ├── app/
│   │   ├── api/             # FastAPI Endpoint routers (auth, trips, weather, places, chat)
│   │   ├── models/          # SQLAlchemy database models & session creators
│   │   ├── prompts/         # Formatted Gemini instructions & system guidelines
│   │   ├── rag/             # Document loaders, splitters, and Chroma search pipeline
│   │   │   └── data/        # Seed markdown travel documents for RAG (Paris, Tokyo, Rome, NYC)
│   │   ├── services/        # Weather fetchers, Places resolvers, and AI generators
│   │   └── utils/           # Password hashing & JWT secure decoders
│   ├── .env                 # Environment variables template
│   └── requirements.txt     # Python backend requirements
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI widgets (Navbar, Map, Cards, ChatWindow, etc.)
│   │   ├── pages/           # Screen routes (Home, Planner, SavedTrips, Chat, Auth)
│   │   ├── services/        # Axios API handlers
│   │   ├── index.css        # Tailwind styling sheet
│   │   ├── App.jsx          # Route configurations
│   │   └── main.jsx         # React mounting wrapper
│   ├── tailwind.config.js   # Tailwind custom theme setup
│   └── postcss.config.js    # PostCSS configurations
│
└── README.md                # Project documentation
```

---

## Local Setup

### Prerequisite Software
- **Python 3.10+**
- **Node.js 18+** & **npm**

---

### Step 1: Set up the Backend API

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Windows PowerShell**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **macOS / Linux**:
     ```bash
     source venv/bin/activate
     ```

4. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Configure environment variables in `backend/.env`:
   - `GEMINI_API_KEY`: Enter your Google Gemini API key to enable AI features (optional: if left empty, the backend runs in a fully detailed simulated itinerary generation mode).
   - `OPENWEATHER_API_KEY`: Enter your OpenWeather Map key (optional: if blank, local weather forecasting is realistically simulated).
   - `DATABASE_URL`: Defaults to local SQLite (`sqlite:///./tripplanner.db`). For production PostgreSQL, specify the database URL.

6. Launch the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend API will run on **`http://localhost:8000`** with interactive Swagger documentation available at `http://localhost:8000/docs`.

---

### Step 2: Set up the Frontend Application

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install the frontend npm packages:
   ```bash
   npm install
   ```

3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   The application UI will run on **`http://localhost:5173`**.

---

## Docker Support

To run the entire stack inside Docker containers:

1. Create a `docker-compose.yml` at the root of the project:
   ```yaml
   version: '3.8'

   services:
     backend:
       build: ./backend
       ports:
         - "8000:8000"
       environment:
         - GEMINI_API_KEY=your_gemini_key
         - OPENWEATHER_API_KEY=your_weather_key
       volumes:
         - ./backend:/app
         
     frontend:
       build: ./frontend
       ports:
         - "5173:5173"
       depends_on:
         - backend
   ```

2. Execute:
   ```bash
   docker-compose up --build
   ```

---

## Deployment Guidelines

### Frontend (Vercel)
1. Link your frontend directory repository to Vercel.
2. In the Vite settings, configure the environment variable `VITE_API_URL` to point to your hosted backend address.
3. Deploy!

### Backend (Render)
1. Create a Web Service on Render and point it to your backend directory repository.
2. Choose **Python** as the runtime environment.
3. Configure the environment variables (`GEMINI_API_KEY`, `SECRET_KEY`, `DATABASE_URL`).
4. Set the build command: `pip install -r requirements.txt`
5. Set the start command: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
