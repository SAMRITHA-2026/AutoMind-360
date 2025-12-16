import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/lib/theme-provider";
import { Settings, Bell, Shield, Bot, Database, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  const { theme } = useTheme();

  return (
    <div className="p-6 space-y-6" data-testid="settings-page">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Settings
        </h1>
        <p className="text-muted-foreground">Configure system preferences and notifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize the dashboard appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
              </div>
              <ThemeToggle />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Current Theme</Label>
                <p className="text-sm text-muted-foreground">Active theme setting</p>
              </div>
              <span className="text-sm font-medium capitalize">{theme}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure alert preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Critical Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive critical failure notifications</p>
              </div>
              <Switch defaultChecked data-testid="switch-critical-alerts" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>UEBA Alerts</Label>
                <p className="text-sm text-muted-foreground">Security event notifications</p>
              </div>
              <Switch defaultChecked data-testid="switch-ueba-alerts" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Appointment Reminders</Label>
                <p className="text-sm text-muted-foreground">Service scheduling notifications</p>
              </div>
              <Switch defaultChecked data-testid="switch-appointment-alerts" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Agent Configuration
            </CardTitle>
            <CardDescription>Configure AI agent behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-Scheduling</Label>
                <p className="text-sm text-muted-foreground">Automatically schedule appointments</p>
              </div>
              <Switch defaultChecked data-testid="switch-auto-scheduling" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Proactive Outreach</Label>
                <p className="text-sm text-muted-foreground">AI-initiated customer contact</p>
              </div>
              <Switch defaultChecked data-testid="switch-proactive-outreach" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Manufacturing Feedback</Label>
                <p className="text-sm text-muted-foreground">Auto-generate quality insights</p>
              </div>
              <Switch defaultChecked data-testid="switch-manufacturing-feedback" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
            <CardDescription>UEBA and security configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>UEBA Monitoring</Label>
                <p className="text-sm text-muted-foreground">Enable behavior analytics</p>
              </div>
              <Switch defaultChecked data-testid="switch-ueba-monitoring" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-Block Anomalies</Label>
                <p className="text-sm text-muted-foreground">Automatically block suspicious agents</p>
              </div>
              <Switch data-testid="switch-auto-block" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Audit Logging</Label>
                <p className="text-sm text-muted-foreground">Log all agent actions</p>
              </div>
              <Switch defaultChecked data-testid="switch-audit-logging" />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="w-5 h-5" />
              System Information
            </CardTitle>
            <CardDescription>System status and data management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-md bg-muted/30 border">
                <p className="text-sm text-muted-foreground">System Version</p>
                <p className="text-lg font-semibold">AutoMind 360 v1.0.0</p>
              </div>
              <div className="p-4 rounded-md bg-muted/30 border">
                <p className="text-sm text-muted-foreground">Last Data Sync</p>
                <p className="text-lg font-semibold">{new Date().toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-md bg-muted/30 border">
                <p className="text-sm text-muted-foreground">API Status</p>
                <p className="text-lg font-semibold text-green-500">Connected</p>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" data-testid="button-refresh-data">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh System Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
