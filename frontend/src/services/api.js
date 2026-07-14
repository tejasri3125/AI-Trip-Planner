import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  async register(email, password) {
    const response = await api.post("/auth/register", { email, password });
    return response.data;
  },

  async login(email, password) {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    const response = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // Store token and user
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },

  async getMe() {
    const response = await api.get("/auth/me");
    return response.data;
  }
};

export const tripService = {
  async planTrip(planData) {
    // planData keys: source, destination, days, budget, style, interests (array)
    const response = await api.post("/trips/plan-trip", planData);
    return response.data;
  },

  async saveTrip(tripData) {
    // tripData keys: source, destination, days, budget, style, interests (array), itinerary_json (string)
    const response = await api.post("/trips/save-trip", tripData);
    return response.data;
  },

  async getSavedTrips() {
    const response = await api.get("/trips/saved-trips");
    return response.data;
  },

  async deleteTrip(id) {
    const response = await api.delete(`/trips/trip/${id}`);
    return response.data;
  }
};

export const chatService = {
  async sendMessage(query, destination, history) {
    // history is array of { role: "user" | "assistant", content: string }
    const response = await api.post("/chat", {
      query,
      destination,
      history
    });
    return response.data;
  }
};

export default api;
