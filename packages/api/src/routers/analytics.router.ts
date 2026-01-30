/**
 * Analytics Router
 * 
 * API endpoints for analytics and statistics
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure } from "../index";
import { Topic, Subject, UserProgress, type ITopic, type ISubject, type IUserProgress } from "@techcure/db";

// ============================================================================
// Input Schemas
// ============================================================================

const getSubjectStatsInput = z.object({
    subjectId: z.string(),
});

const getCourseStatsInput = z.object({
    courseId: z.string(),
});

// ============================================================================
// Procedures
// ============================================================================

/**
 * Get statistics for a subject
 */
export const getSubjectStats = publicProcedure
    .input(getSubjectStatsInput)
    .handler(async ({ input }) => {
        const subject = await Subject.findById(input.subjectId).lean().exec();

        if (!subject) {
            return {
                success: false as const,
                error: "Subject not found",
            };
        }

        const topics = await Topic.find({ subject: input.subjectId }).lean().exec();

        // Calculate statistics
        const totalTopics = topics.length;
        const totalExamWeight = topics.reduce((sum: number, t: ITopic) => sum + t.examWeight, 0);

        // Priority breakdown
        const byPriority = {
            high: topics.filter((t: ITopic) => t.priority === "high"),
            medium: topics.filter((t: ITopic) => t.priority === "medium"),
            low: topics.filter((t: ITopic) => t.priority === "low"),
        };

        // Depth breakdown
        const byDepth = {
            Master: topics.filter((t: ITopic) => t.requiredDepth === "Master"),
            Understand: topics.filter((t: ITopic) => t.requiredDepth === "Understand"),
            Familiar: topics.filter((t: ITopic) => t.requiredDepth === "Familiar"),
        };

        // Calculate estimated time
        let totalMinTime = 0;
        let totalMaxTime = 0;
        for (const topic of topics) {
            const match = topic.estimatedTime.match(/(\d+)-(\d+)/);
            if (match && match[1] && match[2]) {
                totalMinTime += parseInt(match[1], 10);
                totalMaxTime += parseInt(match[2], 10);
            }
        }

        // Get common mistakes count
        const totalMistakes = topics.reduce((sum: number, t: ITopic) => sum + (t.commonMistakes?.length || 0), 0);

        return {
            success: true as const,
            data: {
                subject,
                stats: {
                    totalTopics,
                    totalExamWeight,
                    estimatedTimeRange: `${totalMinTime}-${totalMaxTime} hours`,
                    totalCommonMistakes: totalMistakes,
                    byPriority: {
                        high: {
                            count: byPriority.high.length,
                            examWeight: byPriority.high.reduce((sum: number, t: ITopic) => sum + t.examWeight, 0),
                        },
                        medium: {
                            count: byPriority.medium.length,
                            examWeight: byPriority.medium.reduce((sum: number, t: ITopic) => sum + t.examWeight, 0),
                        },
                        low: {
                            count: byPriority.low.length,
                            examWeight: byPriority.low.reduce((sum: number, t: ITopic) => sum + t.examWeight, 0),
                        },
                    },
                    byDepth: {
                        Master: byDepth.Master.length,
                        Understand: byDepth.Understand.length,
                        Familiar: byDepth.Familiar.length,
                    },
                },
            },
        };
    });

/**
 * Get statistics for a course
 */
export const getCourseStats = publicProcedure
    .input(getCourseStatsInput)
    .handler(async ({ input }) => {
        const subjects = await Subject.find({ course: input.courseId }).lean().exec();

        const subjectStats = await Promise.all(
            subjects.map(async (subject: ISubject) => {
                const topics = await Topic.find({ subject: subject._id }).lean().exec();

                let totalMinTime = 0;
                let totalMaxTime = 0;
                for (const topic of topics) {
                    const match = topic.estimatedTime.match(/(\d+)-(\d+)/);
                    if (match && match[1] && match[2]) {
                        totalMinTime += parseInt(match[1], 10);
                        totalMaxTime += parseInt(match[2], 10);
                    }
                }

                return {
                    subjectId: subject._id,
                    subjectName: subject.name,
                    class: subject.class,
                    totalTopics: topics.length,
                    totalExamWeight: topics.reduce((sum: number, t: ITopic) => sum + t.examWeight, 0),
                    estimatedHours: `${totalMinTime}-${totalMaxTime}`,
                    highPriorityCount: topics.filter((t: ITopic) => t.priority === "high").length,
                };
            })
        );

        return {
            success: true as const,
            data: {
                courseId: input.courseId,
                totalSubjects: subjects.length,
                subjects: subjectStats,
            },
        };
    });

/**
 * Get global completion rates (protected - shows anonymous aggregate data)
 */
export const getCompletionRates = publicProcedure
    .input(getSubjectStatsInput)
    .handler(async ({ input }) => {
        const topics = await Topic.find({ subject: input.subjectId }).lean().exec();

        // Get all progress for this subject
        const allProgress = await UserProgress.find({ subject: input.subjectId }).lean().exec();

        // Calculate completion rates per topic
        const topicCompletionRates = topics.map((topic: ITopic) => {
            const topicProgress = allProgress.filter(
                (p: IUserProgress) => p.topic?.toString() === topic._id?.toString()
            );
            const completed = topicProgress.filter((p: IUserProgress) => p.status === "completed").length;
            const total = topicProgress.length;

            return {
                topicId: topic._id,
                topicCode: topic.code,
                topicTitle: topic.title,
                priority: topic.priority,
                totalUsers: total,
                completedUsers: completed,
                completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
            };
        });

        // Sort by completion rate (ascending - hardest topics first)
        topicCompletionRates.sort((a, b) => a.completionRate - b.completionRate);

        return {
            success: true as const,
            data: {
                subjectId: input.subjectId,
                topicCompletionRates,
                hardestTopics: topicCompletionRates.slice(0, 5),
                easiestTopics: [...topicCompletionRates].reverse().slice(0, 5),
            },
        };
    });

/**
 * Get user's personal analytics
 */
export const getPersonalAnalytics = protectedProcedure
    .handler(async ({ context }) => {
        const userId = context.session?.user?.id;

        if (!userId) {
            return {
                success: false as const,
                error: "User not authenticated",
            };
        }

        const allProgress = await UserProgress.find({ user: userId }).lean().exec();

        // Calculate stats
        const completed = allProgress.filter((p: IUserProgress) => p.status === "completed");
        const inProgress = allProgress.filter((p: IUserProgress) => p.status === "in_progress");

        // Calculate study streak (consecutive days with completed topics)
        const completedDates = completed
            .filter((p: IUserProgress) => p.completedAt)
            .map((p: IUserProgress) => new Date(p.completedAt!).toDateString())
            .sort();

        const uniqueDates = [...new Set(completedDates)];

        let currentStreak = 0;
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
            for (let i = uniqueDates.length - 1; i >= 0; i--) {
                const dateStr = uniqueDates[i];
                if (!dateStr) continue;
                const expectedDate = new Date(Date.now() - (uniqueDates.length - 1 - i) * 86400000).toDateString();
                if (new Date(dateStr).toDateString() === expectedDate) {
                    currentStreak++;
                } else {
                    break;
                }
            }
        }

        // Subject breakdown
        const subjectProgressMap = new Map<string, { completed: number; inProgress: number; total: number }>();

        for (const progress of allProgress) {
            const subjectId = progress.subject;
            const existing = subjectProgressMap.get(subjectId) || { completed: 0, inProgress: 0, total: 0 };
            existing.total++;
            if (progress.status === "completed") existing.completed++;
            if (progress.status === "in_progress") existing.inProgress++;
            subjectProgressMap.set(subjectId, existing);
        }

        return {
            success: true as const,
            data: {
                overview: {
                    totalTopicsTracked: allProgress.length,
                    completedTopics: completed.length,
                    inProgressTopics: inProgress.length,
                    completionRate: allProgress.length > 0
                        ? Math.round((completed.length / allProgress.length) * 100)
                        : 0,
                    totalTimeSpent: allProgress.reduce((sum: number, p: IUserProgress) => sum + (p.timeSpent || 0), 0),
                },
                streak: {
                    currentStreak,
                    totalDaysStudied: uniqueDates.length,
                },
                subjectBreakdown: Array.from(subjectProgressMap.entries()).map(([subjectId, data]) => ({
                    subjectId,
                    ...data,
                    completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
                })),
                recentCompletions: completed
                    .sort((a: IUserProgress, b: IUserProgress) =>
                        new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime()
                    )
                    .slice(0, 10),
            },
        };
    });

// ============================================================================
// Router Export
// ============================================================================

export const analyticsRouter = {
    getSubjectStats,
    getCourseStats,
    getCompletionRates,
    getPersonalAnalytics,
};
