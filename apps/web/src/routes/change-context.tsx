import { createFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Brain, Upload, Map, Target, Clock, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/change-context')({
  component: RouteComponent,
})

function RouteComponent() {
  const [step, setStep] = useState(1);
  const [contextData, setContextData] = useState({
    educationLevel: 'undergraduate',
    course: '',
    year: '',
    subjects: [] as string[]
  });
  const [syllabusData, setSyllabusData] = useState({
    subjectName: '',
    syllabusText: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedStudyPath, setGeneratedStudyPath] = useState<any>(null);

  const handleContextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contextData.course || !contextData.year) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Learning context configured!');
    setStep(2);
  };

  const handleSyllabusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!syllabusData.subjectName || !syllabusData.syllabusText) {
      toast.error('Please provide subject name and syllabus content');
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockAnalysis = {
        topics: syllabusData.syllabusText.split('\n').filter(line => line.trim().length > 5).slice(0, 6),
        estimatedHours: Math.max(20, Math.min(100, syllabusData.syllabusText.length / 10)),
        difficulty: 'medium' as const,
        prerequisites: [`Basic ${syllabusData.subjectName} knowledge`],
        learningObjectives: [`Master ${syllabusData.subjectName} concepts`]
      };

      setGeneratedStudyPath({
        analysis: mockAnalysis,
        studyPlan: {
          totalWeeks: 12,
          phases: [
            {
              name: 'Foundation Phase',
              weeks: 4,
              focus: 'Basic concepts and fundamentals',
              goals: ['Understand core concepts', 'Build strong foundation']
            },
            {
              name: 'Application Phase',
              weeks: 6,
              focus: 'Practice and problem solving',
              goals: ['Apply knowledge', 'Solve problems']
            },
            {
              name: 'Mastery Phase',
              weeks: 2,
              focus: 'Advanced topics and review',
              goals: ['Master advanced concepts', 'Complete preparation']
            }
          ]
        },
        priorities: [
          {
            subject: syllabusData.subjectName,
            priority: 'high' as const,
            reason: `Primary focus for ${contextData.course}`,
            timeAllocation: '60%'
          }
        ]
      });

      // Add subject to context
      setContextData(prev => ({
        ...prev,
        subjects: [...prev.subjects.filter(s => s !== syllabusData.subjectName), syllabusData.subjectName]
      }));

      setSyllabusData({ subjectName: '', syllabusText: '' });
      setIsProcessing(false);
      toast.success('Syllabus analyzed successfully!');
      setStep(3);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🤖 AI-Powered Learning Context
          </h1>
          <p className="text-gray-600">
            Configure your education details and upload syllabi to generate personalized study paths
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {[
            { num: 1, name: 'Context Setup', icon: BookOpen },
            { num: 2, name: 'Upload Syllabus', icon: Upload },
            { num: 3, name: 'AI Study Path', icon: Brain }
          ].map((stepItem) => {
            const Icon = stepItem.icon;
            return (
              <div key={stepItem.num} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step >= stepItem.num
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step > stepItem.num ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm ${step >= stepItem.num ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                  {stepItem.name}
                </span>
                {stepItem.num < 3 && (
                  <div className={`w-8 h-0.5 mx-4 ${step > stepItem.num ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step 1: Context Configuration */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Education Context Setup
              </CardTitle>
              <CardDescription>
                Tell us about your current education level and course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContextSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="educationLevel">Education Level *</Label>
                    <select
                      value={contextData.educationLevel}
                      onChange={(e) => setContextData(prev => ({ ...prev, educationLevel: e.target.value as any }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="high_school">High School</option>
                      <option value="undergraduate">Undergraduate</option>
                      <option value="postgraduate">Postgraduate</option>
                      <option value="competitive_exam">Competitive Exam</option>
                      <option value="professional_course">Professional Course</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year/Semester *</Label>
                    <Input
                      id="year"
                      placeholder="e.g., 3rd Year, Semester 5"
                      value={contextData.year}
                      onChange={(e) => setContextData(prev => ({ ...prev, year: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Course/Program *</Label>
                  <Input
                    id="course"
                    placeholder="e.g., Computer Science Engineering, JEE Main, NEET"
                    value={contextData.course}
                    onChange={(e) => setContextData(prev => ({ ...prev, course: e.target.value }))}
                    required
                  />
                </div>

                {contextData.subjects.length > 0 && (
                  <div className="space-y-2">
                    <Label>Added Subjects</Label>
                    <div className="flex flex-wrap gap-2">
                      {contextData.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Configure Context
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Syllabus Upload */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Syllabus Upload & AI Analysis
              </CardTitle>
              <CardDescription>
                Upload your subject syllabi for AI analysis and study path generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSyllabusSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subjectName">Subject Name *</Label>
                  <Input
                    id="subjectName"
                    placeholder="e.g., Data Structures & Algorithms"
                    value={syllabusData.subjectName}
                    onChange={(e) => setSyllabusData(prev => ({ ...prev, subjectName: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="syllabusText">Syllabus Content *</Label>
                  <textarea
                    id="syllabusText"
                    placeholder="Paste your complete syllabus here... Include all topics, chapters, and learning objectives."
                    className="min-h-[300px] w-full p-3 border border-gray-300 rounded-md resize-y"
                    value={syllabusData.syllabusText}
                    onChange={(e) => setSyllabusData(prev => ({ ...prev, syllabusText: e.target.value }))}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    💡 Tip: Include chapter names, topics, subtopics, and any specific learning objectives
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing with Gemini AI...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Upload & Analyze with AI
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: AI-Generated Results */}
        {step === 3 && generatedStudyPath && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {generatedStudyPath.studyPlan.totalWeeks}
                  </div>
                  <div className="text-sm text-gray-600">Total Weeks</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {generatedStudyPath.analysis.topics.length}
                  </div>
                  <div className="text-sm text-gray-600">Topics Identified</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {generatedStudyPath.analysis.estimatedHours}
                  </div>
                  <div className="text-sm text-gray-600">Study Hours</div>
                </CardContent>
              </Card>
            </div>

            {/* Study Plan Phases */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  AI-Generated Study Phases
                </CardTitle>
                <CardDescription>
                  Personalized study plan phases based on your syllabus analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedStudyPath.studyPlan.phases.map((phase: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{phase.name}</h4>
                      <Badge variant="outline">{phase.weeks} weeks</Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{phase.focus}</p>
                    <div>
                      <strong className="text-sm">Goals:</strong>
                      <ul className="text-sm text-gray-600 ml-4 mt-1">
                        {phase.goals.map((goal: string, goalIndex: number) => (
                          <li key={goalIndex} className="flex items-start gap-2">
                            <Target className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Identified Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Analyzed Topics
                </CardTitle>
                <CardDescription>
                  Topics extracted and prioritized from your syllabus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {generatedStudyPath.analysis.topics.map((topic: string, index: number) => (
                    <Badge key={index} variant="secondary" className="p-2 justify-center">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button onClick={() => setStep(2)} variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Add Another Subject
              </Button>
              <Button onClick={() => {
                const exportData = {
                  context: contextData,
                  analysis: generatedStudyPath,
                  generatedAt: new Date().toISOString()
                };
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'ai-study-plan.json';
                a.click();
                URL.revokeObjectURL(url);
                toast.success('Study plan exported!');
              }}>
                <Zap className="h-4 w-4 mr-2" />
                Export Study Plan
              </Button>
            </div>
          </div>
        )}

        {/* Feature Highlights */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              AI-Powered Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">🤖 Gemini AI Integration</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Intelligent syllabus parsing and analysis</li>
                  <li>• Topic extraction and prioritization</li>
                  <li>• Study time estimation based on content complexity</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">📚 Dynamic Study Planning</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Personalized study phases and timelines</li>
                  <li>• Adaptive difficulty progression</li>
                  <li>• Context-aware learning objectives</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}