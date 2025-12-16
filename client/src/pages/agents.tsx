import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentStatusCard } from "@/components/dashboard/agent-status-card";
import { ActivityLog } from "@/components/dashboard/activity-log";
import { OrchestrationFlow } from "@/components/dashboard/orchestration-flow";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, Activity, CheckCircle, AlertCircle, Cpu, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Agent, AgentActivityLog } from "@shared/schema";

export default function AgentsPage() {
  const { data: agents = [], isLoading: agentsLoading } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
    refetchInterval: 3000,
  });

  const { data: activityLogs = [] } = useQuery<AgentActivityLog[]>({
    queryKey: ["/api/activity-logs"],
    refetchInterval: 3000,
  });

  const masterAgent = agents.find((a) => a.type === "master");
  const workerAgents = agents.filter((a) => a.type !== "master");

  const activeAgents = agents.filter((a) => a.status === "active" || a.status === "busy");
  const totalTasks = agents.reduce((acc, a) => acc + a.tasksCompleted, 0);
  const healthyAgents = agents.filter((a) => a.healthStatus === "healthy");

  return (
    <div className="p-6 space-y-6" data-testid="agents-page">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bot className="w-6 h-6" />
          AI Agents
        </h1>
        <p className="text-muted-foreground">Monitor and manage intelligent agents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{agents.length}</p>
              <p className="text-sm text-muted-foreground">Total Agents</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-green-500/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeAgents.length}</p>
              <p className="text-sm text-muted-foreground">Active Now</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-blue-500/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalTasks}</p>
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-green-500/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{healthyAgents.length}/{agents.length}</p>
              <p className="text-sm text-muted-foreground">Healthy</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workers">Worker Agents</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {masterAgent && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-primary" />
                  Master Agent (Orchestrator)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-md bg-muted/30 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "w-2 h-2 rounded-full animate-pulse",
                            masterAgent.status === "active"
                              ? "bg-green-500"
                              : masterAgent.status === "busy"
                              ? "bg-yellow-500"
                              : "bg-gray-400"
                          )}
                        />
                        <span className="text-sm font-medium capitalize">{masterAgent.status}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Coordinating {workerAgents.length} worker agents
                    </p>
                  </div>
                  <div className="p-4 rounded-md bg-muted/30 border">
                    <p className="text-sm text-muted-foreground mb-2">Current Task</p>
                    <p className="text-sm font-medium">
                      {masterAgent.currentTask || "Monitoring fleet status"}
                    </p>
                  </div>
                  <div className="p-4 rounded-md bg-muted/30 border">
                    <p className="text-sm text-muted-foreground mb-2">Tasks Completed</p>
                    <p className="text-2xl font-bold">{masterAgent.tasksCompleted}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <OrchestrationFlow agents={agents} />
        </TabsContent>

        <TabsContent value="workers" className="mt-6">
          {agentsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[180px]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workerAgents.map((agent) => (
                <AgentStatusCard key={agent.id} agent={agent} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ActivityLog logs={activityLogs} maxHeight="600px" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
