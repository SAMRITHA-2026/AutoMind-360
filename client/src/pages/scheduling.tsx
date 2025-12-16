import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentCard } from "@/components/scheduling/appointment-card";
import { ServiceCenterCapacity } from "@/components/scheduling/service-center-capacity";
import { ServiceDemandChart } from "@/components/dashboard/service-demand-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import type { Appointment, Vehicle, ServiceCenter } from "@shared/schema";

export default function SchedulingPage() {
  const { toast } = useToast();

  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });

  const { data: vehicles = [] } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  const { data: serviceCenters = [] } = useQuery<ServiceCenter[]>({
    queryKey: ["/api/service-centers"],
  });

  const { data: serviceDemand = [] } = useQuery<{ date: string; predicted: number; actual?: number }[]>({
    queryKey: ["/api/service-demand"],
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/appointments/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Appointment Updated",
        description: "The appointment status has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update appointment.",
        variant: "destructive",
      });
    },
  });

  const getVehicle = (vehicleId: string) => vehicles.find((v) => v.id === vehicleId);
  const getServiceCenter = (centerId: string) => serviceCenters.find((c) => c.id === centerId);

  const scheduledAppointments = appointments.filter((a) => a.status === "scheduled");
  const confirmedAppointments = appointments.filter((a) => a.status === "confirmed");
  const completedAppointments = appointments.filter((a) => a.status === "completed");
  const urgentAppointments = appointments.filter((a) => a.priority === "urgent");

  const handleConfirm = (id: string) => {
    updateAppointmentMutation.mutate({ id, status: "confirmed" });
  };

  const handleCancel = (id: string) => {
    updateAppointmentMutation.mutate({ id, status: "cancelled" });
  };

  return (
    <div className="p-6 space-y-6" data-testid="scheduling-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Service Scheduling
          </h1>
          <p className="text-muted-foreground">Manage appointments and service center capacity</p>
        </div>
        <Button variant="outline" data-testid="button-auto-schedule">
          <RefreshCw className="w-4 h-4 mr-2" />
          Auto-Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-blue-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{scheduledAppointments.length}</p>
              <p className="text-sm text-muted-foreground">Scheduled</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{confirmedAppointments.length}</p>
              <p className="text-sm text-muted-foreground">Confirmed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedAppointments.length}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{urgentAppointments.length}</p>
              <p className="text-sm text-muted-foreground">Urgent</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All ({appointments.length})</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled ({scheduledAppointments.length})</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed ({confirmedAppointments.length})</TabsTrigger>
              <TabsTrigger value="urgent">Urgent ({urgentAppointments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-[200px]" />
                  ))}
                </div>
              ) : appointments.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">No appointments</p>
                    <p className="text-sm text-muted-foreground">No service appointments scheduled</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {appointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      vehicle={getVehicle(appointment.vehicleId)}
                      serviceCenter={getServiceCenter(appointment.serviceCenterId)}
                      onConfirm={() => handleConfirm(appointment.id)}
                      onCancel={() => handleCancel(appointment.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="scheduled" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scheduledAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    vehicle={getVehicle(appointment.vehicleId)}
                    serviceCenter={getServiceCenter(appointment.serviceCenterId)}
                    onConfirm={() => handleConfirm(appointment.id)}
                    onCancel={() => handleCancel(appointment.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="confirmed" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {confirmedAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    vehicle={getVehicle(appointment.vehicleId)}
                    serviceCenter={getServiceCenter(appointment.serviceCenterId)}
                    onCancel={() => handleCancel(appointment.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="urgent" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {urgentAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    vehicle={getVehicle(appointment.vehicleId)}
                    serviceCenter={getServiceCenter(appointment.serviceCenterId)}
                    onConfirm={() => handleConfirm(appointment.id)}
                    onCancel={() => handleCancel(appointment.id)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <ServiceCenterCapacity serviceCenters={serviceCenters} />
          <ServiceDemandChart data={serviceDemand} title="Weekly Forecast" />
        </div>
      </div>
    </div>
  );
}
