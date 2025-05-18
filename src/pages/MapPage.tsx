import React from "react";
import { Box, Typography } from "@mui/material";
import Map from "../components/Map/Map";

const MapPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Map
      </Typography>
      <Map />
    </Box>
  );
};

export default MapPage;
