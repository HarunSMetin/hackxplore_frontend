import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ContainerResponse, ContainerReadingResponse } from "../types/api";
import { commonStyles } from "../styles/commonStyles";
import { ContainerService } from "../services/api";
import ErrorBoundary from "../components/common/ErrorBoundary";

const DashboardPage: React.FC = () => {
  const [containers, setContainers] = useState<ContainerResponse[]>([]);
  const [readings, setReadings] = useState<ContainerReadingResponse[]>([]);

  // Use useCallback to memoize functions for useEffect dependencies
  const fetchContainers = useCallback(async () => {
    try {
      const data = await ContainerService.getAll();
      setContainers(data);
    } catch (error) {
      console.error("Error fetching containers:", error);
    }
  }, []);

  const fetchReadingsForContainers = useCallback(async () => {
    try {
      const allReadings: ContainerReadingResponse[] = [];

      for (const container of containers) {
        const data = await ContainerService.getReadings(container.id);
        allReadings.push(...data);
      }

      setReadings(allReadings);
    } catch (error) {
      console.error("Error fetching readings:", error);
    }
  }, [containers]);

  useEffect(() => {
    fetchContainers();
  }, [fetchContainers]);

  useEffect(() => {
    if (containers.length > 0) {
      fetchReadingsForContainers();
    }
  }, [containers, fetchReadingsForContainers]);

  // Prepare data for charts
  const containersByType = containers.reduce(
    (acc: { [key: string]: number }, container) => {
      acc[container.type] = (acc[container.type] || 0) + 1;
      return acc;
    },
    {}
  );

  const containerTypesChart = Object.keys(containersByType).map((type) => ({
    name: type,
    count: containersByType[type],
  }));

  // Group readings by day for the fill level history chart
  const readingsByDay = readings.reduce(
    (acc: { [key: string]: number }, reading) => {
      const date = new Date(reading.timestamp).toLocaleDateString();
      acc[date] = (acc[date] || 0) + reading.fill_level_litres;
      return acc;
    },
    {}
  );

  const fillLevelHistoryData = Object.keys(readingsByDay).map((date) => ({
    date,
    fillLevel: readingsByDay[date],
  }));

  // Calculate containers needing service directly
  const containersNeedingService = containers.filter(
    (c) => c.current_fill / c.capacity > 0.8
  ).length;

  return (
    <ErrorBoundary>
      <Box>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "text.primary",
            letterSpacing: 2,
            fontWeight: 700,
          }}
        >
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid>
            <Card sx={commonStyles.statCard}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "text.secondary", fontWeight: 500 }}
                >
                  Total Containers
                </Typography>
                <Typography variant="h3" sx={commonStyles.glowText}>
                  {containers.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid>
            <Card sx={commonStyles.statCard}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "text.secondary", fontWeight: 500 }}
                >
                  Waste Collected Today
                </Typography>
                <Typography variant="h3" sx={commonStyles.glowText}>
                  {readings
                    .filter(
                      (r) =>
                        new Date(r.timestamp).toLocaleDateString() ===
                        new Date().toLocaleDateString()
                    )
                    .reduce((sum, r) => sum + r.fill_level_litres, 0)}{" "}
                  L
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid>
            <Card sx={commonStyles.statCard}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "text.secondary", fontWeight: 500 }}
                >
                  Average Fill Level
                </Typography>
                <Typography variant="h3" sx={commonStyles.glowText}>
                  {containers.length > 0
                    ? Math.round(
                        (containers.reduce(
                          (sum, c) => sum + (c.current_fill / c.capacity) * 100,
                          0
                        ) /
                          containers.length) *
                          10
                      ) / 1000
                    : 0}
                  %
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid>
            <Card sx={commonStyles.statCard}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "text.secondary", fontWeight: 500 }}
                >
                  Containers Needing Service
                </Typography>
                <Typography variant="h3" sx={commonStyles.glowText}>
                  {containersNeedingService}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Container Types Chart */}
          <Grid>
            <Card sx={commonStyles.chartContainer}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "text.secondary", fontWeight: 500 }}
              >
                Container Types Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={containerTypesChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3a4256" />
                  <XAxis dataKey="name" stroke="text.secondary" />
                  <YAxis stroke="text.secondary" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "background.paper",
                      borderColor: "#3a4256",
                      color: "text.primary",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "text.secondary" }} />
                  <Bar dataKey="count" fill="#00bcd4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Fill Level History Chart */}
          <Grid>
            <Card sx={commonStyles.chartContainer}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "text.secondary", fontWeight: 500 }}
              >
                Fill Level History (Last 7 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fillLevelHistoryData.slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3a4256" />
                  <XAxis dataKey="date" stroke="text.secondary" />
                  <YAxis stroke="text.secondary" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "background.paper",
                      borderColor: "#3a4256",
                      color: "text.primary",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "text.secondary" }} />
                  <Line
                    type="monotone"
                    dataKey="fillLevel"
                    stroke="#00bcd4"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </ErrorBoundary>
  );
};

export default DashboardPage;
