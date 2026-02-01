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
import { flowRouter } from "./flow.router";
import { analyticsRouter } from "./analytics.router";
import { userRouter } from "./user.router";
import { exportRouter } from "./export.router";
import { aiRouter } from "./ai.router";
import { learningRouter } from "./learning.router";
import { contextRouter } from "./context.router";

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

  // =========================================================================
  // Public Feature Routers
  // =========================================================================

  /** Course management (CBSE, JEE, NEET) */
  courses: coursesRouter,

  /** Subject management within courses */
  subjects: subjectsRouter,

  /** Learning topic management */
  topics: topicsRouter,

  /** Search topics and subjects */
  search: searchRouter,

  /** React Flow graph data */
  flow: flowRouter,

  /** Analytics and statistics */
  analytics: analyticsRouter,

  /** Export data in JSON/CSV */
  export: exportRouter,

  // =========================================================================
  // Protected Feature Routers
  // =========================================================================

  /** User progress tracking */
  progress: progressRouter,

  /** User profile and settings */
  user: userRouter,

  /** AI-powered study assistant */
  ai: aiRouter,

  /** Interactive learning features (quizzes, flashcards, gamification) */
  learning: learningRouter,

  /** Learning context and syllabus management */
  context: contextRouter,
};

// ============================================================================
// Type Exports
// ============================================================================

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
