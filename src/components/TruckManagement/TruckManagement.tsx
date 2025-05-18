import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress,
  Divider,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Truck, TruckCreate } from "../../types/api";
import { TruckService } from "../../services/api";
import { commonStyles } from "../../styles/commonStyles";

const initialTruck: TruckCreate = {
  name: "",
  location_lat: 0,
  location_lng: 0,
  white_glass_capacity: 0,
  green_glass_capacity: 0,
  brown_glass_capacity: 0,
};

const TruckManagement: React.FC = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<TruckCreate>(initialTruck);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrucks();
  }, []);

  const fetchTrucks = async () => {
    setLoading(true);
    try {
      const data = await TruckService.getAll();
      setTrucks(data);
    } catch (error) {
      console.error("Error fetching trucks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Open dialog for add or edit
  const handleOpen = (truck?: Truck) => {
    if (truck) {
      setEditId(truck.id);
      setForm({
        name: truck.name,
        location_lat: truck.location_lat,
        location_lng: truck.location_lng,
        white_glass_capacity: truck.white_glass_capacity,
        green_glass_capacity: truck.green_glass_capacity,
        brown_glass_capacity: truck.brown_glass_capacity,
      });
    } else {
      setEditId(null);
      setForm(initialTruck);
    }
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
    setForm(initialTruck);
    setEditId(null);
  };

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.type === "number" ? parseFloat(e.target.value) : e.target.value;

    setForm({ ...form, [e.target.name]: value });
  };

  // Save truck (add or update)
  const handleSave = async () => {
    setLoading(true);
    try {
      if (editId) {
        // Update existing truck
        const updatedTruck = await TruckService.update(editId, form);
        setTrucks((prev) =>
          prev.map((t) => (t.id === editId ? updatedTruck : t))
        );
      } else {
        // Create new truck
        const newTruck = await TruckService.create(form);
        setTrucks((prev) => [...prev, newTruck]);
      }
      handleClose();
    } catch (error) {
      console.error("Error saving truck:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete truck
  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await TruckService.delete(id);
      setTrucks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting truck:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate a capacity percentage
  const getTotalCapacity = (truck: Truck) => {
    return (
      truck.white_glass_capacity +
      truck.green_glass_capacity +
      truck.brown_glass_capacity
    );
  };

  // Generate a random number between 0-70 to simulate current usage (for visualization only)
  const getSimulatedUsage = (truck: Truck) => {
    // Use truck.id as seed for deterministic "random" values
    return (truck.id * 17) % 70;
  };

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          Truck Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          disabled={loading}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            background: "linear-gradient(45deg, #00bcd4 30%, #2196f3 90%)",
            boxShadow: "0 3px 5px 2px rgba(0, 188, 212, .3)",
          }}
        >
          Add New Truck
        </Button>
      </Box>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      <Grid container spacing={3}>
        {trucks.map((truck) => {
          const usagePercent = getSimulatedUsage(truck);
          const totalCapacity = getTotalCapacity(truck);

          return (
            <Grid>
              <Card
                sx={{
                  ...commonStyles.glassCard,
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow:
                      "0 12px 20px -10px rgba(0,188,212,0.28), 0 4px 20px 0 rgba(0,0,0,0.12), 0 7px 8px -5px rgba(0,188,212,0.2)",
                  },
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {/* Truck Icon Avatar */}
                <Avatar
                  sx={{
                    position: "absolute",
                    top: -20,
                    left: 20,
                    width: 60,
                    height: 60,
                    backgroundColor: "#00bcd4",
                    boxShadow:
                      "0 4px 20px 0 rgba(0,0,0,0.14), 0 7px 10px -5px rgba(0,188,212,0.4)",
                  }}
                >
                  <LocalShippingIcon fontSize="large" />
                </Avatar>

                <CardContent sx={{ pt: 5, pb: 2 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, mb: 1, color: "#fff" }}
                    >
                      {truck.name}
                    </Typography>
                    <Box>
                      <IconButton
                        onClick={() => handleOpen(truck)}
                        size="small"
                        sx={{
                          color: "#fff",
                          backgroundColor: "rgba(33, 150, 243, 0.2)",
                          "&:hover": {
                            backgroundColor: "rgba(33, 150, 243, 0.3)",
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(truck.id)}
                        size="small"
                        sx={{
                          ml: 1,
                          color: "#fff",
                          backgroundColor: "rgba(244, 67, 54, 0.2)",
                          "&:hover": {
                            backgroundColor: "rgba(244, 67, 54, 0.3)",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1.5, opacity: 0.2 }} />

                  {/* Capacity Section */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Total Capacity: <b>{totalCapacity} L</b>
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={usagePercent}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        mb: 1,
                        background: "rgba(255,255,255,0.1)",
                        "& .MuiLinearProgress-bar": {
                          background:
                            usagePercent > 80
                              ? "linear-gradient(45deg, #ff9800 30%, #f44336 90%)"
                              : "linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)",
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Current Usage: <b>{usagePercent}%</b>
                    </Typography>
                  </Box>

                  {/* Capacity Type Chips */}
                  <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                    <Chip
                      label={`White: ${truck.white_glass_capacity}L`}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.9)",
                        color: "#333",
                      }}
                    />
                    <Chip
                      label={`Green: ${truck.green_glass_capacity}L`}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(76,175,80,0.2)",
                        borderColor: "rgba(76,175,80,0.5)",
                        color: "#4caf50",
                      }}
                    />
                    <Chip
                      label={`Brown: ${truck.brown_glass_capacity}L`}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(121,85,72,0.2)",
                        borderColor: "rgba(121,85,72,0.5)",
                        color: "#8d6e63",
                      }}
                    />
                  </Box>

                  {/* Location with Icon */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationOnIcon sx={{ color: "#f44336", fontSize: 18 }} />
                    <Typography variant="body2" color="text.secondary">
                      {truck.location_lat.toFixed(4)},{" "}
                      {truck.location_lng.toFixed(4)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            background: "rgba(24, 28, 38, 0.95)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.45)",
            borderRadius: "20px",
            border: "1.5px solid #23272f",
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <Typography variant="h5" fontWeight={700}>
            {editId ? "Edit Truck" : "Add New Truck"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            margin="dense"
            label="Truck Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
            disabled={loading}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.1)",
                },
              },
            }}
          />

          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Capacity Settings
            </Typography>
            <Divider sx={{ mb: 2, opacity: 0.2 }} />
          </Box>

          <Grid container spacing={2}>
            <Grid>
              <TextField
                margin="dense"
                label="White Glass Capacity"
                name="white_glass_capacity"
                type="number"
                value={form.white_glass_capacity}
                onChange={handleChange}
                fullWidth
                required
                disabled={loading}
                InputProps={{
                  endAdornment: <Typography variant="caption">L</Typography>,
                }}
              />
            </Grid>
            <Grid>
              <TextField
                margin="dense"
                label="Green Glass Capacity"
                name="green_glass_capacity"
                type="number"
                value={form.green_glass_capacity}
                onChange={handleChange}
                fullWidth
                required
                disabled={loading}
                InputProps={{
                  endAdornment: <Typography variant="caption">L</Typography>,
                }}
              />
            </Grid>
            <Grid>
              <TextField
                margin="dense"
                label="Brown Glass Capacity"
                name="brown_glass_capacity"
                type="number"
                value={form.brown_glass_capacity}
                onChange={handleChange}
                fullWidth
                required
                disabled={loading}
                InputProps={{
                  endAdornment: <Typography variant="caption">L</Typography>,
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Location Coordinates
            </Typography>
            <Divider sx={{ mb: 2, opacity: 0.2 }} />
          </Box>

          <Grid container spacing={2}>
            <Grid>
              <TextField
                margin="dense"
                label="Location Latitude"
                name="location_lat"
                type="number"
                value={form.location_lat}
                onChange={handleChange}
                fullWidth
                required
                disabled={loading}
              />
            </Grid>
            <Grid>
              <TextField
                margin="dense"
                label="Location Longitude"
                name="location_lng"
                type="number"
                value={form.location_lng}
                onChange={handleChange}
                fullWidth
                required
                disabled={loading}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{ color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 3,
              background: "linear-gradient(45deg, #00bcd4 30%, #2196f3 90%)",
              boxShadow: "0 3px 5px 2px rgba(0, 188, 212, .3)",
            }}
          >
            {editId ? "Update Truck" : "Add Truck"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TruckManagement;
