import { useAppStore } from "@/store/appStore";
import { Link } from "@tanstack/react-router";

interface StudyTopic {
  id: number;
  icon: string;
  title: string;
  description: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  level: "DEEP UNDERSTANDING" | "CONCEPTUAL" | "OVERVIEW" | "SURFACE LEVEL" | "PROBLEM SOLVING";
}

export function StudyPathView() {
  const { selectedSubject } = useAppStore();
  
  const subjectName = selectedSubject?.name || "Operating Systems";
  
  const studyTopics: StudyTopic[] = [
    {
      id: 1,
      icon: "event",
      title: "Process Scheduling",
      description: "Focus on CPU allocation strategies, preemption mechanisms, and performance metrics across different scheduling algorithms like Round Robin and SJF.",
      priority: "HIGH",
      level: "DEEP UNDERSTANDING"
    },
    {
      id: 2,
      icon: "memory",
      title: "Memory Allocation",
      description: "Understanding contiguous and non-contiguous allocation, paging, and segmentation. Key for grasping how physical memory is virtualized.",
      priority: "HIGH",
      level: "CONCEPTUAL"
    },
    {
      id: 3,
      icon: "folder",
      title: "File Systems",
      description: "Structure of directories, disk space allocation, and free-space management. High-level look at NTFS, EXT4, and FAT systems.",
      priority: "MEDIUM",
      level: "OVERVIEW"
    },
    {
      id: 4,
      icon: "input",
      title: "I/O Management",
      description: "Basics of device drivers, buffering, and spooling. Introduction to how the kernel interacts with peripheral hardware.",
      priority: "LOW",
      level: "SURFACE LEVEL"
    },
    {
      id: 5,
      icon: "sync",
      title: "Synchronization",
      description: "Critical sections, mutexes, semaphores, and classic problems like the Producer-Consumer. Essential for concurrent programming.",
      priority: "HIGH",
      level: "DEEP UNDERSTANDING"
    },
    {
      id: 6,
      icon: "block",
      title: "Deadlock Handling",
      description: "Deadlock prevention, avoidance (Banker's Algorithm), and recovery strategies. Focus on practical problem-solving scenarios.",
      priority: "HIGH",
      level: "PROBLEM SOLVING"
    }
  ];

  const getPriorityStyles = (priority: "HIGH" | "MEDIUM" | "LOW") => {
    switch (priority) {
      case "HIGH":
        return "bg-red-50 text-red-700 border-red-200";
      case "MEDIUM":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "LOW":
        return "bg-green-50 text-green-700 border-green-200";
    }
  };

  const getLevelStyles = (level: "DEEP UNDERSTANDING" | "CONCEPTUAL" | "OVERVIEW" | "SURFACE LEVEL" | "PROBLEM SOLVING") => {
    switch (level) {
      case "DEEP UNDERSTANDING":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "CONCEPTUAL":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "OVERVIEW":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "SURFACE LEVEL":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "PROBLEM SOLVING":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black tracking-tight text-[#0d121b]">Study Path</h2>
        <p className="text-base text-[#4c669a]">Your optimized learning sequence for {subjectName}</p>
      </div>

      <div className="flex flex-col gap-6">
        {studyTopics.map((topic, index) => (
          <div 
            key={topic.id} 
            className="bg-white border border-[#e7ebf3] rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Number Circle */}
              <div className="shrink-0 w-12 h-12 rounded-full bg-[#135bec] text-white flex items-center justify-center text-lg font-bold">
                {topic.id}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 mb-3">
                  <span className="material-symbols-outlined text-[#4c669a] text-xl mt-0.5">
                    {topic.icon}
                  </span>
                  <h3 className="text-xl font-bold text-[#0d121b]">
                    {topic.title}
                  </h3>
                </div>

                <p className="text-sm text-[#4c669a] leading-relaxed mb-4">
                  {topic.description}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold border uppercase ${getPriorityStyles(topic.priority)}`}>
                    {topic.priority} Priority
                  </span>
                  <span className={`px-3 py-1 rounded-md text-xs font-bold border uppercase ${getLevelStyles(topic.level)}`}>
                    {topic.level}
                  </span>
                </div>

                {/* Interactive Actions */}
                <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
                  <Link
                    to="/flashcards"
                    search={{ topic: topic.title }}
                    className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">style</span>
                    Study Cards
                  </Link>
                  
                  <Link
                    to="/quizzes"
                    search={{ topic: topic.title }}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">quiz</span>
                    Take Quiz
                  </Link>
                  
                  <button className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-100 transition-colors">
                    <span className="material-symbols-outlined text-sm">play_arrow</span>
                    Start Learning
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
