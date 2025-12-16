import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleHealthCard } from "@/components/dashboard/vehicle-health-card";
import { VehicleDetailsDialog } from "@/components/vehicles/vehicle-details-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, Car, AlertTriangle, RefreshCw } from "lucide-react";
import type { Vehicle, TelematicsData, PredictedFailure, MaintenanceRecord } from "@shared/schema";

export default function VehiclesPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [healthFilter, setHealthFilter] = useState<string>("all");

  const { data: vehicles = [], isLoading, refetch } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  const { data: telematics = [] } = useQuery<TelematicsData[]>({
    queryKey: ["/api/telematics"],
    refetchInterval: 5000,
  });

  const { data: predictions = [] } = useQuery<PredictedFailure[]>({
    queryKey: ["/api/predictions"],
  });

  const { data: maintenanceRecords = [] } = useQuery<MaintenanceRecord[]>({
    queryKey: ["/api/maintenance-records"],
  });

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.ownerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;

    const matchesHealth =
      healthFilter === "all" ||
      (healthFilter === "critical" && vehicle.healthScore < 60) ||
      (healthFilter === "warning" && vehicle.healthScore >= 60 && vehicle.healthScore < 80) ||
      (healthFilter === "healthy" && vehicle.healthScore >= 80);

    return matchesSearch && matchesStatus && matchesHealth;
  });

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

  const getVehicleMaintenanceHistory = (vehicleId: string) => {
    return maintenanceRecords.filter((r) => r.vehicleId === vehicleId);
  };

  const criticalCount = vehicles.filter((v) => v.healthScore < 60).length;
  const warningCount = vehicles.filter((v) => v.healthScore >= 60 && v.healthScore < 80).length;
  const healthyCount = vehicles.filter((v) => v.healthScore >= 80).length;

  return (
    <div className="p-6 space-y-6" data-testid="vehicles-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Car className="w-6 h-6" />
            Fleet Vehicles
          </h1>
          <p className="text-muted-foreground">Monitor and manage vehicle health</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} data-testid="button-refresh-vehicles">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-green-500/10 flex items-center justify-center">
              <Car className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{healthyCount}</p>
              <p className="text-sm text-muted-foreground">Healthy Vehicles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-yellow-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{warningCount}</p>
              <p className="text-sm text-muted-foreground">Need Attention</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{criticalCount}</p>
              <p className="text-sm text-muted-foreground">Critical Status</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search vehicles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-vehicles"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={healthFilter} onValueChange={setHealthFilter}>
              <SelectTrigger className="w-[150px]" data-testid="select-health-filter">
                <SelectValue placeholder="Health" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Health</SelectItem>
                <SelectItem value="healthy">Healthy (80%+)</SelectItem>
                <SelectItem value="warning">Warning (60-80%)</SelectItem>
                <SelectItem value="critical">Critical (&lt;60%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[200px]" />
          ))}
        </div>
      ) : filteredVehicles.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No vehicles found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((vehicle) => (
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

      <VehicleDetailsDialog
        open={vehicleDialogOpen}
        onOpenChange={setVehicleDialogOpen}
        vehicle={selectedVehicle}
        telematics={selectedVehicle ? getVehicleTelematics(selectedVehicle.id) : undefined}
        predictions={selectedVehicle ? getVehiclePredictions(selectedVehicle.id) : undefined}
        maintenanceHistory={selectedVehicle ? getVehicleMaintenanceHistory(selectedVehicle.id) : undefined}
      />
    </div>
  );
}
