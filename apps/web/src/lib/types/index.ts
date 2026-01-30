/**
 * LearnPath TypeScript Interfaces
 * Core data types for the learning path visualization system
 */

// ============================================================================
// Base Types
// ============================================================================

/**
 * Study depth levels indicating how thoroughly a topic should be mastered
 */
export type DepthType = 'Master' | 'Understand' | 'Familiar';

/**
 * Priority levels for topic importance
 */
export type PriorityType = 'high' | 'medium' | 'low';

/**
 * Position coordinates for flow diagram placement
 */
export interface Position {
    x: number;
    y: number;
}

// ============================================================================
// Core Data Types
// ============================================================================

/**
 * Represents a single learning topic within a subject
 */
export interface Topic {
    /** Unique identifier for the topic */
    id: string;

    /** Display title of the topic */
    title: string;

    /** Brief description of what the topic covers */
    description: string;

    /** Percentage weight of this topic in exams (0-100) */
    examWeight: number;

    /** Required study depth for this topic */
    requiredDepth: DepthType;

    /** Common mistakes students make with this topic */
    commonMistakes: string[];

    /** Estimated study time (e.g., "10-12 hours") */
    estimatedTime: string;

    /** IDs of prerequisite topics that should be studied first */
    dependencies: string[];

    /** Priority level based on exam importance */
    priority: PriorityType;

    /** Position coordinates for the flow diagram */
    position: Position;
}

/**
 * Represents a complete subject with all its topics
 */
export interface Subject {
    /** Unique identifier for the subject */
    id: string;

    /** Display name of the subject (e.g., "Physics") */
    name: string;

    /** Course/board (e.g., "CBSE", "JEE", "NEET") */
    course: string;

    /** Class/level (e.g., "12", "11") */
    class: string;

    /** Array of all topics in this subject */
    topics: Topic[];
}

// ============================================================================
// React Flow Types (for visualization)
// ============================================================================

/**
 * React Flow node data structure
 */
export interface FlowNodeData extends Topic {
    // Inherits all Topic properties
}

/**
 * React Flow node representation for topic visualization
 */
export interface FlowNode {
    /** Unique identifier (matches Topic.id) */
    id: string;

    /** Node type for custom rendering */
    type: 'topic';

    /** Position on the canvas */
    position: Position;

    /** Topic data associated with this node */
    data: FlowNodeData;
}

/**
 * React Flow edge representation for dependencies
 */
export interface FlowEdge {
    /** Unique edge identifier */
    id: string;

    /** Source topic ID (prerequisite) */
    source: string;

    /** Target topic ID (dependent) */
    target: string;

    /** Edge type for styling */
    type: 'smoothstep';

    /** Whether the edge should be animated */
    animated: boolean;

    /** Optional label for the edge */
    label?: string;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Result of a topic search operation
 */
export interface SearchResult {
    topic: Topic;
    subject: Subject;
    matchScore: number;
}

/**
 * Statistics about a subject
 */
export interface SubjectStats {
    totalTopics: number;
    highPriorityCount: number;
    mediumPriorityCount: number;
    lowPriorityCount: number;
    totalEstimatedHours: number;
}

/**
 * Priority group for displaying topics by importance
 */
export interface PriorityGroup {
    priority: PriorityType;
    label: string;
    description: string;
    topics: Topic[];
}