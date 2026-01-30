import { useState } from "react";
import { useAppStore } from "@/store/appStore";

type TimeFilter = "7days" | "semester" | "alltime";

export function InsightsView() {
  const { selectedSubject } = useAppStore();
  const subjectName = selectedSubject?.name || "Operating Systems";
  
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("semester");

  const mistakes = [
    {
      id: 1,
      title: "Deadlock Conditions",
      description: "Confusing Mutual Exclusion with Circular Wait.",
      frequency: "42% Frequency",
      icon: "block",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      borderColor: "border-red-100",
      frequencyColor: "text-red-700"
    },
    {
      id: 2,
      title: "Paging Calculations",
      description: "Incorrectly mapping virtual to physical addresses.",
      frequency: "28% Frequency",
      icon: "calculate",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      borderColor: "border-orange-100",
      frequencyColor: "text-orange-700"
    },
    {
      id: 3,
      title: "Context Switching",
      description: "Underestimating overhead in time-sharing systems.",
      frequency: "15% Frequency",
      icon: "schedule",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      borderColor: "border-yellow-100",
      frequencyColor: "text-yellow-700"
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-black tracking-tight text-[#0d121b]">Academic Insights</h2>
          <p className="text-base text-[#4c669a]">Analysis based on Fall 2023 Semester</p>
        </div>

        {/* Time Filter Buttons */}
        <div className="flex items-center gap-2 bg-white border border-[#e7ebf3] rounded-lg p-1">
          <button
            onClick={() => setTimeFilter("7days")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              timeFilter === "7days"
                ? "bg-[#f6f6f8] text-[#0d121b]"
                : "text-[#4c669a] hover:text-[#0d121b]"
            }`}
          >
            <span className="material-symbols-outlined text-lg">schedule</span>
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeFilter("semester")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              timeFilter === "semester"
                ? "bg-[#135bec] text-white"
                : "text-[#4c669a] hover:text-[#0d121b]"
            }`}
          >
            <span className="material-symbols-outlined text-lg">calendar_month</span>
            Semester
          </button>
          <button
            onClick={() => setTimeFilter("alltime")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              timeFilter === "alltime"
                ? "bg-[#f6f6f8] text-[#0d121b]"
                : "text-[#4c669a] hover:text-[#0d121b]"
            }`}
          >
            <span className="material-symbols-outlined text-lg">history</span>
            All Time
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exam Frequency Trends - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white border border-[#e7ebf3] rounded-xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#0d121b] mb-1">Exam Frequency Trends</h3>
              <p className="text-sm text-[#4c669a]">{subjectName} • Last 3 Months</p>
            </div>
            <div className="flex items-center gap-1 text-green-600 font-semibold text-sm">
              <span className="material-symbols-outlined text-lg">trending_up</span>
              +15% frequency
            </div>
          </div>

          {/* Chart Placeholder - You can integrate a real chart library later */}
          <div className="relative h-64 bg-linear-to-b from-blue-50/50 to-transparent rounded-lg">
            <svg className="w-full h-full" viewBox="0 0 800 250" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#135bec" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#135bec" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              
              {/* Area under the curve */}
              <path
                d="M 50 150 Q 150 100, 200 120 T 300 130 Q 400 80, 500 60 T 600 100 Q 700 140, 750 120 L 750 250 L 50 250 Z"
                fill="url(#areaGradient)"
              />
              
              {/* Line */}
              <path
                d="M 50 150 Q 150 100, 200 120 T 300 130 Q 400 80, 500 60 T 600 100 Q 700 140, 750 120"
                fill="none"
                stroke="#135bec"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            
            {/* X-axis labels */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-between px-12 text-xs font-semibold text-[#4c669a] uppercase">
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </div>

        {/* Over-studied Topics - Takes 1 column */}
        <div className="bg-white border border-[#e7ebf3] rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#0d121b] mb-1">Over-studied Topics</h3>
            <p className="text-sm text-[#4c669a]">High effort, low yield analysis</p>
          </div>

          {/* Donut Chart */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke="#e7ebf3"
                  strokeWidth="20"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="20"
                  strokeDasharray="251.2"
                  strokeDashoffset="75"
                  strokeLinecap="round"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke="#e7ebf3"
                  strokeWidth="20"
                  strokeDasharray="251.2"
                  strokeDashoffset="-75"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-[#0d121b]">4h</span>
                <span className="text-xs font-semibold text-[#4c669a] uppercase tracking-wide">Spent</span>
              </div>
            </div>

            <div className="text-center mt-4">
              <h4 className="font-bold text-[#0d121b] mb-1">Basic Scheduling</h4>
              <div className="flex items-center gap-1 justify-center text-sm text-[#4c669a]">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Low Yield (Exam Impact)
              </div>
            </div>
          </div>

          <button className="w-full py-2.5 px-4 bg-blue-50 text-[#135bec] font-semibold text-sm rounded-lg hover:bg-blue-100 transition-colors">
            View Topic Details
          </button>
        </div>
      </div>

      {/* Common Student Mistakes */}
      <div className="bg-white border border-[#e7ebf3] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#0d121b] mb-1">Common Student Mistakes</h3>
            <p className="text-sm text-[#4c669a]">Identified from 240+ {subjectName} quizzes</p>
          </div>
          <button className="text-[#135bec] font-semibold text-sm hover:underline">
            See all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mistakes.map((mistake) => (
            <div
              key={mistake.id}
              className={`${mistake.bgColor} ${mistake.borderColor} border rounded-xl p-5`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full ${mistake.bgColor} flex items-center justify-center shrink-0`}>
                  <span className={`material-symbols-outlined ${mistake.iconColor} text-2xl`}>
                    {mistake.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#0d121b] mb-2">{mistake.title}</h4>
                  <p className="text-sm text-[#4c669a] mb-3 leading-relaxed">
                    {mistake.description}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold ${mistake.frequencyColor} bg-white/50`}>
                    {mistake.frequency}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
