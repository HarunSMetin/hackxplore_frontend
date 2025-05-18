// Helper utility functions used across the application

/**
 * Format date to a readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Calculate fill percentage of a container
 */
export const calculateFillPercentage = (
  current: number,
  capacity: number
): number => {
  if (capacity === 0) return 0;
  return Math.round((current / capacity) * 100);
};

/**
 * Get color based on fill percentage
 */
export const getFillColor = (fillPercentage: number): string => {
  if (fillPercentage < 40) return "green";
  if (fillPercentage < 80) return "yellow";
  return "red";
};

/**
 * Generate a simple route around a point (for demo/testing)
 */
export const generateRouteAroundPoint = (
  lat: number,
  lng: number,
  radius = 0.002
): Array<{ lat: number; lng: number }> => {
  return [
    { lat: lat - radius * 0.5, lng: lng - radius },
    { lat: lat, lng: lng },
    { lat: lat + radius, lng: lng + radius * 0.5 },
    { lat: lat + radius * 0.5, lng: lng + radius * 1.5 },
  ];
};

/**
 * Debounce function to limit how often a function is called
 */
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    return new Promise((resolve) => {
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
  };
};
