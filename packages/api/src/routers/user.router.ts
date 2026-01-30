/**
 * User Router
 * 
 * API endpoints for user profile and settings
 */

import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure } from "../index";
import { User, UserProgress, Subject, type IUserProgress } from "@techcure/db";

// ============================================================================
// Input Schemas
// ============================================================================

const updateProfileInput = z.object({
    name: z.string().min(1).max(255).optional(),
});

const getStudyHistoryInput = z.object({
    limit: z.number().min(1).max(100).optional().default(50),
    offset: z.number().min(0).optional().default(0),
});

// ============================================================================
// Procedures
// ============================================================================

/**
 * Get current user profile
 */
export const getProfile = protectedProcedure
    .handler(async ({ context }) => {
        const userId = context.session?.user?.id;

        if (!userId) {
            throw new ORPCError("UNAUTHORIZED");
        }

        const user = await User.findById(userId).lean().exec();

        if (!user) {
            throw new ORPCError("NOT_FOUND");
        }

        // Get user's progress summary using aggregation for better performance
        const progressSummary = await UserProgress.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    completed: {
                        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                    },
                    inProgress: {
                        $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] }
                    },
                    totalTimeSpent: { $sum: "$timeSpent" }
                }
            }
        ]);

        const summary = progressSummary[0] || {
            total: 0,
            completed: 0,
            inProgress: 0,
            totalTimeSpent: 0
        };

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                createdAt: user.createdAt,
            },
            summary: {
                totalTopicsTracked: summary.total,
                completedTopics: summary.completed,
                inProgressTopics: summary.inProgress,
                totalTimeSpent: summary.totalTimeSpent || 0,
            },
        };
    });

/**
 * Update user profile
 */
export const updateProfile = protectedProcedure
    .input(updateProfileInput)
    .handler(async ({ input, context }) => {
        const userId = context.session?.user?.id;

        if (!userId) {
            throw new ORPCError("UNAUTHORIZED");
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: input },
            { new: true }
        ).lean().exec();

        if (!user) {
            throw new ORPCError("NOT_FOUND");
        }

        return {
            id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
        };
    });

/**
 * Get user's study history
 */
export const getStudyHistory = protectedProcedure
    .input(getStudyHistoryInput)
    .handler(async ({ input, context }) => {
        const userId = context.session?.user?.id;

        if (!userId) {
            throw new ORPCError("UNAUTHORIZED");
        }

        const { limit, offset } = input;

        const allProgress = await UserProgress.find({ user: userId })
            .populate("topic")
            .sort({ updatedAt: -1 })
            .skip(offset)
            .limit(limit)
            .lean()
            .exec();

        // Get total count for pagination info
        const totalCount = await UserProgress.countDocuments({ user: userId });

        // Group by date
        const groupedByDate = new Map<string, IUserProgress[]>();

        for (const progress of allProgress) {
            const date = new Date(progress.updatedAt || new Date()).toDateString();
            const existing = groupedByDate.get(date) || [];
            existing.push(progress);
            groupedByDate.set(date, existing);
        }

        const history = Array.from(groupedByDate.entries()).map(([date, items]) => ({
            date,
            items: items.map(item => ({
                topicId: item.topic,
                subject: item.subject,
                status: item.status,
                timeSpent: item.timeSpent,
                updatedAt: item.updatedAt,
            })),
        }));

        return {
            history,
            pagination: {
                total: totalCount,
                limit,
                offset,
                hasMore: offset + limit < totalCount,
            },
        };
    });

/**
 * Get user's active subjects (subjects with progress)
 */
export const getActiveSubjects = protectedProcedure
    .handler(async ({ context }) => {
        const userId = context.session?.user?.id;

        if (!userId) {
            throw new ORPCError("UNAUTHORIZED");
        }

        // Use aggregation to get subject progress efficiently
        const subjectProgressData = await UserProgress.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: "$subject",
                    total: { $sum: 1 },
                    completed: {
                        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                    },
                    inProgress: {
                        $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] }
                    }
                }
            }
        ]);

        if (subjectProgressData.length === 0) {
            return [];
        }

        // Get subject details for subjects with progress
        const subjectIds = subjectProgressData.map(item => item._id);
        const subjects = await Subject.find({ _id: { $in: subjectIds } }).lean().exec();

        // Map progress data to subjects
        const subjectsWithProgress = subjects.map(subject => {
            const progressData = subjectProgressData.find(p => p._id.equals(subject._id));
            const total = progressData?.total || 0;
            const completed = progressData?.completed || 0;
            const inProgress = progressData?.inProgress || 0;

            return {
                subject,
                progress: {
                    total,
                    completed,
                    inProgress,
                    notStarted: total - completed - inProgress,
                    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
                },
            };
        });

        return subjectsWithProgress;
    });

/**
 * Get user's daily goal status
 */
export const getDailyGoal = protectedProcedure
    .handler(async ({ context }) => {
        const userId = context.session?.user?.id;

        if (!userId) {
            throw new ORPCError("UNAUTHORIZED");
        }

        // Get today's progress using aggregation
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayStats = await UserProgress.aggregate([
            {
                $match: {
                    user: userId,
                    updatedAt: { $gte: today },
                }
            },
            {
                $group: {
                    _id: null,
                    completedToday: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$status", "completed"] },
                                        { $gte: ["$completedAt", today] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    },
                    timeSpentToday: { $sum: "$timeSpent" }
                }
            }
        ]);

        const stats = todayStats[0] || { completedToday: 0, timeSpentToday: 0 };

        // Default daily goal (could be made configurable per user)
        const dailyTopicGoal = 2;
        const dailyTimeGoal = 60; // minutes

        return {
            date: today.toISOString(),
            topicsCompleted: stats.completedToday,
            topicGoal: dailyTopicGoal,
            topicProgress: Math.min(100, Math.round((stats.completedToday / dailyTopicGoal) * 100)),
            timeSpent: stats.timeSpentToday,
            timeGoal: dailyTimeGoal,
            timeProgress: Math.min(100, Math.round((stats.timeSpentToday / dailyTimeGoal) * 100)),
            goalMet: stats.completedToday >= dailyTopicGoal || stats.timeSpentToday >= dailyTimeGoal,
        };
    });

// ============================================================================
// Router Export
// ============================================================================

export const userRouter = {
    getProfile,
    updateProfile,
    getStudyHistory,
    getActiveSubjects,
    getDailyGoal,
};
