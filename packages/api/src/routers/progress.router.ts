/**
 * Progress Router
 * 
 * API endpoints for tracking user progress on topics
 * All endpoints require authentication
 */

import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure } from "../index";
import { UserProgress, Topic, type IUserProgress, type ITopic } from "@techcure/db";

// ============================================================================
// Input Schemas
// ============================================================================

const getProgressInput = z.object({
    subjectId: z.string(),
});

const updateProgressInput = z.object({
    topicId: z.string(),
    subjectId: z.string(),
    status: z.enum(["not_started", "in_progress", "completed"]),
    notes: z.string().max(1000).optional(),
    timeSpent: z.number().min(0).optional(),
});

const getStatsInput = z.object({
    subjectId: z.string().optional(),
});

// ============================================================================
// Procedures
// ============================================================================

/**
 * Get all progress for current user
 */
export const getAllProgress = protectedProcedure
    .handler(async ({ context }) => {
        const userId = context.session?.user?.id;

        if (!userId) {
            throw new ORPCError("UNAUTHORIZED");
        }

        const progress = await UserProgress.find({ user: userId })
            .populate("topic")
            .lean()
            .exec();

        return progress;
    });

/**
 * Get progress for a specific subject
 */
export const getProgress = protectedProcedure
    .input(getProgressInput)
    .handler(async ({ input, context }) => {
        const userId = context.session?.user?.id;

        if (!userId) {
            throw new ORPCError("UNAUTHORIZED");
        }

        const progress = await UserProgress.find({
            user: userId,
            subject: input.subjectId,
        }).populate("topic").lean().exec();

        // Get all topics for the subject
        const allTopics = await Topic.find({ subject: input.subjectId }).lean().exec();

        // Create a map of progress by topic ID
        const progressMap = new Map(
            progress.map((p: IUserProgress) => [p.topic?.toString(), p])
        );

        // Build full progress list with defaults for topics without progress
        const fullProgress = allTopics.map((topic: ITopic) => {
            const existing = progressMap.get(topic._id?.toString() ?? "");
            return existing || {
                topic,
                status: "not_started",
                timeSpent: 0,
            };
        });

        return fullProgress;
    });

/**
 * Update progress for a topic
 */
export const updateProgress = protectedProcedure
    .input(updateProgressInput)
    .handler(async ({ input, context }) => {
        const userId = context.session?.user?.id;

        if (!userId) {
            throw new ORPCError("UNAUTHORIZED");
        }

        // Verify topic exists
        const topic = await Topic.findById(input.topicId).exec();
        if (!topic) {
            throw new ORPCError("NOT_FOUND");
        }

        // Upsert progress with improved retry logic for race conditions
        let retries = 3;
        let progress = null;
        
        while (retries > 0) {
            try {
                progress = await UserProgress.findOneAndUpdate(
                    {
                        user: userId,
                        topic: input.topicId,
                    },
                    {
                        $set: {
                            user: userId,
                            topic: input.topicId,
                            subject: input.subjectId,
                            status: input.status,
                            notes: input.notes,
                            updatedAt: new Date(),
                            ...(input.timeSpent !== undefined && { timeSpent: input.timeSpent }),
                            ...(input.status === "completed" && { completedAt: new Date() }),
                        },
                        $setOnInsert: {
                            createdAt: new Date(),
                        }
                    },
                    { 
                        upsert: true, 
                        new: true,
                        runValidators: true,
                        setDefaultsOnInsert: true
                    }
                ).lean().exec();
                
                break; // Success, exit retry loop
            } catch (error: any) {
                retries--;
                
                if (error.code === 11000 && retries > 0) {
                    // Duplicate key error (race condition), use exponential backoff
                    const backoffMs = Math.pow(2, 3 - retries) * 100 + Math.random() * 100;
                    console.warn(`Race condition detected for user ${userId}, topic ${input.topicId}. Retrying in ${backoffMs}ms...`);
                    await new Promise(resolve => setTimeout(resolve, backoffMs));
                    continue;
                } else if (error.code === 11000) {
                    // Final retry failed due to race condition
                    console.error(`Persistent race condition for user ${userId}, topic ${input.topicId}. All retries exhausted.`);
                    throw new ORPCError("CONFLICT", { message: "Unable to update progress due to concurrent modifications" });
                }
                
                // Other errors, don't retry
                console.error(`Progress update error for user ${userId}, topic ${input.topicId}:`, error);
                throw error;
            }
        }

        if (!progress) {
            throw new ORPCError("INTERNAL_SERVER_ERROR");
        }

        return progress;
    });

/**
 * Get user statistics
 */
export const getStats = protectedProcedure
    .input(getStatsInput)
    .handler(async ({ input, context }) => {
        const userId = context.session?.user?.id;

        if (!userId) {
            throw new ORPCError("UNAUTHORIZED");
        }

        // Build query
        const query: Record<string, string> = { user: userId };
        if (input?.subjectId) {
            query.subject = input.subjectId;
        }

        // Get all progress records
        const allProgress = await UserProgress.find(query).lean().exec();

        // Calculate stats
        const stats = {
            total: allProgress.length,
            notStarted: allProgress.filter((p: IUserProgress) => p.status === "not_started").length,
            inProgress: allProgress.filter((p: IUserProgress) => p.status === "in_progress").length,
            completed: allProgress.filter((p: IUserProgress) => p.status === "completed").length,
            totalTimeSpent: allProgress.reduce((sum: number, p: IUserProgress) => sum + (p.timeSpent || 0), 0),
            completionPercentage: 0,
        };

        if (stats.total > 0) {
            stats.completionPercentage = Math.round((stats.completed / stats.total) * 100);
        }

        // If no subject filter, get breakdown by subject
        let subjectBreakdown: Array<{ subjectId: string; completed: number; total: number }> = [];

        if (!input?.subjectId) {
            const subjectGroups = new Map<string, { completed: number; total: number }>();

            for (const progress of allProgress) {
                const subjectId = progress.subject as string;
                const existing = subjectGroups.get(subjectId) || { completed: 0, total: 0 };
                existing.total++;
                if (progress.status === "completed") {
                    existing.completed++;
                }
                subjectGroups.set(subjectId, existing);
            }

            subjectBreakdown = Array.from(subjectGroups.entries()).map(([subjectId, data]) => ({
                subjectId,
                ...data,
            }));
        }

        return {
            ...stats,
            subjectBreakdown,
        };
    });

/**
 * Reset progress for a subject
 */
export const resetProgress = protectedProcedure
    .input(getProgressInput)
    .handler(async ({ input, context }) => {
        const userId = context.session?.user?.id;

        if (!userId) {
            throw new ORPCError("UNAUTHORIZED");
        }

        await UserProgress.deleteMany({
            user: userId,
            subject: input.subjectId,
        }).exec();

        return { reset: true };
    });

// ============================================================================
// Router Export
// ============================================================================

export const progressRouter = {
    getAllProgress,
    getProgress,
    updateProgress,
    getStats,
    resetProgress,
};
