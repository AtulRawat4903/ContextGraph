import { env } from "../config/env";
import { healthResponseSchema } from "../schemas/api.schema";
import type { HealthResponse } from "../schemas/api.schema";

const API_BASE_URL = env.API_URL;

export const getHealth = async (): Promise<HealthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data: unknown = await response.json();

  return healthResponseSchema.parse(data);
};