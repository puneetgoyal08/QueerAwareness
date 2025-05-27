import { pgTable, text, serial, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const assessmentQuestions = pgTable("assessment_questions", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  text: text("text").notNull(),
  options: json("options").$type<string[]>().notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  weight: integer("weight").default(1),
});

export const educationalResources = pgTable("educational_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // article, video, podcast, organization
  category: text("category").notNull(),
  url: text("url").notNull(),
  imageUrl: text("image_url"),
  duration: text("duration"), // "5 min read", "18 min", etc.
  source: text("source"),
});

export const assessmentResults = pgTable("assessment_results", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  answers: json("answers").$type<number[]>().notNull(),
  totalScore: integer("total_score").notNull(),
  categoryScores: json("category_scores").$type<Record<string, number>>().notNull(),
  completedAt: text("completed_at").notNull(),
});

export const insertAssessmentQuestionSchema = createInsertSchema(assessmentQuestions).omit({
  id: true,
});

export const insertEducationalResourceSchema = createInsertSchema(educationalResources).omit({
  id: true,
});

export const insertAssessmentResultSchema = createInsertSchema(assessmentResults).omit({
  id: true,
});

export type AssessmentQuestion = typeof assessmentQuestions.$inferSelect;
export type EducationalResource = typeof educationalResources.$inferSelect;
export type AssessmentResult = typeof assessmentResults.$inferSelect;
export type InsertAssessmentQuestion = z.infer<typeof insertAssessmentQuestionSchema>;
export type InsertEducationalResource = z.infer<typeof insertEducationalResourceSchema>;
export type InsertAssessmentResult = z.infer<typeof insertAssessmentResultSchema>;
