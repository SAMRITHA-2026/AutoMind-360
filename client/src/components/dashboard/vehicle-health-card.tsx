import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Car, AlertTriangle, Gauge, Thermometer, Battery, Disc } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Vehicle, TelematicsData, PredictedFailure } from "@shared/schema";

interface VehicleHealthCardProps {
  vehicle: Vehicle;
  telematics?: TelematicsData;
  predictions?: PredictedFailure[];
  onClick?: () => void;
}

export function VehicleHealthCard({
  vehicle,
  telematics,
  predictions = [],
  onClick,
}: VehicleHealthCardProps) {
  const healthColor =
    vehicle.healthScore >= 80
      ? "text-green-500"
      : vehicle.healthScore >= 60
      ? "text-yellow-500"
      : "text-red-500";

  const healthBg =
    vehicle.healthScore >= 80
      ? "bg-green-500"
      : vehicle.healthScore >= 60
      ? "bg-yellow-500"
      : "bg-red-500";

  const criticalPredictions = predictions.filter(
    (p) => p.riskLevel === "critical" || p.riskLevel === "high"
  );

  return (
    <Card
      className={cn(
        "hover-elevate cursor-pointer transition-all",
        criticalPredictions.length > 0 && "border-red-500/50"
      )}
      onClick={onClick}
      data-testid={`vehicle-card-${vehicle.id}`}
    >
      <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2 space-y-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
            <Car className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base font-medium truncate">
              {vehicle.make} {vehicle.model}
            </CardTitle>
            <p className="text-xs text-muted-foreground truncate">{vehicle.vin}</p>
          </div>
        </div>
        {criticalPredictions.length > 0 && (
          <Badge variant="destructive" className="flex-shrink-0">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {criticalPredictions.length} Alert{criticalPredictions.length > 1 ? "s" : ""}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="pt-2">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Health Score</span>
            <span className={cn("text-sm font-semibold", healthColor)}>
              {vehicle.healthScore.toFixed(0)}%
            </span>
          </div>
          <Progress
            value={vehicle.healthScore}
            className="h-2"
            indicatorClassName={healthBg}
          />
        </div>

        {telematics && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 p-1.5 rounded bg-muted/50">
              <Thermometer className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Engine:</span>
              <span className="font-medium">{telematics.engineTemp}°C</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded bg-muted/50">
              <Battery className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Battery:</span>
              <span className="font-medium">{telematics.batteryVoltage}V</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded bg-muted/50">
              <Disc className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Brake:</span>
              <span className="font-medium">{telematics.brakeWear}%</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded bg-muted/50">
              <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Oil:</span>
              <span className="font-medium">{telematics.oilPressure} psi</span>
            </div>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{vehicle.ownerName}</span>
          <span>{vehicle.city}</span>
        </div>
      </CardContent>
    </Card>
  );
}
