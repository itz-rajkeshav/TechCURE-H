/**
 * AI Router
 * 
 * API endpoints for AI-powered study assistance using Grok API
 */

import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure } from "../index";
import { env } from "@techcure/env/server";

// ============================================================================
// Input Schemas
// ============================================================================

const chatInput = z.object({
  message: z.string().min(1).max(2000),
  context: z.object({
    subjectId: z.string().optional(),
    subjectName: z.string().optional(),
    userProgress: z.object({
      completedTopics: z.number().default(0),
      totalTopics: z.number().default(0),
      currentLevel: z.string().optional(),
    }).optional(),
  }).optional(),
  conversationHistory: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })).optional(),
});

// ============================================================================
// AI API Integration (Google Gemini + Grok Fallback)
// ============================================================================

interface GeminiMessage {
  role: "user" | "model";
  parts: [{ text: string }];
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface GrokMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GrokResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Primary AI function - tries Gemini first, falls back to Grok or intelligent responses
async function callAIService(messages: GrokMessage[]): Promise<string> {
  // Try Google Gemini first (free tier)
  try {
    console.log("🤖 Trying Google Gemini API...");
    return await callGeminiAPI(messages);
  } catch (geminiError: any) {
    console.log("⚠️ Gemini failed, trying Grok API...");
    
    // Fallback to Grok if available
    if (env.GROK_API_KEY) {
      try {
        return await callGrokAPI(messages);
      } catch (grokError: any) {
        console.log("⚠️ Grok also failed, using intelligent fallback...");
        throw new Error("Both AI services unavailable");
      }
    } else {
      console.log("⚠️ No Grok key available, using intelligent fallback...");
      throw new Error("AI services unavailable");
    }
  }
}

async function callGeminiAPI(messages: GrokMessage[]): Promise<string> {
  console.log("🤖 Calling Google Gemini API...");
  console.log("🔑 Gemini API Key present:", !!env.GEMINI_API_KEY);

  // Convert messages to Gemini format
  const geminiMessages: GeminiMessage[] = [];
  let systemPrompt = "";
  
  for (const message of messages) {
    if (message.role === "system") {
      systemPrompt = message.content;
    } else if (message.role === "user") {
      geminiMessages.push({
        role: "user",
        parts: [{ text: systemPrompt ? `${systemPrompt}\n\nUser: ${message.content}` : message.content }]
      });
      systemPrompt = ""; // Only use system prompt once
    } else if (message.role === "assistant") {
      geminiMessages.push({
        role: "model",
        parts: [{ text: message.content }]
      });
    }
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        },
      }),
    }
  );

  console.log("📡 Gemini API Response Status:", response.status);

  if (!response.ok) {
    const errorData = await response.text();
    console.error("❌ Gemini API Error:", errorData);
    throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorData}`);
  }

  const data = await response.json() as GeminiResponse;
  console.log("✅ Gemini API Success - Response received");

  if (!data.candidates || data.candidates.length === 0) {
    console.error("❌ No candidates in Gemini response:", data);
    throw new Error("No response from Gemini API");
  }

  const candidate = data.candidates[0];
  if (!candidate?.content?.parts?.[0]?.text) {
    console.error("❌ No content in Gemini response:", candidate);
    throw new Error("No content from Gemini API");
  }

  return candidate.content.parts[0].text;
}

async function callGrokAPI(messages: GrokMessage[]): Promise<string> {
  try {
    console.log("🤖 Calling Grok API with", messages.length, "messages");
    console.log("🔑 API Key present:", !!env.GROK_API_KEY);
    
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.GROK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-beta", // Using Grok's latest model
        messages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false,
      }),
    });

    console.log("📡 Grok API Response Status:", response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error("❌ Grok API Error:", errorData);
      throw new Error(`Grok API error: ${response.status} ${response.statusText} - ${errorData}`);
    }

    const data = await response.json() as GrokResponse;
    console.log("✅ Grok API Success - Response received");
    
    if (!data.choices || data.choices.length === 0) {
      console.error("❌ No choices in Grok response:", data);
      throw new Error("No response from Grok API");
    }

    const choice = data.choices[0];
    if (!choice || !choice.message || !choice.message.content) {
      console.error("❌ No message content in Grok response:", choice);
      throw new Error("No message content from Grok API");
    }

    return choice.message.content;
  } catch (error) {
    console.error("💥 Error calling Grok API:", error);
    throw error;
  }
}

// ============================================================================
// Procedures
// ============================================================================

/**
 * Send message to AI study assistant
 */
export const chat = protectedProcedure
  .input(chatInput)
  .handler(async ({ input, context }) => {
    const userId = context.session?.user?.id;

    if (!userId) {
      throw new ORPCError("UNAUTHORIZED");
    }

    const { message, context: userContext, conversationHistory } = input;

    try {
      // Build system prompt based on context
      const systemPrompt = buildSystemPrompt(userContext);
      
      // Build conversation messages
      const messages: GrokMessage[] = [
        { role: "system", content: systemPrompt },
      ];

      // Add conversation history if provided
      if (conversationHistory && conversationHistory.length > 0) {
        conversationHistory.forEach(msg => {
          messages.push({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content
          });
        });
      }

      // Add current user message
      messages.push({ role: "user", content: message });

      // Call AI Service (Gemini primary, Grok fallback)
      const aiResponse = await callAIService(messages);

      return {
        response: aiResponse,
        timestamp: new Date().toISOString(),
      };

    } catch (error: any) {
      console.error("Chat error:", error);
      console.log("🔄 Falling back to intelligent response for message:", message);
      
      // Always provide intelligent fallback based on user input when AI services fail
      const fallbackResponse = generateIntelligentFallback(message, userContext);
      console.log("✅ Generated intelligent fallback response");
      
      return {
        response: fallbackResponse,
        timestamp: new Date().toISOString(),
        fallback: true,
      };
    }
  });

/**
 * Get suggested study topics based on user progress
 */
export const getSuggestions = protectedProcedure
  .input(z.object({
    subjectId: z.string(),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  }))
  .handler(async ({ input, context }) => {
    const userId = context.session?.user?.id;

    if (!userId) {
      throw new ORPCError("UNAUTHORIZED");
    }

    try {
      const systemPrompt = `You are an expert study assistant. Based on the subject ID "${input.subjectId}" and difficulty level "${input.difficulty || 'intermediate'}", provide 3-5 specific study suggestions. Format your response as a JSON array of objects with 'title' and 'description' fields. Be concise and practical.`;

      const messages: GrokMessage[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Give me study suggestions for this subject." }
      ];

      const aiResponse = await callAIService(messages);
      
      // Try to parse as JSON, fallback to plain text if it fails
      try {
        const suggestions = JSON.parse(aiResponse);
        return { suggestions };
      } catch {
        // If not valid JSON, return as plain text
        return { 
          suggestions: [{ 
            title: "Study Recommendations", 
            description: aiResponse 
          }] 
        };
      }

    } catch (error: any) {
      console.error("Suggestions error:", error);
      
      // Fallback suggestions
      return {
        suggestions: [
          {
            title: "Review Fundamentals",
            description: "Start with core concepts and build your foundation."
          },
          {
            title: "Practice Problems",
            description: "Apply your knowledge with hands-on exercises."
          },
          {
            title: "Connect Concepts",
            description: "Look for relationships between different topics."
          }
        ],
        fallback: true,
      };
    }
  });

// ============================================================================
// Helper Functions
// ============================================================================

function generateIntelligentFallback(message: string, userContext?: any): string {
  const lowerMessage = message.toLowerCase();
  
  // GPA-related questions
  if (lowerMessage.includes("gpa") || lowerMessage.includes("grade")) {
    const completedCount = userContext?.userProgress?.completedTopics || 0;
    const totalCount = userContext?.userProgress?.totalTopics || 10;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const subjectName = userContext?.subjectName || "your current subject";
    
    return `Based on your current progress in ${subjectName} (${completedCount}/${totalCount} topics completed, ${progressPercent}%), here's my GPA projection analysis:

📊 **Current Performance Analysis:**
• Subject Progress: ${progressPercent}% complete
• Completion Rate: ${completedCount > 0 ? "On track" : "Getting started"}
• Projected Impact: Moderate to strong positive influence on overall GPA

📈 **GPA Projection Insights:**
• **If you maintain current pace**: Likely 3.3-3.7 GPA range for this subject
• **With focused improvement**: Potential for 3.7-4.0 GPA range
• **Time investment needed**: ~2-3 hours per week for optimal results

🎯 **Recommended Actions:**
1. Complete ${Math.min(3, totalCount - completedCount)} more topics this week
2. Review fundamental concepts for stronger foundation
3. Practice problem-solving to boost comprehension
4. Set up regular study schedule for consistency

💡 **Next Steps:** Focus on completing the remaining ${totalCount - completedCount} topics systematically. Each completed topic should positively impact your overall academic standing.

*Note: This projection is based on your current progress pattern. For more personalized advice, consider meeting with your academic advisor.*`;
  }
  
  // Study planning questions
  if (lowerMessage.includes("study") || lowerMessage.includes("plan") || lowerMessage.includes("schedule")) {
    return `Here's a personalized study plan based on your current progress:

📚 **Study Strategy Recommendations:**
• Focus on active learning techniques (practice problems, concept mapping)
• Break study sessions into 25-45 minute focused blocks
• Review completed topics weekly to maintain retention
• Prioritize understanding over memorization

⏰ **Optimal Study Schedule:**
• **Daily**: 30-60 minutes of focused study
• **Weekly**: 1-2 comprehensive review sessions
• **Before exams**: Spaced repetition of key concepts

🎯 **Subject-Specific Tips:**
• Start with foundational concepts before advanced topics
• Use multiple learning resources (videos, practice problems, textbooks)
• Form study groups for collaborative learning
• Seek help early if concepts seem challenging

Would you like me to help you create a detailed weekly study schedule?`;
  }
  
  // General academic questions
  if (lowerMessage.includes("help") || lowerMessage.includes("advice") || lowerMessage.includes("recommend")) {
    return `I'm here to help with your academic success! Here are some general recommendations:

🎓 **Academic Excellence Tips:**
• Set clear, measurable learning goals
• Develop consistent study habits
• Track your progress regularly
• Seek help when needed - don't wait until you're struggling

📖 **Learning Strategies:**
• Use active recall techniques
• Practice spaced repetition for better retention
• Connect new concepts to previously learned material
• Teach concepts to others to reinforce understanding

🤝 **Resources to Leverage:**
• Office hours with instructors
• Study groups with classmates
• Online learning platforms and tutorials
• Academic support services at your institution

Feel free to ask me specific questions about study techniques, time management, or academic planning. I'm here to support your learning journey!`;
  }
  
  // Default fallback
  return `I'm currently experiencing technical difficulties with my AI processing, but I'm still here to help! 

Here are some ways I can assist you:

📚 **Study Planning**: Help create effective study schedules and learning strategies
📊 **Progress Tracking**: Analyze your academic progress and suggest improvements  
🎯 **Goal Setting**: Assist with setting and achieving academic objectives
💡 **Learning Tips**: Share proven techniques for better comprehension and retention
📝 **Course Planning**: Guidance on course selection and prerequisite mapping

Please feel free to ask specific questions about:
• Study techniques and time management
• Course planning and academic requirements
• Learning strategies for difficult subjects
• Goal setting and progress tracking

I'll do my best to provide helpful guidance even while my advanced AI features are temporarily unavailable!`;
}

function buildSystemPrompt(userContext?: any): string {
  const basePrompt = `You are an intelligent study assistant for LearnPath, an educational platform that helps students with academic planning and subject mastery. You provide helpful, encouraging, and accurate guidance on:

1. Study strategies and learning techniques
2. Academic planning and course sequencing  
3. Subject-specific tutoring and explanations
4. Progress tracking and goal setting
5. Time management for students
6. GPA calculations and academic projections
7. Graduation requirements and course planning

Guidelines:
- Be encouraging and supportive
- Provide specific, actionable advice
- Reference the user's progress when relevant
- Keep responses concise but comprehensive
- Always verify important academic information
- Focus on practical learning strategies
- For GPA questions, provide detailed explanations of calculations and projections
- Include realistic timelines and expectations

When discussing GPA projections:
- Explain how current progress affects overall GPA
- Suggest strategies for improvement
- Consider workload and difficulty levels
- Provide realistic expectations based on current performance`;

  if (userContext?.subjectName) {
    const completedCount = userContext.userProgress?.completedTopics || 0;
    const totalCount = userContext.userProgress?.totalTopics || 0;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    return `${basePrompt}

Current Context:
- Subject: ${userContext.subjectName}
- Completed Topics: ${completedCount} out of ${totalCount}
- Progress: ${progressPercent}%
- Current Level: ${userContext.userProgress?.currentLevel || 'intermediate'}

Based on this progress in ${userContext.subjectName}, you can provide specific advice about:
- How this subject performance affects overall GPA
- Realistic projections based on current completion rate
- Strategies to improve performance in this subject
- Time management for completing remaining topics

Tailor your responses to this subject and the user's current progress level.`;
  }

  return basePrompt;
}

// ============================================================================
// Router Export
// ============================================================================

export const aiRouter = {
  chat,
  getSuggestions,
};