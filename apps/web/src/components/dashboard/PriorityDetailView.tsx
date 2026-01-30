import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PriorityReason {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface RequiredDepthInfo {
  focusArea: string;
  focusDescription: string;
  conceptualLevel: string;
  conceptualDescription: string;
}

interface TopicDetail {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  priorityLevel: "high" | "medium" | "low";
  mastery: number;
  hoursSpent: number;
  subTopicsCompleted: number;
  totalSubTopics: number;
  reasons: PriorityReason[];
  requiredDepth: RequiredDepthInfo;
  commonMistakes: string[];
  resources: { name: string; url: string; icon: string }[];
}

// Mock data - this would come from your API/store
const mockTopicDetails: Record<string, TopicDetail> = {
  "1": {
    id: "1",
    title: "Linear Algebra",
    description: "Fundamental study of vectors, vector spaces, linear transformations, and systems of linear equations.",
    courseCode: "MATH 201",
    priorityLevel: "high",
    mastery: 42,
    hoursSpent: 12.5,
    subTopicsCompleted: 8,
    totalSubTopics: 14,
    reasons: [
      {
        id: "r1",
        icon: "star",
        title: "Critical Exam Weight",
        description: "Accounts for 35% of the final grade in the upcoming Math 201 assessment."
      },
      {
        id: "r2",
        icon: "link",
        title: "Core Prerequisite",
        description: "Essential foundation for Machine Learning and Computer Vision modules next semester."
      },
      {
        id: "r3",
        icon: "target",
        title: "Learning Gap",
        description: "Self-assessment indicates lower confidence in Eigenvalues and Eigenvectors compared to peers."
      }
    ],
    requiredDepth: {
      focusArea: "Problem Solving",
      focusDescription: "Prioritize application over theory. Focus on solving non-homogeneous systems and basis transformations.",
      conceptualLevel: "Advanced Application",
      conceptualDescription: "Need to understand the geometric interpretation of transformations, not just the matrix multiplication."
    },
    commonMistakes: [
      "Confusing the row-echelon form (REF) with the reduced row-echelon form (RREF) during manual calculations.",
      "Forgetting to check if a set of vectors is linearly independent before assuming they form a basis.",
      "Applying matrix multiplication in the wrong order (AB ≠ BA)."
    ],
    resources: [
      { name: "Lecture Notes.pdf", url: "#", icon: "description" },
      { name: "MIT OpenCourseWare", url: "#", icon: "school" }
    ]
  },
  "2": {
    id: "2",
    title: "Deadlock Prevention",
    description: "Strategies and algorithms to prevent deadlock situations in concurrent systems.",
    courseCode: "CS 301",
    priorityLevel: "high",
    mastery: 58,
    hoursSpent: 8.0,
    subTopicsCompleted: 5,
    totalSubTopics: 9,
    reasons: [
      {
        id: "r1",
        icon: "star",
        title: "Critical Exam Weight",
        description: "Heavy weightage in mid-semester exams with focus on Banker's algorithm."
      },
      {
        id: "r2",
        icon: "link",
        title: "Practical Application",
        description: "Required for upcoming concurrent systems lab assignments."
      },
      {
        id: "r3",
        icon: "target",
        title: "Complex Topic",
        description: "Historically challenging topic with many students struggling on practical implementations."
      }
    ],
    requiredDepth: {
      focusArea: "Algorithm Implementation",
      focusDescription: "Focus on implementing and understanding deadlock prevention algorithms like Banker's algorithm and resource allocation graphs.",
      conceptualLevel: "Advanced Application",
      conceptualDescription: "Need to understand not just theory but practical implementation and edge cases in real systems."
    },
    commonMistakes: [
      "Incorrectly calculating safe sequences in Banker's algorithm.",
      "Forgetting to check all four necessary conditions for deadlock.",
      "Confusing deadlock prevention with deadlock avoidance strategies."
    ],
    resources: [
      { name: "Lecture Slides.pdf", url: "#", icon: "description" },
      { name: "Practice Problems", url: "#", icon: "quiz" }
    ]
  },
  "3": {
    id: "3",
    title: "Memory Management",
    description: "Techniques for managing computer memory including paging, segmentation, and virtual memory.",
    courseCode: "CS 301",
    priorityLevel: "medium",
    mastery: 35,
    hoursSpent: 6.0,
    subTopicsCompleted: 4,
    totalSubTopics: 11,
    reasons: [
      {
        id: "r1",
        icon: "schedule",
        title: "Future Requirement",
        description: "Complex but not required until Week 8 of the semester."
      },
      {
        id: "r2",
        icon: "link",
        title: "Builds on Current Topics",
        description: "Requires understanding of process scheduling covered this week."
      },
      {
        id: "r3",
        icon: "trending_up",
        title: "Progressive Difficulty",
        description: "Starting early will help manage the complexity better."
      }
    ],
    requiredDepth: {
      focusArea: "Conceptual Understanding",
      focusDescription: "Focus on understanding memory allocation strategies and virtual memory concepts before implementation details.",
      conceptualLevel: "Intermediate Application",
      conceptualDescription: "Need solid conceptual understanding with ability to trace through page replacement algorithms."
    },
    commonMistakes: [
      "Confusing logical and physical addresses in virtual memory systems.",
      "Incorrectly calculating page table sizes and frame allocations.",
      "Missing the difference between internal and external fragmentation."
    ],
    resources: [
      { name: "Chapter Notes.pdf", url: "#", icon: "description" },
      { name: "Virtual Memory Tutorial", url: "#", icon: "play_circle" }
    ]
  },
  "4": {
    id: "4",
    title: "History of OS",
    description: "Evolution of operating systems from early batch systems to modern distributed systems.",
    courseCode: "CS 301",
    priorityLevel: "low",
    mastery: 80,
    hoursSpent: 3.0,
    subTopicsCompleted: 7,
    totalSubTopics: 8,
    reasons: [
      {
        id: "r1",
        icon: "info",
        title: "Introductory Context",
        description: "Provides background knowledge but minimal exam impact."
      },
      {
        id: "r2",
        icon: "check_circle",
        title: "Already Covered",
        description: "Most content has been covered in lectures and readings."
      },
      {
        id: "r3",
        icon: "insights",
        title: "Optional Deep Dive",
        description: "Additional reading recommended but not required for assessments."
      }
    ],
    requiredDepth: {
      focusArea: "General Awareness",
      focusDescription: "Basic awareness of major OS evolution milestones and their impact on modern systems.",
      conceptualLevel: "Basic Understanding",
      conceptualDescription: "Surface-level understanding sufficient, focus on key innovations and their motivations."
    },
    commonMistakes: [
      "Spending too much time on historical details instead of core concepts.",
      "Confusing the timeline of different OS generations."
    ],
    resources: [
      { name: "Timeline Overview.pdf", url: "#", icon: "description" }
    ]
  }
};

interface PriorityDetailViewProps {
  topicId: string;
}

export function PriorityDetailView({ topicId }: PriorityDetailViewProps) {
  const topic = mockTopicDetails[topicId];

  if (!topic) {
    return (
      <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold text-[#0d121b]">Topic not found</h2>
        <Link to="/priorities">
          <Button variant="outline">Back to Priorities</Button>
        </Link>
      </div>
    );
  }

  const priorityColors = {
    high: {
      bg: "bg-red-100",
      text: "text-red-700",
      border: "border-red-200"
    },
    medium: {
      bg: "bg-orange-100",
      text: "text-orange-700",
      border: "border-orange-200"
    },
    low: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-200"
    }
  };

  const priorityColor = priorityColors[topic.priorityLevel];

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Back Navigation */}
          <Link 
            to="/priorities" 
            className="flex items-center gap-2 text-[#135bec] hover:text-[#0d4ab8] transition-colors w-fit group"
          >
            <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            <span className="font-semibold">Back to Priorities</span>
          </Link>

          {/* Header Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className={`${priorityColor.bg} ${priorityColor.text} border ${priorityColor.border} uppercase text-xs font-bold px-3 py-1`}>
                {topic.priorityLevel} Priority
              </Badge>
              <Badge variant="outline" className="text-xs font-bold px-3 py-1">
                {topic.courseCode}
              </Badge>
            </div>
            
            <h1 className="text-5xl font-black tracking-tight text-[#0d121b]">
              {topic.title}
            </h1>
            
            <p className="text-lg text-[#4c669a] leading-relaxed">
              {topic.description}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Button className="bg-[#135bec] hover:bg-[#0d4ab8] text-white font-semibold px-6 py-6 text-base">
                <span className="material-symbols-outlined mr-2">play_circle</span>
                Start Study Session
              </Button>
              <Button variant="outline" className="font-semibold px-6 py-6">
                <span className="material-symbols-outlined mr-2">more_horiz</span>
              </Button>
            </div>
          </div>

          {/* Why it's a priority */}
          <Card className="border border-[#e7ebf3] shadow-sm">
            <div className="p-6 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#135bec] text-2xl">priority_high</span>
                <h2 className="text-2xl font-bold text-[#0d121b]">Why it's a priority</h2>
              </div>

              <div className="flex flex-col gap-4">
                {topic.reasons.map((reason) => (
                  <div key={reason.id} className="flex gap-4 p-4 bg-[#f9fafb] rounded-lg">
                    <span className="material-symbols-outlined text-[#135bec] text-2xl shrink-0">
                      {reason.icon}
                    </span>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-bold text-[#0d121b]">{reason.title}</h3>
                      <p className="text-sm text-[#4c669a] leading-relaxed">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Required Depth */}
          <Card className="border border-[#e7ebf3] shadow-sm">
            <div className="p-6 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#135bec] text-2xl">layers</span>
                <h2 className="text-2xl font-bold text-[#0d121b]">Required Depth</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-[#e7ebf3] rounded-lg">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-[#135bec] uppercase tracking-wide">
                      Focus Area
                    </span>
                    <h3 className="text-lg font-bold text-[#0d121b]">
                      {topic.requiredDepth.focusArea}
                    </h3>
                    <p className="text-sm text-[#4c669a] leading-relaxed">
                      {topic.requiredDepth.focusDescription}
                    </p>
                  </div>
                </div>

                <div className="p-4 border border-[#e7ebf3] rounded-lg">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-[#135bec] uppercase tracking-wide">
                      Conceptual Level
                    </span>
                    <h3 className="text-lg font-bold text-[#0d121b]">
                      {topic.requiredDepth.conceptualLevel}
                    </h3>
                    <p className="text-sm text-[#4c669a] leading-relaxed">
                      {topic.requiredDepth.conceptualDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Common Mistakes */}
          <Card className="border border-[#e7ebf3] shadow-sm">
            <div className="p-6 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500 text-2xl">warning</span>
                <h2 className="text-2xl font-bold text-[#0d121b]">Common Mistakes</h2>
              </div>

              <div className="flex flex-col gap-3">
                {topic.commonMistakes.map((mistake, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <span className="material-symbols-outlined text-red-500 text-xl shrink-0 mt-0.5">
                      close
                    </span>
                    <p className="text-sm text-[#0d121b] leading-relaxed">
                      {mistake}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Study Statistics */}
          <Card className="border border-[#e7ebf3] shadow-sm sticky top-6">
            <div className="p-6 flex flex-col gap-6">
              <h3 className="text-xs font-bold text-[#4c669a] uppercase tracking-wide">
                Study Statistics
              </h3>

              {/* Mastery */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#0d121b]">Mastery</span>
                  <span className="text-2xl font-bold text-[#0d121b]">{topic.mastery}%</span>
                </div>
                <div className="w-full h-2 bg-[#f6f6f8] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-linear-to-r from-orange-400 to-orange-500 rounded-full transition-all"
                    style={{ width: `${topic.mastery}%` }}
                  />
                </div>
              </div>

              {/* Hours Spent & Sub-topics */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#e7ebf3]">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-[#4c669a] uppercase tracking-wide">
                    Hours Spent
                  </span>
                  <span className="text-2xl font-bold text-[#0d121b]">
                    {topic.hoursSpent}h
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-[#4c669a] uppercase tracking-wide">
                    Sub-topics
                  </span>
                  <span className="text-2xl font-bold text-[#0d121b]">
                    {topic.subTopicsCompleted} / {topic.totalSubTopics}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Resources */}
          <Card className="border border-[#e7ebf3] shadow-sm">
            <div className="p-6 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-[#4c669a] uppercase tracking-wide">
                Resources
              </h3>

              <div className="flex flex-col gap-2">
                {topic.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    className="flex items-center justify-between p-3 bg-[#f9fafb] hover:bg-[#f0f2f5] rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#135bec] text-xl">
                        {resource.icon}
                      </span>
                      <span className="text-sm font-semibold text-[#0d121b]">
                        {resource.name}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-[#4c669a] text-lg group-hover:translate-x-1 transition-transform">
                      open_in_new
                    </span>
                  </a>
                ))}
              </div>

              <Button variant="outline" className="w-full font-semibold mt-2">
                <span className="material-symbols-outlined mr-2 text-lg">add</span>
                Add Resource
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
