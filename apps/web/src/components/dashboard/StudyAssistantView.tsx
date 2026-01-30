import { useState } from "react";
import { useAppStore } from "@/store/appStore";

interface Message {
  id: string;
  type: "assistant" | "user";
  content: string;
  timestamp: Date;
}

export function StudyAssistantView() {
  const { selectedSubject } = useAppStore();
  const subjectName = selectedSubject?.name || "Data Structures & Algorithms";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: `Hello! I'm your LearnPath Study Assistant. Based on your current progress in ${subjectName}, I can help you with priority mapping, graduation requirements, or subject-specific tutoring. How can I assist you today?`,
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");

  const suggestedActions = [
    "Explain Priority Mapping",
    "How is my GPA projected?",
    "Summarize last session",
  ];

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I'm analyzing your question and will provide a detailed response shortly...",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);

    setInputValue("");
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
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-4xl font-black tracking-tight text-[#0d121b]">
          Study Assistant
        </h2>
        <p className="text-base text-[#4c669a]">
          Get personalized help with your academic planning and subject tutoring.
        </p>
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
              className="flex-1 pl-12 pr-4 py-3 border border-[#e7ebf3] rounded-full bg-[#f6f6f8] text-[#0d121b] placeholder:text-[#4c669a] focus:outline-none focus:border-[#135bec] focus:bg-white transition-all"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim()}
              className="w-11 h-11 rounded-full bg-[#135bec] flex items-center justify-center hover:bg-[#0d4bc4] disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-white text-xl">
                send
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
