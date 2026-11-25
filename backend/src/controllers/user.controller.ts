import type { RequestHandler } from "express";
import { getAuthenticatedUserId } from "../utils/auth-context.js";

export const getCurrentUser: RequestHandler = (_req, res) => {
  const userId = getAuthenticatedUserId(res.locals);

  res.status(200).json({
    success: true,
    user: {
      id: userId,
    },
  });
};
