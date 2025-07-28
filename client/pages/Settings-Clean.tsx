import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Download,
  Save,
  CheckCircle,
  AlertTriangle,
  Clock,
  Database,
  Activity
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { usePanelContext } from "@/contexts/PanelContext";
import { showCopySuccess } from "@/components/ui/toast-notification";

interface PanelSettings {
  panelName: string;
  adminEmail: string;
  timezone: string;
  autoBackup: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
}

interface NotificationSettings {
  emailNotifications: boolean;
  fraudAlerts: boolean;
  quotaAlerts: boolean;
  dailyReports: boolean;
  alertEmail: string;
}

export default function Settings() {
  const { state } = usePanelContext();
  const [isLoading, setIsLoading] = useState(false);

  const [panelSettings, setPanelSettings] = useState<PanelSettings>({
    panelName: "My Survey Panel",
    adminEmail: "admin@surveypanel.com",
    timezone: "UTC",
    autoBackup: true,
    sessionTimeout: 60,
    maxLoginAttempts: 5
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    fraudAlerts: true,
    quotaAlerts: true,
    dailyReports: true,
    alertEmail: "alerts@surveypanel.com"
  });

  // Calculate dynamic system stats from panel data
  const systemStats = {
    totalProjects: state.projects.length,
    activeProjects: state.projects.filter(p => p.status === 'active').length,
    totalVendors: state.vendors.length,
    activeVendors: state.vendors.filter(v => v.status === 'active').length,
    totalResponses: state.responses.length,
    todayResponses: state.responses.filter(r => {
      const today = new Date().toISOString().split('T')[0];
      return r.timestamp.startsWith(today);
    }).length,
    completionRate: state.stats.overallCompletionRate,
    totalEarnings: state.stats.totalEarnings
  };

  const saveSettings = async (settingsType: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showCopySuccess(document.body, `${settingsType} settings saved!`);
    } catch (error) {
      showCopySuccess(document.body, 'Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async () => {
    setIsLoading(true);
    try {
      const data = {
        projects: state.projects,
        vendors: state.vendors,
        responses: state.responses,
        exportDate: new Date().toISOString()
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `survey_panel_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();

      showCopySuccess(document.body, "Data exported successfully!");
    } catch (error) {
      showCopySuccess(document.body, "Export failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Panel Settings</h2>
              <p className="text-muted-foreground">Configure your survey panel settings and preferences</p>
            </div>
            <Badge variant="outline" className="gap-1">
              <Activity className="w-3 h-3" />
              {systemStats.activeProjects} Active Projects
            </Badge>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="data">Data & Backup</TabsTrigger>
              <TabsTrigger value="stats">System Stats</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5" />
                    Panel Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="panel-name">Panel Name</Label>
                      <Input
                        id="panel-name"
                        value={panelSettings.panelName}
                        onChange={(e) => setPanelSettings(prev => ({ ...prev, panelName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Admin Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        value={panelSettings.adminEmail}
                        onChange={(e) => setPanelSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={panelSettings.timezone} onValueChange={(value) => setPanelSettings(prev => ({ ...prev, timezone: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="Europe/London">London</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input
                        id="session-timeout"
                        type="number"
                        value={panelSettings.sessionTimeout}
                        onChange={(e) => setPanelSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 60 }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto Backup</Label>
                        <p className="text-sm text-muted-foreground">Automatically backup data daily</p>
                      </div>
                      <Switch
                        checked={panelSettings.autoBackup}
                        onCheckedChange={(checked) => setPanelSettings(prev => ({ ...prev, autoBackup: checked }))}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => saveSettings('Panel')}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save General Settings'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="alert-email">Alert Email Address</Label>
                    <Input
                      id="alert-email"
                      type="email"
                      value={notificationSettings.alertEmail}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, alertEmail: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">General email notifications</p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Fraud Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified about suspicious activity</p>
                      </div>
                      <Switch
                        checked={notificationSettings.fraudAlerts}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, fraudAlerts: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Quota Alerts</Label>
                        <p className="text-sm text-muted-foreground">Alerts when quotas are reached</p>
                      </div>
                      <Switch
                        checked={notificationSettings.quotaAlerts}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, quotaAlerts: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Daily Reports</Label>
                        <p className="text-sm text-muted-foreground">Receive daily performance reports</p>
                      </div>
                      <Switch
                        checked={notificationSettings.dailyReports}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, dailyReports: checked }))}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => saveSettings('Notification')}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Notification Settings'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data & Backup */}
            <TabsContent value="data" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your data is automatically backed up daily. Last backup: {new Date().toLocaleDateString()}
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Data Summary</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Projects:</span>
                          <span className="font-mono">{systemStats.totalProjects}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vendors:</span>
                          <span className="font-mono">{systemStats.totalVendors}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Responses:</span>
                          <span className="font-mono">{systemStats.totalResponses.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Export Options</h4>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          onClick={exportData}
                          disabled={isLoading}
                          className="w-full justify-start"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {isLoading ? 'Exporting...' : 'Export All Data (JSON)'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Stats */}
            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold">{systemStats.activeProjects}</div>
                        <div className="text-sm text-muted-foreground">Active Projects</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="text-2xl font-bold">{systemStats.activeVendors}</div>
                        <div className="text-sm text-muted-foreground">Active Vendors</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="text-2xl font-bold">{systemStats.todayResponses}</div>
                        <div className="text-sm text-muted-foreground">Today's Responses</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-orange-600" />
                      <div>
                        <div className="text-2xl font-bold">{systemStats.completionRate.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">Completion Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>System Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Panel Activity</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Total Responses:</span>
                            <span className="font-mono">{systemStats.totalResponses.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Earnings:</span>
                            <span className="font-mono text-green-600">${systemStats.totalEarnings.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Overall CR:</span>
                            <span className="font-mono">{systemStats.completionRate.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">System Health</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">All systems operational</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Data backup up to date</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Security measures active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
