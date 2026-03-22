import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../db";
import { admin, openAPI} from "better-auth/plugins"
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
    }),
     emailAndPassword: { 
    enabled: true, 
  },
  plugins:[admin(),openAPI()]
});






