import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentActivityLog } from "@shared/schema";

interface ActivityLogProps {
  logs: AgentActivityLog[];
  maxHeight?: string;
}

export function ActivityLog({ logs, maxHeight = "400px" }: ActivityLogProps) {
  const getIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
    ) : (
      <XCircle className="w-3.5 h-3.5 text-red-500" />
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <Card data-testid="activity-log">
      <CardHeader className="pb-3 flex flex-row items-center gap-2 space-y-0">
        <Activity className="w-5 h-5 text-primary" />
        <CardTitle className="text-lg">Agent Activity Log</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea style={{ height: maxHeight }} className="pr-4">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-center">
              <Clock className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No activity yet</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-[7px] top-0 bottom-0 w-px bg-border" />
              <div className="space-y-3">
                {logs.map((log, index) => (
                  <div
                    key={log.id}
                    className="flex gap-3 relative"
                    data-testid={`activity-log-${log.id}`}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center z-10",
                        log.success ? "bg-green-500/20" : "bg-red-500/20"
                      )}
                    >
                      {getIcon(log.success)}
                    </div>
                    <div className="flex-1 min-w-0 pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{log.action}</p>
                          <p className="text-xs text-muted-foreground">{log.agentName}</p>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatTime(log.timestamp)}
                        </span>
                      </div>
                      {log.details && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {log.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
