import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function calculateScore(answers: number[], questions: any[]): {
  totalScore: number;
  categoryScores: Record<string, number>;
} {
  let correctAnswers = 0;
  const categoryCounts: Record<string, { correct: number; total: number }> = {};

  answers.forEach((answer, index) => {
    const question = questions[index];
    const isCorrect = answer === question.correctAnswer;
    
    if (isCorrect) {
      correctAnswers++;
    }

    // Track category scores
    if (!categoryCounts[question.category]) {
      categoryCounts[question.category] = { correct: 0, total: 0 };
    }
    categoryCounts[question.category].total++;
    if (isCorrect) {
      categoryCounts[question.category].correct++;
    }
  });

  const totalScore = Math.round((correctAnswers / questions.length) * 100);
  
  const categoryScores: Record<string, number> = {};
  Object.entries(categoryCounts).forEach(([category, counts]) => {
    categoryScores[category] = Math.round((counts.correct / counts.total) * 100);
  });

  return { totalScore, categoryScores };
}

export function getScoreInterpretation(score: number): {
  level: string;
  description: string;
  color: string;
} {
  if (score >= 80) {
    return {
      level: "Excellent Awareness Level",
      description: "You demonstrate strong awareness of unconscious bias and consistently make inclusive decisions. Keep up the great work!",
      color: "from-green-500 to-blue-500"
    };
  } else if (score >= 60) {
    return {
      level: "Good Awareness Level", 
      description: "You show solid understanding of unconscious bias with room for continued growth in certain areas.",
      color: "from-blue-500 to-purple-500"
    };
  } else {
    return {
      level: "Developing Awareness",
      description: "This is a great starting point for your bias awareness journey. Focus on the recommended resources to continue growing.",
      color: "from-purple-500 to-pink-500"
    };
  }
}
