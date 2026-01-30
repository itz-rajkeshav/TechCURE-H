/**
 * LearnPath API Hooks
 * 
 * React hooks for fetching data from the backend API using oRPC + TanStack Query.
 * These hooks replace the static data in the UI components.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc, client } from "@/utils/orpc";

// ============================================================================
// Subjects Hooks
// ============================================================================

/**
 * Get all subjects, optionally filtered by course/class
 */
export function useSubjects(filters?: { courseId?: string; classLevel?: string }) {
    return useQuery({
        queryKey: ["subjects", filters],
        queryFn: () => client.subjects.list(filters || {}),
    });
}

/**
 * Get a single subject by ID with its topics
 */
export function useSubject(subjectId: string) {
    return useQuery({
        queryKey: ["subjects", subjectId],
        queryFn: () => client.subjects.getById({ id: subjectId }),
        enabled: !!subjectId,
    });
}

/**
 * Get topics for a subject
 */
export function useSubjectTopics(subjectId: string) {
    return useQuery({
        queryKey: ["subjects", subjectId, "topics"],
        queryFn: () => client.subjects.getTopics({ subjectId }),
        enabled: !!subjectId,
    });
}

// ============================================================================
// Topics Hooks
// ============================================================================

/**
 * Get a single topic by ID
 */
export function useTopic(topicId: string) {
    return useQuery({
        queryKey: ["topics", topicId],
        queryFn: () => client.topics.getById({ id: topicId }),
        enabled: !!topicId,
    });
}

/**
 * Get topic dependencies (prerequisites)
 */
export function useTopicDependencies(topicCode: string, subjectId: string) {
    return useQuery({
        queryKey: ["topics", topicCode, "dependencies"],
        queryFn: () => client.topics.getDependencies({ topicCode, subjectId }),
        enabled: !!topicCode && !!subjectId,
    });
}

/**
 * Get topics that depend on this topic
 */
export function useTopicDependents(topicCode: string, subjectId: string) {
    return useQuery({
        queryKey: ["topics", topicCode, "dependents"],
        queryFn: () => client.topics.getDependents({ topicCode, subjectId }),
        enabled: !!topicCode && !!subjectId,
    });
}

/**
 * Get full prerequisite chain
 */
export function useFullDependencyChain(topicCode: string, subjectId: string) {
    return useQuery({
        queryKey: ["topics", topicCode, "fullChain"],
        queryFn: () => client.topics.getFullDependencyChain({ topicCode, subjectId }),
        enabled: !!topicCode && !!subjectId,
    });
}

// ============================================================================
// Flow Hooks (React Flow data)
// ============================================================================

/**
 * Get React Flow nodes and edges for a subject
 */
export function useFlowData(subjectId: string) {
    return useQuery({
        queryKey: ["flow", subjectId],
        queryFn: () => client.flow.getFlowData({ subjectId }),
        enabled: !!subjectId,
    });
}

/**
 * Get topologically sorted learning path
 */
export function useLearningPath(subjectId: string) {
    return useQuery({
        queryKey: ["flow", subjectId, "learningPath"],
        queryFn: () => client.flow.getLearningPath({ subjectId }),
        enabled: !!subjectId,
    });
}

// ============================================================================
// Search Hooks
// ============================================================================

/**
 * Search topics and subjects
 */
export function useSearch(query: string, subjectId?: string) {
    return useQuery({
        queryKey: ["search", query, subjectId],
        queryFn: () => client.search.search({ query, subjectId }),
        enabled: query.length >= 2,
    });
}

/**
 * Get search suggestions for a subject
 */
export function useSearchSuggestions(subjectId: string) {
    return useQuery({
        queryKey: ["search", subjectId, "suggestions"],
        queryFn: () => client.search.getSuggestions({ subjectId }),
        enabled: !!subjectId,
    });
}

// ============================================================================
// Analytics Hooks
// ============================================================================

/**
 * Get subject statistics
 */
export function useSubjectStats(subjectId: string) {
    return useQuery({
        queryKey: ["analytics", "subject", subjectId],
        queryFn: () => client.analytics.getSubjectStats({ subjectId }),
        enabled: !!subjectId,
    });
}

/**
 * Get course statistics
 */
export function useCourseStats(courseId: string) {
    return useQuery({
        queryKey: ["analytics", "course", courseId],
        queryFn: () => client.analytics.getCourseStats({ courseId }),
        enabled: !!courseId,
    });
}

/**
 * Get completion rates for a subject
 */
export function useCompletionRates(subjectId: string) {
    return useQuery({
        queryKey: ["analytics", "completionRates", subjectId],
        queryFn: () => client.analytics.getCompletionRates({ subjectId }),
        enabled: !!subjectId,
    });
}

/**
 * Get personal analytics (protected)
 */
export function usePersonalAnalytics() {
    return useQuery({
        queryKey: ["analytics", "personal"],
        queryFn: () => client.analytics.getPersonalAnalytics({}),
    });
}

// ============================================================================
// Progress Hooks (Protected)
// ============================================================================

/**
 * Get all progress for the current user
 */
export function useAllProgress() {
    return useQuery({
        queryKey: ["progress", "all"],
        queryFn: () => client.progress.getAllProgress({}),
    });
}

/**
 * Get progress for a specific subject
 */
export function useProgress(subjectId: string) {
    return useQuery({
        queryKey: ["progress", subjectId],
        queryFn: () => client.progress.getProgress({ subjectId }),
        enabled: !!subjectId,
    });
}

/**
 * Get user stats
 */
export function useProgressStats() {
    return useQuery({
        queryKey: ["progress", "stats"],
        queryFn: () => client.progress.getStats({}),
    });
}

/**
 * Update topic progress
 */
export function useUpdateProgress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            topicId: string;
            subjectId: string;
            status: "not_started" | "in_progress" | "completed";
            timeSpent?: number;
            notes?: string;
        }) => client.progress.updateProgress(data),
        onSuccess: (_, variables) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ["progress"] });
            queryClient.invalidateQueries({ queryKey: ["analytics", "personal"] });
            queryClient.invalidateQueries({ queryKey: ["analytics", "completionRates", variables.subjectId] });
        },
    });
}

/**
 * Reset progress for a subject
 */
export function useResetProgress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { subjectId: string }) => client.progress.resetProgress(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["progress"] });
            queryClient.invalidateQueries({ queryKey: ["analytics"] });
        },
    });
}

// ============================================================================
// User Profile Hooks (Protected)
// ============================================================================

/**
 * Get user profile
 */
export function useUserProfile() {
    return useQuery({
        queryKey: ["user", "profile"],
        queryFn: () => client.user.getProfile({}),
    });
}

/**
 * Update user profile
 */
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            displayName?: string;
            preferences?: {
                dailyGoalMinutes?: number;
                theme?: string;
                notifications?: boolean;
            };
        }) => client.user.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
        },
    });
}

/**
 * Get study history
 */
export function useStudyHistory(limit?: number) {
    return useQuery({
        queryKey: ["user", "studyHistory", limit],
        queryFn: () => client.user.getStudyHistory({ limit }),
    });
}

/**
 * Get active subjects
 */
export function useActiveSubjects() {
    return useQuery({
        queryKey: ["user", "activeSubjects"],
        queryFn: () => client.user.getActiveSubjects({}),
    });
}

/**
 * Get daily goal status
 */
export function useDailyGoal() {
    return useQuery({
        queryKey: ["user", "dailyGoal"],
        queryFn: () => client.user.getDailyGoal({}),
    });
}

// ============================================================================
// Courses Hooks
// ============================================================================

/**
 * Get all courses
 */
export function useCourses() {
    return useQuery({
        queryKey: ["courses"],
        queryFn: () => client.courses.list({}),
    });
}

/**
 * Get a single course by ID
 */
export function useCourse(courseId: string) {
    return useQuery({
        queryKey: ["courses", courseId],
        queryFn: () => client.courses.getById({ id: courseId }),
        enabled: !!courseId,
    });
}

// ============================================================================
// Export Hooks
// ============================================================================

/**
 * Export subject data
 */
export function useExportSubject() {
    return useMutation({
        mutationFn: (data: { subjectId: string; format?: "json" | "csv" }) =>
            client.export.exportSubject(data),
    });
}

/**
 * Export learning path
 */
export function useExportLearningPath() {
    return useMutation({
        mutationFn: (data: { subjectId: string; format?: "json" | "csv" }) =>
            client.export.exportLearningPath(data),
    });
}

/**
 * Export user progress
 */
export function useExportProgress() {
    return useMutation({
        mutationFn: (data: { subjectId?: string; format?: "json" | "csv" }) =>
            client.export.exportProgress(data),
    });
}
