/**
 * Search Router
 * 
 * API endpoints for searching topics and subjects
 */

import { z } from "zod";
import { publicProcedure } from "../index";
import { Subject, Topic, type ISubject, type ITopic } from "@techcure/db";

// ============================================================================
// Input Schemas
// ============================================================================

const searchInput = z.object({
    query: z.string().min(1).max(200),
    subjectId: z.string().optional(),
    course: z.string().optional(),
    limit: z.number().min(1).max(50).default(20),
});

// ============================================================================
// Procedures
// ============================================================================

/**
 * Search topics and subjects
 */
export const search = publicProcedure
    .input(searchInput)
    .handler(async ({ input }) => {
        const searchRegex = new RegExp(input.query, "i");

        // Build topic query
        const topicQuery: Record<string, unknown> = {
            $or: [
                { title: searchRegex },
                { description: searchRegex },
                { code: searchRegex },
            ],
        };

        if (input.subjectId) {
            topicQuery.subject = input.subjectId;
        }

        // Search topics
        const topics = await Topic.find(topicQuery)
            .limit(input.limit)
            .lean()
            .exec();

        // Search subjects
        const subjectQuery: Record<string, unknown> = {
            $or: [
                { name: searchRegex },
                { description: searchRegex },
                { code: searchRegex },
            ],
        };

        if (input.course) {
            subjectQuery.course = input.course.toLowerCase();
        }

        const subjects = await Subject.find(subjectQuery)
            .limit(Math.max(5, Math.floor(input.limit / 4)))
            .lean()
            .exec();

        // Combine and format results
        const results = [
            ...subjects.map((s: ISubject) => ({
                type: "subject" as const,
                id: s._id,
                title: s.name,
                description: s.description,
                course: s.course,
                class: s.class,
            })),
            ...topics.map((t: ITopic) => ({
                type: "topic" as const,
                id: t._id,
                title: t.title,
                description: t.description,
                subject: t.subject,
                priority: t.priority,
                examWeight: t.examWeight,
            })),
        ];

        return {
            success: true as const,
            data: {
                results,
                query: input.query,
                totalResults: results.length,
            },
        };
    });

/**
 * Get suggested topics based on priority
 */
export const getSuggestions = publicProcedure
    .input(z.object({
        subjectId: z.string(),
        limit: z.number().min(1).max(10).default(5),
    }))
    .handler(async ({ input }) => {
        // Get high priority topics first
        const suggestions = await Topic.find({
            subject: input.subjectId,
            priority: "high",
        })
            .sort({ examWeight: -1 })
            .limit(input.limit)
            .lean()
            .exec();

        // If not enough high priority, add medium priority
        if (suggestions.length < input.limit) {
            const remaining = input.limit - suggestions.length;
            const mediumTopics = await Topic.find({
                subject: input.subjectId,
                priority: "medium",
            })
                .sort({ examWeight: -1 })
                .limit(remaining)
                .lean()
                .exec();

            suggestions.push(...mediumTopics);
        }

        return {
            success: true as const,
            data: suggestions,
        };
    });

// ============================================================================
// Router Export
// ============================================================================

export const searchRouter = {
    search,
    getSuggestions,
};
