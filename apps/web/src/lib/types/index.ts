export interface Topic {
    id: string;
    title: string;
    description: string;
    examWeight: number;
    requiredDepth: 'Master' | 'Understand' | 'Familiar';
    commonMistakes: string[];
    estimatedTime: string;
    dependencies: string[];
    priority: 'high' | 'medium' | 'low';
    position: { x: number; y: number }; // For flow diagram
}

export interface Subject {
    id: string;
    name: string;
    course: string;
    class: string;
    topics: Topic[];
}

export interface FlowNode {
    id: string;
    type: 'topic';
    position: { x: number; y: number };
    data: Topic;
}

export interface FlowEdge {
    id: string;
    source: string;
    target: string;
    type: 'smoothstep';
    animated: boolean;
}
