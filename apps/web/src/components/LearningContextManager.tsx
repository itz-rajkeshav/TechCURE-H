/**
 * Learning Context Configuration Component
 * 
 * Allows users to configure their education level, course, year, 
 * upload syllabi, and generate AI-powered study paths
 */

import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { client } from '@/utils/orpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { BookOpen, Brain, Upload, Map, Target, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface LearningContextData {
  educationLevel: 'high_school' | 'undergraduate' | 'postgraduate' | 'competitive_exam' | 'professional_course';
  course: string;
  year: string;
  subjects: string[];
}

interface SyllabusData {
  subjectName: string;
  syllabusText: string;
  contextId?: string;
}

interface StudyPathPreferences {
  studyHoursPerDay: number;
  examDate?: string;
  focusAreas?: string[];
  difficultyPreference: 'easy_to_hard' | 'hard_to_easy' | 'mixed';
}

export function LearningContextManager() {
  const [contextData, setContextData] = useState<LearningContextData>({
    educationLevel: 'undergraduate',
    course: '',
    year: '',
    subjects: []
  });
  
  const [syllabusData, setSyllabusData] = useState<SyllabusData>({
    subjectName: '',
    syllabusText: ''
  });
  
  const [preferences, setPreferences] = useState<StudyPathPreferences>({
    studyHoursPerDay: 2,
    examDate: '',
    focusAreas: [],
    difficultyPreference: 'easy_to_hard'
  });

  const [currentTab, setCurrentTab] = useState('context');
  const [contextId, setContextId] = useState<string | null>(null);

  // API calls
  const setContextMutation = useMutation({
    mutationFn: (data: LearningContextData) => client.context.setLearningContext(data),
    onSuccess: (response) => {
      toast.success('Learning context configured successfully!');
      setContextId(response.context.id);
      setCurrentTab('syllabus');
    },
    onError: () => {
      toast.error('Failed to configure learning context');
    }
  });

  const uploadSyllabusMutation = useMutation({
    mutationFn: (data: SyllabusData) => client.context.uploadSyllabus(data),
    onSuccess: () => {
      toast.success('Syllabus uploaded and analyzed successfully!');
      setSyllabusData({ subjectName: '', syllabusText: '' });
    },
    onError: () => {
      toast.error('Failed to upload syllabus');
    }
  });

  const generateStudyPathMutation = useMutation({
    mutationFn: (data: { contextId: string; preferences?: StudyPathPreferences }) => 
      client.context.generateStudyPath(data),
    onSuccess: (response) => {
      toast.success('Study path generated successfully!');
      setCurrentTab('results');
    },
    onError: () => {
      toast.error('Failed to generate study path');
    }
  });

  const { data: existingContexts } = useQuery({
    queryKey: ['learning-contexts'],
    queryFn: () => client.context.getLearningContexts({})
  });

  const handleContextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contextData.course || !contextData.year) {
      toast.error('Please fill in all required fields');
      return;
    }
    setContextMutation.mutate(contextData);
  };

  const handleSyllabusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!syllabusData.subjectName || !syllabusData.syllabusText) {
      toast.error('Please provide subject name and syllabus content');
      return;
    }
    uploadSyllabusMutation.mutate({
      ...syllabusData,
      contextId: contextId || undefined
    });
  };

  const handleGenerateStudyPath = () => {
    if (!contextId) {
      toast.error('Please configure learning context first');
      return;
    }
    generateStudyPathMutation.mutate({ contextId, preferences });
  };

  const addSubject = () => {
    if (syllabusData.subjectName && !contextData.subjects.includes(syllabusData.subjectName)) {
      setContextData(prev => ({
        ...prev,
        subjects: [...prev.subjects, syllabusData.subjectName]
      }));
    }
  };

  const removeSubject = (subject: string) => {
    setContextData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Context Configuration</h1>
        <p className="text-gray-600">Configure your education details and upload syllabi to generate personalized study paths</p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="context" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Context Setup
          </TabsTrigger>
          <TabsTrigger value="syllabus" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Syllabus
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Study Path
          </TabsTrigger>
        </TabsList>

        {/* Context Configuration Tab */}
        <TabsContent value="context" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Education Context
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
                    <Select 
                      value={contextData.educationLevel} 
                      onValueChange={(value: any) => setContextData(prev => ({ ...prev, educationLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high_school">High School</SelectItem>
                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="postgraduate">Postgraduate</SelectItem>
                        <SelectItem value="competitive_exam">Competitive Exam</SelectItem>
                        <SelectItem value="professional_course">Professional Course</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <Badge key={subject} variant="secondary" className="px-3 py-1">
                          {subject}
                          <button
                            type="button"
                            onClick={() => removeSubject(subject)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={setContextMutation.isPending}
                >
                  {setContextMutation.isPending ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Configuring...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Configure Context
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Syllabus Upload Tab */}
        <TabsContent value="syllabus" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Syllabus Upload
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
                  <Textarea
                    id="syllabusText"
                    placeholder="Paste your complete syllabus here... Include all topics, chapters, and learning objectives."
                    className="min-h-[300px] resize-y"
                    value={syllabusData.syllabusText}
                    onChange={(e) => setSyllabusData(prev => ({ ...prev, syllabusText: e.target.value }))}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Tip: Include chapter names, topics, subtopics, and any specific learning objectives
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addSubject}
                    disabled={!syllabusData.subjectName}
                  >
                    Add to Subjects
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={uploadSyllabusMutation.isPending}
                  >
                    {uploadSyllabusMutation.isPending ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Upload & Analyze
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Study Preferences
              </CardTitle>
              <CardDescription>
                Customize your study path generation preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studyHours">Study Hours Per Day</Label>
                  <Input
                    id="studyHours"
                    type="number"
                    min="1"
                    max="12"
                    value={preferences.studyHoursPerDay}
                    onChange={(e) => setPreferences(prev => ({ ...prev, studyHoursPerDay: parseInt(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="examDate">Target Exam Date (Optional)</Label>
                  <Input
                    id="examDate"
                    type="date"
                    value={preferences.examDate}
                    onChange={(e) => setPreferences(prev => ({ ...prev, examDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Progression</Label>
                <Select 
                  value={preferences.difficultyPreference} 
                  onValueChange={(value: any) => setPreferences(prev => ({ ...prev, difficultyPreference: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy_to_hard">Easy to Hard</SelectItem>
                    <SelectItem value="hard_to_easy">Hard to Easy</SelectItem>
                    <SelectItem value="mixed">Mixed Difficulty</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerateStudyPath} 
                className="w-full"
                disabled={generateStudyPathMutation.isPending || !contextId}
              >
                {generateStudyPathMutation.isPending ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Generating Study Path...
                  </>
                ) : (
                  <>
                    <Map className="h-4 w-4 mr-2" />
                    Generate AI Study Path
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Generated Study Path
              </CardTitle>
              <CardDescription>
                Your personalized study path based on uploaded syllabi
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generateStudyPathMutation.data ? (
                <div className="space-y-6">
                  {/* Study Plan Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {generateStudyPathMutation.data.studyPath.studyPlan?.totalWeeks || 16}
                      </div>
                      <div className="text-sm text-gray-600">Total Weeks</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {generateStudyPathMutation.data.studyPath.studyPlan?.phases?.length || 3}
                      </div>
                      <div className="text-sm text-gray-600">Study Phases</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {generateStudyPathMutation.data.studyPath.priorities?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Subjects</div>
                    </div>
                  </div>

                  {/* Phase Details */}
                  {generateStudyPathMutation.data.studyPath.studyPlan?.phases && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Study Phases</h3>
                      {generateStudyPathMutation.data.studyPath.studyPlan.phases.map((phase: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{phase.name}</h4>
                            <Badge variant="outline">{phase.weeks} weeks</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{phase.focus}</p>
                          <div className="text-sm">
                            <strong>Goals:</strong> {phase.goals?.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Subject Priorities */}
                  {generateStudyPathMutation.data.studyPath.priorities && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Subject Priorities</h3>
                      <div className="space-y-2">
                        {generateStudyPathMutation.data.studyPath.priorities.map((priority: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">{priority.subject}</div>
                              <div className="text-sm text-gray-600">{priority.reason}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={priority.priority === 'high' ? 'destructive' : 
                                        priority.priority === 'medium' ? 'default' : 'secondary'}
                              >
                                {priority.priority}
                              </Badge>
                              <div className="text-sm font-medium">{priority.timeAllocation}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                  <p>Generate your study path to see personalized recommendations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}