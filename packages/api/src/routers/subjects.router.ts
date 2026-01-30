/**
 * Subjects Router
 * 
 * API endpoints for managing subjects within courses
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure } from "../index";
import { Subject, Topic } from "@techcure/db";

// ============================================================================
// Input Schemas
// ============================================================================

const listSubjectsInput = z.object({
    course: z.string().optional(),
    class: z.string().optional(),
}).optional();

const getSubjectByIdInput = z.object({
    id: z.string(),
});

const getTopicsInput = z.object({
    subjectId: z.string(),
    priority: z.enum(["high", "medium", "low"]).optional(),
});

const createSubjectInput = z.object({
    code: z.string().min(1).max(50),
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    course: z.string(),
    class: z.string(),
    examType: z.enum(["board", "jee", "neet", "gate", "upsc", "other"]).default("board"),
});

const updateSubjectInput = z.object({
    id: z.string(),
    name: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    examType: z.enum(["board", "jee", "neet", "gate", "upsc", "other"]).optional(),
});

const deleteSubjectInput = z.object({
    id: z.string(),
});

// ============================================================================
// Procedures
// ============================================================================

/**
 * List all subjects with optional filtering
 */
export const list = publicProcedure
    .input(listSubjectsInput)
    .handler(async ({ input }) => {
        const query: Record<string, string> = {};

        if (input?.course) {
            query.course = input.course.toLowerCase();
        }
        if (input?.class) {
            query.class = input.class;
        }

        const subjects = await Subject.find(query).sort({ name: 1 }).lean().exec();

        return {
            success: true as const,
            data: subjects,
        };
    });

/**
 * Get subject by ID with topics
 */
export const getById = publicProcedure
    .input(getSubjectByIdInput)
    .handler(async ({ input }) => {
        const subject = await Subject.findById(input.id).lean().exec();

        if (!subject) {
            return {
                success: false as const,
                error: "Subject not found",
            };
        }

        // Get topics for this subject
        const topics = await Topic.find({ subject: input.id })
            .sort({ priority: -1, examWeight: -1 })
            .lean()
            .exec();

        return {
            success: true as const,
            data: {
                ...subject,
                topics,
            },
        };
    });

/**
 * Get topics for a subject with optional priority filter
 */
export const getTopics = publicProcedure
    .input(getTopicsInput)
    .handler(async ({ input }) => {
        const query: Record<string, string> = { subject: input.subjectId };

        if (input.priority) {
            query.priority = input.priority;
        }

        const topics = await Topic.find(query)
            .sort({ priority: -1, examWeight: -1 })
            .lean()
            .exec();

        return {
            success: true as const,
            data: topics,
        };
    });

/**
 * Create a new subject (protected)
 */
export const create = protectedProcedure
    .input(createSubjectInput)
    .handler(async ({ input }) => {
        const subjectId = `${input.code}-${input.class}-${input.course}`;

        const existingSubject = await Subject.findById(subjectId).exec();

        if (existingSubject) {
            return {
                success: false as const,
                error: "Subject already exists for this course and class",
            };
        }

        const subject = new Subject({
            _id: subjectId,
            ...input,
        });

        await subject.save();

        return {
            success: true as const,
            data: subject.toObject(),
        };
    });

/**
 * Update a subject (protected)
 */
export const update = protectedProcedure
    .input(updateSubjectInput)
    .handler(async ({ input }) => {
        const { id, ...updateData } = input;

        const subject = await Subject.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).lean().exec();

        if (!subject) {
            return {
                success: false as const,
                error: "Subject not found",
            };
        }

        return {
            success: true as const,
            data: subject,
        };
    });

/**
 * Delete a subject (protected)
 */
export const remove = protectedProcedure
    .input(deleteSubjectInput)
    .handler(async ({ input }) => {
        // First, delete all topics for this subject
        await Topic.deleteMany({ subject: input.id }).exec();

        // Then delete the subject
        const result = await Subject.findByIdAndDelete(input.id).exec();

        if (!result) {
            return {
                success: false as const,
                error: "Subject not found",
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

export const subjectsRouter = {
    list,
    getById,
    getTopics,
    create,
    update,
    delete: remove,
};
