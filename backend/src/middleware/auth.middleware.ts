import type { RequestHandler } from "express";
import { fromNodeHeaders } from "better-auth/node";

import { auth } from "../auth.js";

export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    res.locals.authUserId = session.user.id;

    next();
  } catch (error) {
    next(error);
  }
};
