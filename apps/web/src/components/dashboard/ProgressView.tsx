import { useAppStore } from "@/store/appStore";

export function ProgressView() {
  const { selectedSubject } = useAppStore();
  const subjectName = selectedSubject?.name || "Operating Systems";

  const progressData = {
    totalCompletion: 72,
    weeklyIncrease: 4,
    highPriorityRemaining: 3,
    nextTopic: "Advanced Calculus & Integration",
    goal: "Exam Ready"
  };

  return (
    <div className="max-w-[1000px] mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black tracking-tight text-[#0d121b]">Your Journey</h2>
        <p className="text-base text-[#4c669a]">Track your progress and stay on target.</p>
      </div>

      {/* Total Completion Card */}
      <div className="bg-white border border-[#e7ebf3] rounded-xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-[#4c669a] uppercase tracking-wide mb-2">
              Total Completion
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-[#135bec]">{progressData.totalCompletion}%</span>
              <span className="text-xl font-medium text-[#4c669a]">done</span>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-green-600 text-lg">trending_up</span>
            <span className="text-sm font-bold text-green-700">+{progressData.weeklyIncrease}% this week</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#135bec] rounded-full transition-all duration-500"
              style={{ width: `${progressData.totalCompletion}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-medium text-[#4c669a]">Start</span>
            <span className="text-xs font-medium text-[#4c669a]">Goal: {progressData.goal}</span>
          </div>
        </div>
      </div>

      {/* Focus & Priority Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Focus Card */}
        <div className="bg-white border border-[#e7ebf3] rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#135bec] text-2xl">verified</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0d121b] mb-2">
                You are focusing on the most exam-relevant topics.
              </h3>
              <p className="text-sm text-[#4c669a] leading-relaxed">
                Our algorithm has optimized your path. You're covering the high-yield material first, maximizing your study efficiency.
              </p>
            </div>
          </div>
        </div>

        {/* High Priority Remaining Card */}
        <div className="bg-white border border-[#e7ebf3] rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-orange-600 text-2xl">priority_high</span>
            </div>
            <div className="flex-1 text-center">
              <div className="text-6xl font-black text-[#0d121b] mb-2">
                {progressData.highPriorityRemaining}
              </div>
              <p className="text-base font-semibold text-[#4c669a]">
                High-Priority Topics Remaining
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Studying Card */}
      <div className="bg-white border border-[#e7ebf3] rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#4c669a]">Next up:</span>
            <span className="text-base font-bold text-[#0d121b]">{progressData.nextTopic}</span>
          </div>
          <button className="flex items-center gap-2 bg-[#135bec] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#135bec]/90 transition-colors">
            <span className="material-symbols-outlined">play_arrow</span>
            Continue Studying
          </button>
        </div>
      </div>

      {/* Additional Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-[#e7ebf3] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-[#135bec] text-2xl">schedule</span>
            <h4 className="text-sm font-semibold text-[#4c669a] uppercase">Study Time</h4>
          </div>
          <p className="text-3xl font-black text-[#0d121b]">24.5h</p>
          <p className="text-xs text-green-600 font-semibold mt-1">+3.2h this week</p>
        </div>

        <div className="bg-white border border-[#e7ebf3] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-[#135bec] text-2xl">check_circle</span>
            <h4 className="text-sm font-semibold text-[#4c669a] uppercase">Completed</h4>
          </div>
          <p className="text-3xl font-black text-[#0d121b]">18/25</p>
          <p className="text-xs text-[#4c669a] mt-1">Topics mastered</p>
        </div>

        <div className="bg-white border border-[#e7ebf3] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-[#135bec] text-2xl">local_fire_department</span>
            <h4 className="text-sm font-semibold text-[#4c669a] uppercase">Streak</h4>
          </div>
          <p className="text-3xl font-black text-[#0d121b]">7 days</p>
          <p className="text-xs text-orange-600 font-semibold mt-1">Keep it going!</p>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white border border-[#e7ebf3] rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[#0d121b] mb-1">Weekly Activity</h3>
          <p className="text-sm text-[#4c669a]">Your study sessions over the past week</p>
        </div>

        <div className="flex items-end justify-between gap-2 h-48">
          {[
            { day: "Mon", height: 60, hours: 2.5 },
            { day: "Tue", height: 80, hours: 3.5 },
            { day: "Wed", height: 45, hours: 1.8 },
            { day: "Thu", height: 90, hours: 4.2 },
            { day: "Fri", height: 70, hours: 3.0 },
            { day: "Sat", height: 95, hours: 4.5 },
            { day: "Sun", height: 55, hours: 2.3 }
          ].map((item) => (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative w-full group">
                <div 
                  className="w-full bg-[#135bec] rounded-t-lg transition-all hover:bg-[#135bec]/80 cursor-pointer"
                  style={{ height: `${item.height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#0d121b] text-white px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.hours}h
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#4c669a]">{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white border border-[#e7ebf3] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#0d121b] mb-1">Recent Achievements</h3>
            <p className="text-sm text-[#4c669a]">Milestones you've unlocked</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: "emoji_events", title: "Week Warrior", description: "7 day streak" },
            { icon: "speed", title: "Fast Learner", description: "Completed 5 topics" },
            { icon: "school", title: "Scholar", description: "20+ hours studied" },
            { icon: "stars", title: "Perfectionist", description: "100% on 3 quizzes" }
          ].map((achievement, index) => (
            <div 
              key={index}
              className="bg-linear-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#135bec] flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-white text-2xl">{achievement.icon}</span>
              </div>
              <h4 className="font-bold text-[#0d121b] text-sm mb-1">{achievement.title}</h4>
              <p className="text-xs text-[#4c669a]">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
