import { 
  assessmentQuestions, 
  educationalResources, 
  assessmentResults,
  type AssessmentQuestion, 
  type EducationalResource, 
  type AssessmentResult,
  type InsertAssessmentQuestion,
  type InsertEducationalResource,
  type InsertAssessmentResult
} from "@shared/schema";

export interface IStorage {
  // Assessment Questions
  getAssessmentQuestions(): Promise<AssessmentQuestion[]>;
  
  // Educational Resources
  getEducationalResources(): Promise<EducationalResource[]>;
  getEducationalResourcesByType(type: string): Promise<EducationalResource[]>;
  
  // Assessment Results
  saveAssessmentResult(result: InsertAssessmentResult): Promise<AssessmentResult>;
  getAssessmentResult(sessionId: string): Promise<AssessmentResult | undefined>;
}

export class MemStorage implements IStorage {
  private questions: Map<number, AssessmentQuestion>;
  private resources: Map<number, EducationalResource>;
  private results: Map<number, AssessmentResult>;
  private currentQuestionId: number;
  private currentResourceId: number;
  private currentResultId: number;

  constructor() {
    this.questions = new Map();
    this.resources = new Map();
    this.results = new Map();
    this.currentQuestionId = 1;
    this.currentResourceId = 1;
    this.currentResultId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed assessment questions
    const questionsData: InsertAssessmentQuestion[] = [
      {
        category: "Workplace Scenarios",
        text: "When reviewing resumes for a software engineering position, which factor would you prioritize first?",
        options: [
          "Technical skills and relevant experience",
          "Educational background and certifications",
          "Cultural fit with the team",
          "References and recommendations"
        ],
        correctAnswer: 0,
        weight: 1
      },
      {
        category: "Social Interactions",
        text: "At a networking event, you're more likely to approach someone who:",
        options: [
          "Looks similar to your professional background",
          "Is standing alone and seems approachable",
          "Is part of an animated conversation",
          "Has an interesting conversation starter visible"
        ],
        correctAnswer: 1,
        weight: 1
      },
      {
        category: "Decision Making",
        text: "When forming a project team, your primary consideration should be:",
        options: [
          "People you've worked successfully with before",
          "A mix of skills, perspectives, and backgrounds",
          "The most qualified individuals regardless of other factors",
          "People who share similar working styles"
        ],
        correctAnswer: 1,
        weight: 1
      },
      {
        category: "Workplace Scenarios",
        text: "If a colleague frequently interrupts others in meetings, you would:",
        options: [
          "Assume they're just enthusiastic and passionate",
          "Notice if there's a pattern in who gets interrupted",
          "Focus on your own contributions to the meeting",
          "Speak to them privately after the meeting"
        ],
        correctAnswer: 1,
        weight: 1
      },
      {
        category: "Social Interactions",
        text: "When someone mispronounces your name repeatedly, you:",
        options: [
          "Don't correct them to avoid awkwardness",
          "Politely correct them each time",
          "Use a simpler version of your name",
          "Only correct them if they ask"
        ],
        correctAnswer: 1,
        weight: 1
      },
      {
        category: "Decision Making",
        text: "When evaluating job candidates from different backgrounds, you:",
        options: [
          "Focus solely on their qualifications and experience",
          "Consider how their background might bring unique perspectives",
          "Prioritize candidates who seem like they'd fit in easily",
          "Give extra consideration to underrepresented candidates"
        ],
        correctAnswer: 1,
        weight: 1
      },
      {
        category: "Workplace Scenarios",
        text: "A team member suggests an unconventional solution. Your first reaction is:",
        options: [
          "To explain why the traditional approach works better",
          "To ask them to elaborate on their reasoning",
          "To politely redirect to proven methods",
          "To consider it only if they have seniority"
        ],
        correctAnswer: 1,
        weight: 1
      },
      {
        category: "Social Interactions",
        text: "When someone shares an experience you can't relate to, you:",
        options: [
          "Try to find a similar experience from your own life",
          "Listen actively and ask thoughtful questions",
          "Acknowledge it briefly and change the subject",
          "Offer advice based on what you would do"
        ],
        correctAnswer: 1,
        weight: 1
      },
      {
        category: "Decision Making",
        text: "When assigning stretch assignments, you typically choose:",
        options: [
          "The person who has performed best historically",
          "Someone who might benefit from the growth opportunity",
          "The person who has asked for more responsibility",
          "The most senior team member available"
        ],
        correctAnswer: 1,
        weight: 1
      },
      {
        category: "Workplace Scenarios",
        text: "In brainstorming sessions, you notice some people speak more than others. You:",
        options: [
          "Let natural conversation flow",
          "Actively invite quieter members to share",
          "Focus on the best ideas regardless of who shares them",
          "Note it but don't intervene in the moment"
        ],
        correctAnswer: 1,
        weight: 1
      },
      {
        category: "Social Interactions",
        text: "When planning team social events, you:",
        options: [
          "Go with what worked well in the past",
          "Survey the team for preferences and accessibility needs",
          "Choose popular activities that most people enjoy",
          "Rotate between different types of activities"
        ],
        correctAnswer: 1,
        weight: 1
      },
      {
        category: "Decision Making",
        text: "When a team member's performance declines, you first:",
        options: [
          "Review their past performance patterns",
          "Have a private conversation to understand what's happening",
          "Document the issues for their performance review",
          "Compare their output to other team members"
        ],
        correctAnswer: 1,
        weight: 1
      },
      {
        category: "Workplace Scenarios",
        text: "When giving feedback on communication style, you:",
        options: [
          "Encourage everyone to adopt the most professional style",
          "Help people communicate effectively while being authentic",
          "Point out when someone's style might not fit company culture",
          "Focus only on the content, not the delivery"
        ],
        correctAnswer: 1,
        weight: 1
      },
      {
        category: "Social Interactions",
        text: "When someone uses language or terminology you're unfamiliar with, you:",
        options: [
          "Assume it's not important to the conversation",
          "Ask for clarification in a respectful way",
          "Look it up later to avoid interrupting",
          "Use context clues to guess the meaning"
        ],
        correctAnswer: 1,
        weight: 1
      },
      {
        category: "Decision Making",
        text: "When creating policies that affect everyone, you:",
        options: [
          "Base them on what works for the majority",
          "Consult with diverse stakeholders before deciding",
          "Research best practices from similar organizations",
          "Start with existing policies and make small adjustments"
        ],
        correctAnswer: 1,
        weight: 1
      }
    ];

    questionsData.forEach(question => {
      const id = this.currentQuestionId++;
      const fullQuestion: AssessmentQuestion = { id, ...question };
      this.questions.set(id, fullQuestion);
    });

    // Seed educational resources
    const resourcesData: InsertEducationalResource[] = [
      {
        title: "Understanding Microaggressions in the Workplace",
        description: "Learn to identify and address subtle forms of bias that impact team dynamics and employee wellbeing.",
        type: "article",
        category: "workplace",
        url: "https://hbr.org/2020/03/youre-not-dealing-with-impostor-syndrome",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        duration: "5 min read",
        source: "Harvard Business Review"
      },
      {
        title: "The Danger of a Single Story",
        description: "Chimamanda Ngozi Adichie's powerful TED talk about the impact of stereotypes and incomplete narratives.",
        type: "video",
        category: "awareness",
        url: "https://www.ted.com/talks/chimamanda_ngozi_adichie_the_danger_of_a_single_story",
        imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        duration: "18 min",
        source: "TED"
      },
      {
        title: "Unconscious Bias in Hiring",
        description: "Deep dive into how recruitment processes can perpetuate bias and strategies for more equitable hiring.",
        type: "podcast",
        category: "hiring",
        url: "https://www.npr.org/2020/07/07/888813608/unconscious-bias-training",
        imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        duration: "45 min",
        source: "NPR"
      },
      {
        title: "Project Implicit",
        description: "Research and educational organization offering tools to discover hidden biases and promote awareness.",
        type: "organization",
        category: "research",
        url: "https://implicit.harvard.edu/",
        imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        duration: "Interactive",
        source: "Harvard University"
      },
      {
        title: "Inclusive Leadership Strategies",
        description: "Practical techniques for creating psychological safety and fostering diverse perspectives in teams.",
        type: "video",
        category: "leadership",
        url: "https://www.youtube.com/watch?v=example",
        imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        duration: "12 min",
        source: "LinkedIn Learning"
      },
      {
        title: "Building Allyship in Practice",
        description: "Actionable steps for becoming an effective ally and supporting underrepresented communities.",
        type: "article",
        category: "allyship",
        url: "https://www.mckinsey.com/featured-insights/diversity-and-inclusion",
        imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        duration: "8 min read",
        source: "McKinsey & Company"
      }
    ];

    resourcesData.forEach(resource => {
      const id = this.currentResourceId++;
      const fullResource: EducationalResource = { id, ...resource };
      this.resources.set(id, fullResource);
    });
  }

  async getAssessmentQuestions(): Promise<AssessmentQuestion[]> {
    return Array.from(this.questions.values());
  }

  async getEducationalResources(): Promise<EducationalResource[]> {
    return Array.from(this.resources.values());
  }

  async getEducationalResourcesByType(type: string): Promise<EducationalResource[]> {
    return Array.from(this.resources.values()).filter(resource => resource.type === type);
  }

  async saveAssessmentResult(insertResult: InsertAssessmentResult): Promise<AssessmentResult> {
    const id = this.currentResultId++;
    const result: AssessmentResult = { id, ...insertResult };
    this.results.set(id, result);
    return result;
  }

  async getAssessmentResult(sessionId: string): Promise<AssessmentResult | undefined> {
    return Array.from(this.results.values()).find(result => result.sessionId === sessionId);
  }
}

export const storage = new MemStorage();
