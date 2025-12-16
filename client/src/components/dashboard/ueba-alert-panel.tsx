import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, AlertTriangle, CheckCircle, XCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UebaEvent } from "@shared/schema";

interface UebaAlertPanelProps {
  events: UebaEvent[];
  onViewDetails?: (event: UebaEvent) => void;
  onResolve?: (eventId: string) => void;
}

export function UebaAlertPanel({
  events,
  onViewDetails,
  onResolve,
}: UebaAlertPanelProps) {
  const severityConfig = {
    low: { color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Shield },
    medium: { color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: AlertTriangle },
    high: { color: "bg-orange-500/10 text-orange-500 border-orange-500/20", icon: AlertTriangle },
    critical: { color: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle },
  };

  const unresolvedEvents = events.filter((e) => !e.resolved);
  const resolvedEvents = events.filter((e) => e.resolved);

  return (
    <Card data-testid="ueba-alert-panel">
      <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2 space-y-0">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">UEBA Security Monitor</CardTitle>
        </div>
        <Badge variant={unresolvedEvents.length > 0 ? "destructive" : "secondary"}>
          {unresolvedEvents.length} Active
        </Badge>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[300px] pr-4">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-center">
              <Shield className="w-12 h-12 text-green-500 mb-3" />
              <p className="text-sm font-medium">All Systems Secure</p>
              <p className="text-xs text-muted-foreground mt-1">
                No anomalies detected
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => {
                const config = severityConfig[event.severity as keyof typeof severityConfig] || severityConfig.low;
                const Icon = config.icon;

                return (
                  <div
                    key={event.id}
                    className={cn(
                      "p-3 rounded-md border",
                      event.resolved
                        ? "bg-muted/30 border-border opacity-60"
                        : config.color
                    )}
                    data-testid={`ueba-event-${event.id}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {event.eventType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            Agent: {event.agentName}
                          </p>
                          <p className="text-xs mt-1 line-clamp-2">{event.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <Badge
                          variant={event.resolved ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {event.severity}
                        </Badge>
                        {event.resolved ? (
                          <span className="text-xs text-green-500 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Resolved
                          </span>
                        ) : (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-xs"
                              onClick={() => onViewDetails?.(event)}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-xs"
                              onClick={() => onResolve?.(event.id)}
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
