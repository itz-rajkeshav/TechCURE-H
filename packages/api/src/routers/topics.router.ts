/**
 * Topics Router
 * 
 * API endpoints for managing learning topics
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure } from "../index";
import { Topic, type ITopic } from "@techcure/db";

// ============================================================================
// Input Schemas
// ============================================================================

const getTopicByIdInput = z.object({
    id: z.string(),
});

const getTopicByCodeInput = z.object({
    subjectId: z.string(),
    code: z.string(),
});

const getDependenciesInput = z.object({
    subjectId: z.string(),
    topicCode: z.string(),
});

const createTopicInput = z.object({
    code: z.string().min(1).max(100),
    title: z.string().min(1).max(255),
    description: z.string().min(1),
    subject: z.string(),
    examWeight: z.number().min(0).max(100),
    requiredDepth: z.enum(["Master", "Understand", "Familiar"]),
    commonMistakes: z.array(z.string()).default([]),
    estimatedTime: z.string(),
    dependencies: z.array(z.string()).default([]),
    priority: z.enum(["high", "medium", "low"]),
    position: z.object({
        x: z.number(),
        y: z.number(),
    }).default({ x: 0, y: 0 }),
});

const updateTopicInput = z.object({
    id: z.string(),
    title: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    examWeight: z.number().min(0).max(100).optional(),
    requiredDepth: z.enum(["Master", "Understand", "Familiar"]).optional(),
    commonMistakes: z.array(z.string()).optional(),
    estimatedTime: z.string().optional(),
    dependencies: z.array(z.string()).optional(),
    priority: z.enum(["high", "medium", "low"]).optional(),
    position: z.object({
        x: z.number(),
        y: z.number(),
    }).optional(),
});

const deleteTopicInput = z.object({
    id: z.string(),
});

// ============================================================================
// Procedures
// ============================================================================

/**
 * Get topic by MongoDB ID
 */
export const getById = publicProcedure
    .input(getTopicByIdInput)
    .handler(async ({ input }) => {
        const topic = await Topic.findById(input.id).lean().exec();

        if (!topic) {
            return {
                success: false as const,
                error: "Topic not found",
            };
        }

        return {
            success: true as const,
            data: topic,
        };
    });

/**
 * Get topic by subject and code
 */
export const getByCode = publicProcedure
    .input(getTopicByCodeInput)
    .handler(async ({ input }) => {
        const topic = await Topic.findOne({
            subject: input.subjectId,
            code: input.code.toLowerCase(),
        }).lean().exec();

        if (!topic) {
            return {
                success: false as const,
                error: "Topic not found",
            };
        }

        return {
            success: true as const,
            data: topic,
        };
    });

/**
 * Get prerequisite topics (dependencies)
 */
export const getDependencies = publicProcedure
    .input(getDependenciesInput)
    .handler(async ({ input }) => {
        const topic = await Topic.findOne({
            subject: input.subjectId,
            code: input.topicCode.toLowerCase(),
        }).lean().exec();

        if (!topic) {
            return {
                success: false as const,
                error: "Topic not found",
            };
        }

        // Get all dependency topics
        const dependencies = await Topic.find({
            subject: input.subjectId,
            code: { $in: topic.dependencies || [] },
        }).lean().exec();

        return {
            success: true as const,
            data: dependencies,
        };
    });

/**
 * Get topics that depend on this topic
 */
export const getDependents = publicProcedure
    .input(getDependenciesInput)
    .handler(async ({ input }) => {
        const dependents = await Topic.find({
            subject: input.subjectId,
            dependencies: input.topicCode.toLowerCase(),
        }).lean().exec();

        return {
            success: true as const,
            data: dependents,
        };
    });

/**
 * Get full dependency chain (all prerequisites recursively)
 */
export const getFullDependencyChain = publicProcedure
    .input(getDependenciesInput)
    .handler(async ({ input }) => {
        const topic = await Topic.findOne({
            subject: input.subjectId,
            code: input.topicCode.toLowerCase(),
        }).lean().exec();

        if (!topic) {
            return {
                success: false as const,
                error: "Topic not found",
            };
        }

        // Get all topics for the subject
        const allTopics = await Topic.find({ subject: input.subjectId }).lean().exec();
        const topicMap = new Map(allTopics.map((t: ITopic) => [t.code, t]));

        // Recursively collect dependencies
        const visited = new Set<string>();
        const chain: ITopic[] = [];

        function traverse(code: string) {
            if (visited.has(code)) return;
            visited.add(code);

            const t = topicMap.get(code);
            if (!t) return;

            for (const depCode of t.dependencies || []) {
                traverse(depCode);
            }

            if (code !== input.topicCode.toLowerCase()) {
                chain.push(t);
            }
        }

        traverse(input.topicCode.toLowerCase());

        return {
            success: true as const,
            data: chain,
        };
    });

/**
 * Create a new topic (protected)
 */
export const create = protectedProcedure
    .input(createTopicInput)
    .handler(async ({ input }) => {
        const existingTopic = await Topic.findOne({
            subject: input.subject,
            code: input.code.toLowerCase(),
        }).exec();

        if (existingTopic) {
            return {
                success: false as const,
                error: "Topic with this code already exists in this subject",
            };
        }

        const topic = new Topic(input);
        await topic.save();

        return {
            success: true as const,
            data: topic.toObject(),
        };
    });

/**
 * Update a topic (protected)
 */
export const update = protectedProcedure
    .input(updateTopicInput)
    .handler(async ({ input }) => {
        const { id, ...updateData } = input;

        const topic = await Topic.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).lean().exec();

        if (!topic) {
            return {
                success: false as const,
                error: "Topic not found",
            };
        }

        return {
            success: true as const,
            data: topic,
        };
    });

/**
 * Delete a topic (protected)
 */
export const remove = protectedProcedure
    .input(deleteTopicInput)
    .handler(async ({ input }) => {
        const result = await Topic.findByIdAndDelete(input.id).exec();

        if (!result) {
            return {
                success: false as const,
                error: "Topic not found",
            };
        }

        return {
            success: true as const,
            data: { deleted: true },
        };
    });

// ============================================================================
// Router Export
// ============================================================================

export const topicsRouter = {
    getById,
    getByCode,
    getDependencies,
    getDependents,
    getFullDependencyChain,
    create,
    update,
    delete: remove,
};
