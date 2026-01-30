/**
 * User Router
 * 
 * API endpoints for user profile and settings
 */

import { z } from "zod";
import { protectedProcedure } from "../index";
import { User, UserProgress, Subject, type IUserProgress } from "@techcure/db";

// ============================================================================
// Input Schemas
// ============================================================================

const updateProfileInput = z.object({
    name: z.string().min(1).max(255).optional(),
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
            return {
                success: false as const,
                error: "User not authenticated",
            };
        }

        const user = await User.findById(userId).lean().exec();

        if (!user) {
            return {
                success: false as const,
                error: "User not found",
            };
        }

        // Get user's progress summary
        const allProgress = await UserProgress.find({ user: userId }).lean().exec();
        const completed = allProgress.filter((p: IUserProgress) => p.status === "completed").length;
        const inProgress = allProgress.filter((p: IUserProgress) => p.status === "in_progress").length;

        return {
            success: true as const,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    createdAt: user.createdAt,
                },
                summary: {
                    totalTopicsTracked: allProgress.length,
                    completedTopics: completed,
                    inProgressTopics: inProgress,
                    totalTimeSpent: allProgress.reduce((sum: number, p: IUserProgress) => sum + (p.timeSpent || 0), 0),
                },
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
            return {
                success: false as const,
                error: "User not authenticated",
            };
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: input },
            { new: true }
        ).lean().exec();

        if (!user) {
            return {
                success: false as const,
                error: "User not found",
            };
        }

        return {
            success: true as const,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
            },
        };
    });

/**
 * Get user's study history
 */
export const getStudyHistory = protectedProcedure
    .handler(async ({ context }) => {
        const userId = context.session?.user?.id;

        if (!userId) {
            return {
                success: false as const,
                error: "User not authenticated",
            };
        }

        const allProgress = await UserProgress.find({ user: userId })
            .populate("topic")
            .sort({ updatedAt: -1 })
            .limit(50)
            .lean()
            .exec();

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
            success: true as const,
            data: history,
        };
    });

/**
 * Get user's active subjects (subjects with progress)
 */
export const getActiveSubjects = protectedProcedure
    .handler(async ({ context }) => {
        const userId = context.session?.user?.id;

        if (!userId) {
            return {
                success: false as const,
                error: "User not authenticated",
            };
        }

        const allProgress = await UserProgress.find({ user: userId }).lean().exec();

        // Get unique subject IDs
        const subjectIds = [...new Set(allProgress.map((p: IUserProgress) => p.subject))];

        // Get subject details
        const subjects = await Subject.find({ _id: { $in: subjectIds } }).lean().exec();

        // Calculate progress per subject
        const subjectsWithProgress = subjects.map(subject => {
            const subjectProgress = allProgress.filter((p: IUserProgress) => p.subject === subject._id);
            const completed = subjectProgress.filter((p: IUserProgress) => p.status === "completed").length;
            const inProgress = subjectProgress.filter((p: IUserProgress) => p.status === "in_progress").length;

            return {
                subject,
                progress: {
                    total: subjectProgress.length,
                    completed,
                    inProgress,
                    notStarted: subjectProgress.length - completed - inProgress,
                    completionRate: subjectProgress.length > 0
                        ? Math.round((completed / subjectProgress.length) * 100)
                        : 0,
                },
            };
        });

        return {
            success: true as const,
            data: subjectsWithProgress,
        };
    });

/**
 * Get user's daily goal status
 */
export const getDailyGoal = protectedProcedure
    .handler(async ({ context }) => {
        const userId = context.session?.user?.id;

        if (!userId) {
            return {
                success: false as const,
                error: "User not authenticated",
            };
        }

        // Get today's progress
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayProgress = await UserProgress.find({
            user: userId,
            updatedAt: { $gte: today },
        }).lean().exec();

        const completedToday = todayProgress.filter((p: IUserProgress) =>
            p.status === "completed" && p.completedAt && new Date(p.completedAt) >= today
        ).length;

        const timeSpentToday = todayProgress.reduce((sum: number, p: IUserProgress) =>
            sum + (p.timeSpent || 0), 0
        );

        // Default daily goal (could be made configurable per user)
        const dailyTopicGoal = 2;
        const dailyTimeGoal = 60; // minutes

        return {
            success: true as const,
            data: {
                date: today.toISOString(),
                topicsCompleted: completedToday,
                topicGoal: dailyTopicGoal,
                topicProgress: Math.min(100, Math.round((completedToday / dailyTopicGoal) * 100)),
                timeSpent: timeSpentToday,
                timeGoal: dailyTimeGoal,
                timeProgress: Math.min(100, Math.round((timeSpentToday / dailyTimeGoal) * 100)),
                goalMet: completedToday >= dailyTopicGoal || timeSpentToday >= dailyTimeGoal,
            },
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
