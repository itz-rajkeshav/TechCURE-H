import { useState } from "react";
import { useAppStore } from "@/store/appStore";

type CourseStatus = "completed" | "unlocked" | "locked" | "pending";

interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  status: CourseStatus;
  progress?: number;
  isRecommended?: boolean;
  position: { x: number; y: number };
  dependencies?: string[];
}

export function DependenciesView() {
  const { selectedSubject } = useAppStore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const courses: Course[] = [
    {
      id: "mat101",
      code: "MAT101",
      title: "Intro to Calculus",
      description: "Limits, derivatives, and integrals of functions of a single variable.",
      status: "completed",
      position: { x: 100, y: 200 },
      dependencies: []
    },
    {
      id: "cs101",
      code: "CS101",
      title: "Intro to Comp Sci",
      description: "Fundamental concepts of programming and computer science.",
      status: "completed",
      position: { x: 100, y: 450 },
      dependencies: []
    },
    {
      id: "mat102",
      code: "MAT102",
      title: "Calculus II",
      description: "Integration techniques, sequences, and series.",
      status: "unlocked",
      progress: 15,
      isRecommended: true,
      position: { x: 500, y: 300 },
      dependencies: ["mat101"]
    },
    {
      id: "mat201",
      code: "MAT201",
      title: "Linear Algebra",
      description: "Vector spaces, linear transformations, and matrices.",
      status: "pending",
      position: { x: 500, y: 100 },
      dependencies: ["mat101"]
    },
    {
      id: "cs201",
      code: "CS201",
      title: "Data Structures",
      description: "Arrays, lists, stacks, queues, trees, and graphs.",
      status: "unlocked",
      position: { x: 500, y: 550 },
      dependencies: ["cs101"]
    }
  ];

  const getStatusColor = (status: CourseStatus) => {
    switch (status) {
      case "completed":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-700",
          badge: "bg-green-100 text-green-700",
          dot: "bg-green-500"
        };
      case "unlocked":
        return {
          bg: "bg-white",
          border: "border-blue-500",
          text: "text-blue-600",
          badge: "bg-blue-100 text-blue-600",
          dot: "bg-blue-500"
        };
      case "locked":
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-400",
          badge: "bg-gray-100 text-gray-400",
          dot: "bg-gray-400"
        };
      case "pending":
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-400",
          badge: "bg-gray-100 text-gray-400",
          dot: "bg-gray-300"
        };
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));
  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const renderArrow = (from: Course, to: Course) => {
    const fromX = from.position.x + 150; // Card width adjustment
    const fromY = from.position.y + 60; // Card height center
    const toX = to.position.x;
    const toY = to.position.y + 60;

    const isActive = from.status === "completed" && to.status === "unlocked";
    const isCompleted = from.status === "completed" && to.status === "completed";
    const isPending = to.status === "pending" || to.status === "locked";

    const strokeColor = isActive || isCompleted ? "#135bec" : "#cbd5e1";
    const strokeWidth = isActive ? 3 : 2;

    // Calculate control points for curved arrow
    const midX = (fromX + toX) / 2;
    const curve = Math.abs(toY - fromY) * 0.3;

    return (
      <g key={`${from.id}-${to.id}`}>
        <defs>
          <marker
            id={`arrowhead-${from.id}-${to.id}`}
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M0,0 L0,6 L9,3 z"
              fill={strokeColor}
            />
          </marker>
        </defs>
        <path
          d={`M ${fromX} ${fromY} Q ${midX} ${fromY + curve}, ${toX} ${toY}`}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          markerEnd={`url(#arrowhead-${from.id}-${to.id})`}
          opacity={isPending ? 0.3 : 1}
        />
      </g>
    );
  };

  return (
    <div className="relative h-[calc(100vh-140px)] bg-[#f6f6f8] rounded-xl overflow-hidden">
      {/* Header with Edit Path button */}
      <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between">
        <div className="bg-white/95 backdrop-blur-sm border border-[#e7ebf3] rounded-xl px-6 py-4 shadow-sm">
          <p className="text-xs font-semibold text-[#4c669a] uppercase tracking-wide mb-1">
            Dependency Guide
          </p>
          <h3 className="text-lg font-bold text-[#0d121b]">Map Legend</h3>
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-[#4c669a]">Completed</span>
              <span className="material-symbols-outlined text-green-600 text-base">check_circle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium text-[#4c669a]">Unlocked</span>
              <span className="material-symbols-outlined text-blue-600 text-base">lock_open</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-sm font-medium text-[#4c669a]">Locked</span>
              <span className="material-symbols-outlined text-gray-400 text-base">lock</span>
            </div>
          </div>
        </div>

        <button className="bg-white border-2 border-[#135bec] text-[#135bec] px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
          Edit Path
        </button>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full h-full overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-200"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center"
          }}
        >
          {/* SVG for arrows */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: "1200px", minHeight: "800px" }}>
            {courses.map(course => 
              course.dependencies?.map(depId => {
                const depCourse = courses.find(c => c.id === depId);
                if (depCourse) {
                  return renderArrow(depCourse, course);
                }
                return null;
              })
            )}
          </svg>

          {/* Course Cards */}
          {courses.map((course) => {
            const colors = getStatusColor(course.status);
            return (
              <div
                key={course.id}
                className={`absolute w-64 ${colors.bg} border-2 ${colors.border} rounded-xl p-4 shadow-lg transition-all hover:shadow-xl cursor-pointer`}
                style={{
                  left: `${course.position.x}px`,
                  top: `${course.position.y}px`,
                  opacity: course.status === "pending" ? 0.6 : 1
                }}
              >
                {course.isRecommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#135bec] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap">
                      Recommended Next
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs font-semibold ${colors.text} uppercase`}>
                    {course.status === "pending" ? "Pending" : course.status}
                  </span>
                  <span className="text-xs font-semibold text-[#4c669a]">{course.code}</span>
                </div>

                {course.status === "completed" && (
                  <div className="absolute top-3 right-3">
                    <span className="material-symbols-outlined text-green-600 text-xl">check_circle</span>
                  </div>
                )}

                <h4 className="font-bold text-[#0d121b] text-lg mb-2">{course.title}</h4>
                <p className="text-sm text-[#4c669a] leading-relaxed mb-3">
                  {course.description}
                </p>

                {course.progress !== undefined && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#4c669a]">{course.progress}% Progress</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#135bec] rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white border border-[#e7ebf3] rounded-lg flex items-center justify-center hover:bg-[#f6f6f8] transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[#4c669a]">add</span>
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white border border-[#e7ebf3] rounded-lg flex items-center justify-center hover:bg-[#f6f6f8] transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[#4c669a]">remove</span>
        </button>
        <button
          onClick={handleZoomReset}
          className="w-10 h-10 bg-white border border-[#e7ebf3] rounded-lg flex items-center justify-center hover:bg-[#f6f6f8] transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[#4c669a]">center_focus_strong</span>
        </button>
      </div>

      {/* Sync Status */}
      <div className="absolute bottom-6 left-6 z-20">
        <div className="bg-white border border-[#e7ebf3] rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-semibold text-[#4c669a] uppercase tracking-wide">
            Sync Active
          </span>
          <span className="material-symbols-outlined text-[#4c669a] text-base">cloud_upload</span>
        </div>
      </div>
    </div>
  );
}
