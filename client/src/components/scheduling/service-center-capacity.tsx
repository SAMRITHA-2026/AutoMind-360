import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Clock, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServiceCenter } from "@shared/schema";

interface ServiceCenterCapacityProps {
  serviceCenters: ServiceCenter[];
}

export function ServiceCenterCapacity({ serviceCenters }: ServiceCenterCapacityProps) {
  return (
    <Card data-testid="service-center-capacity">
      <CardHeader className="pb-3 flex flex-row items-center gap-2 space-y-0">
        <Building className="w-5 h-5 text-primary" />
        <CardTitle className="text-lg">Service Center Capacity</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {serviceCenters.map((center) => {
            const utilization = (center.currentLoad / center.capacity) * 100;
            const utilizationColor =
              utilization >= 90
                ? "text-red-500"
                : utilization >= 70
                ? "text-yellow-500"
                : "text-green-500";
            const barColor =
              utilization >= 90
                ? "bg-red-500"
                : utilization >= 70
                ? "bg-yellow-500"
                : "bg-green-500";

            return (
              <div
                key={center.id}
                className="p-3 rounded-md bg-muted/30 border"
                data-testid={`service-center-${center.id}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-medium text-sm">{center.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {center.city}
                    </div>
                  </div>
                  <span className={cn("text-sm font-semibold", utilizationColor)}>
                    {utilization.toFixed(0)}%
                  </span>
                </div>

                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>
                      {center.currentLoad} / {center.capacity} slots
                    </span>
                    <span>{center.capacity - center.currentLoad} available</span>
                  </div>
                  <Progress
                    value={utilization}
                    className="h-2"
                    indicatorClassName={barColor}
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{center.operatingHours}</span>
                </div>

                {center.specializations && center.specializations.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {center.specializations.map((spec, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        <Wrench className="w-2.5 h-2.5 mr-1" />
                        {spec}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
