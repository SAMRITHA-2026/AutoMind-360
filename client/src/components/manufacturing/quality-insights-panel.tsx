import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RcaCapaRecord, PredictedFailure } from "@shared/schema";

interface QualityInsightsPanelProps {
  rcaRecords: RcaCapaRecord[];
  predictedFailures: PredictedFailure[];
}

interface Insight {
  type: "warning" | "improvement" | "success";
  title: string;
  description: string;
  metric?: string;
  component?: string;
}

export function QualityInsightsPanel({
  rcaRecords,
  predictedFailures,
}: QualityInsightsPanelProps) {
  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];

    const componentFailures = predictedFailures.reduce((acc, f) => {
      acc[f.component] = (acc[f.component] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostFailedComponent = Object.entries(componentFailures).sort((a, b) => b[1] - a[1])[0];

    if (mostFailedComponent && mostFailedComponent[1] >= 2) {
      insights.push({
        type: "warning",
        title: "Recurring Component Issue",
        description: `${mostFailedComponent[0]} shows ${mostFailedComponent[1]} predicted failures across fleet. Consider design review.`,
        metric: `${mostFailedComponent[1]} vehicles affected`,
        component: mostFailedComponent[0],
      });
    }

    const openRcas = rcaRecords.filter((r) => r.status === "open");
    const criticalRcas = openRcas.filter((r) => r.priority === "critical" || r.priority === "high");

    if (criticalRcas.length > 0) {
      insights.push({
        type: "warning",
        title: "Critical Quality Issues Pending",
        description: `${criticalRcas.length} high-priority RCA/CAPA items require immediate attention from manufacturing team.`,
        metric: `${criticalRcas.length} critical issues`,
      });
    }

    const closedRcas = rcaRecords.filter((r) => r.status === "closed");
    if (closedRcas.length > 0) {
      insights.push({
        type: "success",
        title: "Quality Improvements Implemented",
        description: `${closedRcas.length} corrective actions have been successfully closed and verified.`,
        metric: `${closedRcas.length} resolved`,
      });
    }

    const criticalFailures = predictedFailures.filter((f) => f.riskLevel === "critical");
    if (criticalFailures.length > 0) {
      insights.push({
        type: "warning",
        title: "Immediate Attention Required",
        description: `${criticalFailures.length} vehicles have critical failure predictions requiring urgent service scheduling.`,
        metric: `${criticalFailures.length} critical`,
      });
    }

    const lowRiskVehicles = new Set(predictedFailures.filter((f) => f.riskLevel === "low").map((f) => f.vehicleId));
    if (lowRiskVehicles.size > 0) {
      insights.push({
        type: "improvement",
        title: "Fleet Health Trend",
        description: `${lowRiskVehicles.size} vehicles show excellent health with only minor maintenance needs.`,
        metric: `${lowRiskVehicles.size} healthy`,
      });
    }

    return insights.slice(0, 5);
  };

  const insights = generateInsights();

  const getIcon = (type: Insight["type"]) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "improvement":
        return <TrendingUp className="w-4 h-4" />;
      case "success":
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getColors = (type: Insight["type"]) => {
    switch (type) {
      case "warning":
        return "border-yellow-500/30 bg-yellow-500/5";
      case "improvement":
        return "border-blue-500/30 bg-blue-500/5";
      case "success":
        return "border-green-500/30 bg-green-500/5";
    }
  };

  const getIconColors = (type: Insight["type"]) => {
    switch (type) {
      case "warning":
        return "text-yellow-500 bg-yellow-500/10";
      case "improvement":
        return "text-blue-500 bg-blue-500/10";
      case "success":
        return "text-green-500 bg-green-500/10";
    }
  };

  return (
    <Card data-testid="quality-insights-panel">
      <CardHeader className="pb-3 flex flex-row items-center gap-2 space-y-0">
        <Lightbulb className="w-5 h-5 text-primary" />
        <CardTitle className="text-lg">Manufacturing Quality Insights</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-center">
            <Lightbulb className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              No insights available yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-md border",
                  getColors(insight.type)
                )}
                data-testid={`insight-${index}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0",
                      getIconColors(insight.type)
                    )}
                  >
                    {getIcon(insight.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium">{insight.title}</h4>
                      {insight.metric && (
                        <Badge variant="outline" className="flex-shrink-0 text-xs">
                          {insight.metric}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {insight.description}
                    </p>
                    {insight.component && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {insight.component}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
