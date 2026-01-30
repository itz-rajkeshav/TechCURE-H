import { useState, useMemo } from "react";
import { useAppStore } from "@/store/appStore";
import { Link } from "@tanstack/react-router";
import { useSubjectTopics, useProgress, useUpdateProgress } from "@/lib/api/hooks";

interface PriorityItem {
  id: string;
  title: string;
  description: string;
  examWeight: number;
  estimatedTime: string;
  status: "not_started" | "in_progress" | "completed";
  badge?: {
    text: string;
    color: string;
  };
}

type PriorityLevel = "high" | "medium" | "low";

interface PriorityColumn {
  id: PriorityLevel;
  title: string;
  color: string;
  dotColor: string;
  borderColor: string;
  items: PriorityItem[];
}

export function PrioritiesView() {
  const { selectedSubject } = useAppStore();
  
  // Use hardcoded physics subject ID if no subject is selected (for demo purposes)
  const subjectName = selectedSubject?.name || "Physics (Class 12)";
  const subjectId = selectedSubject?.id || "physics-12-cbse";

  // Fetch topics and progress from API
  const { data: topicsResponse, isLoading: topicsLoading, error: topicsError } = useSubjectTopics(subjectId);
  const { data: progress = [], isLoading: progressLoading, error: progressError } = useProgress(subjectId);
  const updateProgressMutation = useUpdateProgress();

  // Extract topics from response
  const topics = topicsResponse?.success ? topicsResponse.data : [];

  // Transform API data into priority columns
  const columns = useMemo<PriorityColumn[]>(() => {
    if (!topics.length) {
      return [
        {
          id: "high",
          title: "HIGH PRIORITY",
          color: "text-red-600",
          dotColor: "bg-red-500",
          borderColor: "border-l-red-500",
          items: []
        },
        {
          id: "medium", 
          title: "MEDIUM PRIORITY",
          color: "text-orange-600",
          dotColor: "bg-orange-500",
          borderColor: "border-l-orange-500",
          items: []
        },
        {
          id: "low",
          title: "LOW PRIORITY", 
          color: "text-gray-600",
          dotColor: "bg-gray-400",
          borderColor: "border-l-gray-400",
          items: []
        }
      ];
    }

    // Create progress map for quick lookup
    const progressMap = new Map(
      progress.map((p: any) => [p.topic?._id?.toString() || p.topic?.toString(), p])
    );

    // Transform topics into priority items
    const priorityItems: PriorityItem[] = topics.map((topic: any) => {
      const topicProgress = progressMap.get(topic._id?.toString());
      const status = topicProgress?.status || "not_started";
      
      // Generate priority badge for high priority items
      const badge = topic.priority === "high" && topic.examWeight > 15 
        ? { text: "HIGH IMPACT", color: "bg-red-100 text-red-700 border-red-200" }
        : undefined;

      return {
        id: topic._id?.toString(),
        title: topic.title,
        description: topic.description,
        examWeight: topic.examWeight,
        estimatedTime: topic.estimatedTime,
        status,
        badge
      };
    });

    // Group items by priority
    const highItems = priorityItems.filter(item => 
      topics.find((t: any) => t._id?.toString() === item.id)?.priority === "high"
    );
    const mediumItems = priorityItems.filter(item => 
      topics.find((t: any) => t._id?.toString() === item.id)?.priority === "medium"
    );
    const lowItems = priorityItems.filter(item => 
      topics.find((t: any) => t._id?.toString() === item.id)?.priority === "low"
    );

    return [
      {
        id: "high",
        title: "HIGH PRIORITY",
        color: "text-red-600",
        dotColor: "bg-red-500", 
        borderColor: "border-l-red-500",
        items: highItems
      },
      {
        id: "medium",
        title: "MEDIUM PRIORITY",
        color: "text-orange-600",
        dotColor: "bg-orange-500",
        borderColor: "border-l-orange-500", 
        items: mediumItems
      },
      {
        id: "low",
        title: "LOW PRIORITY",
        color: "text-gray-600",
        dotColor: "bg-gray-400",
        borderColor: "border-l-gray-400",
        items: lowItems
      }
    ];
  }, [topics, progress]);

  const [draggedItem, setDraggedItem] = useState<{ item: PriorityItem; fromColumn: PriorityLevel } | null>(null);

  const handleDragStart = (item: PriorityItem, columnId: PriorityLevel) => {
    setDraggedItem({ item, fromColumn: columnId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: PriorityLevel) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.fromColumn === targetColumnId) {
      setDraggedItem(null);
      return;
    }

    // TODO: Implement priority update API call
    console.log(`Moving ${draggedItem.item.title} from ${draggedItem.fromColumn} to ${targetColumnId}`);
    setDraggedItem(null);
  };

  const handleAddItem = (columnId: PriorityLevel) => {
    console.log("Add item to column:", columnId);
  };

  // Loading state
  if (topicsLoading || progressLoading) {
    return (
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-black tracking-tight text-[#0d121b]">Priorities</h2>
          <p className="text-base text-[#4c669a]">
            Organize topics by urgency and impact to optimize your learning flow.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-[#e7ebf3] rounded-xl p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (topicsError || progressError) {
    return (
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-black tracking-tight text-[#0d121b]">Priorities</h2>
          <p className="text-base text-[#4c669a]">
            Organize topics by urgency and impact to optimize your learning flow.
          </p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to load priorities</h3>
          <p className="text-red-700">
            {topicsError?.message || progressError?.message || "An error occurred while loading your priorities."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black tracking-tight text-[#0d121b]">Priorities</h2>
        <p className="text-base text-[#4c669a]">
          Organize topics by urgency and impact to optimize your learning flow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex flex-col gap-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="bg-white border border-[#e7ebf3] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${column.dotColor}`}></div>
                <h3 className={`text-sm font-bold ${column.color} tracking-wide`}>
                  {column.title}
                </h3>
                <span className="text-xs font-semibold text-[#4c669a] bg-[#f6f6f8] px-2 py-0.5 rounded-full">
                  {column.items.length}
                </span>
              </div>
              <button
                onClick={() => handleAddItem(column.id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f6f6f8] transition-colors"
              >
                <span className="material-symbols-outlined text-[#4c669a] text-xl">add</span>
              </button>
            </div>

            {/* Column Items */}
            <div className="flex flex-col gap-3 min-h-[200px]">
              {column.items.map((item) => (
                <Link
                  key={item.id}
                  to="/priorities/$topicId"
                  params={{ topicId: item.id }}
                  className={`bg-white border border-[#e7ebf3] rounded-xl p-4 hover:shadow-md transition-all border-l-4 ${column.borderColor} group block`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#0d121b] mb-2 group-hover:text-[#135bec] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-sm text-[#4c669a] leading-relaxed mb-3">
                        {item.description}
                      </p>
                      
                      {/* Topic metadata */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium">
                          {item.examWeight}% exam weight
                        </span>
                        <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-md font-medium">
                          ~{item.estimatedTime}
                        </span>
                        {item.status === "completed" && (
                          <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md font-medium">
                            ✓ Completed
                          </span>
                        )}
                        {item.status === "in_progress" && (
                          <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-md font-medium">
                            ⏳ In Progress
                          </span>
                        )}
                      </div>
                      
                      {item.badge && (
                        <div className="mt-3">
                          <span className={`px-3 py-1 rounded-md text-xs font-bold border uppercase ${item.badge.color}`}>
                            {item.badge.text}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      draggable
                      onDragStart={(e) => {
                        e.stopPropagation();
                        handleDragStart(item, column.id);
                      }}
                      onClick={(e) => e.preventDefault()}
                      className="material-symbols-outlined text-[#cfd7e7] text-xl shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                    >
                      drag_indicator
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Drag Instructions */}
      <div className="bg-blue-50/50 border border-[#135bec]/20 rounded-xl p-4">
        <p className="text-sm text-[#4c669a] text-center">
          <span className="font-semibold text-[#135bec]">Tip:</span> Drag and drop cards between columns to reorganize your priorities
        </p>
      </div>
    </div>
  );
}
