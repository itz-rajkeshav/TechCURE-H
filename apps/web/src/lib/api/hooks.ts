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
export function useSubjects(filters?: { course?: string; class?: string }) {
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
            name?: string;
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

// ============================================================================
// AI Assistant Hooks (Protected)
// ============================================================================

/**
 * Send message to AI study assistant
 */
export function useAIChat() {
    return useMutation({
        mutationFn: (data: {
            message: string;
            context?: {
                subjectId?: string;
                subjectName?: string;
                userProgress?: {
                    completedTopics?: number;
                    totalTopics?: number;
                    currentLevel?: string;
                };
            };
            conversationHistory?: Array<{
                role: "user" | "assistant";
                content: string;
            }>;
        }) => client.ai.chat(data),
    });
}

/**
 * Get AI study suggestions
 */
export function useAISuggestions() {
    return useMutation({
        mutationFn: (data: {
            subjectId: string;
            difficulty?: "beginner" | "intermediate" | "advanced";
        }) => client.ai.getSuggestions(data),
    });
}

// ============================================================================
// Learning Experience Hooks (Quizzes, Flashcards, Gamification)
// ============================================================================

/**
 * Get quizzes for a topic
 */
export function useQuizzesForTopic(topicId: string, quizType?: "practice" | "assessment" | "mock_test" | "quick_review") {
    return useQuery({
        queryKey: ["learning", "quizzes", topicId, quizType],
        queryFn: () => client.learning.getQuizzesForTopic({ topicId, quizType }),
        enabled: !!topicId,
    });
}

/**
 * Start a quiz session
 */
export function useStartQuiz() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { quizId: string }) => client.learning.startQuiz(data),
        onSuccess: () => {
            // Invalidate quiz-related queries
            queryClient.invalidateQueries({ queryKey: ["learning", "quizzes"] });
        },
    });
}

/**
 * Submit quiz answer
 */
export function useSubmitQuizAnswer() {
    return useMutation({
        mutationFn: (data: {
            quizId: string;
            questionId: string;
            answer: string | string[];
            timeSpent: number;
            hintsUsed?: number;
        }) => client.learning.submitQuizAnswer(data),
    });
}

/**
 * Complete quiz session
 */
export function useCompleteQuiz() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { quizId: string; attemptId: string }) => client.learning.completeQuiz(data),
        onSuccess: () => {
            // Invalidate user stats and progress
            queryClient.invalidateQueries({ queryKey: ["learning", "userStats"] });
            queryClient.invalidateQueries({ queryKey: ["progress"] });
        },
    });
}

/**
 * Get flashcards for review (spaced repetition)
 */
export function useFlashcardsForReview(topicId?: string) {
    return useQuery({
        queryKey: ["learning", "flashcards", "review", topicId],
        queryFn: () => client.learning.getFlashcardsForReview({ topicId }),
    });
}

/**
 * Review flashcard (record difficulty)
 */
export function useReviewFlashcard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            flashcardId: string;
            difficulty: "again" | "hard" | "good" | "easy";
            responseTime: number;
        }) => client.learning.reviewFlashcard(data),
        onSuccess: () => {
            // Invalidate flashcard queries to update spaced repetition
            queryClient.invalidateQueries({ queryKey: ["learning", "flashcards"] });
        },
    });
}

/**
 * Get user stats (gamification)
 */
export function useUserStats() {
    return useQuery({
        queryKey: ["learning", "userStats"],
        queryFn: () => client.learning.getUserStats({}),
    });
}

/**
 * Get badges
 */
export function useBadges() {
    return useQuery({
        queryKey: ["learning", "badges"],
        queryFn: () => client.learning.getBadges({}),
    });
}

/**
 * Get practice tests for a subject
 */
export function usePracticeTests(subjectId: string, testType?: "custom" | "mock_exam" | "chapter_test" | "full_syllabus") {
    return useQuery({
        queryKey: ["learning", "practiceTests", subjectId, testType],
        queryFn: () => client.learning.getPracticeTests({ subjectId, testType }),
        enabled: !!subjectId,
    });
}

/**
 * Get user analytics (study insights)
 */
export function useUserAnalytics(period?: "week" | "month" | "quarter" | "year", subjectId?: string) {
    return useQuery({
        queryKey: ["learning", "analytics", period, subjectId],
        queryFn: () => client.learning.getUserAnalytics({ period, subjectId }),
    });
}

// ============================================================================
// Learning Context Hooks
// ============================================================================

/**
 * Set learning context (education level, course, year)
 */
export function useSetLearningContext() {
    return useMutation({
        mutationFn: (data: {
            educationLevel: 'high_school' | 'undergraduate' | 'postgraduate' | 'competitive_exam' | 'professional_course';
            course: string;
            year: string;
            subjects?: string[];
        }) => client.context.setLearningContext(data),
    });
}

/**
 * Upload and analyze syllabus
 */
export function useUploadSyllabus() {
    return useMutation({
        mutationFn: (data: {
            subjectName: string;
            syllabusText: string;
            contextId?: string;
        }) => client.context.uploadSyllabus(data),
    });
}

/**
 * Generate AI study path
 */
export function useGenerateStudyPath() {
    return useMutation({
        mutationFn: (data: {
            contextId: string;
            preferences?: {
                studyHoursPerDay?: number;
                examDate?: string;
                focusAreas?: string[];
                difficultyPreference?: 'easy_to_hard' | 'hard_to_easy' | 'mixed';
            };
        }) => client.context.generateStudyPath(data),
    });
}

/**
 * Get user's learning contexts
 */
export function useLearningContexts() {
    return useQuery({
        queryKey: ["learning-contexts"],
        queryFn: () => client.context.getLearningContexts({}),
    });
}
