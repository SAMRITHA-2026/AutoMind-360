import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Vehicle data model
export const vehicles = pgTable("vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vin: text("vin").notNull().unique(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  ownerName: text("owner_name").notNull(),
  ownerPhone: text("owner_phone").notNull(),
  ownerEmail: text("owner_email"),
  city: text("city").notNull(),
  healthScore: real("health_score").notNull().default(100),
  lastServiceDate: text("last_service_date"),
  nextServiceDue: text("next_service_due"),
  mileage: integer("mileage").notNull().default(0),
  status: text("status").notNull().default("active"),
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({ id: true });
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;

// Telematics sensor data
export const telematicsData = pgTable("telematics_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleId: varchar("vehicle_id").notNull(),
  timestamp: text("timestamp").notNull(),
  engineTemp: real("engine_temp").notNull(),
  oilPressure: real("oil_pressure").notNull(),
  brakeWear: real("brake_wear").notNull(),
  batteryVoltage: real("battery_voltage").notNull(),
  tirePressure: jsonb("tire_pressure").notNull(),
  fuelLevel: real("fuel_level").notNull(),
  rpm: integer("rpm").notNull(),
  speed: integer("speed").notNull(),
  diagnosticCodes: text("diagnostic_codes").array(),
});

export const insertTelematicsSchema = createInsertSchema(telematicsData).omit({ id: true });
export type InsertTelematics = z.infer<typeof insertTelematicsSchema>;
export type TelematicsData = typeof telematicsData.$inferSelect;

// Agent types and status
export const agents = pgTable("agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // master, data_analysis, diagnosis, customer_engagement, scheduling, feedback, manufacturing_insights
  status: text("status").notNull().default("idle"), // idle, active, busy, error
  currentTask: text("current_task"),
  tasksCompleted: integer("tasks_completed").notNull().default(0),
  lastActiveAt: text("last_active_at"),
  healthStatus: text("health_status").notNull().default("healthy"), // healthy, warning, critical
});

export const insertAgentSchema = createInsertSchema(agents).omit({ id: true });
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;

// Appointments
export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleId: varchar("vehicle_id").notNull(),
  serviceCenterId: varchar("service_center_id").notNull(),
  scheduledDate: text("scheduled_date").notNull(),
  scheduledTime: text("scheduled_time").notNull(),
  serviceType: text("service_type").notNull(),
  status: text("status").notNull().default("scheduled"), // scheduled, confirmed, in_progress, completed, cancelled, declined
  priority: text("priority").notNull().default("normal"), // low, normal, high, urgent
  estimatedDuration: integer("estimated_duration").notNull(), // in minutes
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true });
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

// Service Centers
export const serviceCenters = pgTable("service_centers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  capacity: integer("capacity").notNull(),
  currentLoad: integer("current_load").notNull().default(0),
  operatingHours: text("operating_hours").notNull(),
  specializations: text("specializations").array(),
});

export const insertServiceCenterSchema = createInsertSchema(serviceCenters).omit({ id: true });
export type InsertServiceCenter = z.infer<typeof insertServiceCenterSchema>;
export type ServiceCenter = typeof serviceCenters.$inferSelect;

// Maintenance Records
export const maintenanceRecords = pgTable("maintenance_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleId: varchar("vehicle_id").notNull(),
  serviceDate: text("service_date").notNull(),
  serviceType: text("service_type").notNull(),
  description: text("description").notNull(),
  partsReplaced: text("parts_replaced").array(),
  cost: real("cost").notNull(),
  technicianNotes: text("technician_notes"),
  customerSatisfaction: integer("customer_satisfaction"), // 1-5
  feedbackNotes: text("feedback_notes"),
});

export const insertMaintenanceRecordSchema = createInsertSchema(maintenanceRecords).omit({ id: true });
export type InsertMaintenanceRecord = z.infer<typeof insertMaintenanceRecordSchema>;
export type MaintenanceRecord = typeof maintenanceRecords.$inferSelect;

// Predicted Failures
export const predictedFailures = pgTable("predicted_failures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleId: varchar("vehicle_id").notNull(),
  component: text("component").notNull(), // brake, engine, transmission, battery, suspension
  riskLevel: text("risk_level").notNull(), // low, medium, high, critical
  probability: real("probability").notNull(),
  estimatedTimeToFailure: integer("estimated_time_to_failure"), // in days
  recommendedAction: text("recommended_action").notNull(),
  detectedAt: text("detected_at").notNull(),
  status: text("status").notNull().default("active"), // active, addressed, dismissed
});

export const insertPredictedFailureSchema = createInsertSchema(predictedFailures).omit({ id: true });
export type InsertPredictedFailure = z.infer<typeof insertPredictedFailureSchema>;
export type PredictedFailure = typeof predictedFailures.$inferSelect;

// RCA/CAPA Records (Root Cause Analysis / Corrective and Preventive Actions)
export const rcaCapaRecords = pgTable("rca_capa_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  failureType: text("failure_type").notNull(),
  component: text("component").notNull(),
  rootCause: text("root_cause").notNull(),
  occurrenceCount: integer("occurrence_count").notNull(),
  affectedModels: text("affected_models").array(),
  correctiveAction: text("corrective_action").notNull(),
  preventiveAction: text("preventive_action").notNull(),
  status: text("status").notNull().default("open"), // open, in_progress, closed
  priority: text("priority").notNull().default("medium"), // low, medium, high, critical
  createdAt: text("created_at").notNull(),
  resolvedAt: text("resolved_at"),
});

export const insertRcaCapaSchema = createInsertSchema(rcaCapaRecords).omit({ id: true });
export type InsertRcaCapa = z.infer<typeof insertRcaCapaSchema>;
export type RcaCapaRecord = typeof rcaCapaRecords.$inferSelect;

// UEBA Events (User and Entity Behavior Analytics)
export const uebaEvents = pgTable("ueba_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").notNull(),
  agentName: text("agent_name").notNull(),
  eventType: text("event_type").notNull(), // unauthorized_access, anomalous_behavior, policy_violation, suspicious_api_call
  severity: text("severity").notNull(), // low, medium, high, critical
  description: text("description").notNull(),
  actionTaken: text("action_taken"),
  timestamp: text("timestamp").notNull(),
  resolved: boolean("resolved").notNull().default(false),
  details: jsonb("details"),
});

export const insertUebaEventSchema = createInsertSchema(uebaEvents).omit({ id: true });
export type InsertUebaEvent = z.infer<typeof insertUebaEventSchema>;
export type UebaEvent = typeof uebaEvents.$inferSelect;

// Chat Messages for Voice Agent
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  vehicleId: varchar("vehicle_id"),
  role: text("role").notNull(), // user, assistant, system
  content: text("content").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true });
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Agent Activity Logs
export const agentActivityLogs = pgTable("agent_activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").notNull(),
  agentName: text("agent_name").notNull(),
  action: text("action").notNull(),
  details: text("details"),
  timestamp: text("timestamp").notNull(),
  success: boolean("success").notNull().default(true),
});

export const insertAgentActivityLogSchema = createInsertSchema(agentActivityLogs).omit({ id: true });
export type InsertAgentActivityLog = z.infer<typeof insertAgentActivityLogSchema>;
export type AgentActivityLog = typeof agentActivityLogs.$inferSelect;

// Users (keeping the original schema)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
