import { z } from "zod";

export const healthResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;