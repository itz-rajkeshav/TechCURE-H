/**
 * Learning Context Router
 * 
 * API endpoints for managing user learning context:
 * - Education level, course, year configuration
 * - Syllabus upload and processing
 * - AI-powered study path generation
 */

import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure } from "../index";
import { env } from "@techcure/env/server";

// ============================================================================
// Input Schemas
// ============================================================================

const learningContextInput = z.object({
  educationLevel: z.enum([
    "high_school", 
    "undergraduate", 
    "postgraduate", 
    "competitive_exam", 
    "professional_course"
  ]),
  course: z.string().min(1).max(100),
  year: z.string().min(1).max(50),
  subjects: z.array(z.string()).optional(),
});

const syllabusUploadInput = z.object({
  subjectName: z.string().min(1).max(100),
  syllabusText: z.string().min(10).max(50000), // Large text content
  contextId: z.string().optional(), // Link to learning context
});

const studyPathGenerationInput = z.object({
  contextId: z.string(),
  preferences: z.object({
    studyHoursPerDay: z.number().min(1).max(12).default(2),
    examDate: z.string().optional(),
    focusAreas: z.array(z.string()).optional(),
    difficultyPreference: z.enum(["easy_to_hard", "hard_to_easy", "mixed"]).default("easy_to_hard"),
  }).optional(),
});

// ============================================================================
// AI Integration Functions
// ============================================================================

export interface SyllabusAnalysisResult {
  topics: string[];
  estimatedHours: number;
  difficulty: "easy" | "medium" | "hard";
  prerequisites: string[];
  learningObjectives: string[];
}

async function analyzeSyllabusWithAI(syllabusText: string, subjectName: string): Promise<SyllabusAnalysisResult> {
  const analysisPrompt = `
Please analyze this syllabus for ${subjectName} and extract structured information:

SYLLABUS TEXT:
${syllabusText}

Please respond with a JSON object containing:
{
  "topics": ["topic1", "topic2", ...], // Main topics/chapters
  "estimatedHours": number, // Total estimated study hours
  "difficulty": "easy|medium|hard", // Overall difficulty
  "prerequisites": ["prereq1", "prereq2", ...], // Prerequisites needed
  "learningObjectives": ["objective1", "objective2", ...] // Key learning goals
}

Ensure the response is valid JSON and realistic estimates.`;

  console.log("🧠 Analyzing syllabus with AI for subject:", subjectName);

  try {
    // Try Gemini first
    const geminiMessages = [{
      role: "user" as const,
      parts: [{ text: analysisPrompt }]
    }];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.3, // Lower temperature for structured output
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2000,
          },
        }),
      }
    );

    if (response.ok) {
      const result = await response.json() as any;
      const aiResponse = result.candidates[0].content.parts[0].text;
      
      // Extract JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    console.log("🔄 Gemini failed, using fallback analysis");
    
  } catch (error) {
    console.error("❌ AI analysis error:", error);
  }

  // Fallback: Basic text analysis
  const topics = syllabusText
    .split(/\n|\./)
    .filter(line => line.length > 10 && line.length < 100)
    .slice(0, 10);

  return {
    topics: topics.length > 0 ? topics : [`${subjectName} Fundamentals`],
    estimatedHours: Math.max(20, Math.min(200, syllabusText.length / 100)),
    difficulty: "medium",
    prerequisites: [`Basic ${subjectName} knowledge`],
    learningObjectives: [`Master ${subjectName} concepts`, `Apply theoretical knowledge`],
  };
}

async function generateStudyPathWithAI(
  context: any, 
  subjects: any[], 
  preferences: any
): Promise<any> {
  const studyPathPrompt = `
Generate a comprehensive study path for a student with this learning context:

CONTEXT:
- Education Level: ${context.educationLevel}
- Course: ${context.course}
- Year: ${context.year}
- Study Hours/Day: ${preferences?.studyHoursPerDay || 2}
- Exam Date: ${preferences?.examDate || "Not specified"}

SUBJECTS & SYLLABI:
${subjects.map(subject => `
Subject: ${subject.name}
Topics: ${subject.topics?.join(", ") || "Not specified"}
Estimated Hours: ${subject.estimatedHours || "Unknown"}
`).join("\n")}

Please generate a JSON response with:
{
  "studyPlan": {
    "totalWeeks": number,
    "phases": [
      {
        "name": "Phase name",
        "weeks": number,
        "focus": "Main focus area",
        "subjects": ["subject1", "subject2"],
        "goals": ["goal1", "goal2"]
      }
    ]
  },
  "priorities": [
    {
      "subject": "subject name",
      "priority": "high|medium|low",
      "reason": "explanation",
      "timeAllocation": "percentage"
    }
  ],
  "mindMap": {
    "central": "Main goal",
    "branches": [
      {
        "name": "Branch name",
        "subbranches": ["item1", "item2"],
        "color": "color code"
      }
    ]
  },
  "milestones": [
    {
      "week": number,
      "title": "Milestone title",
      "description": "What to achieve"
    }
  ]
}`;

  console.log("🗺️ Generating study path with AI");

  try {
    const geminiMessages = [{
      role: "user" as const,
      parts: [{ text: studyPathPrompt }]
    }];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.4,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 3000,
          },
        }),
      }
    );

    if (response.ok) {
      const result = await response.json() as any;
      const aiResponse = result.candidates[0].content.parts[0].text;
      
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

  } catch (error) {
    console.error("❌ Study path generation error:", error);
  }

  // Fallback study path
  return {
    studyPlan: {
      totalWeeks: 16,
      phases: [
        {
          name: "Foundation Phase",
          weeks: 6,
          focus: "Basic concepts and fundamentals",
          subjects: subjects.map(s => s.name),
          goals: ["Understand core concepts", "Build strong foundation"]
        },
        {
          name: "Application Phase", 
          weeks: 6,
          focus: "Practice and problem solving",
          subjects: subjects.map(s => s.name),
          goals: ["Apply knowledge", "Solve complex problems"]
        },
        {
          name: "Mastery Phase",
          weeks: 4,
          focus: "Advanced topics and revision",
          subjects: subjects.map(s => s.name),
          goals: ["Master advanced concepts", "Final preparation"]
        }
      ]
    },
    priorities: subjects.map((subject, index) => ({
      subject: subject.name,
      priority: index === 0 ? "high" : index === 1 ? "medium" : "low",
      reason: `Important for ${context.course}`,
      timeAllocation: index === 0 ? "40%" : index === 1 ? "35%" : "25%"
    })),
    mindMap: {
      central: `${context.course} Mastery`,
      branches: subjects.map((subject, index) => ({
        name: subject.name,
        subbranches: subject.topics?.slice(0, 4) || [`${subject.name} Basics`],
        color: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"][index % 4]
      }))
    },
    milestones: [
      { week: 4, title: "Foundation Complete", description: "Core concepts mastered" },
      { week: 8, title: "Mid-term Assessment", description: "Evaluate progress" },
      { week: 12, title: "Application Mastery", description: "Problem-solving skills developed" },
      { week: 16, title: "Final Readiness", description: "Complete preparation achieved" }
    ]
  };
}

// ============================================================================
// API Endpoints
// ============================================================================

/**
 * Create or update learning context
 */
export const setLearningContext = protectedProcedure
  .input(learningContextInput)
  .handler(async ({ input, context }) => {
    try {
      console.log(`📚 Setting learning context for user ${context.session?.user?.id}`);
      
      // TODO: Save to database
      // For now, return the input as confirmation
      const contextData = {
        id: `context_${Date.now()}`,
        userId: context.session?.user?.id,
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("✅ Learning context set successfully");

      return {
        success: true,
        context: contextData,
        message: "Learning context configured successfully"
      };

    } catch (error: any) {
      console.error("❌ Error setting learning context:", error);
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }
  });

/**
 * Upload and analyze syllabus
 */
export const uploadSyllabus = protectedProcedure
  .input(syllabusUploadInput)
  .handler(async ({ input, context }) => {
    try {
      console.log(`📄 Processing syllabus for subject: ${input.subjectName}`);
      
      // Analyze syllabus with AI
      const analysis = await analyzeSyllabusWithAI(input.syllabusText, input.subjectName);
      
      const syllabusData = {
        id: `syllabus_${Date.now()}`,
        userId: context.session?.user?.id,
        subjectName: input.subjectName,
        syllabusText: input.syllabusText,
        analysis,
        contextId: input.contextId,
        createdAt: new Date().toISOString(),
      };

      console.log("✅ Syllabus analyzed successfully");

      return {
        success: true,
        syllabus: syllabusData,
        message: "Syllabus uploaded and analyzed successfully"
      };

    } catch (error: any) {
      console.error("❌ Error processing syllabus:", error);
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }
  });

/**
 * Generate comprehensive study path
 */
export const generateStudyPath = protectedProcedure
  .input(studyPathGenerationInput)
  .handler(async ({ input, context }) => {
    try {
      console.log(`🗺️ Generating study path for context: ${input.contextId}`);
      
      // TODO: Fetch real context and subjects from database
      // For now, use mock data
      const mockContext = {
        educationLevel: "undergraduate",
        course: "Computer Science",
        year: "3rd Year"
      };

      const mockSubjects = [
        {
          name: "Data Structures & Algorithms",
          topics: ["Arrays", "Linked Lists", "Trees", "Graphs", "Dynamic Programming"],
          estimatedHours: 80
        },
        {
          name: "Database Management Systems", 
          topics: ["SQL", "Normalization", "Transactions", "Indexing"],
          estimatedHours: 60
        }
      ];

      // Generate study path with AI
      const studyPath = await generateStudyPathWithAI(mockContext, mockSubjects, input.preferences);

      const result = {
        id: `studypath_${Date.now()}`,
        userId: context.session?.user?.id,
        contextId: input.contextId,
        ...studyPath,
        createdAt: new Date().toISOString(),
      };

      console.log("✅ Study path generated successfully");

      return {
        success: true,
        studyPath: result,
        message: "Study path generated successfully"
      };

    } catch (error: any) {
      console.error("❌ Error generating study path:", error);
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }
  });

/**
 * Get user's learning contexts
 */
export const getLearningContexts = protectedProcedure
  .handler(async ({ context }) => {
    try {
      console.log(`📚 Fetching learning contexts for user ${context.session?.user?.id}`);
      
      // TODO: Fetch from database
      // Mock data for now
      const contexts = [
        {
          id: "context_1",
          educationLevel: "undergraduate",
          course: "Computer Science Engineering",
          year: "3rd Year",
          subjects: ["DSA", "DBMS", "OS", "Networks"],
          createdAt: "2024-01-15T10:00:00Z",
          isActive: true
        }
      ];

      return {
        success: true,
        contexts,
        total: contexts.length
      };

    } catch (error: any) {
      console.error("❌ Error fetching contexts:", error);
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }
  });

// ============================================================================
// Router Export
// ============================================================================

export const contextRouter = {
  setLearningContext,
  uploadSyllabus, 
  generateStudyPath,
  getLearningContexts,
};