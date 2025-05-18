import React from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import darkTheme from "./theme/darkTheme";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import MapPage from "./pages/MapPage";
import TruckManagementPage from "./pages/TruckManagementPage";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { APP } from "./config/config";

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ErrorBoundary>
        <BrowserRouter>
          <Box
            sx={{
              display: "flex",
              minHeight: "100vh",
              bgcolor: "background.default",
            }}
          >
            <Sidebar />
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Header title={APP.NAME} />
              <Box sx={{ p: 3 }}>
                <Routes>
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/trucks" element={<TruckManagementPage />} />
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </Box>
            </Box>
          </Box>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
