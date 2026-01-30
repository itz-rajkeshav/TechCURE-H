/**
 * LearnPath API Module
 * 
 * Re-exports all API hooks and utilities for frontend data fetching.
 */

// Re-export all hooks
export * from "./hooks";

// Re-export orpc utilities
export { client, orpc, queryClient, link } from "@/utils/orpc";
