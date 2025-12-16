import { randomUUID } from "crypto";
import type {
  Vehicle, InsertVehicle,
  TelematicsData, InsertTelematics,
  Agent, InsertAgent,
  Appointment, InsertAppointment,
  ServiceCenter, InsertServiceCenter,
  MaintenanceRecord, InsertMaintenanceRecord,
  PredictedFailure, InsertPredictedFailure,
  RcaCapaRecord, InsertRcaCapa,
  UebaEvent, InsertUebaEvent,
  ChatMessage, InsertChatMessage,
  AgentActivityLog, InsertAgentActivityLog,
  User, InsertUser,
} from "@shared/schema";

export interface IStorage {
  // Vehicles
  getVehicles(): Promise<Vehicle[]>;
  getVehicle(id: string): Promise<Vehicle | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle | undefined>;

  // Telematics
  getTelematics(): Promise<TelematicsData[]>;
  getTelematicsByVehicle(vehicleId: string): Promise<TelematicsData[]>;
  createTelematics(data: InsertTelematics): Promise<TelematicsData>;

  // Agents
  getAgents(): Promise<Agent[]>;
  getAgent(id: string): Promise<Agent | undefined>;
  updateAgent(id: string, updates: Partial<Agent>): Promise<Agent | undefined>;

  // Appointments
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | undefined>;

  // Service Centers
  getServiceCenters(): Promise<ServiceCenter[]>;

  // Maintenance Records
  getMaintenanceRecords(): Promise<MaintenanceRecord[]>;
  getMaintenanceRecordsByVehicle(vehicleId: string): Promise<MaintenanceRecord[]>;

  // Predicted Failures
  getPredictions(): Promise<PredictedFailure[]>;
  getPredictionsByVehicle(vehicleId: string): Promise<PredictedFailure[]>;

  // RCA/CAPA
  getRcaCapaRecords(): Promise<RcaCapaRecord[]>;
  updateRcaCapa(id: string, updates: Partial<RcaCapaRecord>): Promise<RcaCapaRecord | undefined>;

  // UEBA Events
  getUebaEvents(): Promise<UebaEvent[]>;
  createUebaEvent(event: InsertUebaEvent): Promise<UebaEvent>;
  updateUebaEvent(id: string, updates: Partial<UebaEvent>): Promise<UebaEvent | undefined>;

  // Chat Messages
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Activity Logs
  getActivityLogs(): Promise<AgentActivityLog[]>;
  createActivityLog(log: InsertAgentActivityLog): Promise<AgentActivityLog>;

  // Service Demand Forecast
  getServiceDemand(): Promise<{ date: string; predicted: number; actual?: number }[]>;

  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private vehicles: Map<string, Vehicle> = new Map();
  private telematics: Map<string, TelematicsData> = new Map();
  private agents: Map<string, Agent> = new Map();
  private appointments: Map<string, Appointment> = new Map();
  private serviceCenters: Map<string, ServiceCenter> = new Map();
  private maintenanceRecords: Map<string, MaintenanceRecord> = new Map();
  private predictions: Map<string, PredictedFailure> = new Map();
  private rcaCapaRecords: Map<string, RcaCapaRecord> = new Map();
  private uebaEvents: Map<string, UebaEvent> = new Map();
  private chatMessages: Map<string, ChatMessage> = new Map();
  private activityLogs: Map<string, AgentActivityLog> = new Map();
  private users: Map<string, User> = new Map();

  constructor() {
    this.initializeSyntheticData();
  }

  private initializeSyntheticData() {
    // Initialize Agents
    const agentData: Omit<Agent, "id">[] = [
      { name: "Master Orchestrator", type: "master", status: "active", currentTask: "Coordinating worker agents", tasksCompleted: 1247, lastActiveAt: new Date().toISOString(), healthStatus: "healthy" },
      { name: "Data Analysis Agent", type: "data_analysis", status: "active", currentTask: "Analyzing vehicle telemetry data", tasksCompleted: 856, lastActiveAt: new Date().toISOString(), healthStatus: "healthy" },
      { name: "Diagnosis Agent", type: "diagnosis", status: "busy", currentTask: "Running predictive failure model for MH-12-AB-1234", tasksCompleted: 623, lastActiveAt: new Date().toISOString(), healthStatus: "healthy" },
      { name: "Customer Engagement Agent", type: "customer_engagement", status: "idle", currentTask: null, tasksCompleted: 412, lastActiveAt: new Date(Date.now() - 300000).toISOString(), healthStatus: "healthy" },
      { name: "Scheduling Agent", type: "scheduling", status: "active", currentTask: "Optimizing service center appointments", tasksCompleted: 534, lastActiveAt: new Date().toISOString(), healthStatus: "healthy" },
      { name: "Feedback Agent", type: "feedback", status: "idle", currentTask: null, tasksCompleted: 298, lastActiveAt: new Date(Date.now() - 600000).toISOString(), healthStatus: "healthy" },
      { name: "Manufacturing Insights Agent", type: "manufacturing_insights", status: "active", currentTask: "Generating RCA/CAPA report for brake assembly", tasksCompleted: 187, lastActiveAt: new Date().toISOString(), healthStatus: "healthy" },
    ];

    agentData.forEach((agent) => {
      const id = randomUUID();
      this.agents.set(id, { ...agent, id });
    });

    // Initialize Vehicles (10 Indian vehicles)
    const vehicleData: Omit<Vehicle, "id">[] = [
      { vin: "MAHINDRA2024001XUV", make: "Mahindra", model: "XUV700", year: 2024, ownerName: "Rajesh Kumar", ownerPhone: "+91 98765 43210", ownerEmail: "rajesh.kumar@email.com", city: "Mumbai", healthScore: 92, lastServiceDate: "2024-10-15", nextServiceDue: "2025-01-15", mileage: 25000, status: "active" },
      { vin: "TATA2023002NEXON", make: "Tata", model: "Nexon EV", year: 2023, ownerName: "Priya Sharma", ownerPhone: "+91 87654 32109", ownerEmail: "priya.sharma@email.com", city: "Delhi", healthScore: 78, lastServiceDate: "2024-09-20", nextServiceDue: "2024-12-20", mileage: 35000, status: "active" },
      { vin: "MARUTI2024003BREZZA", make: "Maruti Suzuki", model: "Brezza", year: 2024, ownerName: "Amit Patel", ownerPhone: "+91 76543 21098", ownerEmail: "amit.patel@email.com", city: "Ahmedabad", healthScore: 85, lastServiceDate: "2024-11-01", nextServiceDue: "2025-02-01", mileage: 18000, status: "active" },
      { vin: "HYUNDAI2022004CRETA", make: "Hyundai", model: "Creta", year: 2022, ownerName: "Sunita Reddy", ownerPhone: "+91 65432 10987", ownerEmail: "sunita.reddy@email.com", city: "Hyderabad", healthScore: 45, lastServiceDate: "2024-07-10", nextServiceDue: "2024-10-10", mileage: 68000, status: "active" },
      { vin: "KIA2023005SELTOS", make: "Kia", model: "Seltos", year: 2023, ownerName: "Vikram Singh", ownerPhone: "+91 54321 09876", ownerEmail: "vikram.singh@email.com", city: "Jaipur", healthScore: 88, lastServiceDate: "2024-10-25", nextServiceDue: "2025-01-25", mileage: 28000, status: "active" },
      { vin: "HONDA2021006CITY", make: "Honda", model: "City", year: 2021, ownerName: "Ananya Gupta", ownerPhone: "+91 43210 98765", ownerEmail: "ananya.gupta@email.com", city: "Bangalore", healthScore: 62, lastServiceDate: "2024-08-15", nextServiceDue: "2024-11-15", mileage: 52000, status: "active" },
      { vin: "TOYOTA2024007INNOVA", make: "Toyota", model: "Innova Crysta", year: 2024, ownerName: "Suresh Menon", ownerPhone: "+91 32109 87654", ownerEmail: "suresh.menon@email.com", city: "Chennai", healthScore: 95, lastServiceDate: "2024-11-10", nextServiceDue: "2025-02-10", mileage: 15000, status: "active" },
      { vin: "MG2023008HECTOR", make: "MG", model: "Hector", year: 2023, ownerName: "Deepika Nair", ownerPhone: "+91 21098 76543", ownerEmail: "deepika.nair@email.com", city: "Kochi", healthScore: 73, lastServiceDate: "2024-09-05", nextServiceDue: "2024-12-05", mileage: 42000, status: "active" },
      { vin: "SKODA2022009KUSHAQ", make: "Skoda", model: "Kushaq", year: 2022, ownerName: "Arjun Verma", ownerPhone: "+91 10987 65432", ownerEmail: "arjun.verma@email.com", city: "Pune", healthScore: 55, lastServiceDate: "2024-06-20", nextServiceDue: "2024-09-20", mileage: 58000, status: "active" },
      { vin: "VW2024010TAIGUN", make: "Volkswagen", model: "Taigun", year: 2024, ownerName: "Meera Iyer", ownerPhone: "+91 09876 54321", ownerEmail: "meera.iyer@email.com", city: "Coimbatore", healthScore: 91, lastServiceDate: "2024-11-05", nextServiceDue: "2025-02-05", mileage: 12000, status: "active" },
    ];

    const vehicleIds: string[] = [];
    vehicleData.forEach((vehicle) => {
      const id = randomUUID();
      vehicleIds.push(id);
      this.vehicles.set(id, { ...vehicle, id });
    });

    // Initialize Telematics for each vehicle
    vehicleIds.forEach((vehicleId, index) => {
      const vehicle = this.vehicles.get(vehicleId)!;
      const healthFactor = vehicle.healthScore / 100;
      const id = randomUUID();
      const telematics: TelematicsData = {
        id,
        vehicleId,
        timestamp: new Date().toISOString(),
        engineTemp: Math.round(75 + (1 - healthFactor) * 30 + Math.random() * 10),
        oilPressure: Math.round(35 + healthFactor * 10 + Math.random() * 5),
        brakeWear: Math.round((1 - healthFactor) * 60 + Math.random() * 20),
        batteryVoltage: Math.round((11.5 + healthFactor * 1.5 + Math.random() * 0.5) * 10) / 10,
        tirePressure: { fl: 32, fr: 31, rl: 33, rr: 32 },
        fuelLevel: Math.round(30 + Math.random() * 70),
        rpm: Math.round(800 + Math.random() * 200),
        speed: 0,
        diagnosticCodes: vehicle.healthScore < 60 ? ["P0300", "P0171"] : vehicle.healthScore < 80 ? ["P0420"] : [],
      };
      this.telematics.set(id, telematics);
    });

    // Initialize Predicted Failures
    const predictionData: Omit<PredictedFailure, "id">[] = [
      { vehicleId: vehicleIds[3], component: "Brake Pads", riskLevel: "critical", probability: 0.89, estimatedTimeToFailure: 7, recommendedAction: "Immediate brake pad replacement required. Schedule urgent service appointment.", detectedAt: new Date(Date.now() - 86400000).toISOString(), status: "active" },
      { vehicleId: vehicleIds[3], component: "Engine Oil", riskLevel: "high", probability: 0.75, estimatedTimeToFailure: 14, recommendedAction: "Engine oil degradation detected. Schedule oil change within 2 weeks.", detectedAt: new Date(Date.now() - 172800000).toISOString(), status: "active" },
      { vehicleId: vehicleIds[5], component: "Transmission", riskLevel: "medium", probability: 0.52, estimatedTimeToFailure: 45, recommendedAction: "Monitor transmission performance. Consider fluid check at next service.", detectedAt: new Date(Date.now() - 259200000).toISOString(), status: "active" },
      { vehicleId: vehicleIds[8], component: "Battery", riskLevel: "high", probability: 0.78, estimatedTimeToFailure: 21, recommendedAction: "Battery showing signs of degradation. Replacement recommended soon.", detectedAt: new Date(Date.now() - 345600000).toISOString(), status: "active" },
      { vehicleId: vehicleIds[1], component: "Suspension", riskLevel: "medium", probability: 0.48, estimatedTimeToFailure: 60, recommendedAction: "Suspension wear detected. Schedule inspection at next visit.", detectedAt: new Date(Date.now() - 432000000).toISOString(), status: "active" },
      { vehicleId: vehicleIds[7], component: "Brake Disc", riskLevel: "low", probability: 0.32, estimatedTimeToFailure: 90, recommendedAction: "Minor brake disc wear. Monitor during routine maintenance.", detectedAt: new Date(Date.now() - 518400000).toISOString(), status: "active" },
    ];

    predictionData.forEach((pred) => {
      const id = randomUUID();
      this.predictions.set(id, { ...pred, id });
    });

    // Initialize Service Centers
    const serviceCenterData: Omit<ServiceCenter, "id">[] = [
      { name: "AutoMind Mumbai Central", city: "Mumbai", address: "Plot 45, Andheri East, Mumbai 400069", capacity: 20, currentLoad: 14, operatingHours: "8:00 AM - 8:00 PM", specializations: ["Engine", "Transmission", "Electrical"] },
      { name: "AutoMind Delhi Hub", city: "Delhi", address: "Sector 18, Noida, Delhi NCR 201301", capacity: 25, currentLoad: 22, operatingHours: "7:00 AM - 9:00 PM", specializations: ["EV Service", "Body Work", "AC Repair"] },
      { name: "AutoMind Bangalore Tech", city: "Bangalore", address: "Electronic City Phase 1, Bangalore 560100", capacity: 18, currentLoad: 10, operatingHours: "8:00 AM - 7:00 PM", specializations: ["Diagnostics", "Software Updates", "Hybrid"] },
      { name: "AutoMind Hyderabad", city: "Hyderabad", address: "HITEC City, Hyderabad 500081", capacity: 15, currentLoad: 8, operatingHours: "9:00 AM - 6:00 PM", specializations: ["General Service", "Tire Center"] },
      { name: "AutoMind Chennai Express", city: "Chennai", address: "OMR Road, Sholinganallur, Chennai 600119", capacity: 22, currentLoad: 18, operatingHours: "7:30 AM - 8:30 PM", specializations: ["Premium Vehicles", "Detailing"] },
    ];

    const serviceCenterIds: string[] = [];
    serviceCenterData.forEach((center) => {
      const id = randomUUID();
      serviceCenterIds.push(id);
      this.serviceCenters.set(id, { ...center, id });
    });

    // Initialize Appointments
    const appointmentData: Omit<Appointment, "id">[] = [
      { vehicleId: vehicleIds[3], serviceCenterId: serviceCenterIds[3], scheduledDate: "2024-12-16", scheduledTime: "10:00 AM", serviceType: "Emergency Brake Service", status: "confirmed", priority: "urgent", estimatedDuration: 180, notes: "Critical brake pad replacement", createdAt: new Date().toISOString() },
      { vehicleId: vehicleIds[1], serviceCenterId: serviceCenterIds[1], scheduledDate: "2024-12-18", scheduledTime: "2:00 PM", serviceType: "EV Battery Check", status: "scheduled", priority: "normal", estimatedDuration: 90, notes: "Routine battery health check", createdAt: new Date().toISOString() },
      { vehicleId: vehicleIds[5], serviceCenterId: serviceCenterIds[2], scheduledDate: "2024-12-20", scheduledTime: "11:00 AM", serviceType: "Transmission Service", status: "scheduled", priority: "high", estimatedDuration: 240, notes: "Transmission fluid change and inspection", createdAt: new Date().toISOString() },
      { vehicleId: vehicleIds[8], serviceCenterId: serviceCenterIds[0], scheduledDate: "2024-12-17", scheduledTime: "9:00 AM", serviceType: "Battery Replacement", status: "confirmed", priority: "high", estimatedDuration: 60, notes: "Replace degraded battery", createdAt: new Date().toISOString() },
      { vehicleId: vehicleIds[0], serviceCenterId: serviceCenterIds[0], scheduledDate: "2024-12-22", scheduledTime: "3:00 PM", serviceType: "Regular Maintenance", status: "scheduled", priority: "normal", estimatedDuration: 120, notes: "15000 km service", createdAt: new Date().toISOString() },
    ];

    appointmentData.forEach((appt) => {
      const id = randomUUID();
      this.appointments.set(id, { ...appt, id });
    });

    // Initialize Maintenance Records
    const maintenanceData: Omit<MaintenanceRecord, "id">[] = [
      { vehicleId: vehicleIds[0], serviceDate: "2024-10-15", serviceType: "Regular Service", description: "20000 km scheduled maintenance", partsReplaced: ["Oil Filter", "Air Filter"], cost: 8500, technicianNotes: "Vehicle in good condition", customerSatisfaction: 5, feedbackNotes: "Excellent service" },
      { vehicleId: vehicleIds[1], serviceDate: "2024-09-20", serviceType: "Battery Service", description: "EV battery health check and calibration", partsReplaced: [], cost: 2500, technicianNotes: "Battery at 92% health", customerSatisfaction: 4, feedbackNotes: "Quick turnaround" },
      { vehicleId: vehicleIds[3], serviceDate: "2024-07-10", serviceType: "Full Service", description: "60000 km major service", partsReplaced: ["Brake Pads", "Spark Plugs", "Coolant"], cost: 25000, technicianNotes: "Brake wear noted, monitor closely", customerSatisfaction: 3, feedbackNotes: "Service took longer than expected" },
    ];

    maintenanceData.forEach((record) => {
      const id = randomUUID();
      this.maintenanceRecords.set(id, { ...record, id });
    });

    // Initialize RCA/CAPA Records
    const rcaCapaData: Omit<RcaCapaRecord, "id">[] = [
      { failureType: "Premature Brake Wear", component: "Brake Pads", rootCause: "Substandard friction material in batch BRK-2024-Q2", occurrenceCount: 47, affectedModels: ["Creta", "Seltos", "Kushaq"], correctiveAction: "Recall and replace affected brake pads from batch BRK-2024-Q2", preventiveAction: "Enhanced incoming quality checks for friction material. Supplier audit scheduled.", status: "in_progress", priority: "critical", createdAt: new Date(Date.now() - 604800000).toISOString(), resolvedAt: null },
      { failureType: "Battery Degradation", component: "12V Battery", rootCause: "Manufacturing defect in electrolyte composition", occurrenceCount: 23, affectedModels: ["Kushaq", "Taigun"], correctiveAction: "Free battery replacement for affected vehicles", preventiveAction: "New supplier qualification. Enhanced testing protocol.", status: "open", priority: "high", createdAt: new Date(Date.now() - 1209600000).toISOString(), resolvedAt: null },
      { failureType: "Transmission Noise", component: "Gearbox", rootCause: "Bearing tolerance issue in assembly line 3", occurrenceCount: 12, affectedModels: ["City", "Hector"], correctiveAction: "Gearbox inspection and bearing replacement if needed", preventiveAction: "Assembly line 3 recalibration. Operator retraining completed.", status: "closed", priority: "medium", createdAt: new Date(Date.now() - 2592000000).toISOString(), resolvedAt: new Date(Date.now() - 864000000).toISOString() },
      { failureType: "Infotainment System Freeze", component: "Head Unit", rootCause: "Firmware memory leak in version 2.4.1", occurrenceCount: 156, affectedModels: ["XUV700", "Nexon EV", "Seltos"], correctiveAction: "OTA firmware update to version 2.4.3", preventiveAction: "Extended QA testing cycle for firmware releases", status: "closed", priority: "low", createdAt: new Date(Date.now() - 3888000000).toISOString(), resolvedAt: new Date(Date.now() - 2160000000).toISOString() },
    ];

    rcaCapaData.forEach((record) => {
      const id = randomUUID();
      this.rcaCapaRecords.set(id, { ...record, id });
    });

    // Initialize UEBA Events
    const uebaData: Omit<UebaEvent, "id">[] = [
      { agentId: Array.from(this.agents.keys())[4], agentName: "Scheduling Agent", eventType: "unauthorized_access", severity: "high", description: "Scheduling Agent attempted to access vehicle telematics data outside its normal scope", actionTaken: "Access blocked. Alert generated.", timestamp: new Date(Date.now() - 3600000).toISOString(), resolved: false, details: { attemptedResource: "/api/telematics", normalScope: ["appointments", "service-centers"] } },
      { agentId: Array.from(this.agents.keys())[3], agentName: "Customer Engagement Agent", eventType: "anomalous_behavior", severity: "medium", description: "Unusual spike in outbound API calls detected (5x normal rate)", actionTaken: "Rate limiting applied. Monitoring increased.", timestamp: new Date(Date.now() - 7200000).toISOString(), resolved: true, details: { normalRate: 50, detectedRate: 250, period: "1 hour" } },
      { agentId: Array.from(this.agents.keys())[2], agentName: "Diagnosis Agent", eventType: "suspicious_api_call", severity: "low", description: "Diagnosis Agent accessed manufacturing database (unusual but within permissions)", actionTaken: "Logged for audit. No action required.", timestamp: new Date(Date.now() - 86400000).toISOString(), resolved: true, details: { database: "manufacturing_quality", accessType: "read" } },
    ];

    uebaData.forEach((event) => {
      const id = randomUUID();
      this.uebaEvents.set(id, { ...event, id });
    });

    // Initialize Activity Logs
    const activityData: Omit<AgentActivityLog, "id">[] = [
      { agentId: Array.from(this.agents.keys())[0], agentName: "Master Orchestrator", action: "Initiated fleet health scan", details: "Scanning 10 vehicles for anomalies", timestamp: new Date().toISOString(), success: true },
      { agentId: Array.from(this.agents.keys())[1], agentName: "Data Analysis Agent", action: "Processed telematics batch", details: "Analyzed 1,247 data points from fleet", timestamp: new Date(Date.now() - 60000).toISOString(), success: true },
      { agentId: Array.from(this.agents.keys())[2], agentName: "Diagnosis Agent", action: "Generated failure prediction", details: "Critical brake wear predicted for Hyundai Creta (MH-12)", timestamp: new Date(Date.now() - 120000).toISOString(), success: true },
      { agentId: Array.from(this.agents.keys())[4], agentName: "Scheduling Agent", action: "Auto-scheduled appointment", details: "Emergency brake service for vehicle ID ending ...CRETA", timestamp: new Date(Date.now() - 180000).toISOString(), success: true },
      { agentId: Array.from(this.agents.keys())[3], agentName: "Customer Engagement Agent", action: "Initiated customer outreach", details: "Called Sunita Reddy regarding urgent brake service", timestamp: new Date(Date.now() - 240000).toISOString(), success: true },
      { agentId: Array.from(this.agents.keys())[6], agentName: "Manufacturing Insights Agent", action: "Generated RCA report", details: "Identified brake pad quality issue in batch BRK-2024-Q2", timestamp: new Date(Date.now() - 300000).toISOString(), success: true },
      { agentId: Array.from(this.agents.keys())[5], agentName: "Feedback Agent", action: "Collected customer feedback", details: "Post-service survey completed for 3 customers", timestamp: new Date(Date.now() - 360000).toISOString(), success: true },
      { agentId: Array.from(this.agents.keys())[0], agentName: "Master Orchestrator", action: "Coordinated multi-agent workflow", details: "Predictive maintenance pipeline completed", timestamp: new Date(Date.now() - 420000).toISOString(), success: true },
    ];

    activityData.forEach((log) => {
      const id = randomUUID();
      this.activityLogs.set(id, { ...log, id });
    });
  }

  // Vehicle methods
  async getVehicles(): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values());
  }

  async getVehicle(id: string): Promise<Vehicle | undefined> {
    return this.vehicles.get(id);
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const id = randomUUID();
    const newVehicle: Vehicle = { ...vehicle, id };
    this.vehicles.set(id, newVehicle);
    return newVehicle;
  }

  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle | undefined> {
    const vehicle = this.vehicles.get(id);
    if (!vehicle) return undefined;
    const updated = { ...vehicle, ...updates };
    this.vehicles.set(id, updated);
    return updated;
  }

  // Telematics methods
  async getTelematics(): Promise<TelematicsData[]> {
    return Array.from(this.telematics.values());
  }

  async getTelematicsByVehicle(vehicleId: string): Promise<TelematicsData[]> {
    return Array.from(this.telematics.values()).filter((t) => t.vehicleId === vehicleId);
  }

  async createTelematics(data: InsertTelematics): Promise<TelematicsData> {
    const id = randomUUID();
    const newData: TelematicsData = { ...data, id };
    this.telematics.set(id, newData);
    return newData;
  }

  // Agent methods
  async getAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async getAgent(id: string): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent | undefined> {
    const agent = this.agents.get(id);
    if (!agent) return undefined;
    const updated = { ...agent, ...updates };
    this.agents.set(id, updated);
    return updated;
  }

  // Appointment methods
  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const newAppointment: Appointment = { ...appointment, id };
    this.appointments.set(id, newAppointment);
    return newAppointment;
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    const updated = { ...appointment, ...updates };
    this.appointments.set(id, updated);
    return updated;
  }

  // Service Center methods
  async getServiceCenters(): Promise<ServiceCenter[]> {
    return Array.from(this.serviceCenters.values());
  }

  // Maintenance Record methods
  async getMaintenanceRecords(): Promise<MaintenanceRecord[]> {
    return Array.from(this.maintenanceRecords.values());
  }

  async getMaintenanceRecordsByVehicle(vehicleId: string): Promise<MaintenanceRecord[]> {
    return Array.from(this.maintenanceRecords.values()).filter((r) => r.vehicleId === vehicleId);
  }

  // Prediction methods
  async getPredictions(): Promise<PredictedFailure[]> {
    return Array.from(this.predictions.values());
  }

  async getPredictionsByVehicle(vehicleId: string): Promise<PredictedFailure[]> {
    return Array.from(this.predictions.values()).filter((p) => p.vehicleId === vehicleId);
  }

  // RCA/CAPA methods
  async getRcaCapaRecords(): Promise<RcaCapaRecord[]> {
    return Array.from(this.rcaCapaRecords.values());
  }

  async updateRcaCapa(id: string, updates: Partial<RcaCapaRecord>): Promise<RcaCapaRecord | undefined> {
    const record = this.rcaCapaRecords.get(id);
    if (!record) return undefined;
    const updated = { ...record, ...updates };
    if (updates.status === "closed" && !record.resolvedAt) {
      updated.resolvedAt = new Date().toISOString();
    }
    this.rcaCapaRecords.set(id, updated);
    return updated;
  }

  // UEBA Event methods
  async getUebaEvents(): Promise<UebaEvent[]> {
    return Array.from(this.uebaEvents.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async createUebaEvent(event: InsertUebaEvent): Promise<UebaEvent> {
    const id = randomUUID();
    const newEvent: UebaEvent = { ...event, id };
    this.uebaEvents.set(id, newEvent);
    return newEvent;
  }

  async updateUebaEvent(id: string, updates: Partial<UebaEvent>): Promise<UebaEvent | undefined> {
    const event = this.uebaEvents.get(id);
    if (!event) return undefined;
    const updated = { ...event, ...updates };
    this.uebaEvents.set(id, updated);
    return updated;
  }

  // Chat Message methods
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((m) => m.sessionId === sessionId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const newMessage: ChatMessage = { ...message, id };
    this.chatMessages.set(id, newMessage);
    return newMessage;
  }

  // Activity Log methods
  async getActivityLogs(): Promise<AgentActivityLog[]> {
    return Array.from(this.activityLogs.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async createActivityLog(log: InsertAgentActivityLog): Promise<AgentActivityLog> {
    const id = randomUUID();
    const newLog: AgentActivityLog = { ...log, id };
    this.activityLogs.set(id, newLog);
    return newLog;
  }

  // Service Demand Forecast
  async getServiceDemand(): Promise<{ date: string; predicted: number; actual?: number }[]> {
    const data = [];
    const today = new Date();
    for (let i = -7; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const baseLoad = 15 + Math.random() * 10;
      data.push({
        date: dateStr,
        predicted: Math.round(baseLoad + (i > 0 ? Math.random() * 5 : 0)),
        actual: i <= 0 ? Math.round(baseLoad + Math.random() * 3 - 1.5) : undefined,
      });
    }
    return data;
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
