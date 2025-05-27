import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Brain } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { generateSessionId, calculateScore } from "@/lib/utils";
import type { AssessmentQuestion } from "@shared/schema";

export default function Assessment() {
  const [, setLocation] = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [sessionId] = useState(() => generateSessionId());
  const queryClient = useQueryClient();

  const { data: questions, isLoading } = useQuery<AssessmentQuestion[]>({
    queryKey: ["/api/assessment/questions"],
  });

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/assessment/submit", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessment/result"] });
      setLocation(`/results?sessionId=${sessionId}`);
    },
  });

  const currentQuestion = questions?.[currentQuestionIndex];
  const progress = questions ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  useEffect(() => {
    // Load existing answer for current question
    if (answers[currentQuestionIndex] !== undefined) {
      setCurrentAnswer(answers[currentQuestionIndex].toString());
    } else {
      setCurrentAnswer("");
    }
  }, [currentQuestionIndex, answers]);

  const handleNext = () => {
    if (currentAnswer === "") return;
    
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = parseInt(currentAnswer);
    setAnswers(newAnswers);

    if (currentQuestionIndex < (questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit assessment
      if (questions) {
        const { totalScore, categoryScores } = calculateScore(newAnswers, questions);
        submitMutation.mutate({
          sessionId,
          answers: newAnswers,
          totalScore,
          categoryScores,
          completedAt: new Date().toISOString(),
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">No questions available. Please try again later.</p>
            <Button 
              onClick={() => setLocation("/")} 
              className="mt-4"
            >
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="mb-6">
              <Badge variant="secondary" className="mb-4">
                <Brain className="mr-2 h-3 w-3" />
                {currentQuestion.category}
              </Badge>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 leading-relaxed">
                {currentQuestion.text}
              </h2>
            </div>

            {/* Answer Options */}
            <RadioGroup value={currentAnswer} onValueChange={setCurrentAnswer}>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-200">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="text-gray-900 font-medium cursor-pointer flex-1"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={currentAnswer === "" || submitMutation.isPending}
                className="px-8"
              >
                {submitMutation.isPending ? (
                  "Submitting..."
                ) : isLastQuestion ? (
                  <>
                    View Results
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next Question
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Question Categories Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {["Workplace Scenarios", "Social Interactions", "Decision Making"].map((category, index) => {
            const categoryQuestions = questions.filter(q => q.category === category);
            const colors = ["blue", "purple", "pink"];
            const color = colors[index];
            
            return (
              <div key={category} className={`p-4 bg-${color}-50 rounded-xl`}>
                <div className={`text-2xl font-bold text-${color}-600 mb-1`}>
                  {categoryQuestions.length}
                </div>
                <div className={`text-sm text-${color}-700`}>
                  {category}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
