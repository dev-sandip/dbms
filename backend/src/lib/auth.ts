import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../db";
import { admin, openAPI } from "better-auth/plugins";
import { FRONTEND_DEPLOYED_URL } from "~/constants";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    "http://localhost:5173",
    FRONTEND_DEPLOYED_URL
],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [admin(), openAPI()],
});


