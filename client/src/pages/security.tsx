import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UebaAlertPanel } from "@/components/dashboard/ueba-alert-panel";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Shield, AlertTriangle, CheckCircle, Eye, Activity, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UebaEvent, Agent } from "@shared/schema";

export default function SecurityPage() {
  const { toast } = useToast();

  const { data: uebaEvents = [] } = useQuery<UebaEvent[]>({
    queryKey: ["/api/ueba-events"],
    refetchInterval: 5000,
  });

  const { data: agents = [] } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const resolveEventMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("PATCH", `/api/ueba-events/${id}`, { resolved: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ueba-events"] });
      toast({ title: "Event Resolved", description: "The security event has been marked as resolved." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to resolve event.", variant: "destructive" });
    },
  });

  const unresolvedEvents = uebaEvents.filter((e) => !e.resolved);
  const resolvedEvents = uebaEvents.filter((e) => e.resolved);
  const criticalEvents = uebaEvents.filter((e) => e.severity === "critical" && !e.resolved);

  const severityConfig = {
    low: { color: "bg-blue-500/10 text-blue-500", count: uebaEvents.filter((e) => e.severity === "low").length },
    medium: { color: "bg-yellow-500/10 text-yellow-500", count: uebaEvents.filter((e) => e.severity === "medium").length },
    high: { color: "bg-orange-500/10 text-orange-500", count: uebaEvents.filter((e) => e.severity === "high").length },
    critical: { color: "bg-red-500/10 text-red-500", count: uebaEvents.filter((e) => e.severity === "critical").length },
  };

  return (
    <div className="p-6 space-y-6" data-testid="security-page">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6" />
          UEBA Security Monitor
        </h1>
        <p className="text-muted-foreground">User and Entity Behavior Analytics for AI Agents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{unresolvedEvents.length}</p>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{criticalEvents.length}</p>
              <p className="text-sm text-muted-foreground">Critical</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{resolvedEvents.length}</p>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-green-500/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{agents.filter((a) => a.healthStatus === "healthy").length}/{agents.length}</p>
              <p className="text-sm text-muted-foreground">Agents Healthy</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Events ({uebaEvents.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({unresolvedEvents.length})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({resolvedEvents.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <div className="p-4 space-y-3">
                      {uebaEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[300px] text-center">
                          <Shield className="w-12 h-12 text-green-500 mb-3" />
                          <p className="text-lg font-medium">All Systems Secure</p>
                          <p className="text-sm text-muted-foreground">No security events detected</p>
                        </div>
                      ) : (
                        uebaEvents.map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              "p-4 rounded-md border",
                              event.resolved ? "bg-muted/30 opacity-60" : severityConfig[event.severity as keyof typeof severityConfig]?.color || "bg-muted"
                            )}
                            data-testid={`security-event-${event.id}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">
                                    {event.eventType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                  </h4>
                                  <Badge variant="outline" className="text-xs">{event.severity}</Badge>
                                  {event.resolved && <Badge variant="secondary" className="text-xs">Resolved</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">Agent: {event.agentName}</p>
                                <p className="text-sm">{event.description}</p>
                                {event.actionTaken && (
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Action: {event.actionTaken}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-2">
                                  {new Date(event.timestamp).toLocaleString()}
                                </p>
                              </div>
                              {!event.resolved && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => resolveEventMutation.mutate(event.id)}
                                  data-testid={`button-resolve-${event.id}`}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Resolve
                                </Button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="active" className="mt-4">
              <UebaAlertPanel
                events={unresolvedEvents}
                onResolve={(id) => resolveEventMutation.mutate(id)}
              />
            </TabsContent>

            <TabsContent value="resolved" className="mt-4">
              <UebaAlertPanel events={resolvedEvents} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Agent Security Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-3 rounded-md bg-muted/30 border"
                  >
                    <div className="flex items-center gap-2">
                      {agent.healthStatus === "healthy" ? (
                        <Lock className="w-4 h-4 text-green-500" />
                      ) : (
                        <Unlock className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className="text-sm font-medium">{agent.name}</span>
                    </div>
                    <Badge
                      className={cn(
                        agent.healthStatus === "healthy"
                          ? "bg-green-500/10 text-green-500"
                          : agent.healthStatus === "warning"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-red-500/10 text-red-500"
                      )}
                    >
                      {agent.healthStatus}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Severity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(severityConfig).map(([severity, config]) => (
                  <div key={severity} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", config.color.replace("/10", ""))} />
                      <span className="text-sm capitalize">{severity}</span>
                    </div>
                    <Badge variant="outline">{config.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
