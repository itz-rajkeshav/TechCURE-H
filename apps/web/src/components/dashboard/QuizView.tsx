import { useState, useEffect } from "react";
import { useAppStore } from "@/store/appStore";
import { 
  useQuizzesForTopic, 
  useStartQuiz, 
  useSubmitQuizAnswer, 
  useCompleteQuiz 
} from "@/lib/api/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Trophy, CheckCircle, XCircle, Lightbulb } from "lucide-react";

type QuizState = 'selection' | 'active' | 'completed';
type Question = {
  _id: string;
  question: string;
  type: string; // Allow any string type from API
  options?: { id: string; text: string }[];
  difficulty: string; // Allow any string difficulty from API
  hints?: string[];
};

type QuizSession = {
  attemptId: string;
  quiz: {
    _id: string;
    title: string;
    questions: Question[];
    timeLimit: number;
    totalQuestions: number;
  };
};

export function QuizView() {
  const { selectedSubject } = useAppStore();
  
  // Mock topic ID - in real app this would come from route params or selection
  const topicId = "topic-electrostatics-12";
  const subjectId = selectedSubject?.id || "physics-12-cbse";
  
  // Quiz state
  const [quizState, setQuizState] = useState<QuizState>('selection');
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [quizResults, setQuizResults] = useState<any>(null);

  // API hooks
  const { data: quizzesResponse, isLoading: quizzesLoading } = useQuizzesForTopic(topicId);
  const startQuizMutation = useStartQuiz();
  const submitAnswerMutation = useSubmitQuizAnswer();
  const completeQuizMutation = useCompleteQuiz();

  const quizzes = quizzesResponse?.success ? quizzesResponse.data : [];

  // Timer effect
  useEffect(() => {
    if (quizState === 'active' && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && currentSession) {
      handleCompleteQuiz();
    }
  }, [timeRemaining, quizState]);

  const handleStartQuiz = async (quizId: string) => {
    try {
      const response = await startQuizMutation.mutateAsync({ quizId });
      if (response.success && response.data) {
        setCurrentSession(response.data);
        setTimeRemaining(response.data.quiz.timeLimit * 60); // Convert to seconds
        setQuizState('active');
        setCurrentQuestionIndex(0);
        setAnswers({});
        setShowHints({});
      }
    } catch (error) {
      console.error('Failed to start quiz:', error);
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitAnswer = async () => {
    if (!currentSession) return;
    
    const currentQuestion = currentSession.quiz.questions[currentQuestionIndex];
    const answer = answers[currentQuestion._id];
    
    if (!answer) return;

    try {
      const response = await submitAnswerMutation.mutateAsync({
        quizId: currentSession.quiz._id,
        questionId: currentQuestion._id,
        answer,
        timeSpent: 30, // Mock time spent
        hintsUsed: showHints[currentQuestion._id] ? 1 : 0,
      });

      // Move to next question or complete quiz
      if (currentQuestionIndex < currentSession.quiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        handleCompleteQuiz();
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const handleCompleteQuiz = async () => {
    if (!currentSession) return;

    try {
      const response = await completeQuizMutation.mutateAsync({
        quizId: currentSession.quiz._id,
        attemptId: currentSession.attemptId,
      });

      if (response.success) {
        setQuizResults(response.data);
        setQuizState('completed');
      }
    } catch (error) {
      console.error('Failed to complete quiz:', error);
    }
  };

  const toggleHint = (questionId: string) => {
    setShowHints(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Quiz Selection View
  if (quizState === 'selection') {
    if (quizzesLoading) {
      return (
        <div className="max-w-[800px] mx-auto flex flex-col gap-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid gap-4">
              {[1, 2].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-[800px] mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Practice Quizzes</h1>
          <p className="text-muted-foreground">
            Test your knowledge with interactive quizzes
          </p>
        </div>

        <div className="grid gap-4">
          {quizzes?.map((quiz: any) => (
            <Card key={quiz._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{quiz.title}</CardTitle>
                    <CardDescription>{quiz.description}</CardDescription>
                  </div>
                  <Badge variant={quiz.quizType === 'practice' ? 'default' : 'secondary'}>
                    {quiz.quizType.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {quiz.questionCount} questions
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {quiz.timeLimit} minutes
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    {quiz.passingScore}% to pass
                  </div>
                </div>
                <Button 
                  onClick={() => handleStartQuiz(quiz._id)}
                  className="w-full"
                  disabled={startQuizMutation.isPending}
                >
                  {startQuizMutation.isPending ? 'Starting...' : 'Start Quiz'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Active Quiz View
  if (quizState === 'active' && currentSession) {
    const currentQuestion = currentSession.quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentSession.quiz.totalQuestions) * 100;

    return (
      <div className="max-w-[800px] mx-auto flex flex-col gap-6">
        {/* Quiz Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{currentSession.quiz.title}</h1>
            <p className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {currentSession.quiz.totalQuestions}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono">{formatTime(timeRemaining)}</div>
            <div className="text-sm text-muted-foreground">Time remaining</div>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="h-2" />

        {/* Question Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
              <Badge variant="outline">
                {currentQuestion.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Multiple Choice */}
            {currentQuestion.type === 'multiple_choice' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => (
                  <label 
                    key={option.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion._id}`}
                      value={option.id}
                      onChange={(e) => handleAnswerSelect(currentQuestion._id, e.target.value)}
                      className="w-4 h-4"
                    />
                    <span>{option.text}</span>
                  </label>
                ))}
              </div>
            )}

            {/* True/False */}
            {currentQuestion.type === 'true_false' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => (
                  <label 
                    key={option.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion._id}`}
                      value={option.id}
                      onChange={(e) => handleAnswerSelect(currentQuestion._id, e.target.value)}
                      className="w-4 h-4"
                    />
                    <span>{option.text}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Fill in the Blank */}
            {currentQuestion.type === 'fill_blank' && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter your answer..."
                  onChange={(e) => handleAnswerSelect(currentQuestion._id, e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            )}

            {/* Hints */}
            {currentQuestion.hints && (
              <div className="mt-4">
                {!showHints[currentQuestion._id] ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleHint(currentQuestion._id)}
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Show Hint
                  </Button>
                ) : (
                  <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Hint</span>
                    </div>
                    <p className="text-yellow-700">{currentQuestion.hints[0]}</p>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleSubmitAnswer}
                disabled={!answers[currentQuestion._id] || submitAnswerMutation.isPending}
              >
                {currentQuestionIndex < currentSession.quiz.questions.length - 1 
                  ? 'Next Question' 
                  : 'Complete Quiz'
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz Results View
  if (quizState === 'completed' && quizResults) {
    return (
      <div className="max-w-[800px] mx-auto flex flex-col gap-6">
        <div className="text-center">
          <div className="mb-4">
            {quizResults.passed ? (
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {quizResults.passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h1>
          <p className="text-muted-foreground">
            You scored {quizResults.score}% on this quiz
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {quizResults.correctAnswers}
                </div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {quizResults.totalQuestions - quizResults.correctAnswers}
                </div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.floor(quizResults.timeSpent / 60)}m
                </div>
                <div className="text-sm text-muted-foreground">Time Used</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {quizResults.pointsEarned}
                </div>
                <div className="text-sm text-muted-foreground">Points</div>
              </div>
            </div>

            {quizResults.strengths && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-green-700">Strengths</h3>
                <div className="flex flex-wrap gap-2">
                  {quizResults.strengths.map((strength: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-green-700 border-green-300">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {quizResults.weaknesses && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2 text-red-700">Areas for Improvement</h3>
                <div className="flex flex-wrap gap-2">
                  {quizResults.weaknesses.map((weakness: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-red-700 border-red-300">
                      {weakness}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button onClick={() => setQuizState('selection')} className="flex-1">
                Take Another Quiz
              </Button>
              <Button variant="outline" onClick={() => window.history.back()} className="flex-1">
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}