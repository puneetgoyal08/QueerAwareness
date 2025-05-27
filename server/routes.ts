import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAssessmentResultSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all assessment questions
  app.get("/api/assessment/questions", async (req, res) => {
    try {
      const questions = await storage.getAssessmentQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // Get all educational resources
  app.get("/api/resources", async (req, res) => {
    try {
      const { type } = req.query;
      let resources;
      
      if (type && typeof type === 'string') {
        resources = await storage.getEducationalResourcesByType(type);
      } else {
        resources = await storage.getEducationalResources();
      }
      
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  // Submit assessment results
  app.post("/api/assessment/submit", async (req, res) => {
    try {
      const validatedData = insertAssessmentResultSchema.parse(req.body);
      const result = await storage.saveAssessmentResult(validatedData);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save assessment result" });
      }
    }
  });

  // Get assessment result by session ID
  app.get("/api/assessment/result/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const result = await storage.getAssessmentResult(sessionId);
      
      if (!result) {
        res.status(404).json({ message: "Assessment result not found" });
        return;
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assessment result" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
