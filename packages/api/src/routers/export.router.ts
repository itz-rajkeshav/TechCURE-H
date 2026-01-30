/**
 * Export Router
 * 
 * API endpoints for exporting learning data
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure } from "../index";
import { Subject, Topic, UserProgress, type ITopic, type IUserProgress } from "@techcure/db";

// ============================================================================
// Input Schemas
// ============================================================================

const exportSubjectInput = z.object({
    subjectId: z.string(),
    format: z.enum(["json", "csv"]).default("json"),
});

const exportProgressInput = z.object({
    subjectId: z.string().optional(),
    format: z.enum(["json", "csv"]).default("json"),
});

// ============================================================================
// Procedures
// ============================================================================

/**
 * Export subject data (topics with all metadata)
 */
export const exportSubject = publicProcedure
    .input(exportSubjectInput)
    .handler(async ({ input }) => {
        const subject = await Subject.findById(input.subjectId).lean().exec();

        if (!subject) {
            return {
                success: false as const,
                error: "Subject not found",
            };
        }

        const topics = await Topic.find({ subject: input.subjectId })
            .sort({ priority: -1, examWeight: -1 })
            .lean()
            .exec();

        if (input.format === "csv") {
            // Generate CSV format
            const headers = [
                "Code",
                "Title",
                "Description",
                "Priority",
                "Exam Weight",
                "Required Depth",
                "Estimated Time",
                "Dependencies",
                "Common Mistakes",
            ];

            const rows = topics.map((topic: ITopic) => [
                topic.code,
                `"${topic.title.replace(/"/g, '""')}"`,
                `"${topic.description.replace(/"/g, '""')}"`,
                topic.priority,
                topic.examWeight.toString(),
                topic.requiredDepth,
                topic.estimatedTime,
                topic.dependencies?.join("; ") || "",
                `"${(topic.commonMistakes || []).join("; ").replace(/"/g, '""')}"`,
            ]);

            const csv = [
                headers.join(","),
                ...rows.map(row => row.join(",")),
            ].join("\n");

            return {
                success: true as const,
                data: {
                    format: "csv" as const,
                    filename: `${subject.code}-${subject.class}-topics.csv`,
                    content: csv,
                },
            };
        }

        // JSON format
        return {
            success: true as const,
            data: {
                format: "json" as const,
                filename: `${subject.code}-${subject.class}-topics.json`,
                content: {
                    subject: {
                        id: subject._id,
                        code: subject.code,
                        name: subject.name,
                        description: subject.description,
                        course: subject.course,
                        class: subject.class,
                        examType: subject.examType,
                    },
                    topics: topics.map((topic: ITopic) => ({
                        code: topic.code,
                        title: topic.title,
                        description: topic.description,
                        priority: topic.priority,
                        examWeight: topic.examWeight,
                        requiredDepth: topic.requiredDepth,
                        estimatedTime: topic.estimatedTime,
                        dependencies: topic.dependencies,
                        commonMistakes: topic.commonMistakes,
                        position: topic.position,
                    })),
                    exportedAt: new Date().toISOString(),
                },
            },
        };
    });

/**
 * Export learning path
 */
export const exportLearningPath = publicProcedure
    .input(exportSubjectInput)
    .handler(async ({ input }) => {
        const subject = await Subject.findById(input.subjectId).lean().exec();

        if (!subject) {
            return {
                success: false as const,
                error: "Subject not found",
            };
        }

        const topics = await Topic.find({ subject: input.subjectId }).lean().exec();

        // Build topological order
        const codeToTopic = new Map(topics.map((t: ITopic) => [t.code, t]));
        const inDegree = new Map<string, number>();
        const adjList = new Map<string, string[]>();

        for (const topic of topics) {
            inDegree.set(topic.code, 0);
            adjList.set(topic.code, []);
        }

        for (const topic of topics) {
            for (const depCode of topic.dependencies || []) {
                if (codeToTopic.has(depCode)) {
                    adjList.get(depCode)?.push(topic.code);
                    inDegree.set(topic.code, (inDegree.get(topic.code) || 0) + 1);
                }
            }
        }

        const queue: string[] = [];
        const result: { order: number; topic: ITopic }[] = [];

        for (const [code, degree] of inDegree) {
            if (degree === 0) queue.push(code);
        }

        let order = 1;
        while (queue.length > 0) {
            // Sort by priority
            queue.sort((a, b) => {
                const priorityWeight = { high: 3, medium: 2, low: 1 };
                const topicA = codeToTopic.get(a)!;
                const topicB = codeToTopic.get(b)!;
                return (priorityWeight[topicB.priority as keyof typeof priorityWeight] || 0) -
                    (priorityWeight[topicA.priority as keyof typeof priorityWeight] || 0);
            });

            const code = queue.shift()!;
            result.push({ order: order++, topic: codeToTopic.get(code)! });

            for (const nextCode of adjList.get(code) || []) {
                const newDegree = (inDegree.get(nextCode) || 0) - 1;
                inDegree.set(nextCode, newDegree);
                if (newDegree === 0) queue.push(nextCode);
            }
        }

        if (input.format === "csv") {
            const headers = ["Order", "Code", "Title", "Priority", "Exam Weight", "Estimated Time", "Dependencies"];
            const rows = result.map(({ order, topic }) => [
                order.toString(),
                topic.code,
                `"${topic.title.replace(/"/g, '""')}"`,
                topic.priority,
                topic.examWeight.toString(),
                topic.estimatedTime,
                topic.dependencies?.join("; ") || "",
            ]);

            const csv = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

            return {
                success: true as const,
                data: {
                    format: "csv" as const,
                    filename: `${subject.code}-${subject.class}-learning-path.csv`,
                    content: csv,
                },
            };
        }

        return {
            success: true as const,
            data: {
                format: "json" as const,
                filename: `${subject.code}-${subject.class}-learning-path.json`,
                content: {
                    subject: {
                        id: subject._id,
                        name: subject.name,
                        course: subject.course,
                        class: subject.class,
                    },
                    learningPath: result.map(({ order, topic }) => ({
                        order,
                        code: topic.code,
                        title: topic.title,
                        priority: topic.priority,
                        examWeight: topic.examWeight,
                        estimatedTime: topic.estimatedTime,
                        dependencies: topic.dependencies,
                    })),
                    totalTopics: result.length,
                    exportedAt: new Date().toISOString(),
                },
            },
        };
    });

/**
 * Export user progress (protected)
 */
export const exportProgress = protectedProcedure
    .input(exportProgressInput)
    .handler(async ({ input, context }) => {
        const userId = context.session?.user?.id;

        if (!userId) {
            return {
                success: false as const,
                error: "User not authenticated",
            };
        }

        const query: Record<string, string> = { user: userId };
        if (input.subjectId) {
            query.subject = input.subjectId;
        }

        const progress = await UserProgress.find(query)
            .populate("topic")
            .lean()
            .exec();

        if (input.format === "csv") {
            const headers = ["Topic", "Subject", "Status", "Time Spent (min)", "Completed At", "Notes"];
            const rows = (progress as unknown[]).map((p) => {
                const prog = p as IUserProgress & { topic: ITopic };
                return [
                    `"${prog.topic?.title || 'Unknown'}"`,
                    prog.subject,
                    prog.status,
                    (prog.timeSpent || 0).toString(),
                    prog.completedAt ? new Date(prog.completedAt).toISOString() : "",
                    `"${(prog.notes || "").replace(/"/g, '""')}"`,
                ];
            });

            const csv = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

            return {
                success: true as const,
                data: {
                    format: "csv" as const,
                    filename: `my-progress-${new Date().toISOString().split("T")[0]}.csv`,
                    content: csv,
                },
            };
        }

        return {
            success: true as const,
            data: {
                format: "json" as const,
                filename: `my-progress-${new Date().toISOString().split("T")[0]}.json`,
                content: {
                    progress: (progress as unknown[]).map((p) => {
                        const prog = p as IUserProgress & { topic: ITopic };
                        return {
                            topic: {
                                id: prog.topic?._id,
                                title: prog.topic?.title,
                                code: prog.topic?.code,
                            },
                            subject: prog.subject,
                            status: prog.status,
                            timeSpent: prog.timeSpent,
                            completedAt: prog.completedAt,
                            notes: prog.notes,
                        };
                    }),
                    summary: {
                        total: progress.length,
                        completed: progress.filter((p: IUserProgress) => p.status === "completed").length,
                        inProgress: progress.filter((p: IUserProgress) => p.status === "in_progress").length,
                        totalTimeSpent: progress.reduce((sum: number, p: IUserProgress) => sum + (p.timeSpent || 0), 0),
                    },
                    exportedAt: new Date().toISOString(),
                },
            },
        };
    });

// ============================================================================
// Router Export
// ============================================================================

export const exportRouter = {
    exportSubject,
    exportLearningPath,
    exportProgress,
};
