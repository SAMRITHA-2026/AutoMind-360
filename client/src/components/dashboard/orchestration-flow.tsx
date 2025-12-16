import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, ArrowRight, Cpu, Database, MessageSquare, Calendar, Factory, Shield, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Agent } from "@shared/schema";

interface OrchestrationFlowProps {
  agents: Agent[];
}

const agentIcons: Record<string, React.ElementType> = {
  master: Cpu,
  data_analysis: Database,
  diagnosis: Bot,
  customer_engagement: MessageSquare,
  scheduling: Calendar,
  feedback: ThumbsUp,
  manufacturing_insights: Factory,
};

export function OrchestrationFlow({ agents }: OrchestrationFlowProps) {
  const masterAgent = agents.find((a) => a.type === "master");
  const workerAgents = agents.filter((a) => a.type !== "master");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "border-green-500 bg-green-500/10";
      case "busy":
        return "border-yellow-500 bg-yellow-500/10";
      case "error":
        return "border-red-500 bg-red-500/10";
      default:
        return "border-border bg-muted/30";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "busy":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <Card data-testid="orchestration-flow">
      <CardHeader className="pb-3 flex flex-row items-center gap-2 space-y-0">
        <Cpu className="w-5 h-5 text-primary" />
        <CardTitle className="text-lg">Agent Orchestration</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col items-center">
          {masterAgent && (
            <div
              className={cn(
                "p-4 rounded-md border-2 mb-4 w-full max-w-xs text-center",
                getStatusColor(masterAgent.status)
              )}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Cpu className="w-5 h-5 text-primary" />
                <span className="font-semibold">Master Agent</span>
                <span className={cn("w-2 h-2 rounded-full animate-pulse", getStatusDot(masterAgent.status))} />
              </div>
              <p className="text-xs text-muted-foreground">{masterAgent.currentTask || "Orchestrating workers"}</p>
            </div>
          )}

          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-border" />
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="h-px w-8 bg-border" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
            {workerAgents.map((agent) => {
              const Icon = agentIcons[agent.type] || Bot;
              return (
                <div
                  key={agent.id}
                  className={cn(
                    "p-3 rounded-md border text-center",
                    getStatusColor(agent.status)
                  )}
                  data-testid={`flow-agent-${agent.type}`}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1.5">
                    <Icon className="w-4 h-4" />
                    <span className={cn("w-1.5 h-1.5 rounded-full", getStatusDot(agent.status))} />
                  </div>
                  <p className="text-xs font-medium truncate">{agent.name.replace(" Agent", "")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{agent.tasksCompleted} tasks</p>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
