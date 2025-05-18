import { API } from "../config/config";
import {
  ContainerCreate,
  ContainerResponse,
  ContainerUpdate,
  Truck,
  TruckCreate,
  TruckUpdate,
} from "../types/api";

// Helper for handling fetch responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || `API error: ${response.status}`);
  }
  return response.json();
};

// Container API services
export const ContainerService = {
  getAll: async (): Promise<ContainerResponse[]> => {
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.CONTAINERS}/`);
    return handleResponse(response);
  },

  getById: async (id: number): Promise<ContainerResponse> => {
    const response = await fetch(
      `${API.BASE_URL}${API.ENDPOINTS.CONTAINERS}/${id}`
    );
    return handleResponse(response);
  },

  create: async (container: ContainerCreate): Promise<ContainerResponse> => {
    const response = await fetch(
      `${API.BASE_URL}${API.ENDPOINTS.CONTAINERS}/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(container),
      }
    );
    return handleResponse(response);
  },

  update: async (
    id: number,
    updates: ContainerUpdate
  ): Promise<ContainerResponse> => {
    const response = await fetch(
      `${API.BASE_URL}${API.ENDPOINTS.CONTAINERS}/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }
    );
    return handleResponse(response);
  },

  delete: async (id: number): Promise<ContainerResponse> => {
    const response = await fetch(
      `${API.BASE_URL}${API.ENDPOINTS.CONTAINERS}/${id}`,
      {
        method: "DELETE",
      }
    );
    return handleResponse(response);
  },

  getCO2Estimate: async (id: number, delayedHours = 0): Promise<number> => {
    const response = await fetch(
      `${API.BASE_URL}${API.ENDPOINTS.CONTAINERS}/${id}/co2?delayed_hours=${delayedHours}`
    );
    return handleResponse(response);
  },

  getReadings: async (id: number): Promise<any[]> => {
    const response = await fetch(
      `${API.BASE_URL}${API.ENDPOINTS.CONTAINERS}/${id}/readings`
    );
    return handleResponse(response);
  },

  getTimestampRange: async () => {
    const response = await fetch(
      `${API.BASE_URL}/containers/readings/timestamp-range`
    );
    const data = await response.json();
    return {
      minTimestamp: new Date(data.min_timestamp),
      maxTimestamp: new Date(data.max_timestamp),
    };
  },

  getNearestReadings: async (timestamp: Date) => {
    const formattedTimestamp = timestamp.toISOString();
    const response = await fetch(
      `${API.BASE_URL}/containers/readings/nearest?timestamp=${formattedTimestamp}`
    );
    const data = await response.json();
    return data.readings;
  },
};

// Truck API services
export const TruckService = {
  getAll: async (): Promise<Truck[]> => {
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.TRUCKS}/`);
    return handleResponse(response);
  },

  getById: async (id: number): Promise<Truck> => {
    const response = await fetch(
      `${API.BASE_URL}${API.ENDPOINTS.TRUCKS}/${id}`
    );
    return handleResponse(response);
  },

  create: async (truck: TruckCreate): Promise<Truck> => {
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.TRUCKS}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(truck),
    });
    return handleResponse(response);
  },

  update: async (id: number, updates: TruckUpdate): Promise<Truck> => {
    const response = await fetch(
      `${API.BASE_URL}${API.ENDPOINTS.TRUCKS}/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }
    );
    return handleResponse(response);
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(
      `${API.BASE_URL}${API.ENDPOINTS.TRUCKS}/${id}`,
      {
        method: "DELETE",
      }
    );
    return handleResponse(response);
  },
};
