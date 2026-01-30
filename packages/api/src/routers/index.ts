/**
 * App Router
 * 
 * Main entry point for all API routes
 */

import type { RouterClient } from "@orpc/server";

import { protectedProcedure, publicProcedure } from "../index";
import { coursesRouter } from "./courses.router";
import { subjectsRouter } from "./subjects.router";
import { topicsRouter } from "./topics.router";
import { progressRouter } from "./progress.router";
import { searchRouter } from "./search.router";

// ============================================================================
// Main App Router
// ============================================================================

export const appRouter = {
  // Health check
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),

  // Private data (example)
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    };
  }),

  // Feature routers
  courses: coursesRouter,
  subjects: subjectsRouter,
  topics: topicsRouter,
  progress: progressRouter,
  search: searchRouter,
};

// ============================================================================
// Type Exports
// ============================================================================

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
