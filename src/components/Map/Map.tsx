/* eslint-disable */
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import {
  CircularProgress,
  MenuItem,
  Select,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { ContainerResponse, Truck } from "../../types/api";
import { MAP } from "../../config/config";
import { commonStyles, mapStyles } from "../../styles/commonStyles";
import {
  getFillColor,
  calculateFillPercentage,
  formatDate,
  generateRouteAroundPoint,
} from "../../utils/helpers";
import { TruckService, ContainerService } from "../../services/api";

const containerStyle = {
  width: "100%",
  height: "75vh", // Increased height for a larger map
  borderRadius: 16,
};

// Update the interface for container readings
interface ContainerReading {
  container_id: number;
  reading_id: number;
  timestamp: string;
  fullness: number;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

const MapComponent = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [selectedTruck, setSelectedTruck] = useState<number | null>(null);
  const [containers, setContainers] = useState<ContainerResponse[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [filteredContainers, setFilteredContainers] = useState<
    ContainerResponse[]
  >([]);
  const [filteredTrucks, setFilteredTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 49.4875, lng: 8.466 });
  const [mapZoom, setMapZoom] = useState(MAP.DEFAULT_ZOOM);
  const [mapLoaded, setMapLoaded] = useState(false);
  // Add containerReadings state with proper typing
  const [containerReadings, setContainerReadings] = useState<
    ContainerReading[]
  >([]);

  // Reference to the map instance
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: MAP.API_KEY,
    // Add these to help with loading issues
    libraries: ["places", "geometry"],
  });

  // Load data only after map is initialized
  useEffect(() => {
    if (isLoaded && mapLoaded) {
      fetchContainers();
      fetchTrucks();
    }
  }, [isLoaded, mapLoaded]);

  // Effect to focus on selected truck's route - only run when map is loaded
  useEffect(() => {
    if (selectedTruck && trucks.length > 0 && mapLoaded && mapRef.current) {
      const selectedTruckData = trucks.find((t) => t.id === selectedTruck);

      if (
        selectedTruckData &&
        selectedTruckData.route &&
        selectedTruckData.route.length > 0
      ) {
        focusOnRoute(selectedTruckData.route);
      } else if (selectedTruckData) {
        setMapCenter({
          lat: selectedTruckData.location_lat,
          lng: selectedTruckData.location_lng,
        });
        setMapZoom(15);
      }
    }
  }, [selectedTruck, trucks, mapLoaded]);

  // Use a callback to avoid recalculating this function on renders
  const focusOnRoute = useCallback(
    (route: Array<{ lat: number; lng: number }>) => {
      if (!route || route.length === 0 || !mapRef.current || !mapLoaded) return;

      try {
        const bounds = new google.maps.LatLngBounds();

        route.forEach((point) => {
          bounds.extend(new google.maps.LatLng(point.lat, point.lng));
        });

        // Center the map on the route bounds with a safe check
        if (!bounds.isEmpty()) {
          // Add a small padding to the bounds
          const padding = {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50,
          };

          mapRef.current.fitBounds(bounds, padding);
        }
      } catch (error) {
        console.error("Error focusing on route:", error);
        // Fallback to just setting the center to the first point
        if (route.length > 0) {
          setMapCenter(route[0]);
          setMapZoom(15);
        }
      }
    },
    [mapLoaded]
  );

  const fetchContainers = async () => {
    try {
      const data = await ContainerService.getAll();
      setContainers(data);
    } catch (error) {
      console.error("Error fetching containers:", error);
    }
  };

  const fetchTrucks = async () => {
    setLoading(true);
    try {
      const data = await TruckService.getAll();

      // Ensure data is an array before setting it to state
      if (Array.isArray(data)) {
        // Since your API doesn't include route information in the truck schema,
        // we need to add sample routes for visualization purposes
        const trucksWithRoutes = data.map((truck) => ({
          ...truck,
          // Generate a route around the truck's location
          route: generateRouteAroundPoint(
            truck.location_lat,
            truck.location_lng
          ),
        }));

        setTrucks(trucksWithRoutes);

        // Set the first truck as selected by default if trucks exist
        if (trucksWithRoutes.length > 0) {
          setSelectedTruck(trucksWithRoutes[0].id);
        }
      } else {
        console.error("Expected array of trucks but got:", data);
        setTrucks([]);
      }
    } catch (error) {
      console.error("Error fetching trucks:", error);
      // Fallback to sample data if API fails
      const sampleTrucks = [
        {
          id: 1,
          name: "Truck A",
          location_lat: 40.992,
          location_lng: 29.124,
          white_glass_capacity: 1000,
          green_glass_capacity: 1000,
          brown_glass_capacity: 1000,
          created_at: new Date().toISOString(),
          updated_at: null,
          route: [
            { lat: 40.992, lng: 29.124 },
            { lat: 40.995, lng: 29.128 },
            { lat: 40.99, lng: 29.12 },
          ],
        },
      ];
      setTrucks(sampleTrucks);
      setSelectedTruck(sampleTrucks[0].id);
    } finally {
      setLoading(false);
    }
  };

  // Handle map load safely
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setMapLoaded(true);
  };

  // Update state variables - remove endDate and add timestamp range
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [timeFilterEnabled, setTimeFilterEnabled] = useState(false);
  const [timestampRange, setTimestampRange] = useState<{
    minTimestamp: Date;
    maxTimestamp: Date;
  } | null>(null);

  // Add new effect to fetch timestamp range
  useEffect(() => {
    const fetchTimestampRange = async () => {
      try {
        const range = await ContainerService.getTimestampRange();
        setTimestampRange(range);
        // Set initial start date to the minimum timestamp
        setStartDate(range.minTimestamp);
      } catch (error) {
        console.error("Error fetching timestamp range:", error);
      }
    };

    fetchTimestampRange();
  }, []);

  // Update the filtering effect
  useEffect(() => {
    if (!timeFilterEnabled || !startDate || !timestampRange) {
      setFilteredContainers(containers);
      setFilteredTrucks(trucks);
      return;
    }

    // Filter containers to show only data after the selected start date
    const filteredC = containers.filter((container) => {
      const containerDate = new Date(container.last_updated);
      return (
        containerDate >= startDate &&
        containerDate <= timestampRange.maxTimestamp
      );
    });

    // Filter trucks similarly
    const filteredT = trucks.filter((truck) => {
      const truckDate = truck.updated_at
        ? new Date(truck.updated_at)
        : new Date(truck.created_at);
      return truckDate >= startDate && truckDate <= timestampRange.maxTimestamp;
    });

    setFilteredContainers(filteredC);
    setFilteredTrucks(filteredT);
  }, [containers, trucks, startDate, timeFilterEnabled, timestampRange]);

  // Update the filtering effect to fetch nearest readings
  useEffect(() => {
    const fetchReadings = async () => {
      if (!timeFilterEnabled || !startDate) {
        // When time filter is disabled, use the original container data
        setFilteredContainers(
          containers.map((container) => ({
            ...container,
            current_fill: container.current_fill / 1000, // Convert liters to cubic meters
          }))
        );
        return;
      }

      try {
        const readings = await ContainerService.getNearestReadings(startDate);
        setContainerReadings(readings);

        // Map the readings to container format for markers with proper typing
        const mappedContainers: ContainerResponse[] = readings.map(
          (reading: ContainerReading) => ({
            id: reading.container_id,
            name: `Container ${reading.container_id}`,
            address: reading.location,
            location_lat: reading.coordinates.latitude,
            location_lng: reading.coordinates.longitude,
            type: "unknown",
            capacity: 1000, // Set capacity to 1000L = 1m³
            current_fill: reading.fullness / 1000, // Convert liters to cubic meters
            last_updated: reading.timestamp,
          })
        );

        setFilteredContainers(mappedContainers);
      } catch (error) {
        console.error("Error fetching readings:", error);
        setFilteredContainers([]);
      }
    };

    fetchReadings();
  }, [startDate, timeFilterEnabled, containers]);

  // Helper to get a route between points using Google Directions API
  const getTruckRoute = async (
    origin: { lat: number; lng: number },
    waypoints: Array<{ lat: number; lng: number }>,
    destination: { lat: number; lng: number }
  ): Promise<Array<{ lat: number; lng: number }>> => {
    if (!window.google || !window.google.maps) return [];

    return new Promise((resolve, reject) => {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin,
          destination,
          waypoints: waypoints.map((wp) => ({
            location: new window.google.maps.LatLng(wp.lat, wp.lng),
            stopover: true,
          })),
          travelMode: window.google.maps.TravelMode.DRIVING,
          optimizeWaypoints: true,
        },
        (result, status) => {
          if (status === "OK" && result?.routes[0]) {
            const routePath = result.routes[0].overview_path.map((p) => ({
              lat: p.lat(),
              lng: p.lng(),
            }));
            resolve(routePath);
          } else {
            reject(status);
          }
        }
      );
    });
  };

  // Add a new state variable to store routes for all trucks
  const [truckRoutes, setTruckRoutes] = useState<{
    [truckId: number]: Array<{ lat: number; lng: number }>;
  }>({});

  useEffect(() => {
    const generateRoute = async () => {
      if (!selectedTruck || filteredContainers.length === 0 || !mapLoaded) {
        return;
      }

      const truck = trucks.find((t) => t.id === selectedTruck);
      if (!truck) return;

      // Check if we already have a route for this truck
      if (truckRoutes[selectedTruck] && truckRoutes[selectedTruck].length > 0) {
        // Just focus on the existing route
        focusOnRoute(truckRoutes[selectedTruck]);
        return;
      }

      // Use the truck's current location as origin and destination
      const origin = { lat: truck.location_lat, lng: truck.location_lng };
      const destination = origin;

      // Different route strategy for different trucks:
      // - Truck 1: Focuses on fullest containers first
      // - Truck 2: Focuses on containers closest to its position
      // - Other trucks: Mix of strategies

      let containersToVisit = [...filteredContainers];

      if (truck.id === 1) {
        // Sort by fullness to prioritize the fullest containers
        containersToVisit = containersToVisit.sort(
          (a, b) => b.current_fill - a.current_fill
        );
      } else if (truck.id === 2) {
        // Sort by distance to truck
        containersToVisit = containersToVisit.sort((a, b) => {
          const distanceA = Math.sqrt(
            Math.pow(a.location_lat - truck.location_lat, 2) +
              Math.pow(a.location_lng - truck.location_lng, 2)
          );
          const distanceB = Math.sqrt(
            Math.pow(b.location_lat - truck.location_lat, 2) +
              Math.pow(b.location_lng - truck.location_lng, 2)
          );
          return distanceA - distanceB;
        });
      } else {
        // Mix of strategies for other trucks
        // Make this random but deterministic for each truck
        const randomSeed = truck.id * 1000;
        containersToVisit = containersToVisit.sort((a, b) => {
          const valueA = a.current_fill + Math.sin(a.id * randomSeed) * 0.5;
          const valueB = b.current_fill + Math.sin(b.id * randomSeed) * 0.5;
          return valueB - valueA;
        });
      }

      // Limit to 23 waypoints (Google Maps has a limit of 25 including origin/destination)
      const waypoints = containersToVisit.slice(0, 23).map((c) => ({
        lat: c.location_lat,
        lng: c.location_lng,
      }));

      try {
        const route = await getTruckRoute(origin, waypoints, destination);

        // Store the route for this specific truck
        setTruckRoutes((prev) => ({
          ...prev,
          [truck.id]: route,
        }));

        // If you have a valid route, focus on it
        if (route.length > 0) {
          focusOnRoute(route);
        }
      } catch (err) {
        console.error("Failed to get truck route:", err);
      }
    };

    generateRoute();
    // Only re-run when relevant data changes
  }, [selectedTruck, filteredContainers, trucks, mapLoaded, truckRoutes]);

  if (loadError) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Error loading Google Maps: {loadError.message}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Please check your API key and network connection.
        </Typography>
      </Box>
    );
  }

  if (!isLoaded || loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="500px"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minHeight: "90vh",
      }}
    >
      {/* Add this time filter panel before the truck selection panel */}
      <Box sx={commonStyles.controlPanel}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="subtitle2" sx={{ color: "#b0b8c1" }}>
            Time Filter
          </Typography>
          <Button
            size="small"
            startIcon={<FilterAltIcon />}
            variant={timeFilterEnabled ? "contained" : "outlined"}
            onClick={() => setTimeFilterEnabled(!timeFilterEnabled)}
            sx={{ borderRadius: 2 }}
          >
            {timeFilterEnabled ? "Enabled" : "Disabled"}
          </Button>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={2}>
            <DateTimePicker
              label="Show Data From"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              disabled={!timeFilterEnabled || !timestampRange}
              minDateTime={timestampRange?.minTimestamp}
              maxDateTime={timestampRange?.maxTimestamp}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  sx: commonStyles.darkDropdown,
                  helperText: timestampRange
                    ? `Available data range: ${timestampRange.minTimestamp.toLocaleDateString()} - ${timestampRange.maxTimestamp.toLocaleDateString()}`
                    : "Loading available data range...",
                },
              }}
            />
          </Stack>
        </LocalizationProvider>
      </Box>

      <Box sx={commonStyles.controlPanel}>
        <Typography variant="subtitle2" sx={{ color: "#b0b8c1", mb: 1 }}>
          Select Truck
        </Typography>
        <Select
          fullWidth
          value={selectedTruck || ""}
          onChange={(e) => setSelectedTruck(Number(e.target.value))}
          sx={commonStyles.darkDropdown}
          disabled={!mapLoaded}
        >
          {trucks.map((truck) => (
            <MenuItem key={truck.id} value={truck.id}>
              {truck.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box
        sx={{ ...commonStyles.mapContainer, flexGrow: 1, minHeight: "75vh" }}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={mapZoom}
          options={{
            styles: mapStyles,
            disableDefaultUI: true,
          }}
          onLoad={handleMapLoad}
        >
          {mapLoaded &&
            filteredContainers.map((c) => (
              <Marker
                key={c.id}
                position={{ lat: c.location_lat, lng: c.location_lng }}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 12,
                  fillColor: getFillColor(c.current_fill), // Already in percentage form
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: "#23272f",
                }}
                onClick={() => setSelected(c.id)}
              />
            ))}

          {/* Update InfoWindow to show reading details */}
          {mapLoaded &&
            selected !== null &&
            filteredContainers.find((c) => c.id === selected) && (
              <InfoWindow
                position={{
                  lat: filteredContainers.find((c) => c.id === selected)!
                    .location_lat,
                  lng: filteredContainers.find((c) => c.id === selected)!
                    .location_lng,
                }}
                onCloseClick={() => setSelected(null)}
              >
                <Paper
                  sx={{
                    p: 2,
                    minWidth: 220,
                    borderRadius: 4,
                    bgcolor: "rgba(30,32,40,0.85)",
                    backdropFilter: "blur(8px)",
                    color: "white",
                    boxShadow: 8,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    Container {selected}
                  </Typography>
                  <Typography variant="body2">
                    Address:{" "}
                    {filteredContainers.find((c) => c.id === selected)?.address}
                  </Typography>
                  <Typography variant="body2">
                    Fill Level:{" "}
                    {(
                      filteredContainers.find((c) => c.id === selected)
                        ?.current_fill || 0
                    ).toFixed(2)}
                    m³
                  </Typography>
                  <Typography variant="body2">
                    Last Reading:{" "}
                    {formatDate(
                      filteredContainers.find((c) => c.id === selected)
                        ?.last_updated || ""
                    )}
                  </Typography>
                  <Chip
                    label="View Details"
                    size="small"
                    color="primary"
                    sx={{ mt: 1, borderRadius: 1 }}
                  />
                </Paper>
              </InfoWindow>
            )}

          {/* Only render the road-based truck route */}
          {mapLoaded &&
            selectedTruck &&
            truckRoutes[selectedTruck] &&
            truckRoutes[selectedTruck].length > 1 && (
              <Polyline
                path={truckRoutes[selectedTruck]}
                options={{
                  strokeColor:
                    selectedTruck === 1
                      ? "#00bcd4"
                      : selectedTruck === 2
                      ? "#ff9800"
                      : "#4caf50",
                  strokeOpacity: 0.9,
                  strokeWeight: 6,
                  icons: [
                    {
                      icon: {
                        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                        scale: 3,
                      },
                      offset: "50%",
                      repeat: "100px",
                    },
                  ],
                  zIndex: 2,
                }}
              />
            )}

          {timeFilterEnabled && timestampRange && (
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                right: "20px",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                zIndex: 1000,
              }}
            >
              Showing container readings at:
              <br />
              {startDate?.toLocaleString()}
            </div>
          )}
        </GoogleMap>
      </Box>
    </Box>
  );
};

export default MapComponent;
