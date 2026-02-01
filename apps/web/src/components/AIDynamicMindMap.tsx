/**
 * AI-Powered Dynamic Mind Map Component
 * 
 * Displays mind maps generated from user's syllabus and learning context
 * Shows study paths, priorities, and AI-generated connections
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Map, Zap, Target, BookOpen, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface MindMapNode {
  id: string;
  name: string;
  type: 'central' | 'main_branch' | 'sub_branch' | 'leaf';
  color: string;
  position: { x: number; y: number };
  connections: string[];
  metadata?: {
    priority?: 'high' | 'medium' | 'low';
    estimatedHours?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    prerequisites?: string[];
    learningObjectives?: string[];
  };
}

interface StudyPhase {
  name: string;
  weeks: number;
  focus: string;
  subjects: string[];
  goals: string[];
  color: string;
}

interface SubjectPriority {
  subject: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  timeAllocation: string;
  color: string;
}

// Mock AI-generated data (would come from API in real implementation)
const mockAIGeneratedData = {
  mindMap: {
    central: "Computer Science Mastery",
    branches: [
      {
        name: "Data Structures & Algorithms",
        subbranches: ["Arrays & Strings", "Linked Lists", "Trees & Graphs", "Dynamic Programming"],
        color: "#3B82F6"
      },
      {
        name: "Database Management Systems",
        subbranches: ["SQL Fundamentals", "Normalization", "Transactions", "Query Optimization"],
        color: "#10B981"
      },
      {
        name: "Operating Systems",
        subbranches: ["Process Management", "Memory Management", "File Systems", "Concurrency"],
        color: "#F59E0B"
      },
      {
        name: "Computer Networks",
        subbranches: ["Network Protocols", "OSI Model", "Routing", "Network Security"],
        color: "#EF4444"
      }
    ]
  },
  studyPlan: {
    totalWeeks: 16,
    phases: [
      {
        name: "Foundation Phase",
        weeks: 6,
        focus: "Core concepts and fundamentals",
        subjects: ["DSA Basics", "Database Fundamentals", "OS Concepts"],
        goals: ["Understand basic data structures", "Learn SQL fundamentals", "Grasp OS principles"],
        color: "#3B82F6"
      },
      {
        name: "Application Phase",
        weeks: 6,
        focus: "Problem solving and practical implementation",
        subjects: ["Advanced DSA", "Database Design", "System Programming"],
        goals: ["Solve complex algorithms", "Design efficient databases", "Implement system programs"],
        color: "#10B981"
      },
      {
        name: "Mastery Phase",
        weeks: 4,
        focus: "Advanced topics and integration",
        subjects: ["System Design", "Advanced Databases", "Network Programming"],
        goals: ["Design scalable systems", "Optimize database performance", "Build networked applications"],
        color: "#F59E0B"
      }
    ]
  },
  priorities: [
    {
      subject: "Data Structures & Algorithms",
      priority: "high" as const,
      reason: "Foundation for all computer science concepts",
      timeAllocation: "40%",
      color: "#3B82F6"
    },
    {
      subject: "Database Management Systems",
      priority: "medium" as const,
      reason: "Essential for backend development",
      timeAllocation: "30%",
      color: "#10B981"
    },
    {
      subject: "Operating Systems",
      priority: "medium" as const,
      reason: "Important for system understanding",
      timeAllocation: "20%",
      color: "#F59E0B"
    },
    {
      subject: "Computer Networks",
      priority: "low" as const,
      reason: "Supportive knowledge for distributed systems",
      timeAllocation: "10%",
      color: "#EF4444"
    }
  ]
};

export function AIDynamicMindMap() {
  const [selectedView, setSelectedView] = useState<'mindmap' | 'phases' | 'priorities'>('mindmap');
  const [data, setData] = useState(mockAIGeneratedData);
  
  // Generate mind map nodes from AI data
  const generateMindMapNodes = (): MindMapNode[] => {
    const nodes: MindMapNode[] = [];
    
    // Central node
    nodes.push({
      id: 'central',
      name: data.mindMap.central,
      type: 'central',
      color: '#6366F1',
      position: { x: 400, y: 300 },
      connections: data.mindMap.branches.map((_, index) => `branch-${index}`)
    });
    
    // Main branches
    data.mindMap.branches.forEach((branch, branchIndex) => {
      const angle = (2 * Math.PI * branchIndex) / data.mindMap.branches.length;
      const radius = 150;
      
      nodes.push({
        id: `branch-${branchIndex}`,
        name: branch.name,
        type: 'main_branch',
        color: branch.color,
        position: {
          x: 400 + Math.cos(angle) * radius,
          y: 300 + Math.sin(angle) * radius
        },
        connections: branch.subbranches.map((_, subIndex) => `sub-${branchIndex}-${subIndex}`),
        metadata: {
          priority: data.priorities.find(p => p.subject === branch.name)?.priority,
          estimatedHours: 40 + Math.floor(Math.random() * 60), // Mock data
          difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as any
        }
      });
      
      // Sub-branches
      branch.subbranches.forEach((subBranch, subIndex) => {
        const subAngle = angle + (subIndex - branch.subbranches.length / 2 + 0.5) * 0.3;
        const subRadius = 100;
        
        nodes.push({
          id: `sub-${branchIndex}-${subIndex}`,
          name: subBranch,
          type: 'sub_branch',
          color: branch.color,
          position: {
            x: nodes[branchIndex + 1].position.x + Math.cos(subAngle) * subRadius,
            y: nodes[branchIndex + 1].position.y + Math.sin(subAngle) * subRadius
          },
          connections: [],
          metadata: {
            estimatedHours: 10 + Math.floor(Math.random() * 20),
            difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as any
          }
        });
      });
    });
    
    return nodes;
  };

  const [mindMapNodes] = useState(generateMindMapNodes());

  const refreshMindMap = () => {
    toast.success("Mind map refreshed with latest AI analysis!");
    // In real implementation, this would fetch fresh data from API
  };

  const exportStudyPlan = () => {
    const exportData = {
      mindMap: data.mindMap,
      studyPlan: data.studyPlan,
      priorities: data.priorities,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-study-plan.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Study plan exported successfully!");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Study Path</h1>
          <p className="text-gray-600">Dynamic mind maps and study plans generated from your syllabus</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={refreshMindMap}>
            <Zap className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportStudyPlan}>
            <BookOpen className="h-4 w-4 mr-2" />
            Export Plan
          </Button>
        </div>
      </div>

      {/* View Selector */}
      <Tabs value={selectedView} onValueChange={(value: any) => setSelectedView(value)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mindmap" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Mind Map
          </TabsTrigger>
          <TabsTrigger value="phases" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Study Phases
          </TabsTrigger>
          <TabsTrigger value="priorities" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Priorities
          </TabsTrigger>
        </TabsList>

        {/* Mind Map View */}
        <TabsContent value="mindmap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Interactive Mind Map
              </CardTitle>
              <CardDescription>
                AI-generated mind map showing subject relationships and learning paths
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg min-h-[600px] overflow-hidden">
                <svg width="800" height="600" className="w-full h-full">
                  {/* Connections */}
                  {mindMapNodes.map(node => 
                    node.connections.map(connectionId => {
                      const connectedNode = mindMapNodes.find(n => n.id === connectionId);
                      if (!connectedNode) return null;
                      
                      return (
                        <line
                          key={`${node.id}-${connectionId}`}
                          x1={node.position.x}
                          y1={node.position.y}
                          x2={connectedNode.position.x}
                          y2={connectedNode.position.y}
                          stroke={node.color}
                          strokeWidth="2"
                          opacity="0.6"
                        />
                      );
                    })
                  )}
                  
                  {/* Nodes */}
                  {mindMapNodes.map(node => (
                    <g key={node.id}>
                      <circle
                        cx={node.position.x}
                        cy={node.position.y}
                        r={node.type === 'central' ? 40 : node.type === 'main_branch' ? 30 : 20}
                        fill={node.color}
                        stroke="#fff"
                        strokeWidth="3"
                        className="drop-shadow-lg"
                      />
                      <text
                        x={node.position.x}
                        y={node.position.y + 5}
                        textAnchor="middle"
                        className="text-white font-medium text-sm"
                        fill="white"
                      >
                        {node.name.length > 15 ? node.name.substring(0, 15) + '...' : node.name}
                      </text>
                      
                      {/* Priority indicator */}
                      {node.metadata?.priority && (
                        <circle
                          cx={node.position.x + 25}
                          cy={node.position.y - 25}
                          r="8"
                          fill={
                            node.metadata.priority === 'high' ? '#EF4444' :
                            node.metadata.priority === 'medium' ? '#F59E0B' : '#10B981'
                          }
                          className="drop-shadow"
                        />
                      )}
                    </g>
                  ))}
                </svg>
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white rounded-lg p-4 shadow-lg">
                  <h4 className="font-medium mb-2">Priority Levels</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>High Priority</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span>Medium Priority</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Low Priority</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Study Phases View */}
        <TabsContent value="phases" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.studyPlan.phases.map((phase, index) => (
              <Card key={index} className="relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 right-0 h-1" 
                  style={{ backgroundColor: phase.color }}
                />
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {phase.name}
                    <Badge variant="secondary">{phase.weeks} weeks</Badge>
                  </CardTitle>
                  <CardDescription>{phase.focus}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Subjects</h4>
                    <div className="flex flex-wrap gap-1">
                      {phase.subjects.map((subject) => (
                        <Badge key={subject} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Goals</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {phase.goals.map((goal, goalIndex) => (
                        <li key={goalIndex} className="flex items-start gap-2">
                          <Target className="h-3 w-3 mt-0.5 text-green-500" />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Study Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Week 1</span>
                <span className="text-sm text-gray-500">Week {data.studyPlan.totalWeeks}</span>
              </div>
              <div className="relative">
                <div className="h-2 bg-gray-200 rounded-full">
                  {data.studyPlan.phases.map((phase, index) => {
                    const startPercent = data.studyPlan.phases
                      .slice(0, index)
                      .reduce((sum, p) => sum + p.weeks, 0) / data.studyPlan.totalWeeks * 100;
                    const widthPercent = phase.weeks / data.studyPlan.totalWeeks * 100;
                    
                    return (
                      <div
                        key={index}
                        className="absolute top-0 h-2 rounded-full"
                        style={{
                          left: `${startPercent}%`,
                          width: `${widthPercent}%`,
                          backgroundColor: phase.color
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Priorities View */}
        <TabsContent value="priorities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.priorities.map((priority, index) => (
              <Card key={index} className="relative overflow-hidden">
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1" 
                  style={{ backgroundColor: priority.color }}
                />
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {priority.subject}
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          priority.priority === 'high' ? 'destructive' : 
                          priority.priority === 'medium' ? 'default' : 'secondary'
                        }
                      >
                        {priority.priority}
                      </Badge>
                      <Badge variant="outline">{priority.timeAllocation}</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{priority.reason}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Time Allocation</span>
                      <span className="font-medium">{priority.timeAllocation}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          width: priority.timeAllocation,
                          backgroundColor: priority.color
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Study Plan Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {data.studyPlan.totalWeeks}
                  </div>
                  <div className="text-sm text-gray-600">Total Weeks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {data.priorities.length}
                  </div>
                  <div className="text-sm text-gray-600">Subjects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {data.studyPlan.phases.length}
                  </div>
                  <div className="text-sm text-gray-600">Study Phases</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {data.priorities.filter(p => p.priority === 'high').length}
                  </div>
                  <div className="text-sm text-gray-600">High Priority</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}