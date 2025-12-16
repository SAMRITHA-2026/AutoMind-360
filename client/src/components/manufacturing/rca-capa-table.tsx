import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Factory, AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RcaCapaRecord } from "@shared/schema";

interface RcaCapaTableProps {
  records: RcaCapaRecord[];
  onViewDetails?: (record: RcaCapaRecord) => void;
  onUpdateStatus?: (id: string, status: string) => void;
}

export function RcaCapaTable({
  records,
  onViewDetails,
  onUpdateStatus,
}: RcaCapaTableProps) {
  const statusConfig = {
    open: { color: "bg-red-500/10 text-red-500", icon: AlertTriangle },
    in_progress: { color: "bg-yellow-500/10 text-yellow-500", icon: Clock },
    closed: { color: "bg-green-500/10 text-green-500", icon: CheckCircle },
  };

  const priorityConfig = {
    low: "bg-gray-500/10 text-gray-500",
    medium: "bg-blue-500/10 text-blue-500",
    high: "bg-orange-500/10 text-orange-500",
    critical: "bg-red-500/10 text-red-500",
  };

  return (
    <Card data-testid="rca-capa-table">
      <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2 space-y-0">
        <div className="flex items-center gap-2">
          <Factory className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">RCA/CAPA Analysis</CardTitle>
        </div>
        <Badge variant="secondary">
          {records.filter((r) => r.status === "open").length} Open Issues
        </Badge>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Component</TableHead>
                <TableHead>Failure Type</TableHead>
                <TableHead className="hidden md:table-cell">Root Cause</TableHead>
                <TableHead className="text-center">Count</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Factory className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No RCA/CAPA records found</p>
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => {
                  const status = statusConfig[record.status as keyof typeof statusConfig] || statusConfig.open;
                  const StatusIcon = status.icon;

                  return (
                    <TableRow key={record.id} data-testid={`rca-row-${record.id}`}>
                      <TableCell className="font-medium">{record.component}</TableCell>
                      <TableCell>{record.failureType}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                        {record.rootCause}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{record.occurrenceCount}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityConfig[record.priority as keyof typeof priorityConfig]}>
                          {record.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {record.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onViewDetails?.(record)}
                          data-testid={`button-view-rca-${record.id}`}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
