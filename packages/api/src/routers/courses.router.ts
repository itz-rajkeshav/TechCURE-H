/**
 * Courses Router
 * 
 * API endpoints for managing educational courses (CBSE, JEE, NEET, etc.)
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure } from "../index";
import { Course } from "@techcure/db";

// ============================================================================
// Input Schemas
// ============================================================================

const createCourseInput = z.object({
    code: z.string().min(1).max(50),
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    classes: z.array(z.string()).default([]),
});

const getCourseByIdInput = z.object({
    id: z.string(),
});

// ============================================================================
// Procedures
// ============================================================================

/**
 * List all courses
 */
export const list = publicProcedure
    .handler(async () => {
        const courses = await Course.find().sort({ name: 1 }).lean().exec();
        return {
            success: true as const,
            data: courses,
        };
    });

/**
 * Get course by ID
 */
export const getById = publicProcedure
    .input(getCourseByIdInput)
    .handler(async ({ input }) => {
        const course = await Course.findById(input.id).lean().exec();

        if (!course) {
            return {
                success: false as const,
                error: "Course not found",
            };
        }

        return {
            success: true as const,
            data: course,
        };
    });

/**
 * Create a new course (protected)
 */
export const create = protectedProcedure
    .input(createCourseInput)
    .handler(async ({ input }) => {
        const existingCourse = await Course.findOne({ code: input.code }).exec();

        if (existingCourse) {
            return {
                success: false as const,
                error: "Course with this code already exists",
            };
        }

        const course = new Course({
            _id: input.code,
            ...input,
        });

        await course.save();

        return {
            success: true as const,
            data: course.toObject(),
        };
    });

// ============================================================================
// Router Export
// ============================================================================

export const coursesRouter = {
    list,
    getById,
    create,
};
