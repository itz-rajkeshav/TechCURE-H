/**
 * LearnPath Data Utilities
 * 
 * Central export file for all subject data and utility functions.
 * Provides helpers for querying topics, generating flow elements,
 * and data validation.
 */

import type {
    Subject,
    Topic,
    PriorityType,
    FlowNode,
    FlowEdge,
    PriorityGroup,
    SubjectStats
} from '../types';

// ============================================================================
// Subject Data Exports
// ============================================================================

import {
    physics12CBSE,
    physics12Topics,
    physics12TopicsMap
} from './physics12';

// Re-export for direct access
export { physics12CBSE, physics12Topics, physics12TopicsMap };

/**
 * Registry of all available subjects
 */
export const subjectRegistry: Subject[] = [
    physics12CBSE,
    // Add more subjects here as they become available:
    // chemistry12CBSE,
    // mathematics12CBSE,
    // physics11CBSE,
];

/**
 * Map for quick subject lookup by ID
 */
export const subjectMap = new Map<string, Subject>(
    subjectRegistry.map(subject => [subject.id, subject])
);

// ============================================================================
// Subject Query Functions
// ============================================================================

/**
 * Get a subject by its unique ID
 * @param id - Subject ID
 * @returns Subject or undefined if not found
 */
export function getSubjectById(id: string): Subject | undefined {
    return subjectMap.get(id);
}

/**
 * Get subjects filtered by course
 * @param course - Course name (e.g., 'CBSE', 'JEE', 'NEET')
 * @returns Array of matching subjects
 */
export function getSubjectsByCourse(course: string): Subject[] {
    return subjectRegistry.filter(s => s.course.toLowerCase() === course.toLowerCase());
}

/**
 * Get subjects filtered by class
 * @param classLevel - Class level (e.g., '11', '12')
 * @returns Array of matching subjects
 */
export function getSubjectsByClass(classLevel: string): Subject[] {
    return subjectRegistry.filter(s => s.class === classLevel);
}

/**
 * Get subjects filtered by both course and class
 * @param course - Course name
 * @param classLevel - Class level
 * @returns Array of matching subjects
 */
export function getSubjectsByCourseAndClass(course: string, classLevel: string): Subject[] {
    return subjectRegistry.filter(
        s => s.course.toLowerCase() === course.toLowerCase() && s.class === classLevel
    );
}

// ============================================================================
// Topic Query Functions
// ============================================================================

/**
 * Get a specific topic from a subject by ID
 * @param subject - Subject to search in
 * @param topicId - Topic ID to find
 * @returns Topic or undefined if not found
 */
export function getTopicById(subject: Subject, topicId: string): Topic | undefined {
    return subject.topics.find(t => t.id === topicId);
}

/**
 * Get all topics from a subject
 * @param subject - Subject to get topics from
 * @returns Array of all topics
 */
export function getAllTopics(subject: Subject): Topic[] {
    return [...subject.topics];
}

/**
 * Get topics filtered by priority level
 * @param subject - Subject to filter
 * @param priority - Priority level to filter by
 * @returns Array of topics with matching priority
 */
export function getTopicsByPriority(subject: Subject, priority: PriorityType): Topic[] {
    return subject.topics.filter(t => t.priority === priority);
}

/**
 * Get topics filtered by required depth
 * @param subject - Subject to filter
 * @param depth - Required depth level
 * @returns Array of topics with matching depth
 */
export function getTopicsByDepth(subject: Subject, depth: Topic['requiredDepth']): Topic[] {
    return subject.topics.filter(t => t.requiredDepth === depth);
}

/**
 * Get prerequisite topics for a given topic
 * @param subject - Subject containing the topics
 * @param topicId - ID of the topic to get dependencies for
 * @returns Array of prerequisite topics
 */
export function getTopicDependencies(subject: Subject, topicId: string): Topic[] {
    const topic = getTopicById(subject, topicId);
    if (!topic) return [];

    return topic.dependencies
        .map(depId => getTopicById(subject, depId))
        .filter((t): t is Topic => t !== undefined);
}

/**
 * Get topics that depend on the given topic
 * @param subject - Subject containing the topics
 * @param topicId - ID of the topic to find dependents for
 * @returns Array of dependent topics
 */
export function getTopicDependents(subject: Subject, topicId: string): Topic[] {
    return subject.topics.filter(t => t.dependencies.includes(topicId));
}

/**
 * Get the full dependency chain (all prerequisites recursively)
 * @param subject - Subject containing the topics
 * @param topicId - ID of the topic to trace dependencies for
 * @returns Array of all prerequisite topics in order
 */
export function getFullDependencyChain(subject: Subject, topicId: string): Topic[] {
    const visited = new Set<string>();
    const chain: Topic[] = [];

    function traverse(id: string) {
        if (visited.has(id)) return;
        visited.add(id);

        const topic = getTopicById(subject, id);
        if (!topic) return;

        // First, traverse dependencies
        for (const depId of topic.dependencies) {
            traverse(depId);
        }

        // Then add this topic (if not the original)
        if (id !== topicId) {
            chain.push(topic);
        }
    }

    traverse(topicId);
    return chain;
}

/**
 * Get topics with no dependencies (starting points)
 * @param subject - Subject to search
 * @returns Array of topics with no prerequisites
 */
export function getRootTopics(subject: Subject): Topic[] {
    return subject.topics.filter(t => t.dependencies.length === 0);
}

/**
 * Get topics with no dependents (ending points)
 * @param subject - Subject to search
 * @returns Array of topics that no other topics depend on
 */
export function getLeafTopics(subject: Subject): Topic[] {
    const allDependencies = new Set(subject.topics.flatMap(t => t.dependencies));
    return subject.topics.filter(t => !allDependencies.has(t.id));
}

// ============================================================================
// Priority Groups
// ============================================================================

/**
 * Priority group metadata
 */
const priorityGroupMeta: Record<PriorityType, { label: string; description: string }> = {
    high: {
        label: 'High Focus',
        description: 'Core topics requiring mastery. These carry highest exam weight.'
    },
    medium: {
        label: 'Medium Focus',
        description: 'Important topics for solid understanding. Good score contributors.'
    },
    low: {
        label: 'Low Focus',
        description: 'Topics requiring basic familiarity. Quick review recommended.'
    }
};

/**
 * Get topics organized by priority groups
 * @param subject - Subject to organize
 * @returns Array of priority groups with topics
 */
export function getPriorityGroups(subject: Subject): PriorityGroup[] {
    const priorities: PriorityType[] = ['high', 'medium', 'low'];

    return priorities.map(priority => ({
        priority,
        label: priorityGroupMeta[priority].label,
        description: priorityGroupMeta[priority].description,
        topics: getTopicsByPriority(subject, priority)
    }));
}

// ============================================================================
// React Flow Generation
// ============================================================================

/**
 * Generate React Flow nodes from subject topics
 * @param subject - Subject to generate nodes for
 * @returns Array of FlowNode objects for React Flow
 */
export function generateFlowNodes(subject: Subject): FlowNode[] {
    return subject.topics.map(topic => ({
        id: topic.id,
        type: 'topic' as const,
        position: topic.position,
        data: { ...topic }
    }));
}

/**
 * Generate React Flow edges from topic dependencies
 * @param subject - Subject to generate edges for
 * @param animated - Whether edges should be animated (default: true)
 * @returns Array of FlowEdge objects for React Flow
 */
export function generateFlowEdges(subject: Subject, animated: boolean = true): FlowEdge[] {
    const edges: FlowEdge[] = [];

    for (const topic of subject.topics) {
        for (const depId of topic.dependencies) {
            edges.push({
                id: `${depId}-${topic.id}`,
                source: depId,
                target: topic.id,
                type: 'smoothstep',
                animated
            });
        }
    }

    return edges;
}

/**
 * Generate both nodes and edges for a subject
 * @param subject - Subject to generate flow elements for
 * @returns Object containing nodes and edges arrays
 */
export function generateFlowElements(subject: Subject): {
    nodes: FlowNode[];
    edges: FlowEdge[];
} {
    return {
        nodes: generateFlowNodes(subject),
        edges: generateFlowEdges(subject)
    };
}

// ============================================================================
// Statistics & Validation
// ============================================================================

/**
 * Calculate statistics for a subject
 * @param subject - Subject to analyze
 * @returns SubjectStats object with counts and totals
 */
export function calculateSubjectStats(subject: Subject): SubjectStats {
    const topics = subject.topics;

    // Parse estimated time strings to get hours
    const parseTime = (timeStr: string): number => {
        const match = timeStr.match(/(\d+)-(\d+)/);
        if (match) {
            return (parseInt(match[1]) + parseInt(match[2])) / 2;
        }
        const singleMatch = timeStr.match(/(\d+)/);
        return singleMatch ? parseInt(singleMatch[1]) : 0;
    };

    return {
        totalTopics: topics.length,
        highPriorityCount: topics.filter(t => t.priority === 'high').length,
        mediumPriorityCount: topics.filter(t => t.priority === 'medium').length,
        lowPriorityCount: topics.filter(t => t.priority === 'low').length,
        totalEstimatedHours: topics.reduce((sum, t) => sum + parseTime(t.estimatedTime), 0)
    };
}

/**
 * Validate subject data integrity
 * @param subject - Subject to validate
 * @returns Object with validation results
 */
export function validateSubjectData(subject: Subject): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
} {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for unique topic IDs
    const ids = new Set<string>();
    for (const topic of subject.topics) {
        if (ids.has(topic.id)) {
            errors.push(`Duplicate topic ID: ${topic.id}`);
        }
        ids.add(topic.id);
    }

    // Check dependency references
    for (const topic of subject.topics) {
        for (const depId of topic.dependencies) {
            if (!ids.has(depId)) {
                errors.push(`Topic "${topic.id}" references non-existent dependency: ${depId}`);
            }
        }
    }

    // Check for circular dependencies
    for (const topic of subject.topics) {
        const chain = getFullDependencyChain(subject, topic.id);
        if (chain.some(t => t.id === topic.id)) {
            errors.push(`Circular dependency detected for topic: ${topic.id}`);
        }
    }

    // Check exam weights
    for (const topic of subject.topics) {
        if (topic.examWeight < 0 || topic.examWeight > 100) {
            errors.push(`Invalid exam weight for "${topic.id}": ${topic.examWeight}`);
        }
    }

    // Warnings for potential issues
    const orphanTopics = getRootTopics(subject).filter(t => t.priority !== 'high');
    if (orphanTopics.length > 0) {
        warnings.push(`Root topics that are not high priority: ${orphanTopics.map(t => t.id).join(', ')}`);
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

// ============================================================================
// Search Functions
// ============================================================================

/**
 * Search topics by title or description
 * @param subject - Subject to search in
 * @param query - Search query
 * @returns Array of matching topics sorted by relevance
 */
export function searchTopics(subject: Subject, query: string): Topic[] {
    const lowerQuery = query.toLowerCase();

    return subject.topics
        .filter(topic =>
            topic.title.toLowerCase().includes(lowerQuery) ||
            topic.description.toLowerCase().includes(lowerQuery)
        )
        .sort((a, b) => {
            // Prioritize title matches over description matches
            const aInTitle = a.title.toLowerCase().includes(lowerQuery);
            const bInTitle = b.title.toLowerCase().includes(lowerQuery);

            if (aInTitle && !bInTitle) return -1;
            if (!aInTitle && bInTitle) return 1;
            return 0;
        });
}

/**
 * Search across all subjects
 * @param query - Search query
 * @returns Array of results with subject context
 */
export function searchAllSubjects(query: string): Array<{ topic: Topic; subject: Subject }> {
    const results: Array<{ topic: Topic; subject: Subject }> = [];

    for (const subject of subjectRegistry) {
        const matchingTopics = searchTopics(subject, query);
        for (const topic of matchingTopics) {
            results.push({ topic, subject });
        }
    }

    return results;
}
