import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { useAIChat, useUserStats } from "@/lib/api/hooks";
import { useProgress } from "@/lib/api/hooks";
import { Link } from "@tanstack/react-router";

interface Message {
  id: string;
  type: "assistant" | "user";
  content: string;
  timestamp: Date;
}

export function StudyAssistantView() {
  const { selectedSubject } = useAppStore();
  const subjectName = selectedSubject?.name || "Data Structures & Algorithms";
  const subjectId = selectedSubject?.id;
  
  // Get user progress for context
  const { data: progressData } = useProgress(subjectId || "");
  const { data: userStatsData } = useUserStats();
  
  // AI Chat hook
  const aiChatMutation = useAIChat();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: `Hello! I'm your Study Assistant for ${subjectName}. I can help you with questions, create practice quizzes, suggest study strategies, or review concepts. I can also guide you to interactive learning tools. What would you like to work on?`,
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");

  const suggestedActions = [
    "Create a practice quiz",
    "Review key concepts",
    "Study strategy tips",
    "Explain difficult topics",
  ];

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: "Thinking...",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Get conversation history for context (last 10 messages)
      const conversationHistory = messages
        .slice(-10)
        .map(msg => ({
          role: msg.type === "user" ? "user" as const : "assistant" as const,
          content: msg.content
        }));

      // Build context from user progress and subject info
      const context = {
        subjectId: subjectId,
        subjectName: subjectName,
        userProgress: progressData && Array.isArray(progressData) ? {
          completedTopics: progressData.filter(p => p.status === "completed").length,
          totalTopics: progressData.length,
          currentLevel: "intermediate" // Default level, can be enhanced later
        } : undefined
      };

      // Call AI API
      const response = await aiChatMutation.mutateAsync({
        message: content,
        context: context,
        conversationHistory: conversationHistory
      });

      // Replace loading message with AI response
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === loadingMessage.id 
            ? {
                ...msg,
                content: response.response,
                timestamp: new Date(response.timestamp)
              }
            : msg
        )
      );

    } catch (error) {
      console.error("AI Chat error:", error);
      
      // Replace loading message with error fallback
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === loadingMessage.id 
            ? {
                ...msg,
                content: "I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment, or feel free to ask me about study planning, course recommendations, or academic strategies.",
              }
            : msg
        )
      );
    }
  };

  const handleSuggestedAction = (action: string) => {
    handleSendMessage(action);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-[#0d121b]">
            Study Assistant
          </h2>
          <p className="text-base text-[#4c669a]">
            Get AI-powered help with learning, plus access to interactive study tools.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/quizzes"
            className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <span className="material-symbols-outlined text-white text-lg">quiz</span>
              </div>
              <div>
                <h4 className="font-bold text-blue-800 text-sm">Practice Quiz</h4>
                <p className="text-xs text-blue-600">Test knowledge</p>
              </div>
            </div>
          </Link>

          <Link
            to="/flashcards"
            className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center group-hover:bg-green-600 transition-colors">
                <span className="material-symbols-outlined text-white text-lg">style</span>
              </div>
              <div>
                <h4 className="font-bold text-green-800 text-sm">Flashcards</h4>
                <p className="text-xs text-green-600">Quick review</p>
              </div>
            </div>
          </Link>

          <Link
            to="/progress"
            className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                <span className="material-symbols-outlined text-white text-lg">trending_up</span>
              </div>
              <div>
                <h4 className="font-bold text-purple-800 text-sm">Progress</h4>
                <p className="text-xs text-purple-600">Track stats</p>
              </div>
            </div>
          </Link>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-lg">emoji_events</span>
              </div>
              <div>
                <h4 className="font-bold text-orange-800 text-sm">
                  Level {userStatsData?.success && userStatsData.data ? userStatsData.data.stats.level : '1'}
                </h4>
                <p className="text-xs text-orange-600">
                  {userStatsData?.success && userStatsData.data ? `${userStatsData.data.stats.currentStreak} day streak` : 'Loading...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white border border-[#e7ebf3] rounded-xl shadow-sm flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Today Label */}
          <div className="flex items-center justify-center">
            <span className="px-4 py-1 bg-[#f6f6f8] text-[#4c669a] text-xs font-semibold rounded-full uppercase tracking-wide">
              Today
            </span>
          </div>

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.type === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              {message.type === "assistant" && (
                <div className="w-10 h-10 rounded-full bg-[#135bec] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-xl">
                    smart_toy
                  </span>
                </div>
              )}

              {message.type === "user" && (
                <div className="w-10 h-10 rounded-full bg-[#4c669a] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-xl">
                    person
                  </span>
                </div>
              )}

              {/* Message Content */}
              <div
                className={`flex flex-col gap-2 max-w-[70%] ${
                  message.type === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="text-xs text-[#4c669a] font-medium">
                  {message.type === "assistant" ? "Assistant" : "You"}
                </div>
                <div
                  className={`rounded-2xl px-5 py-3 ${
                    message.type === "assistant"
                      ? "bg-[#f6f6f8] text-[#0d121b]"
                      : "bg-[#135bec] text-white"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t border-[#e7ebf3] p-6 space-y-4">
          {/* Suggested Actions */}
          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-3 justify-center">
              {suggestedActions.map((action) => (
                <button
                  key={action}
                  onClick={() => handleSuggestedAction(action)}
                  className="px-5 py-2 bg-white border border-[#e7ebf3] rounded-full text-sm font-medium text-[#4c669a] hover:bg-[#f6f6f8] hover:border-[#135bec] hover:text-[#135bec] transition-all"
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* Input Field */}
          <div className="relative flex items-center gap-3">
            <span className="material-symbols-outlined text-[#4c669a] text-xl absolute left-4">
              chat_bubble
            </span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything about your academic plan..."
              disabled={aiChatMutation.isPending}
              className="flex-1 pl-12 pr-4 py-3 border border-[#e7ebf3] rounded-full bg-[#f6f6f8] text-[#0d121b] placeholder:text-[#4c669a] focus:outline-none focus:border-[#135bec] focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || aiChatMutation.isPending}
              className="w-11 h-11 rounded-full bg-[#135bec] flex items-center justify-center hover:bg-[#0d4bc4] disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-white text-xl">
                {aiChatMutation.isPending ? "hourglass_empty" : "send"}
              </span>
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-[#4c669a] text-center">
            Assistant may provide suggestions based on university policy. Always
            verify with your Academic Advisor.
          </p>
        </div>
      </div>
    </div>
  );
}
