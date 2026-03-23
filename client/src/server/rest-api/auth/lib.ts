import { createAuthClient } from "better-auth/react";


export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_PUBLIC_SERVER_URL,

});