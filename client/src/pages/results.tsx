import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Lightbulb, BookOpen, RotateCcw, Share, Briefcase, Users, Brain } from "lucide-react";
import { getScoreInterpretation } from "@/lib/utils";
import type { AssessmentResult } from "@shared/schema";

export default function Results() {
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("sessionId");
    if (id) {
      setSessionId(id);
    } else {
      setLocation("/");
    }
  }, [setLocation]);

  const { data: result, isLoading } = useQuery<AssessmentResult>({
    queryKey: [`/api/assessment/result/${sessionId}`],
    enabled: !!sessionId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Results not found.</p>
            <Button onClick={() => setLocation("/")}>
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const interpretation = getScoreInterpretation(result.totalScore);

  const categoryData = [
    {
      name: "Workplace",
      icon: Briefcase,
      score: result.categoryScores["Workplace Scenarios"] || 0,
      color: "blue"
    },
    {
      name: "Social",
      icon: Users,
      score: result.categoryScores["Social Interactions"] || 0,
      color: "purple"
    },
    {
      name: "Decision Making",
      icon: Brain,
      score: result.categoryScores["Decision Making"] || 0,
      color: "pink"
    }
  ];

  const getRecommendations = (score: number, categoryScores: Record<string, number>) => {
    const recommendations = [];
    
    if (score >= 80) {
      recommendations.push({
        type: "success",
        title: "Continue Building Awareness",
        description: "Your bias awareness is strong. Keep practicing inclusive language and decision-making."
      });
    }
    
    const lowestCategory = Object.entries(categoryScores).reduce((lowest, [category, score]) => 
      score < lowest.score ? { category, score } : lowest
    , { category: "", score: 100 });
    
    if (lowestCategory.score < 80) {
      if (lowestCategory.category === "Social Interactions") {
        recommendations.push({
          type: "warning",
          title: "Focus on Social Interactions",
          description: "Consider exploring resources about microaggressions and inclusive communication in social settings."
        });
      } else if (lowestCategory.category === "Decision Making") {
        recommendations.push({
          type: "info",
          title: "Enhance Decision-Making Skills",
          description: "Practice structured decision-making frameworks that help minimize bias in critical choices."
        });
      } else if (lowestCategory.category === "Workplace Scenarios") {
        recommendations.push({
          type: "warning",
          title: "Strengthen Workplace Awareness",
          description: "Focus on identifying and addressing bias in professional environments and team dynamics."
        });
      }
    }
    
    if (score < 60) {
      recommendations.push({
        type: "info",
        title: "Start with Foundational Learning",
        description: "Begin with basic unconscious bias concepts and gradually build your awareness through practice."
      });
    }
    
    return recommendations;
  };

  const recommendations = getRecommendations(result.totalScore, result.categoryScores);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="mr-2 h-3 w-3" />
            Assessment Complete
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Bias Awareness Score
          </h1>
          <p className="text-xl text-gray-600">
            Here's your personalized assessment results and recommendations
          </p>
        </div>

        {/* Score Display */}
        <Card className="mb-8">
          <CardContent className="p-8 text-center">
            <div className={`inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br ${interpretation.color} rounded-full mb-6`}>
              <span className="text-4xl font-bold text-white">{result.totalScore}</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {interpretation.level}
            </h2>
            
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {interpretation.description}
            </p>
            
            {/* Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {categoryData.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.name} className="text-center">
                    <div className={`w-16 h-16 bg-${category.color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <Icon className={`text-${category.color}-600 h-6 w-6`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                    <div className={`text-2xl font-bold text-${category.color}-600`}>
                      {category.score}%
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Lightbulb className="text-yellow-500 mr-3 h-5 w-5" />
              Personalized Recommendations
            </h3>
            
            <div className="space-y-4">
              {recommendations.map((rec, index) => {
                const iconColor = rec.type === "success" ? "text-green-600" : 
                                rec.type === "warning" ? "text-yellow-600" : "text-blue-600";
                const bgColor = rec.type === "success" ? "bg-green-100" : 
                              rec.type === "warning" ? "bg-yellow-100" : "bg-blue-100";
                
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-6 h-6 ${bgColor} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <CheckCircle className={`${iconColor} h-3 w-3`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                      <p className="text-gray-600">{rec.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => setLocation("/resources")}
            size="lg"
            className="px-8 py-4"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            View Recommended Resources
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setLocation("/assessment")}
            size="lg"
            className="px-8 py-4"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Retake Assessment
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "My Bias Awareness Score",
                  text: `I scored ${result.totalScore}% on the BiasAware assessment!`,
                  url: window.location.href
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }
            }}
            size="lg"
            className="px-8 py-4"
          >
            <Share className="mr-2 h-4 w-4" />
            Share Results
          </Button>
        </div>
      </div>
    </div>
  );
}
