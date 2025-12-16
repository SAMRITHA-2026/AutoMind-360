// server/routes.ts
import type { Express } from "express";
import type { Server } from "http";
import OpenAI from "openai";

import { storage } from "./storage";
import { insertVehicleSchema, insertAppointmentSchema } from "@shared/schema";

/* -------------------------------------------------
   OpenAI client (safe initialization)
-------------------------------------------------- */
const openai =
  process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

/* -------------------------------------------------
   Register Routes
-------------------------------------------------- */
export async function registerRoutes(
  _httpServer: Server,
  app: Express
): Promise<void> {

  /* -------------------- HEALTH -------------------- */
  app.get("/api/health", (_req, res) => {
    res.json({ status: "OK", service: "AutoMind 360 API" });
  });

  /* -------------------- VEHICLES -------------------- */
  app.get("/api/vehicles", async (_req, res) => {
    res.json(await storage.getVehicles());
  });

  app.get("/api/vehicles/:id", async (req, res) => {
    const vehicle = await storage.getVehicle(req.params.id);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
    res.json(vehicle);
  });

  app.post("/api/vehicles", async (req, res) => {
    const parsed = insertVehicleSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error.format());
    }
    res.status(201).json(await storage.createVehicle(parsed.data));
  });

  /* -------------------- APPOINTMENTS -------------------- */
  app.get("/api/appointments", async (_req, res) => {
    res.json(await storage.getAppointments());
  });

  app.post("/api/appointments", async (req, res) => {
    const parsed = insertAppointmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error.format());
    }
    res.status(201).json(await storage.createAppointment(parsed.data));
  });

  /* -------------------- VOICE AGENT -------------------- */
  app.post("/api/voice-agent/chat", async (req, res) => {
    try {
      if (!openai) {
        return res.status(503).json({
          error: "OPENAI_API_KEY not configured",
        });
      }

      const { sessionId, vehicleId, message } = req.body;

      if (!sessionId || !message) {
        return res.status(400).json({
          error: "sessionId and message are required",
        });
      }

      /* -------- Context Builder -------- */
      let context = "";

      if (vehicleId) {
        const vehicle = await storage.getVehicle(vehicleId);
        if (vehicle) {
          context += `
Vehicle: ${vehicle.year} ${vehicle.make} ${vehicle.model}
Mileage: ${vehicle.mileage} km
Health Score: ${vehicle.healthScore}%
`;

          const predictions = await storage.getPredictionsByVehicle(vehicleId);
          if (predictions.length > 0) {
            context += "\nPredicted Issues:\n";
            for (const p of predictions) {
              context += `- ${p.component}: ${p.riskLevel} risk (${Math.round(
                p.probability * 100
              )}%)\n`;
            }
          }
        }
      }

      /* -------- Chat History -------- */
      const history = await storage.getChatMessages(sessionId);
      const historyText = history
        .map(h => `${h.role.toUpperCase()}: ${h.content}`)
        .join("\n");

      /* -------- OpenAI Responses API -------- */
      const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: `
You are AutoMind 360 AI Service Advisor.
Explain vehicle issues simply.
Emphasize safety and preventive maintenance.
Be polite and professional.

${context}

Conversation so far:
${historyText}

User: ${message}
Assistant:
        `,
        temperature: 0.7,
        max_output_tokens: 500,
      });

      const reply =
        response.output_text ||
        "Sorry, I'm having trouble responding right now.";

      /* -------- Persist Chat -------- */
      await storage.createChatMessage({
        sessionId,
        vehicleId: vehicleId ?? null,
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
      });

      await storage.createChatMessage({
        sessionId,
        vehicleId: vehicleId ?? null,
        role: "assistant",
        content: reply,
        timestamp: new Date().toISOString(),
      });

      res.json({ response: reply });

    } catch (error) {
      console.error("Voice Agent Error:", error);
      res.status(500).json({ error: "Voice agent failed" });
    }
  });

  /* -------------------- CHAT HISTORY -------------------- */
  app.get("/api/voice-agent/history/:sessionId", async (req, res) => {
    res.json(await storage.getChatMessages(req.params.sessionId));
  });
}
