import { useState, useRef, useCallback, useEffect } from "react";
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

interface DragState {
  isDragging: boolean;
  draggedCourse: Course | null;
  offset: { x: number; y: number };
  startPosition: { x: number; y: number };
}

export function DependenciesView() {
  const { selectedSubject } = useAppStore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedCourse: null,
    offset: { x: 0, y: 0 },
    startPosition: { x: 0, y: 0 }
  });
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [canvasStartPan, setCanvasStartPan] = useState({ x: 0, y: 0 });
  const [canvasStartMouse, setCanvasStartMouse] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);

  const [courses, setCourses] = useState<Course[]>([
    {
      id: "mat101",
      code: "MAT101",
      title: "Intro to Calculus",
      description: "Limits, derivatives, and integrals",
      status: "completed",
      position: { x: 100, y: 200 },
      dependencies: []
    },
    {
      id: "cs101",
      code: "CS101",
      title: "Intro to Comp Sci",
      description: "Programming fundamentals",
      status: "completed",
      position: { x: 100, y: 400 },
      dependencies: []
    },
    {
      id: "mat102",
      code: "MAT102",
      title: "Calculus II",
      description: "Integration techniques",
      status: "unlocked",
      progress: 15,
      isRecommended: true,
      position: { x: 450, y: 250 },
      dependencies: ["mat101"]
    },
    {
      id: "mat201",
      code: "MAT201",
      title: "Linear Algebra",
      description: "Vector spaces & matrices",
      status: "pending",
      position: { x: 450, y: 100 },
      dependencies: ["mat101"]
    },
    {
      id: "cs201",
      code: "CS201",
      title: "Data Structures",
      description: "Arrays, trees, graphs",
      status: "unlocked",
      position: { x: 450, y: 450 },
      dependencies: ["cs101"]
    }
  ]);

  // Auto-save layout changes
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      localStorage.setItem('mindmap-layout', JSON.stringify({
        courses: courses.map(c => ({ id: c.id, position: c.position })),
        zoom,
        pan
      }));
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [courses, zoom, pan]);

  // Load saved layout on mount
  useEffect(() => {
    const saved = localStorage.getItem('mindmap-layout');
    if (saved) {
      try {
        const { courses: savedPositions, zoom: savedZoom, pan: savedPan } = JSON.parse(saved);
        if (savedPositions) {
          setCourses(prev => prev.map(course => {
            const saved = savedPositions.find((s: any) => s.id === course.id);
            return saved ? { ...course, position: saved.position } : course;
          }));
        }
        if (savedZoom) setZoom(savedZoom);
        if (savedPan) setPan(savedPan);
      } catch (e) {
        console.warn('Failed to load saved layout');
      }
    }
  }, []);

  // Handle course drag start
  const handleCourseMouseDown = useCallback((e: React.MouseEvent, course: Course) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = (e.target as HTMLElement).closest('.course-card')?.getBoundingClientRect();
    if (!rect) return;

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDragState({
      isDragging: true,
      draggedCourse: course,
      offset: { x: offsetX, y: offsetY },
      startPosition: { x: e.clientX, y: e.clientY }
    });
  }, []);

  // Handle canvas drag start (for panning)
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (dragState.isDragging) return;
    
    setIsDraggingCanvas(true);
    setCanvasStartPan({ ...pan });
    setCanvasStartMouse({ x: e.clientX, y: e.clientY });
  }, [pan, dragState.isDragging]);

  // Snap to grid function
  const snapToGrid = useCallback((x: number, y: number, gridSize = 20) => {
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  }, []);

  // Handle mouse move for both course dragging and canvas panning
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragState.isDragging && dragState.draggedCourse) {
      // Course dragging
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      let newX = (e.clientX - canvasRect.left - pan.x - dragState.offset.x) / zoom;
      let newY = (e.clientY - canvasRect.top - pan.y - dragState.offset.y) / zoom;

      // Snap to grid if enabled
      if (showGrid) {
        const snapped = snapToGrid(newX, newY);
        newX = snapped.x;
        newY = snapped.y;
      }

      setCourses(prev => prev.map(course => 
        course.id === dragState.draggedCourse?.id
          ? { ...course, position: { x: Math.max(0, newX), y: Math.max(0, newY) } }
          : course
      ));
    } else if (isDraggingCanvas) {
      // Canvas panning
      const deltaX = e.clientX - canvasStartMouse.x;
      const deltaY = e.clientY - canvasStartMouse.y;
      
      setPan({
        x: canvasStartPan.x + deltaX,
        y: canvasStartPan.y + deltaY
      });
    }
  }, [dragState, isDraggingCanvas, pan, zoom, canvasStartPan, canvasStartMouse, showGrid, snapToGrid]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedCourse: null,
      offset: { x: 0, y: 0 },
      startPosition: { x: 0, y: 0 }
    });
    setIsDraggingCanvas(false);
  }, []);

  // Reset layout to default
  const resetLayout = useCallback(() => {
    const defaultPositions = [
      { id: "mat101", position: { x: 100, y: 200 } },
      { id: "cs101", position: { x: 100, y: 400 } },
      { id: "mat102", position: { x: 450, y: 250 } },
      { id: "mat201", position: { x: 450, y: 100 } },
      { id: "cs201", position: { x: 450, y: 450 } }
    ];

    setCourses(prev => prev.map(course => {
      const defaultPos = defaultPositions.find(p => p.id === course.id);
      return defaultPos ? { ...course, position: defaultPos.position } : course;
    }));
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

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
    const fromX = from.position.x + 120; // Adjusted for smaller card width
    const fromY = from.position.y + 50; // Adjusted for smaller card height
    const toX = to.position.x;
    const toY = to.position.y + 50;

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

  // Render grid dots
  const renderGrid = () => {
    if (!showGrid) return null;
    
    const dots = [];
    const gridSize = 20;
    const canvasSize = 1200;
    
    for (let x = 0; x <= canvasSize; x += gridSize) {
      for (let y = 0; y <= canvasSize; y += gridSize) {
        dots.push(
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="1"
            fill="#cbd5e1"
            opacity="0.3"
          />
        );
      }
    }
    
    return dots;
  };

  return (
    <div className="relative h-[calc(100vh-120px)] bg-[#f6f6f8] rounded-xl overflow-hidden">
      {/* Collapsible Header */}
      <div className={`absolute top-4 left-4 z-20 transition-all duration-300 ${isLegendCollapsed ? 'w-auto' : 'w-80'}`}>
        <div className="bg-white/95 backdrop-blur-sm border border-[#e7ebf3] rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div>
              <h3 className="text-lg font-bold text-[#0d121b]">Mind Map</h3>
              {!isLegendCollapsed && (
                <p className="text-xs text-[#4c669a]">Drag to rearrange • Scroll to zoom</p>
              )}
            </div>
            <button
              onClick={() => setIsLegendCollapsed(!isLegendCollapsed)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[#4c669a] text-lg">
                {isLegendCollapsed ? 'expand_more' : 'expand_less'}
              </span>
            </button>
          </div>
          
          {!isLegendCollapsed && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-[#4c669a]">Done</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-[#4c669a]">Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="text-[#4c669a]">Locked</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
            showGrid 
              ? 'bg-[#135bec] text-white' 
              : 'bg-white border border-[#e7ebf3] text-[#4c669a] hover:bg-gray-50'
          }`}
        >
          Grid
        </button>
        <button
          onClick={resetLayout}
          className="px-3 py-2 bg-white border border-[#e7ebf3] rounded-lg text-xs font-semibold text-[#4c669a] hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        className="relative w-full h-full overflow-hidden"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={(e) => {
          e.preventDefault();
          const delta = e.deltaY > 0 ? -0.05 : 0.05;
          setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
        }}
        style={{ cursor: isDraggingCanvas ? 'grabbing' : dragState.isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          className="absolute inset-0 transition-transform duration-200"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center"
          }}
        >
          {/* Grid */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: "1200px", minHeight: "800px" }}>
            {renderGrid()}
          </svg>

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

          {/* Course Cards - Redesigned to be more compact */}
          {courses.map((course) => {
            const colors = getStatusColor(course.status);
            const isBeingDragged = dragState.draggedCourse?.id === course.id;
            
            return (
              <div
                key={course.id}
                className={`course-card absolute w-48 ${colors.bg} border-2 ${colors.border} rounded-lg p-3 shadow-md transition-all hover:shadow-lg select-none ${
                  isBeingDragged ? 'shadow-xl scale-105 z-50 rotate-2' : 'cursor-move hover:scale-102'
                }`}
                style={{
                  left: `${course.position.x}px`,
                  top: `${course.position.y}px`,
                  opacity: course.status === "pending" ? 0.7 : 1,
                  transition: isBeingDragged ? 'none' : 'all 0.2s ease-out'
                }}
                onMouseDown={(e) => handleCourseMouseDown(e, course)}
              >
                {/* Status indicator and drag handle */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${colors.dot}`}></div>
                    <span className="text-xs font-semibold text-[#4c669a]">{course.code}</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-sm opacity-50 hover:opacity-100">
                    drag_indicator
                  </span>
                </div>

                {/* Recommended badge */}
                {course.isRecommended && (
                  <div className="absolute -top-2 -right-2 bg-[#135bec] text-white px-2 py-1 rounded-full text-xs font-bold">
                    Next
                  </div>
                )}

                {/* Completed check */}
                {course.status === "completed" && (
                  <div className="absolute top-2 right-2">
                    <span className="material-symbols-outlined text-green-600 text-lg">check_circle</span>
                  </div>
                )}

                {/* Course content */}
                <h4 className="font-bold text-[#0d121b] text-sm mb-1 leading-tight">{course.title}</h4>
                <p className="text-xs text-[#4c669a] leading-relaxed mb-2 line-clamp-2">
                  {course.description}
                </p>

                {/* Progress bar */}
                {course.progress !== undefined && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-[#4c669a]">{course.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
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
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1">
        <div className="bg-white border border-[#e7ebf3] rounded-lg p-1 flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#f6f6f8] rounded transition-colors"
          >
            <span className="material-symbols-outlined text-[#4c669a] text-lg">add</span>
          </button>
          <button
            onClick={handleZoomReset}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#f6f6f8] rounded transition-colors"
            title="Reset zoom"
          >
            <span className="material-symbols-outlined text-[#4c669a] text-lg">center_focus_strong</span>
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#f6f6f8] rounded transition-colors"
          >
            <span className="material-symbols-outlined text-[#4c669a] text-lg">remove</span>
          </button>
        </div>
        <div className="text-center text-xs text-[#4c669a] mt-1">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-white/90 border border-[#e7ebf3] rounded-lg px-3 py-2 flex items-center gap-2 text-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <span className="text-[#4c669a] font-medium">Layout Auto-saved</span>
        </div>
      </div>
    </div>
  );
}
