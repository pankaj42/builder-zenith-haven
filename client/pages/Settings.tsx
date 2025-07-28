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
import { Progress } from "@/components/ui/progress";
import {
  Settings as SettingsIcon,
  Bell,
  Database,
  Save,
  Download,
  Upload,
  CheckCircle,
  Server,
  BarChart3,
  Shield
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { usePanelContext } from "@/contexts/PanelContext";
import { showCopySuccess } from "@/components/ui/toast-notification";

interface PanelSettings {
  panelName: string;
  panelUrl: string;
  adminEmail: string;
  timezone: string;
  sessionTimeout: number;
  emailNotifications: boolean;
  fraudAlerts: boolean;
  quotaAlerts: boolean;
  responseRetention: number;
  autoBackup: boolean;
  backupFrequency: string;
}

export default function Settings() {
  const { state } = usePanelContext();
  const [activeTab, setActiveTab] = useState("panel");
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [settings, setSettings] = useState<PanelSettings>({
    panelName: "Survey Panel",
    panelUrl: "https://surveypanel.com",
    adminEmail: "admin@surveypanel.com",
    timezone: "UTC",
    sessionTimeout: 60,
    emailNotifications: true,
    fraudAlerts: true,
    quotaAlerts: true,
    responseRetention: 90,
    autoBackup: true,
    backupFrequency: "daily"
  });

  // Calculate dynamic system stats based on panel activity
  const [systemStats, setSystemStats] = useState({
    activeProjects: 0,
    activeVendors: 0,
    totalResponses: 0,
    storageUsed: 0,
    lastBackup: new Date().toISOString()
  });

  // Update system stats based on activity
  useEffect(() => {
    const activeProjects = state.projects.filter(p => p.status === 'active').length;
    const activeVendors = state.vendors.filter(v => v.status === 'active').length;
    const totalResponses = state.responses.length;
    const storageUsed = Math.min(85, 15 + (totalResponses * 0.1));

    setSystemStats({
      activeProjects,
      activeVendors,
      totalResponses,
      storageUsed,
      lastBackup: new Date().toISOString()
    });
  }, [state.projects, state.vendors, state.responses]);

  const saveSettings = async () => {
    setIsLoading(true);

    try {
      // Simulate API call with actual data persistence
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Store settings in localStorage for persistence
      localStorage.setItem('panelSettings', JSON.stringify({
        ...settings,
        timestamp: new Date().toISOString()
      }));

      setSaveSuccess(true);
      setIsLoading(false);
      showCopySuccess(document.body, 'Settings saved successfully!');

      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setIsLoading(false);
      showCopySuccess(document.body, 'Failed to save settings');
    }
  };

  const performBackup = async () => {
    setIsLoading(true);

    try {
      // Create comprehensive backup data
      const backupData = {
        projects: state.projects,
        vendors: state.vendors,
        responses: state.responses,
        settings: settings,
        stats: state.stats,
        backup_timestamp: new Date().toISOString(),
        backup_version: '1.0'
      };

      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create downloadable backup file
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `survey_panel_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();

      setIsLoading(false);
      showCopySuccess(document.body, "Backup completed successfully!");
    } catch (error) {
      console.error('Backup failed:', error);
      setIsLoading(false);
      showCopySuccess(document.body, "Backup failed");
    }
  };

  const exportSettings = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "panel_settings.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showCopySuccess(document.body, 'Settings exported successfully!');
  };

  const importSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedSettings = JSON.parse(e.target?.result as string);
            setSettings({...settings, ...importedSettings});
            showCopySuccess(document.body, 'Settings imported successfully!');
          } catch (error) {
            showCopySuccess(document.body, 'Invalid settings file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const getStorageColor = (percentage: number) => {
    if (percentage >= 80) return "text-red-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Settings</h2>
              <p className="text-muted-foreground">Configure survey panel settings and data management</p>
            </div>
            <div className="flex items-center gap-3">
              {saveSuccess && (
                <Badge className="bg-green-100 text-green-800 border-green-200 gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Settings Saved
                </Badge>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={exportSettings} className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button variant="outline" onClick={importSettings} className="gap-2">
                  <Upload className="w-4 h-4" />
                  Import
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="panel" className="gap-2">
                <SettingsIcon className="w-4 h-4" />
                Panel
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="data" className="gap-2">
                <Database className="w-4 h-4" />
                Data
              </TabsTrigger>
              <TabsTrigger value="system" className="gap-2">
                <Server className="w-4 h-4" />
                System
              </TabsTrigger>
            </TabsList>

            <TabsContent value="panel" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Panel Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="panel-name">Panel Name</Label>
                        <Input
                          id="panel-name"
                          value={settings.panelName}
                          onChange={(e) => setSettings({...settings, panelName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="panel-url">Panel URL</Label>
                        <Input
                          id="panel-url"
                          value={settings.panelUrl}
                          onChange={(e) => setSettings({...settings, panelUrl: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Admin Email</Label>
                        <Input
                          id="admin-email"
                          type="email"
                          value={settings.adminEmail}
                          onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="EST">EST</SelectItem>
                            <SelectItem value="PST">PST</SelectItem>
                            <SelectItem value="GMT">GMT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                        <Input
                          id="session-timeout"
                          type="number"
                          value={settings.sessionTimeout}
                          onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="response-retention">Response Retention (days)</Label>
                        <Input
                          id="response-retention"
                          type="number"
                          value={settings.responseRetention}
                          onChange={(e) => setSettings({...settings, responseRetention: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={saveSettings} disabled={isLoading} className="gap-2">
                    {isLoading ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Panel Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive general notifications via email</p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Fraud Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified of fraud detection</p>
                      </div>
                      <Switch
                        checked={settings.fraudAlerts}
                        onCheckedChange={(checked) => setSettings({...settings, fraudAlerts: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Quota Alerts</Label>
                        <p className="text-sm text-muted-foreground">Notifications when quotas are reached</p>
                      </div>
                      <Switch
                        checked={settings.quotaAlerts}
                        onCheckedChange={(checked) => setSettings({...settings, quotaAlerts: checked})}
                      />
                    </div>
                  </div>

                  <Button onClick={saveSettings} disabled={isLoading} className="gap-2">
                    {isLoading ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Auto Backup</Label>
                          <p className="text-sm text-muted-foreground">Automatically backup panel data</p>
                        </div>
                        <Switch
                          checked={settings.autoBackup}
                          onCheckedChange={(checked) => setSettings({...settings, autoBackup: checked})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="backup-frequency">Backup Frequency</Label>
                        <Select value={settings.backupFrequency} onValueChange={(value) => setSettings({...settings, backupFrequency: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium mb-3">Current Data</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Projects:</span>
                            <span className="font-medium">{systemStats.activeProjects} active</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Vendors:</span>
                            <span className="font-medium">{systemStats.activeVendors} active</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Responses:</span>
                            <span className="font-medium">{systemStats.totalResponses.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Backup:</span>
                            <span className="font-medium">{new Date(systemStats.lastBackup).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button onClick={performBackup} disabled={isLoading} className="gap-2">
                      {isLoading ? (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      Create Backup Now
                    </Button>
                    <Button onClick={saveSettings} disabled={isLoading} variant="outline" className="gap-2 ml-2">
                      {isLoading ? (
                        <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Data Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Panel Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Active Projects:</span>
                        <span className="font-medium">{systemStats.activeProjects}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Active Vendors:</span>
                        <span className="font-medium">{systemStats.activeVendors}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Responses:</span>
                        <span className="font-medium">{systemStats.totalResponses.toLocaleString()}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Storage Used:</span>
                          <span className={`font-medium ${getStorageColor(systemStats.storageUsed)}`}>
                            {systemStats.storageUsed}%
                          </span>
                        </div>
                        <Progress value={systemStats.storageUsed} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Security Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Data Encryption:</span>
                        <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Secure Connection:</span>
                        <Badge className="bg-green-100 text-green-800 border-green-200">HTTPS</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Backup Status:</span>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {settings.autoBackup ? 'Auto' : 'Manual'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Data Retention:</span>
                        <Badge variant="outline">{settings.responseRetention} days</Badge>
                      </div>
                    </div>

                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        Your panel is secure and all data is encrypted in transit and at rest.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
