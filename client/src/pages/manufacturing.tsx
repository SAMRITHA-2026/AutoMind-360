import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RcaCapaTable } from "@/components/manufacturing/rca-capa-table";
import { RcaDetailsDialog } from "@/components/manufacturing/rca-details-dialog";
import { QualityInsightsPanel } from "@/components/manufacturing/quality-insights-panel";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Factory, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import type { RcaCapaRecord, PredictedFailure } from "@shared/schema";

export default function ManufacturingPage() {
  const { toast } = useToast();
  const [selectedRecord, setSelectedRecord] = useState<RcaCapaRecord | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const { data: rcaRecords = [] } = useQuery<RcaCapaRecord[]>({
    queryKey: ["/api/rca-capa"],
  });

  const { data: predictions = [] } = useQuery<PredictedFailure[]>({
    queryKey: ["/api/predictions"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/rca-capa/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rca-capa"] });
      toast({ title: "Status Updated", description: "RCA/CAPA record has been updated." });
      setDetailsDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    },
  });

  const handleViewDetails = (record: RcaCapaRecord) => {
    setSelectedRecord(record);
    setDetailsDialogOpen(true);
  };

  const openRecords = rcaRecords.filter((r) => r.status === "open");
  const inProgressRecords = rcaRecords.filter((r) => r.status === "in_progress");
  const closedRecords = rcaRecords.filter((r) => r.status === "closed");

  return (
    <div className="p-6 space-y-6" data-testid="manufacturing-page">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Factory className="w-6 h-6" />
          Manufacturing Insights
        </h1>
        <p className="text-muted-foreground">RCA/CAPA analysis and quality improvement feedback</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{openRecords.length}</p>
              <p className="text-sm text-muted-foreground">Open Issues</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inProgressRecords.length}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{closedRecords.length}</p>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{rcaRecords.length}</p>
              <p className="text-sm text-muted-foreground">Total Records</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Records</TabsTrigger>
              <TabsTrigger value="open">Open ({openRecords.length})</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress ({inProgressRecords.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <RcaCapaTable records={rcaRecords} onViewDetails={handleViewDetails} />
            </TabsContent>

            <TabsContent value="open" className="mt-4">
              <RcaCapaTable records={openRecords} onViewDetails={handleViewDetails} />
            </TabsContent>

            <TabsContent value="in_progress" className="mt-4">
              <RcaCapaTable records={inProgressRecords} onViewDetails={handleViewDetails} />
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <QualityInsightsPanel rcaRecords={rcaRecords} predictedFailures={predictions} />
        </div>
      </div>

      <RcaDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        record={selectedRecord}
        onUpdateStatus={(id, status) => updateStatusMutation.mutate({ id, status })}
      />
    </div>
  );
}
