import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Car, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Appointment, Vehicle, ServiceCenter } from "@shared/schema";

interface AppointmentCardProps {
  appointment: Appointment;
  vehicle?: Vehicle;
  serviceCenter?: ServiceCenter;
  onConfirm?: () => void;
  onCancel?: () => void;
  onReschedule?: () => void;
}

export function AppointmentCard({
  appointment,
  vehicle,
  serviceCenter,
  onConfirm,
  onCancel,
  onReschedule,
}: AppointmentCardProps) {
  const statusConfig = {
    scheduled: { color: "bg-blue-500/10 text-blue-500", icon: Calendar },
    confirmed: { color: "bg-green-500/10 text-green-500", icon: CheckCircle },
    in_progress: { color: "bg-yellow-500/10 text-yellow-500", icon: Clock },
    completed: { color: "bg-green-500/10 text-green-500", icon: CheckCircle },
    cancelled: { color: "bg-red-500/10 text-red-500", icon: XCircle },
    declined: { color: "bg-red-500/10 text-red-500", icon: XCircle },
  };

  const priorityConfig = {
    low: "bg-gray-500/10 text-gray-500",
    normal: "bg-blue-500/10 text-blue-500",
    high: "bg-orange-500/10 text-orange-500",
    urgent: "bg-red-500/10 text-red-500",
  };

  const status = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.scheduled;
  const StatusIcon = status.icon;

  return (
    <Card className="hover-elevate" data-testid={`appointment-card-${appointment.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Badge className={status.color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {appointment.status.replace("_", " ")}
            </Badge>
            <Badge className={priorityConfig[appointment.priority as keyof typeof priorityConfig]}>
              {appointment.priority}
            </Badge>
          </div>
          {appointment.priority === "urgent" && (
            <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
          )}
        </div>

        <h3 className="font-medium mb-2">{appointment.serviceType}</h3>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{appointment.scheduledDate}</span>
            <Clock className="w-4 h-4 ml-2" />
            <span>{appointment.scheduledTime}</span>
          </div>

          {vehicle && (
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              <span>
                {vehicle.make} {vehicle.model} - {vehicle.ownerName}
              </span>
            </div>
          )}

          {serviceCenter && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{serviceCenter.name}, {serviceCenter.city}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Est. Duration: {appointment.estimatedDuration} min</span>
          </div>
        </div>

        {appointment.notes && (
          <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
            {appointment.notes}
          </p>
        )}

        {(appointment.status === "scheduled" || appointment.status === "declined") && (
          <div className="flex gap-2 mt-4">
            {onConfirm && appointment.status === "scheduled" && (
              <Button size="sm" onClick={onConfirm} data-testid="button-confirm-appointment">
                <CheckCircle className="w-3 h-3 mr-1" />
                Confirm
              </Button>
            )}
            {onReschedule && (
              <Button size="sm" variant="outline" onClick={onReschedule} data-testid="button-reschedule">
                <Calendar className="w-3 h-3 mr-1" />
                Reschedule
              </Button>
            )}
            {onCancel && appointment.status !== "cancelled" && (
              <Button size="sm" variant="ghost" onClick={onCancel} data-testid="button-cancel-appointment">
                <XCircle className="w-3 h-3 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
