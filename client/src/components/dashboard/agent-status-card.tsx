import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Activity, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Agent } from "@shared/schema";

interface AgentStatusCardProps {
  agent: Agent;
}

export function AgentStatusCard({ agent }: AgentStatusCardProps) {
  const statusConfig = {
    idle: { color: "bg-gray-400", label: "Idle", icon: Clock },
    active: { color: "bg-green-500", label: "Active", icon: Activity },
    busy: { color: "bg-yellow-500", label: "Busy", icon: Activity },
    error: { color: "bg-red-500", label: "Error", icon: AlertCircle },
  };

  const healthConfig = {
    healthy: { color: "text-green-500", bgColor: "bg-green-500/10" },
    warning: { color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
    critical: { color: "text-red-500", bgColor: "bg-red-500/10" },
  };

  const status = statusConfig[agent.status as keyof typeof statusConfig] || statusConfig.idle;
  const health = healthConfig[agent.healthStatus as keyof typeof healthConfig] || healthConfig.healthy;
  const StatusIcon = status.icon;

  const agentTypeLabels: Record<string, string> = {
    master: "Master Orchestrator",
    data_analysis: "Data Analysis",
    diagnosis: "Diagnosis",
    customer_engagement: "Customer Engagement",
    scheduling: "Scheduling",
    feedback: "Feedback",
    manufacturing_insights: "Manufacturing Insights",
  };

  return (
    <Card
      className="hover-elevate transition-all"
      data-testid={`agent-card-${agent.id}`}
    >
      <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2 space-y-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn("w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0", health.bgColor)}>
            <Bot className={cn("w-5 h-5", health.color)} />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base font-medium truncate">{agent.name}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {agentTypeLabels[agent.type] || agent.type}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={cn("w-2 h-2 rounded-full animate-pulse", status.color)} />
          <span className="text-xs text-muted-foreground">{status.label}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {agent.currentTask && (
          <div className="mb-3 p-2 rounded-md bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Current Task</p>
            <p className="text-sm truncate">{agent.currentTask}</p>
          </div>
        )}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{agent.tasksCompleted} tasks completed</span>
          </div>
          {agent.lastActiveAt && (
            <span className="text-muted-foreground truncate">
              Last: {new Date(agent.lastActiveAt).toLocaleTimeString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
