const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface HealthResponse {
  success: boolean;
  message: string;
}

export const getHealth = async (): Promise<HealthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data: HealthResponse = await response.json();

  return data;
};