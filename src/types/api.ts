export interface ContainerCreate {
  name: string;
  address: string;
  location_lat: number;
  location_lng: number;
  type: string;
  capacity: number;
  current_fill: number;
}

export interface ContainerUpdate {
  name?: string | null;
  address?: string | null;
  location_lat?: number | null;
  location_lng?: number | null;
  type?: string | null;
  capacity?: number | null;
  current_fill?: number | null;
  last_updated?: string | null;
}

export interface ContainerResponse {
  id: number;
  name: string;
  address: string;
  location_lat: number;
  location_lng: number;
  type: string;
  capacity: number;
  current_fill: number;
  last_updated: string;
}

export interface ContainerReadingResponse {
  container_id: number;
  timestamp: string;
  fill_level_litres: number;
  reading_id: number;
}

// Add the Truck interface here from Map.tsx and other locations
export interface Truck {
  id: number;
  name: string;
  location_lat: number;
  location_lng: number;
  white_glass_capacity: number;
  green_glass_capacity: number;
  brown_glass_capacity: number;
  created_at: string;
  updated_at: string | null;
  route?: Array<{ lat: number; lng: number }>;
}

export interface TruckCreate {
  name: string;
  location_lat: number;
  location_lng: number;
  white_glass_capacity: number;
  green_glass_capacity: number;
  brown_glass_capacity: number;
}

export interface TruckUpdate {
  name?: string | null;
  location_lat?: number | null;
  location_lng?: number | null;
  white_glass_capacity?: number | null;
  green_glass_capacity?: number | null;
  brown_glass_capacity?: number | null;
}
