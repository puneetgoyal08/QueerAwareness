import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Clock } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-6">
              <span className="mr-2">🏳️‍🌈</span>
              Pride Month 2024 Initiative
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Discover Your{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Unconscious Bias
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Take our comprehensive assessment to understand your unconscious biases and explore resources 
              to build a more inclusive mindset. Your journey toward awareness starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setLocation("/assessment")}
                size="lg"
                className="bg-white text-primary hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Assessment
              </Button>
              
              <Button
                onClick={() => setLocation("/resources")}
                variant="outline"
                size="lg"
                className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary px-8 py-4 rounded-xl font-semibold transition-all duration-200"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Resources
              </Button>
            </div>
            
            <div className="flex items-center justify-center mt-12 text-white/80 text-sm">
              <Clock className="mr-2 h-4 w-4" />
              Approximately 10-15 minutes • Completely anonymous
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Workplace Scenarios</h3>
              <p className="text-gray-600">Assess your awareness in professional environments and team dynamics.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Social Interactions</h3>
              <p className="text-gray-600">Understand how unconscious bias affects your social and cultural interactions.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚖️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Decision Making</h3>
              <p className="text-gray-600">Evaluate how bias influences your choices and judgment processes.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
