import { SxProps, Theme } from "@mui/material";

// Common styles used across multiple components
export const commonStyles = {
  // Global glass card style
  glassCard: {
    background: "rgba(24, 28, 38, 0.85)",
    boxShadow: "0 8px 32px 0 rgba(0,0,0,0.45)",
    backdropFilter: "blur(8px)",
    borderRadius: "20px",
    border: "1.5px solid #23272f",
    color: "#fff",
  } as SxProps<Theme>,

  // Typography styles
  glowText: {
    color: "#e0e4ea",
    fontWeight: 700,
    textShadow: "0 0 8px #23272f, 0 0 2px #23272f",
  } as SxProps<Theme>,

  // Map-related styles
  mapContainer: {
    height: 500,
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: 8,
  } as SxProps<Theme>,

  // Form controls
  darkDropdown: {
    bgcolor: "rgba(30,32,40,0.85)",
    color: "white",
    "& .MuiSelect-icon": {
      color: "white",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.1)",
    },
  } as SxProps<Theme>,

  // Widget control panel
  controlPanel: {
    backgroundColor: "rgba(24, 28, 38, 0.85)",
    padding: 2,
    borderRadius: 2,
    border: "1px solid rgba(255,255,255,0.1)",
  } as SxProps<Theme>,

  // Dashboard layout
  dashboardContainer: {
    padding: 3,
  } as SxProps<Theme>,

  // Dashboard cards
  statCard: {
    background: "rgba(24, 28, 38, 0.85)",
    boxShadow: "0 8px 32px 0 rgba(0,0,0,0.45)",
    backdropFilter: "blur(8px)",
    borderRadius: "20px",
    border: "1.5px solid #23272f",
    color: "#fff",
    padding: 2,
    height: "100%",
  } as SxProps<Theme>,

  // Colors for capacity levels
  capacityColors: {
    low: "#4CAF50", // Green
    medium: "#FFC107", // Yellow/amber
    high: "#F44336", // Red
  },

  // Chart styles
  chartContainer: {
    background: "rgba(24, 28, 38, 0.85)",
    boxShadow: "0 8px 32px 0 rgba(0,0,0,0.45)",
    backdropFilter: "blur(8px)",
    borderRadius: "20px",
    border: "1.5px solid #23272f",
    color: "#fff",
    height: 400,
    p: 3,
  } as SxProps<Theme>,
};

// Map styles for Google Maps
export const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#212121" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#23272f" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#23272f" }],
  },
];
