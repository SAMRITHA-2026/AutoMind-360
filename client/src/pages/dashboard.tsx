import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/dashboard/stats-card";
import { AgentStatusCard } from "@/components/dashboard/agent-status-card";
import { VehicleHealthCard } from "@/components/dashboard/vehicle-health-card";
import { UebaAlertPanel } from "@/components/dashboard/ueba-alert-panel";
import { ActivityLog } from "@/components/dashboard/activity-log";
import { ServiceDemandChart } from "@/components/dashboard/service-demand-chart";
import { OrchestrationFlow } from "@/components/dashboard/orchestration-flow";
import { VehicleDetailsDialog } from "@/components/vehicles/vehicle-details-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Car, Bot, Calendar, AlertTriangle, Shield, Factory } from "lucide-react";
import type { Vehicle, Agent, TelematicsData, PredictedFailure, UebaEvent, AgentActivityLog } from "@shared/schema";

export default function Dashboard() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);

  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  const { data: agents = [], isLoading: agentsLoading } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const { data: telematics = [] } = useQuery<TelematicsData[]>({
    queryKey: ["/api/telematics"],
    refetchInterval: 5000,
  });

  const { data: predictions = [] } = useQuery<PredictedFailure[]>({
    queryKey: ["/api/predictions"],
  });

  const { data: uebaEvents = [] } = useQuery<UebaEvent[]>({
    queryKey: ["/api/ueba-events"],
    refetchInterval: 10000,
  });

  const { data: activityLogs = [] } = useQuery<AgentActivityLog[]>({
    queryKey: ["/api/activity-logs"],
    refetchInterval: 3000,
  });

  const { data: serviceDemand = [] } = useQuery<{ date: string; predicted: number; actual?: number }[]>({
    queryKey: ["/api/service-demand"],
  });

  const criticalPredictions = predictions.filter(
    (p) => p.riskLevel === "critical" || p.riskLevel === "high"
  );

  const activeAgents = agents.filter((a) => a.status === "active" || a.status === "busy");
  const unresolvedAlerts = uebaEvents.filter((e) => !e.resolved);

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setVehicleDialogOpen(true);
  };

  const getVehicleTelematics = (vehicleId: string) => {
    return telematics.find((t) => t.vehicleId === vehicleId);
  };

  const getVehiclePredictions = (vehicleId: string) => {
    return predictions.filter((p) => p.vehicleId === vehicleId);
  };

  return (
    <div className="p-6 space-y-6" data-testid="dashboard-page">
      <div>
        <h1 className="text-2xl font-bold">AutoMind 360 Dashboard</h1>
        <p className="text-muted-foreground">Predictive Maintenance & Proactive Service Scheduling</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Fleet Vehicles"
          value={vehicles.length}
          subtitle="Active monitoring"
          icon={Car}
          variant="default"
        />
        <StatsCard
          title="Active Agents"
          value={`${activeAgents.length}/${agents.length}`}
          subtitle="Processing tasks"
          icon={Bot}
          variant="success"
        />
        <StatsCard
          title="Critical Alerts"
          value={criticalPredictions.length}
          subtitle="Require attention"
          icon={AlertTriangle}
          variant={criticalPredictions.length > 0 ? "danger" : "success"}
        />
        <StatsCard
          title="Security Events"
          value={unresolvedAlerts.length}
          subtitle="Unresolved"
          icon={Shield}
          variant={unresolvedAlerts.length > 0 ? "warning" : "success"}
        />
      </div>

      <OrchestrationFlow agents={agents} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Fleet Health Overview</h2>
            {vehiclesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-[200px]" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicles.slice(0, 6).map((vehicle) => (
                  <VehicleHealthCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    telematics={getVehicleTelematics(vehicle.id)}
                    predictions={getVehiclePredictions(vehicle.id)}
                    onClick={() => handleVehicleClick(vehicle)}
                  />
                ))}
              </div>
            )}
          </div>

          <ServiceDemandChart data={serviceDemand} />
        </div>

        <div className="space-y-6">
          <UebaAlertPanel events={uebaEvents} />
          <ActivityLog logs={activityLogs.slice(0, 20)} maxHeight="300px" />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Worker Agents Status</h2>
        {agentsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[150px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <AgentStatusCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>

      <VehicleDetailsDialog
        open={vehicleDialogOpen}
        onOpenChange={setVehicleDialogOpen}
        vehicle={selectedVehicle}
        telematics={selectedVehicle ? getVehicleTelematics(selectedVehicle.id) : undefined}
        predictions={selectedVehicle ? getVehiclePredictions(selectedVehicle.id) : undefined}
      />
    </div>
  );
}
