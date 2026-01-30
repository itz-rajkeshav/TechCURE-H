/**
 * Flow Router
 * 
 * API endpoints for generating React Flow graph data
 */

import { z } from "zod";
import { publicProcedure } from "../index";
import { Topic, type ITopic } from "@techcure/db";

// ============================================================================
// Input Schemas
// ============================================================================

const getFlowDataInput = z.object({
    subjectId: z.string(),
});

// ============================================================================
// Types
// ============================================================================

export interface FlowNode {
    id: string;
    type: "topic";
    position: { x: number; y: number };
    data: {
        code: string;
        title: string;
        description: string;
        priority: string;
        examWeight: number;
        requiredDepth: string;
        estimatedTime: string;
        commonMistakes: string[];
        hasDependencies: boolean;
        hasDependents: boolean;
    };
}

export interface FlowEdge {
    id: string;
    source: string;
    target: string;
    type: "dependency";
    animated: boolean;
    style: { stroke: string };
}

// ============================================================================
// Helper Functions
// ============================================================================

function getPriorityColor(priority: string): string {
    switch (priority) {
        case "high":
            return "#ef4444"; // red
        case "medium":
            return "#f59e0b"; // amber
        case "low":
            return "#22c55e"; // green
        default:
            return "#6b7280"; // gray
    }
}

// ============================================================================
// Procedures
// ============================================================================

/**
 * Get flow data for a subject (nodes and edges for React Flow)
 */
export const getFlowData = publicProcedure
    .input(getFlowDataInput)
    .handler(async ({ input }) => {
        const topics = await Topic.find({ subject: input.subjectId }).lean().exec();

        if (topics.length === 0) {
            return {
                success: false as const,
                error: "No topics found for this subject",
            };
        }

        // Create topic code to ID map
        const codeToId = new Map(topics.map((t: ITopic) => [t.code, t._id?.toString() ?? ""]));

        // Create nodes
        const nodes: FlowNode[] = topics.map((topic: ITopic) => ({
            id: topic._id?.toString() ?? "",
            type: "topic",
            position: topic.position || { x: 0, y: 0 },
            data: {
                code: topic.code,
                title: topic.title,
                description: topic.description,
                priority: topic.priority,
                examWeight: topic.examWeight,
                requiredDepth: topic.requiredDepth,
                estimatedTime: topic.estimatedTime,
                commonMistakes: topic.commonMistakes,
                hasDependencies: (topic.dependencies?.length ?? 0) > 0,
                hasDependents: false, // Will be set below
            },
        }));

        // Create edges
        const edges: FlowEdge[] = [];
        const nodeIds = new Set(nodes.map(n => n.id));

        for (const topic of topics) {
            const targetId = topic._id?.toString() ?? "";

            for (const depCode of topic.dependencies || []) {
                const sourceId = codeToId.get(depCode);
                if (sourceId && nodeIds.has(sourceId)) {
                    edges.push({
                        id: `${sourceId}-${targetId}`,
                        source: sourceId,
                        target: targetId,
                        type: "dependency",
                        animated: topic.priority === "high",
                        style: { stroke: getPriorityColor(topic.priority) },
                    });

                    // Mark source as having dependents
                    const sourceNode = nodes.find(n => n.id === sourceId);
                    if (sourceNode) {
                        sourceNode.data.hasDependents = true;
                    }
                }
            }
        }

        return {
            success: true as const,
            data: {
                nodes,
                edges,
                stats: {
                    totalNodes: nodes.length,
                    totalEdges: edges.length,
                    highPriority: topics.filter((t: ITopic) => t.priority === "high").length,
                    mediumPriority: topics.filter((t: ITopic) => t.priority === "medium").length,
                    lowPriority: topics.filter((t: ITopic) => t.priority === "low").length,
                },
            },
        };
    });

/**
 * Get learning path order (topologically sorted topics)
 */
export const getLearningPath = publicProcedure
    .input(getFlowDataInput)
    .handler(async ({ input }) => {
        const topics = await Topic.find({ subject: input.subjectId }).lean().exec();

        if (topics.length === 0) {
            return {
                success: false as const,
                error: "No topics found for this subject",
            };
        }

        // Build adjacency list
        const codeToTopic = new Map(topics.map((t: ITopic) => [t.code, t]));
        const inDegree = new Map<string, number>();
        const adjList = new Map<string, string[]>();

        // Initialize
        for (const topic of topics) {
            inDegree.set(topic.code, 0);
            adjList.set(topic.code, []);
        }

        // Build graph
        for (const topic of topics) {
            for (const depCode of topic.dependencies || []) {
                if (codeToTopic.has(depCode)) {
                    adjList.get(depCode)?.push(topic.code);
                    inDegree.set(topic.code, (inDegree.get(topic.code) || 0) + 1);
                }
            }
        }

        // Kahn's algorithm for topological sort with priority weighting
        const queue: string[] = [];
        const result: ITopic[] = [];

        // Start with nodes that have no dependencies
        for (const [code, degree] of inDegree) {
            if (degree === 0) {
                queue.push(code);
            }
        }

        // Sort queue by priority (high first)
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        queue.sort((a, b) => {
            const topicA = codeToTopic.get(a)!;
            const topicB = codeToTopic.get(b)!;
            return (priorityWeight[topicB.priority as keyof typeof priorityWeight] || 0) -
                (priorityWeight[topicA.priority as keyof typeof priorityWeight] || 0);
        });

        while (queue.length > 0) {
            const code = queue.shift()!;
            const topic = codeToTopic.get(code)!;
            result.push(topic);

            for (const nextCode of adjList.get(code) || []) {
                const newDegree = (inDegree.get(nextCode) || 0) - 1;
                inDegree.set(nextCode, newDegree);
                if (newDegree === 0) {
                    queue.push(nextCode);
                    // Re-sort by priority
                    queue.sort((a, b) => {
                        const topicA = codeToTopic.get(a)!;
                        const topicB = codeToTopic.get(b)!;
                        return (priorityWeight[topicB.priority as keyof typeof priorityWeight] || 0) -
                            (priorityWeight[topicA.priority as keyof typeof priorityWeight] || 0);
                    });
                }
            }
        }

        // Calculate cumulative time
        let cumulativeTime = 0;
        const pathWithTime = result.map((topic, index) => {
            const timeMatch = topic.estimatedTime.match(/(\d+)-(\d+)/);
            const avgTime = timeMatch && timeMatch[1] && timeMatch[2]
                ? (parseInt(timeMatch[1], 10) + parseInt(timeMatch[2], 10)) / 2
                : 0;
            cumulativeTime += avgTime;

            return {
                order: index + 1,
                topic,
                estimatedHours: avgTime,
                cumulativeHours: cumulativeTime,
            };
        });

        return {
            success: true as const,
            data: {
                path: pathWithTime,
                totalTopics: result.length,
                totalEstimatedHours: cumulativeTime,
            },
        };
    });

// ============================================================================
// Router Export
// ============================================================================

export const flowRouter = {
    getFlowData,
    getLearningPath,
};
