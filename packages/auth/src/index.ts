import { connectDB, mongoose } from "@techcure/db";
import { env } from "@techcure/env/server";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export async function getAuth() {
  if (authInstance) {
    return authInstance;
  }

  // Ensure database connection exists
  await connectDB();

  // Get the database instance
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection not available.");
  }

  authInstance = betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    basePath: "/api/auth",
    database: mongodbAdapter(db),
    trustedOrigins: [env.CORS_ORIGIN, env.BETTER_AUTH_URL],
    emailAndPassword: {
      enabled: true,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },
    advanced: {
      defaultCookieAttributes: {
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
        secure: env.NODE_ENV === "production",
        httpOnly: true,
      },
    },
  });

  return authInstance;
}

// For backward compatibility, export auth as a promise
export const auth = getAuth();
