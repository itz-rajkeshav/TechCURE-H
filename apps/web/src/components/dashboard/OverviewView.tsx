import { useAppStore } from "@/store/appStore";
import { useSubjectStats, useProgress, useSubjectTopics } from "@/lib/api/hooks";
import { useMemo } from "react";
import { Link } from "@tanstack/react-router";

export function OverviewView() {
  const { selectedSubject } = useAppStore();
  
  // Use hardcoded physics subject ID if no subject is selected (for demo purposes)
  const subjectId = selectedSubject?.id || "physics-12-cbse";
  const title = selectedSubject?.name || "Physics (Class 12)";
  
  // Fetch data from APIs
  const { data: statsResponse, isLoading: statsLoading, error: statsError } = useSubjectStats(subjectId);
  const { data: progress = [], isLoading: progressLoading } = useProgress(subjectId);
  const { data: topicsResponse, isLoading: topicsLoading } = useSubjectTopics(subjectId);

  const stats = statsResponse?.success ? statsResponse.data.stats : null;
  const subjectData = statsResponse?.success ? statsResponse.data.subject : null;
  const topics = topicsResponse?.success ? topicsResponse.data : [];

  // Calculate progress stats
  const progressStats = useMemo(() => {
    if (!progress.length) return { high: 0, upcoming: 0, completed: 0 };
    
    const completedCount = progress.filter((p: any) => p.status === "completed").length;
    const inProgressCount = progress.filter((p: any) => p.status === "in_progress").length;
    const highPriorityCount = stats?.byPriority?.high?.count || 0;
    
    return {
      high: highPriorityCount,
      upcoming: inProgressCount,
      completed: completedCount
    };
  }, [progress, stats]);

  // Get high priority topics for focus section
  const focusTopics = useMemo(() => {
    if (!topics.length) return [];
    
    return topics
      .filter((t: any) => t.priority === "high")
      .filter((t: any) => !progress.find((p: any) => p.topic?._id?.toString() === t._id?.toString() && p.status === "completed"))
      .slice(0, 2);
  }, [topics, progress]);

  // Loading state
  if (statsLoading || progressLoading || topicsLoading) {
    return (
      <div className="max-w-[1000px] mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-black tracking-tight text-[#0d121b]">Overview</h2>
          <p className="text-base text-[#4c669a]">Curriculum tracking for {title}</p>
        </div>

        <div className="animate-pulse">
          <div className="bg-gray-200 h-48 rounded-xl mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 h-24 rounded-xl"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-32 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (statsError) {
    return (
      <div className="max-w-[1000px] mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-black tracking-tight text-[#0d121b]">Overview</h2>
          <p className="text-base text-[#4c669a]">Curriculum tracking for {title}</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to load overview</h3>
          <p className="text-red-700">
            {statsError.message || "An error occurred while loading the subject overview."}
          </p>
        </div>
      </div>
    );
  }

  const summary = subjectData?.description || "Mastering kernel concepts, process management, and file systems. This course covers the fundamental interface between hardware and the user, including CPU scheduling, memory management, and security protocols.";

  return (
    <div className="max-w-[1000px] mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black tracking-tight text-[#0d121b]">Overview</h2>
        <p className="text-base text-[#4c669a]">Curriculum tracking for {title}</p>
      </div>

      <section className="bg-white border border-[#e7ebf3] rounded-xl overflow-hidden flex flex-col md:flex-row items-center">
        <div 
          className="w-full md:w-1/3 h-48 md:h-auto bg-cover bg-center" 
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBpzUWunC6Ky_9CW7Q-Mt9KRHJ1wbU3xvj-_u6GMww1rm0K6jtMdPUiPeYiBes2OHO7iKyA798RS1XIo4Z1rLQqRPG-Aqow-csFfJoAukoKj8nHOMSPn-YYwtNcZjuft9PRBp-M5LdCCyTUEotCvlYjntvQbTSnxnULVr1w0DzXVvm3U8_NS9gJjX_Ece2VU18L5V65yS07r7pcL98KI8bWgSZTp59sKPDWzj7rz6M09CcYd1D_JvfDVGipLQinnXdwZW1pJGTNCu0z")' }}
        ></div>
        <div className="p-6 md:p-8 flex-1">
          <h3 className="text-xl font-bold mb-2">Subject Summary</h3>
          <p className="text-[#4c669a] leading-relaxed">
            {summary}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#cfd7e7]">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-2 rounded-full bg-red-500"></div>
            <p className="text-sm font-medium text-[#4c669a]">High Priority</p>
          </div>
          <p className="text-3xl font-bold">{progressStats.high}</p>
          <p className="text-xs mt-2 text-[#4c669a] font-medium">
            {stats?.byPriority?.high?.examWeight || 0}% total exam weight
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#cfd7e7]">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-2 rounded-full bg-blue-500"></div>
            <p className="text-sm font-medium text-[#4c669a]">In Progress</p>
          </div>
          <p className="text-3xl font-bold">{progressStats.upcoming}</p>
          <p className="text-xs mt-2 text-[#4c669a] font-medium">
            Currently studying
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#cfd7e7]">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-2 rounded-full bg-green-500"></div>
            <p className="text-sm font-medium text-[#4c669a]">Completed</p>
          </div>
          <p className="text-3xl font-bold">{progressStats.completed}</p>
          <p className="text-xs mt-2 text-[#4c669a] font-medium">
            of {stats?.totalTopics || 0} topics
          </p>
        </div>
      </div>

      <section className="bg-blue-50/50 border-2 border-[#135bec]/20 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-[#135bec] text-3xl">task_alt</span>
          <h3 className="text-2xl font-bold text-[#135bec]">Focus Today</h3>
        </div>

        {focusTopics.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {focusTopics.map((topic: any, index: number) => (
                <div key={topic._id} className="bg-white p-5 rounded-lg border border-[#135bec]/10 shadow-sm flex items-start gap-4">
                  <div className="mt-1 flex items-center justify-center size-6 rounded-full bg-[#135bec]/10 text-[#135bec] text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0d121b]">{topic.title}</h4>
                    <p className="text-sm text-[#4c669a] mt-1">{topic.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-md font-medium">
                        {topic.examWeight}% exam weight
                      </span>
                      <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-md font-medium">
                        {topic.estimatedTime}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button className="text-[#135bec] font-bold text-sm flex items-center gap-1 hover:underline">
                View full study path <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h4 className="text-xl font-bold text-[#135bec] mb-2">Great progress!</h4>
            <p className="text-[#4c669a]">
              {progressStats.completed > 0 
                ? "You've completed all high priority topics. Keep up the momentum!"
                : "No high priority topics found. Check your subject selection."
              }
            </p>
          </div>
        )}
      </section>

      <section className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200/50 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-purple-600 text-3xl">psychology</span>
          <h3 className="text-2xl font-bold text-purple-700">Interactive Learning</h3>
        </div>
        
        <p className="text-purple-600/80 mb-6 leading-relaxed">
          Master your subjects with AI-powered quizzes, smart flashcards, and personalized learning analytics.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link 
            to="/quizzes" 
            className="bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-purple-200/50 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <span className="material-symbols-outlined text-blue-600 text-xl">quiz</span>
              </div>
              <h4 className="font-bold text-gray-800">Practice Quizzes</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Test your knowledge with adaptive quizzes that adjust to your learning pace.
            </p>
          </Link>

          <Link 
            to="/flashcards" 
            className="bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-purple-200/50 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <span className="material-symbols-outlined text-green-600 text-xl">style</span>
              </div>
              <h4 className="font-bold text-gray-800">Smart Flashcards</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Review concepts with spaced repetition algorithm for long-term retention.
            </p>
          </Link>

          <Link 
            to="/stats" 
            className="bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-purple-200/50 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <span className="material-symbols-outlined text-orange-600 text-xl">trending_up</span>
              </div>
              <h4 className="font-bold text-gray-800">My Progress</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Track your learning journey with detailed analytics and achievements.
            </p>
          </Link>
        </div>

        <div className="mt-6 flex justify-end">
          <Link 
            to="/study-assistant" 
            className="text-purple-600 font-bold text-sm flex items-center gap-1 hover:underline hover:text-purple-700 transition-colors"
          >
            Get AI Study Help <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
