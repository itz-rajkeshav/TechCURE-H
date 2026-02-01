import type { Request } from "express";

import { auth } from "@techcure/auth";
import { mongoose } from "@techcure/db";
import { fromNodeHeaders } from "better-auth/node";

interface CreateContextOptions {
  req: Request;
}

export async function createContext(opts: CreateContextOptions) {
  // Only check connection if it's not already connected
  // This avoids unnecessary database calls on every request
  if (mongoose.connection.readyState !== 1) {
    // Import dynamically to avoid circular dependency issues
    const { ensureConnection } = await import("@techcure/db");
    await ensureConnection();
  }
  
  // Get the auth instance (it's a promise)
  const authInstance = await auth;
  
  const session = await authInstance.api.getSession({
    headers: fromNodeHeaders(opts.req.headers),
  });
  
  return {
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
