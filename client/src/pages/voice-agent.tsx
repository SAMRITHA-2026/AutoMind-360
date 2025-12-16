import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInterface } from "@/components/voice-agent/chat-interface";
import { VehicleHealthCard } from "@/components/dashboard/vehicle-health-card";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { MessageSquare, Phone, Car, User, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Vehicle, ChatMessage, TelematicsData, PredictedFailure } from "@shared/schema";

export default function VoiceAgentPage() {
  const { toast } = useToast();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);

  const { data: vehicles = [] } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  const { data: telematics = [] } = useQuery<TelematicsData[]>({
    queryKey: ["/api/telematics"],
  });

  const { data: predictions = [] } = useQuery<PredictedFailure[]>({
    queryKey: ["/api/predictions"],
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/voice-agent/chat", {
        sessionId,
        vehicleId: selectedVehicle?.id,
        message,
      });
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        sessionId,
        vehicleId: selectedVehicle?.id || null,
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to get response from voice agent.", variant: "destructive" });
      setIsLoading(false);
    },
  });

  const handleSendMessage = (message: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sessionId,
      vehicleId: selectedVehicle?.id || null,
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    chatMutation.mutate(message);
  };

  const handleStartCall = () => {
    if (!selectedVehicle) {
      toast({ title: "Select a Vehicle", description: "Please select a vehicle to start the call.", variant: "destructive" });
      return;
    }
    setIsCallActive(true);
    const systemMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sessionId,
      vehicleId: selectedVehicle.id,
      role: "assistant",
      content: `Hello ${selectedVehicle.ownerName}, this is AutoMind 360 calling about your ${selectedVehicle.make} ${selectedVehicle.model}. I've been monitoring your vehicle's health and wanted to discuss some important maintenance recommendations with you. How are you today?`,
      timestamp: new Date().toISOString(),
    };
    setMessages([systemMessage]);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    toast({ title: "Call Ended", description: "The customer engagement session has ended." });
  };

  const getVehicleTelematics = (vehicleId: string) => telematics.find((t) => t.vehicleId === vehicleId);
  const getVehiclePredictions = (vehicleId: string) => predictions.filter((p) => p.vehicleId === vehicleId);

  const vehiclesWithIssues = vehicles.filter((v) => {
    const preds = getVehiclePredictions(v.id);
    return preds.some((p) => p.riskLevel === "high" || p.riskLevel === "critical");
  });

  return (
    <div className="p-6 space-y-6" data-testid="voice-agent-page">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          Customer Engagement Agent
        </h1>
        <p className="text-muted-foreground">Voice-based customer communication for maintenance recommendations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <div className="lg:col-span-2 h-full">
          <ChatInterface
            messages={messages}
            vehicle={selectedVehicle || undefined}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            isCallActive={isCallActive}
            onStartCall={handleStartCall}
            onEndCall={handleEndCall}
          />
        </div>

        <div className="space-y-6 overflow-auto">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Car className="w-5 h-5" />
                Select Vehicle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {vehicles.map((vehicle) => {
                    const preds = getVehiclePredictions(vehicle.id);
                    const hasCritical = preds.some((p) => p.riskLevel === "critical" || p.riskLevel === "high");

                    return (
                      <div
                        key={vehicle.id}
                        className={cn(
                          "p-3 rounded-md border cursor-pointer transition-all hover-elevate",
                          selectedVehicle?.id === vehicle.id
                            ? "border-primary bg-primary/5"
                            : "border-border",
                          hasCritical && "border-red-500/50"
                        )}
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setMessages([]);
                          setIsCallActive(false);
                        }}
                        data-testid={`select-vehicle-${vehicle.id}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">
                              {vehicle.make} {vehicle.model}
                            </p>
                            <p className="text-xs text-muted-foreground">{vehicle.ownerName}</p>
                            <p className="text-xs text-muted-foreground">{vehicle.ownerPhone}</p>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={cn(
                                vehicle.healthScore >= 80
                                  ? "bg-green-500/10 text-green-500"
                                  : vehicle.healthScore >= 60
                                  ? "bg-yellow-500/10 text-yellow-500"
                                  : "bg-red-500/10 text-red-500"
                              )}
                            >
                              {vehicle.healthScore.toFixed(0)}%
                            </Badge>
                            {hasCritical && (
                              <AlertTriangle className="w-4 h-4 text-red-500 mt-1 ml-auto" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {vehiclesWithIssues.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Priority Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Vehicles requiring urgent customer contact:
                </p>
                <div className="space-y-2">
                  {vehiclesWithIssues.slice(0, 3).map((vehicle) => (
                    <Button
                      key={vehicle.id}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setMessages([]);
                        setIsCallActive(false);
                      }}
                      data-testid={`priority-vehicle-${vehicle.id}`}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {vehicle.ownerName} - {vehicle.make} {vehicle.model}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
