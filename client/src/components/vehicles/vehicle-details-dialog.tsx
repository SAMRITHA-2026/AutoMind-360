import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Car,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Gauge,
  Thermometer,
  Battery,
  Disc,
  AlertTriangle,
  Wrench,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Vehicle, TelematicsData, PredictedFailure, MaintenanceRecord } from "@shared/schema";

interface VehicleDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
  telematics?: TelematicsData;
  predictions?: PredictedFailure[];
  maintenanceHistory?: MaintenanceRecord[];
}

export function VehicleDetailsDialog({
  open,
  onOpenChange,
  vehicle,
  telematics,
  predictions = [],
  maintenanceHistory = [],
}: VehicleDetailsDialogProps) {
  if (!vehicle) return null;

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

  const riskColors = {
    low: "bg-blue-500/10 text-blue-500",
    medium: "bg-yellow-500/10 text-yellow-500",
    high: "bg-orange-500/10 text-orange-500",
    critical: "bg-red-500/10 text-red-500",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]" data-testid="vehicle-details-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            {vehicle.make} {vehicle.model} ({vehicle.year})
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="telematics">Telematics</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] mt-4">
            <TabsContent value="overview" className="space-y-4 pr-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-md bg-muted/30 border">
                  <p className="text-xs text-muted-foreground mb-1">VIN</p>
                  <p className="text-sm font-mono">{vehicle.vin}</p>
                </div>
                <div className="p-4 rounded-md bg-muted/30 border">
                  <p className="text-xs text-muted-foreground mb-1">Mileage</p>
                  <p className="text-sm font-medium">{vehicle.mileage.toLocaleString()} km</p>
                </div>
              </div>

              <div className="p-4 rounded-md bg-muted/30 border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Health Score</span>
                  <span className={cn("text-lg font-bold", healthColor)}>
                    {vehicle.healthScore.toFixed(0)}%
                  </span>
                </div>
                <Progress value={vehicle.healthScore} className="h-3" indicatorClassName={healthBg} />
              </div>

              <div className="p-4 rounded-md bg-muted/30 border space-y-3">
                <h4 className="text-sm font-medium">Owner Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{vehicle.ownerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{vehicle.ownerPhone}</span>
                  </div>
                  {vehicle.ownerEmail && (
                    <div className="flex items-center gap-2 col-span-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{vehicle.ownerEmail}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{vehicle.city}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-md bg-muted/30 border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Last Service
                  </div>
                  <p className="text-sm font-medium">{vehicle.lastServiceDate || "N/A"}</p>
                </div>
                <div className="p-4 rounded-md bg-muted/30 border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Next Service Due
                  </div>
                  <p className="text-sm font-medium">{vehicle.nextServiceDue || "N/A"}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="telematics" className="space-y-4 pr-4">
              {telematics ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-md bg-muted/30 border">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Thermometer className="w-4 h-4" />
                        <span className="text-xs">Engine Temperature</span>
                      </div>
                      <p className="text-xl font-bold">{telematics.engineTemp}°C</p>
                    </div>
                    <div className="p-4 rounded-md bg-muted/30 border">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Gauge className="w-4 h-4" />
                        <span className="text-xs">Oil Pressure</span>
                      </div>
                      <p className="text-xl font-bold">{telematics.oilPressure} psi</p>
                    </div>
                    <div className="p-4 rounded-md bg-muted/30 border">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Battery className="w-4 h-4" />
                        <span className="text-xs">Battery Voltage</span>
                      </div>
                      <p className="text-xl font-bold">{telematics.batteryVoltage}V</p>
                    </div>
                    <div className="p-4 rounded-md bg-muted/30 border">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Disc className="w-4 h-4" />
                        <span className="text-xs">Brake Wear</span>
                      </div>
                      <p className="text-xl font-bold">{telematics.brakeWear}%</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-md bg-muted/30 border">
                    <h4 className="text-sm font-medium mb-3">Real-time Metrics</h4>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">RPM</p>
                        <p className="text-lg font-bold">{telematics.rpm}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Speed</p>
                        <p className="text-lg font-bold">{telematics.speed} km/h</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Fuel Level</p>
                        <p className="text-lg font-bold">{telematics.fuelLevel}%</p>
                      </div>
                    </div>
                  </div>

                  {telematics.diagnosticCodes && telematics.diagnosticCodes.length > 0 && (
                    <div className="p-4 rounded-md bg-red-500/10 border border-red-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium">Diagnostic Trouble Codes</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {telematics.diagnosticCodes.map((code, i) => (
                          <Badge key={i} variant="destructive" className="font-mono">
                            {code}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-center">
                  <Activity className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">No telematics data available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="predictions" className="space-y-4 pr-4">
              {predictions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-center">
                  <AlertTriangle className="w-12 h-12 text-green-500 mb-3" />
                  <p className="text-sm font-medium">No Predicted Failures</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All components are in good condition
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {predictions.map((prediction) => (
                    <div
                      key={prediction.id}
                      className={cn(
                        "p-4 rounded-md border",
                        riskColors[prediction.riskLevel as keyof typeof riskColors]
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{prediction.component}</h4>
                          <p className="text-xs text-muted-foreground">
                            Detected: {new Date(prediction.detectedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={riskColors[prediction.riskLevel as keyof typeof riskColors]}>
                          {prediction.riskLevel} risk
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Failure Probability</span>
                          <span className="font-medium">{(prediction.probability * 100).toFixed(0)}%</span>
                        </div>
                        {prediction.estimatedTimeToFailure && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Est. Time to Failure</span>
                            <span className="font-medium">{prediction.estimatedTimeToFailure} days</span>
                          </div>
                        )}
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground mb-1">Recommended Action</p>
                          <p className="text-sm">{prediction.recommendedAction}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4 pr-4">
              {maintenanceHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-center">
                  <Wrench className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">No maintenance history available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {maintenanceHistory.map((record) => (
                    <div key={record.id} className="p-4 rounded-md bg-muted/30 border">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{record.serviceType}</h4>
                          <p className="text-xs text-muted-foreground">{record.serviceDate}</p>
                        </div>
                        <Badge variant="outline">${record.cost.toFixed(2)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{record.description}</p>
                      {record.partsReplaced && record.partsReplaced.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {record.partsReplaced.map((part, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {part}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
