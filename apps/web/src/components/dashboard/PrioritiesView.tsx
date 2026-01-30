import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { Link } from "@tanstack/react-router";

interface PriorityItem {
  id: string;
  title: string;
  description: string;
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
  const subjectName = selectedSubject?.name || "Operating Systems";

  const [columns, setColumns] = useState<PriorityColumn[]>([
    {
      id: "high",
      title: "HIGH PRIORITY",
      color: "text-red-600",
      dotColor: "bg-red-500",
      borderColor: "border-l-red-500",
      items: [
        {
          id: "1",
          title: "Process Scheduling",
          description: "Fundamental concept for all upcoming lab assignments.",
          badge: {
            text: "DUE TOMORROW",
            color: "bg-red-100 text-red-700 border-red-200"
          }
        },
        {
          id: "2",
          title: "Deadlock Prevention",
          description: "Heavy weightage in mid-semester exams."
        }
      ]
    },
    {
      id: "medium",
      title: "MEDIUM PRIORITY",
      color: "text-orange-600",
      dotColor: "bg-orange-500",
      borderColor: "border-l-orange-500",
      items: [
        {
          id: "3",
          title: "Memory Management",
          description: "Complex but not required until Week 8."
        }
      ]
    },
    {
      id: "low",
      title: "LOW PRIORITY",
      color: "text-gray-600",
      dotColor: "bg-gray-400",
      borderColor: "border-l-gray-400",
      items: [
        {
          id: "4",
          title: "History of OS",
          description: "Introductory context, minimal exam impact."
        }
      ]
    }
  ]);

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

    setColumns(prev => {
      const newColumns = [...prev];
      
      // Remove from source column
      const sourceColumn = newColumns.find(col => col.id === draggedItem.fromColumn);
      if (sourceColumn) {
        sourceColumn.items = sourceColumn.items.filter(item => item.id !== draggedItem.item.id);
      }
      
      // Add to target column
      const targetColumn = newColumns.find(col => col.id === targetColumnId);
      if (targetColumn) {
        targetColumn.items.push(draggedItem.item);
      }
      
      return newColumns;
    });

    setDraggedItem(null);
  };

  const handleAddItem = (columnId: PriorityLevel) => {
    // Placeholder for adding new items
    console.log("Add item to column:", columnId);
  };

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
                      <p className="text-sm text-[#4c669a] leading-relaxed">
                        {item.description}
                      </p>
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
