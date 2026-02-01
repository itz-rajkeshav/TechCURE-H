/**
 * Enhanced Learning Experience Database Schema
 * 
 * Extends the existing TechCURE-H database with:
 * - Interactive Quizzes with multiple question types
 * - Flashcards with spaced repetition
 * - Gamification elements (points, badges, streaks)
 * - Practice tests and assessments
 * - User analytics and progress tracking
 */

import mongoose from "mongoose";

// ============================================================================
// Quiz System Schemas
// ============================================================================

/**
 * Question Types:
 * - multiple_choice: Single correct answer from options
 * - multiple_select: Multiple correct answers from options  
 * - true_false: Boolean question
 * - fill_blank: Fill in the blank(s)
 * - short_answer: Short text response
 * - matching: Match items from two lists
 * - ordering: Put items in correct order
 */
export type QuestionType = 
  | 'multiple_choice' 
  | 'multiple_select' 
  | 'true_false' 
  | 'fill_blank' 
  | 'short_answer' 
  | 'matching' 
  | 'ordering';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Question Schema
const questionSchema = new mongoose.Schema({
  _id: { type: String },
  
  // Question Content
  question: { type: String, required: true, trim: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['multiple_choice', 'multiple_select', 'true_false', 'fill_blank', 'short_answer', 'matching', 'ordering']
  },
  
  // Question Metadata
  topic: { type: String, ref: "Topic", required: true },
  subject: { type: String, ref: "Subject", required: true },
  difficulty: { 
    type: String, 
    required: true, 
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  
  // Question Options & Answers
  options: [{ 
    id: String,
    text: String,
    isCorrect: { type: Boolean, default: false }
  }],
  
  // For different question types
  correctAnswers: [String], // For multiple_select, fill_blank, short_answer
  explanation: { type: String, trim: true },
  hints: [String],
  
  // For matching questions
  leftItems: [{ id: String, text: String }],
  rightItems: [{ id: String, text: String }],
  correctPairs: [{ left: String, right: String }],
  
  // For ordering questions
  items: [{ id: String, text: String, correctOrder: Number }],
  
  // Analytics
  totalAttempts: { type: Number, default: 0 },
  correctAttempts: { type: Number, default: 0 },
  averageTime: { type: Number, default: 0 }, // in seconds
  
  // Metadata
  tags: [String],
  createdBy: { type: String, ref: "User" },
  isActive: { type: Boolean, default: true },
  
}, { 
  collection: "questions", 
  timestamps: true 
});

// Quiz Schema
const quizSchema = new mongoose.Schema({
  _id: { type: String },
  
  // Quiz Content
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  
  // Quiz Configuration  
  topic: { type: String, ref: "Topic", required: true },
  subject: { type: String, ref: "Subject", required: true },
  questions: [{ type: String, ref: "Question" }],
  
  // Quiz Settings
  timeLimit: { type: Number }, // in minutes, null for unlimited
  passingScore: { type: Number, default: 70 }, // percentage
  maxAttempts: { type: Number, default: 3 },
  shuffleQuestions: { type: Boolean, default: true },
  shuffleOptions: { type: Boolean, default: true },
  showResults: { type: Boolean, default: true },
  showCorrectAnswers: { type: Boolean, default: true },
  
  // Quiz Type
  quizType: {
    type: String,
    enum: ['practice', 'assessment', 'mock_test', 'quick_review'],
    default: 'practice'
  },
  
  // Analytics
  totalAttempts: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  averageTime: { type: Number, default: 0 },
  
  // Metadata
  createdBy: { type: String, ref: "User" },
  isActive: { type: Boolean, default: true },
  
}, { 
  collection: "quizzes", 
  timestamps: true 
});

// ============================================================================
// Flashcard System Schemas  
// ============================================================================

// Flashcard Schema
const flashcardSchema = new mongoose.Schema({
  _id: { type: String },
  
  // Card Content
  front: { type: String, required: true, trim: true },
  back: { type: String, required: true, trim: true },
  
  // Card Metadata
  topic: { type: String, ref: "Topic", required: true },
  subject: { type: String, ref: "Subject", required: true },
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  
  // Spaced Repetition Data
  easeFactor: { type: Number, default: 2.5 },
  interval: { type: Number, default: 1 }, // days until next review
  repetitions: { type: Number, default: 0 },
  
  // Analytics
  totalReviews: { type: Number, default: 0 },
  correctReviews: { type: Number, default: 0 },
  
  // Metadata
  tags: [String],
  createdBy: { type: String, ref: "User" },
  isActive: { type: Boolean, default: true },
  
}, { 
  collection: "flashcards", 
  timestamps: true 
});

// User Flashcard Progress Schema
const userFlashcardProgressSchema = new mongoose.Schema({
  _id: { type: String },
  
  user: { type: String, ref: "User", required: true },
  flashcard: { type: String, ref: "Flashcard", required: true },
  
  // Spaced Repetition State
  easeFactor: { type: Number, default: 2.5 },
  interval: { type: Number, default: 1 },
  repetitions: { type: Number, default: 0 },
  nextReviewDate: { type: Date, default: Date.now },
  
  // Performance Tracking
  totalReviews: { type: Number, default: 0 },
  correctReviews: { type: Number, default: 0 },
  lastReviewDate: { type: Date },
  averageResponseTime: { type: Number, default: 0 },
  
  // Current Status
  status: {
    type: String,
    enum: ['new', 'learning', 'review', 'mastered'],
    default: 'new'
  },
  
}, { 
  collection: "user_flashcard_progress", 
  timestamps: true 
});

// ============================================================================
// Gamification Schemas
// ============================================================================

// Badge Schema
const badgeSchema = new mongoose.Schema({
  _id: { type: String },
  
  // Badge Details
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  icon: { type: String, required: true }, // Icon name or URL
  color: { type: String, default: '#3B82F6' }, // Hex color
  
  // Badge Criteria
  category: {
    type: String,
    enum: ['quiz', 'streak', 'progress', 'achievement', 'milestone'],
    required: true
  },
  
  // Unlock Conditions
  criteria: {
    type: { type: String, required: true }, // 'quiz_score', 'streak_days', 'topics_completed', etc.
    value: { type: Number, required: true }, // Threshold value
    subject: String, // Optional: specific to subject
    topic: String,   // Optional: specific to topic
  },
  
  // Badge Properties
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  points: { type: Number, default: 100 }, // Points awarded for earning badge
  
  // Metadata
  isActive: { type: Boolean, default: true },
  
}, { 
  collection: "badges", 
  timestamps: true 
});

// User Achievement Schema
const userAchievementSchema = new mongoose.Schema({
  _id: { type: String },
  
  user: { type: String, ref: "User", required: true },
  badge: { type: String, ref: "Badge", required: true },
  
  // Achievement Details
  earnedAt: { type: Date, default: Date.now },
  value: { type: Number }, // The value that triggered the badge (e.g., score, streak count)
  
  // Context
  quiz: { type: String, ref: "Quiz" }, // If earned from a quiz
  topic: { type: String, ref: "Topic" }, // If related to a topic
  subject: { type: String, ref: "Subject" }, // If related to a subject
  
}, { 
  collection: "user_achievements", 
  timestamps: true 
});

// User Stats Schema (for progress tracking and analytics)
const userStatsSchema = new mongoose.Schema({
  _id: { type: String },
  
  user: { type: String, ref: "User", required: true, unique: true },
  
  // Points & Level
  totalPoints: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  experiencePoints: { type: Number, default: 0 },
  
  // Streaks
  currentStreak: { type: Number, default: 0 }, // Current daily streak
  longestStreak: { type: Number, default: 0 }, // Best ever streak
  lastActivityDate: { type: Date, default: Date.now },
  
  // Quiz Statistics
  quizzesCompleted: { type: Number, default: 0 },
  totalQuizScore: { type: Number, default: 0 },
  averageQuizScore: { type: Number, default: 0 },
  perfectScores: { type: Number, default: 0 },
  
  // Study Statistics
  topicsCompleted: { type: Number, default: 0 },
  totalStudyTime: { type: Number, default: 0 }, // in minutes
  flashcardsReviewed: { type: Number, default: 0 },
  
  // Weekly/Monthly Progress
  weeklyStats: {
    quizzesCompleted: { type: Number, default: 0 },
    studyTime: { type: Number, default: 0 },
    pointsEarned: { type: Number, default: 0 },
    weekStartDate: { type: Date, default: Date.now },
  },
  
  monthlyStats: {
    quizzesCompleted: { type: Number, default: 0 },
    studyTime: { type: Number, default: 0 },
    pointsEarned: { type: Number, default: 0 },
    monthStartDate: { type: Date, default: Date.now },
  },
  
}, { 
  collection: "user_stats", 
  timestamps: true 
});

// ============================================================================
// Assessment & Testing Schemas
// ============================================================================

// Quiz Attempt Schema (detailed attempt tracking)
const quizAttemptSchema = new mongoose.Schema({
  _id: { type: String },
  
  // Attempt Details
  user: { type: String, ref: "User", required: true },
  quiz: { type: String, ref: "Quiz", required: true },
  attemptNumber: { type: Number, required: true },
  
  // Attempt Results
  score: { type: Number, required: true }, // Percentage score
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  timeSpent: { type: Number, required: true }, // in seconds
  
  // Individual Question Results
  questionResults: [{
    question: { type: String, ref: "Question" },
    userAnswer: mongoose.Schema.Types.Mixed, // Can be string, array, or object
    isCorrect: Boolean,
    timeSpent: Number, // seconds spent on this question
    hintsUsed: Number,
  }],
  
  // Attempt Status
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned', 'expired'],
    default: 'in_progress'
  },
  
  startedAt: { type: Date, default: Date.now },
  completedAt: Date,
  
  // Performance Insights
  strengths: [String], // Topics where user performed well
  weaknesses: [String], // Topics needing improvement
  recommendedTopics: [String], // AI-recommended next topics
  
}, { 
  collection: "quiz_attempts", 
  timestamps: true 
});

// Practice Test Schema (comprehensive testing)
const practiceTestSchema = new mongoose.Schema({
  _id: { type: String },
  
  // Test Details
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  
  // Test Configuration
  subject: { type: String, ref: "Subject", required: true },
  topics: [{ type: String, ref: "Topic" }], // Empty means all topics
  
  // Test Structure
  questionCount: { type: Number, required: true },
  timeLimit: { type: Number, required: true }, // in minutes
  difficultyDistribution: {
    beginner: { type: Number, default: 0.3 }, // 30% beginner
    intermediate: { type: Number, default: 0.4 }, // 40% intermediate  
    advanced: { type: Number, default: 0.2 }, // 20% advanced
    expert: { type: Number, default: 0.1 }, // 10% expert
  },
  
  // Test Type
  testType: {
    type: String,
    enum: ['mock_exam', 'chapter_test', 'full_syllabus', 'custom'],
    default: 'mock_exam'
  },
  
  // Test Settings
  negativeMarking: { type: Boolean, default: false },
  negativeMarkingRatio: { type: Number, default: 0.25 }, // -0.25 for wrong answer
  passingScore: { type: Number, default: 70 },
  
  // Analytics
  totalAttempts: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  highestScore: { type: Number, default: 0 },
  
  // Metadata
  createdBy: { type: String, ref: "User" },
  isActive: { type: Boolean, default: true },
  
}, { 
  collection: "practice_tests", 
  timestamps: true 
});

// Export all schemas
export {
  questionSchema,
  quizSchema,
  flashcardSchema,
  userFlashcardProgressSchema,
  badgeSchema,
  userAchievementSchema,
  userStatsSchema,
  quizAttemptSchema,
  practiceTestSchema
};