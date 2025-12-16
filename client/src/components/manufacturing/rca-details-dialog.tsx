import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Factory,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  FileText,
  Target,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RcaCapaRecord } from "@shared/schema";

interface RcaDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: RcaCapaRecord | null;
  onUpdateStatus?: (id: string, status: string) => void;
}

export function RcaDetailsDialog({
  open,
  onOpenChange,
  record,
  onUpdateStatus,
}: RcaDetailsDialogProps) {
  if (!record) return null;

  const statusConfig = {
    open: { color: "bg-red-500/10 text-red-500 border-red-500/30", icon: AlertTriangle, label: "Open" },
    in_progress: { color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30", icon: Clock, label: "In Progress" },
    closed: { color: "bg-green-500/10 text-green-500 border-green-500/30", icon: CheckCircle, label: "Closed" },
  };

  const priorityConfig = {
    low: "bg-gray-500/10 text-gray-500",
    medium: "bg-blue-500/10 text-blue-500",
    high: "bg-orange-500/10 text-orange-500",
    critical: "bg-red-500/10 text-red-500",
  };

  const status = statusConfig[record.status as keyof typeof statusConfig] || statusConfig.open;
  const StatusIcon = status.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" data-testid="rca-details-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Factory className="w-5 h-5" />
            RCA/CAPA Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={status.color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
            <Badge className={priorityConfig[record.priority as keyof typeof priorityConfig]}>
              {record.priority} priority
            </Badge>
            <Badge variant="outline">
              <Wrench className="w-3 h-3 mr-1" />
              {record.component}
            </Badge>
            <Badge variant="secondary">
              {record.occurrenceCount} occurrences
            </Badge>
          </div>

          <div className="p-4 rounded-md bg-muted/30 border">
            <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Failure Type
            </h4>
            <p className="text-sm">{record.failureType}</p>
          </div>

          <div className="p-4 rounded-md bg-muted/30 border">
            <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary" />
              Root Cause Analysis
            </h4>
            <p className="text-sm">{record.rootCause}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-md bg-blue-500/5 border border-blue-500/20">
              <h4 className="text-sm font-medium flex items-center gap-2 mb-2 text-blue-500">
                <Wrench className="w-4 h-4" />
                Corrective Action
              </h4>
              <p className="text-sm">{record.correctiveAction}</p>
            </div>
            <div className="p-4 rounded-md bg-green-500/5 border border-green-500/20">
              <h4 className="text-sm font-medium flex items-center gap-2 mb-2 text-green-500">
                <Shield className="w-4 h-4" />
                Preventive Action
              </h4>
              <p className="text-sm">{record.preventiveAction}</p>
            </div>
          </div>

          {record.affectedModels && record.affectedModels.length > 0 && (
            <div className="p-4 rounded-md bg-muted/30 border">
              <h4 className="text-sm font-medium mb-2">Affected Models</h4>
              <div className="flex flex-wrap gap-2">
                {record.affectedModels.map((model, i) => (
                  <Badge key={i} variant="outline">
                    {model}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Created: {new Date(record.createdAt).toLocaleDateString()}</span>
            {record.resolvedAt && (
              <span>Resolved: {new Date(record.resolvedAt).toLocaleDateString()}</span>
            )}
          </div>

          {record.status !== "closed" && onUpdateStatus && (
            <div className="flex gap-2 pt-2">
              {record.status === "open" && (
                <Button
                  onClick={() => onUpdateStatus(record.id, "in_progress")}
                  data-testid="button-start-rca"
                >
                  <Clock className="w-4 h-4 mr-1" />
                  Start Working
                </Button>
              )}
              {record.status === "in_progress" && (
                <Button
                  onClick={() => onUpdateStatus(record.id, "closed")}
                  data-testid="button-close-rca"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mark as Closed
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
