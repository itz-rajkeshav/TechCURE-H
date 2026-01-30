import { env } from "@techcure/env/web";
import { createAuthClient } from "better-auth/react";

console.log("🔗 Auth Client - Server URL:", env.VITE_SERVER_URL);

export const authClient = createAuthClient({
  baseURL: env.VITE_SERVER_URL,
});
