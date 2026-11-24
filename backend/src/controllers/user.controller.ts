import type { RequestHandler } from "express";

export const getCurrentUser: RequestHandler = (
  _req,
  res,
) => {
  res.status(200).json({
    success: true,
    user: {
      id: res.locals.authUserId,
    },
  });
};
