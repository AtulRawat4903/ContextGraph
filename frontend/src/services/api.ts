import { env } from "../config/env";

const API_BASE_URL = env.API_URL;

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