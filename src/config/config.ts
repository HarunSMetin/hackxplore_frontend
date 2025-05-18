// Configuration constants for the application

const isDevelopment = process.env.NODE_ENV === "development";

// API Configuration
export const API = {
  BASE_URL: isDevelopment
    ? "/api" // Use proxy in development
    : process.env.REACT_APP_API_BASE_URL ||
      "https://hackxplore-backend.onrender.com",
  ENDPOINTS: {
    CONTAINERS: "/containers",
    TRUCKS: "/trucks",
    HEALTH: "/health",
  },
};

// Map Configuration
export const MAP = {
  API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "YOUR_FALLBACK_KEY",
  DEFAULT_CENTER: { lat: 40.992, lng: 29.124 },
  DEFAULT_ZOOM: 13,
};

// Other app constants
export const APP = {
  NAME: "Green Route",
  DESCRIPTION: "Optimize your waste collection routes",
  VERSION: "1.0.0",
};
