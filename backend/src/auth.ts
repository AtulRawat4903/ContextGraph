import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";

import { env } from "./config/env.js";
import { db } from "./db/index.js";

import { users, session, account, verification } from "./db/schema.js";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,

  secret: env.BETTER_AUTH_SECRET,

  trustedOrigins: [env.CLIENT_URL],

  database: drizzleAdapter(db, {
    provider: "pg",

    schema: {
      user: users,
      session,
      account,
      verification,
    },
  }),

  emailAndPassword: {
    enabled: true,
  },

  advanced: {
    database: {
      generateId: "uuid",
    },
  },
});
