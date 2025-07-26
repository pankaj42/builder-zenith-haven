import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell,
  Mail,
  Globe,
  Key,
  Smartphone,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Clock,
  Database,
  Server,
  Lock,
  Palette
} from "lucide-react";
import { Link } from "react-router-dom";

interface SystemSettings {
  siteName: string;
  siteUrl: string;
  adminEmail: string;
  timezone: string;
  dateFormat: string;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  require2FA: boolean;
  allowSignups: boolean;
  maintenanceMode: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  emailVerificationRequired: boolean;
  ipWhitelisting: boolean;
  auditLogging: boolean;
  passwordExpiry: number;
  autoLogout: number;
  encryptionLevel: string;
  backupFrequency: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  fraudAlerts: boolean;
  quotaAlerts: boolean;
  systemAlerts: boolean;
  dailyReports: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  alertEmail: string;
  alertFrequency: string;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: "SurveyPanel Admin",
    siteUrl: "https://admin.surveypanel.com",
    adminEmail: "admin@surveypanel.com",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    require2FA: true,
    allowSignups: false,
    maintenanceMode: false
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: true,
    emailVerificationRequired: true,
    ipWhitelisting: false,
    auditLogging: true,
    passwordExpiry: 90,
    autoLogout: 30,
    encryptionLevel: "AES-256",
    backupFrequency: "daily"
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    fraudAlerts: true,
    quotaAlerts: true,
    systemAlerts: true,
    dailyReports: true,
    weeklyReports: true,
    monthlyReports: false,
    alertEmail: "alerts@surveypanel.com",
    alertFrequency: "immediate"
  });

  const [passwordChange, setPasswordChange] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [backupInfo] = useState({
    lastBackup: "2024-01-25T10:30:00Z",
    backupSize: "2.4 GB",
    nextScheduled: "2024-01-26T02:00:00Z",
    retentionDays: 30
  });

  const [systemStats] = useState({
    uptime: "15 days, 8 hours",
    cpuUsage: 34,
    memoryUsage: 67,
    diskUsage: 45,
    activeUsers: 3,
    totalRequests: 45892,
    errorRate: 0.2
  });

  const saveSettings = async (section: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSaveSuccess(true);
    setIsLoading(false);
    
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const changePassword = async () => {
    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      alert("New passwords don't match");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setPasswordChange({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setSaveSuccess(true);
    setIsLoading(false);
    
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const performBackup = async () => {
    setIsLoading(true);
    
    // Simulate backup process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsLoading(false);
    alert("Backup completed successfully");
  };

  const exportSettings = () => {
    const settings = {
      system: systemSettings,
      security: securitySettings,
      notifications: notificationSettings
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "surveypanel_settings.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 80) return "text-red-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-green-600";
  };

  const sidebarItems = [
    { icon: Globe, label: "Dashboard", href: "/", active: false },
    { icon: SettingsIcon, label: "Settings", href: "/settings", active: true },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">SurveyPanel</h1>
              <p className="text-xs text-sidebar-foreground/60">Admin Dashboard</p>
            </div>
          </Link>
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  item.active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Settings</h2>
              <p className="text-muted-foreground">Configure system settings, security options, and user preferences</p>
            </div>
            <div className="flex items-center gap-3">
              {saveSuccess && (
                <Badge className="bg-green-100 text-green-800 border-green-200 gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Settings Saved
                </Badge>
              )}
              <Button variant="outline" onClick={exportSettings} className="gap-2">
                <Download className="w-4 h-4" />
                Export Settings
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general" className="gap-2">
                <SettingsIcon className="w-4 h-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="w-4 h-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="account" className="gap-2">
                <User className="w-4 h-4" />
                Account
              </TabsTrigger>
              <TabsTrigger value="system" className="gap-2">
                <Server className="w-4 h-4" />
                System
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="site-name">Site Name</Label>
                        <Input
                          id="site-name"
                          value={systemSettings.siteName}
                          onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="site-url">Site URL</Label>
                        <Input
                          id="site-url"
                          value={systemSettings.siteUrl}
                          onChange={(e) => setSystemSettings({...systemSettings, siteUrl: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Admin Email</Label>
                        <Input
                          id="admin-email"
                          type="email"
                          value={systemSettings.adminEmail}
                          onChange={(e) => setSystemSettings({...systemSettings, adminEmail: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings({...systemSettings, timezone: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                            <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                            <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                            <SelectItem value="GMT">GMT (Greenwich Mean Time)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date-format">Date Format</Label>
                        <Select value={systemSettings.dateFormat} onValueChange={(value) => setSystemSettings({...systemSettings, dateFormat: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                        <Input
                          id="session-timeout"
                          type="number"
                          value={systemSettings.sessionTimeout}
                          onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">Put the system in maintenance mode</p>
                      </div>
                      <Switch
                        checked={systemSettings.maintenanceMode}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Require 2FA</Label>
                        <p className="text-sm text-muted-foreground">Require two-factor authentication for all admin users</p>
                      </div>
                      <Switch
                        checked={systemSettings.require2FA}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, require2FA: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Allow Signups</Label>
                        <p className="text-sm text-muted-foreground">Allow new admin registrations</p>
                      </div>
                      <Switch
                        checked={systemSettings.allowSignups}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, allowSignups: checked})}
                      />
                    </div>
                  </div>

                  <Button onClick={() => saveSettings('general')} disabled={isLoading} className="gap-2">
                    {isLoading ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save General Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">Enable 2FA for enhanced security</p>
                        </div>
                        <Switch
                          checked={securitySettings.twoFactorEnabled}
                          onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorEnabled: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Email Verification</Label>
                          <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                        </div>
                        <Switch
                          checked={securitySettings.emailVerificationRequired}
                          onCheckedChange={(checked) => setSecuritySettings({...securitySettings, emailVerificationRequired: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">IP Whitelisting</Label>
                          <p className="text-sm text-muted-foreground">Restrict access to approved IP addresses</p>
                        </div>
                        <Switch
                          checked={securitySettings.ipWhitelisting}
                          onCheckedChange={(checked) => setSecuritySettings({...securitySettings, ipWhitelisting: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Audit Logging</Label>
                          <p className="text-sm text-muted-foreground">Log all administrative actions</p>
                        </div>
                        <Switch
                          checked={securitySettings.auditLogging}
                          onCheckedChange={(checked) => setSecuritySettings({...securitySettings, auditLogging: checked})}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                        <Input
                          id="password-expiry"
                          type="number"
                          value={securitySettings.passwordExpiry}
                          onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="auto-logout">Auto Logout (minutes of inactivity)</Label>
                        <Input
                          id="auto-logout"
                          type="number"
                          value={securitySettings.autoLogout}
                          onChange={(e) => setSecuritySettings({...securitySettings, autoLogout: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="encryption-level">Encryption Level</Label>
                        <Select value={securitySettings.encryptionLevel} onValueChange={(value) => setSecuritySettings({...securitySettings, encryptionLevel: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AES-128">AES-128</SelectItem>
                            <SelectItem value="AES-256">AES-256</SelectItem>
                            <SelectItem value="RSA-2048">RSA-2048</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="backup-frequency">Backup Frequency</Label>
                        <Select value={securitySettings.backupFrequency} onValueChange={(value) => setSecuritySettings({...securitySettings, backupFrequency: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => saveSettings('security')} disabled={isLoading} className="gap-2">
                    {isLoading ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Security Settings
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Fraud Alerts</Label>
                          <p className="text-sm text-muted-foreground">Get notified of fraud detection</p>
                        </div>
                        <Switch
                          checked={notificationSettings.fraudAlerts}
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, fraudAlerts: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Quota Alerts</Label>
                          <p className="text-sm text-muted-foreground">Notifications when quotas are reached</p>
                        </div>
                        <Switch
                          checked={notificationSettings.quotaAlerts}
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, quotaAlerts: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">System Alerts</Label>
                          <p className="text-sm text-muted-foreground">Server and system notifications</p>
                        </div>
                        <Switch
                          checked={notificationSettings.systemAlerts}
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, systemAlerts: checked})}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Daily Reports</Label>
                          <p className="text-sm text-muted-foreground">Daily summary reports</p>
                        </div>
                        <Switch
                          checked={notificationSettings.dailyReports}
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, dailyReports: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Weekly Reports</Label>
                          <p className="text-sm text-muted-foreground">Weekly analytics reports</p>
                        </div>
                        <Switch
                          checked={notificationSettings.weeklyReports}
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, weeklyReports: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Monthly Reports</Label>
                          <p className="text-sm text-muted-foreground">Monthly summary reports</p>
                        </div>
                        <Switch
                          checked={notificationSettings.monthlyReports}
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, monthlyReports: checked})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alert-email">Alert Email Address</Label>
                        <Input
                          id="alert-email"
                          type="email"
                          value={notificationSettings.alertEmail}
                          onChange={(e) => setNotificationSettings({...notificationSettings, alertEmail: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => saveSettings('notifications')} disabled={isLoading} className="gap-2">
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

            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="current-password"
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordChange.currentPassword}
                            onChange={(e) => setPasswordChange({...passwordChange, currentPassword: e.target.value})}
                            placeholder="Enter current password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                          <Input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            value={passwordChange.newPassword}
                            onChange={(e) => setPasswordChange({...passwordChange, newPassword: e.target.value})}
                            placeholder="Enter new password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={passwordChange.confirmPassword}
                          onChange={(e) => setPasswordChange({...passwordChange, confirmPassword: e.target.value})}
                          placeholder="Confirm new password"
                        />
                      </div>
                      <Button onClick={changePassword} disabled={isLoading} className="gap-2">
                        {isLoading ? (
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <Key className="w-4 h-4" />
                        )}
                        Change Password
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium mb-3">Two-Factor Authentication</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Smartphone className="w-4 h-4 text-green-600" />
                              <span className="text-sm">Authenticator App</span>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200">Enabled</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-green-600" />
                              <span className="text-sm">Email OTP</span>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200">Enabled</Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-3">
                          Manage 2FA Settings
                        </Button>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium mb-3">Account Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Username:</span>
                            <span className="font-medium">admin</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium">admin@surveypanel.com</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Role:</span>
                            <span className="font-medium">Super Admin</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Login:</span>
                            <span className="font-medium">2024-01-25 10:30 AM</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="w-5 h-5" />
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>CPU Usage</span>
                          <span className={getUsageColor(systemStats.cpuUsage)}>{systemStats.cpuUsage}%</span>
                        </div>
                        <Progress value={systemStats.cpuUsage} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Memory Usage</span>
                          <span className={getUsageColor(systemStats.memoryUsage)}>{systemStats.memoryUsage}%</span>
                        </div>
                        <Progress value={systemStats.memoryUsage} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Disk Usage</span>
                          <span className={getUsageColor(systemStats.diskUsage)}>{systemStats.diskUsage}%</span>
                        </div>
                        <Progress value={systemStats.diskUsage} className="h-2" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Uptime:</span>
                        <span className="font-medium">{systemStats.uptime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Active Users:</span>
                        <span className="font-medium">{systemStats.activeUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Requests:</span>
                        <span className="font-medium">{systemStats.totalRequests.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Error Rate:</span>
                        <span className="font-medium text-green-600">{systemStats.errorRate}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Backup & Maintenance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Backup:</span>
                        <span className="font-medium">{new Date(backupInfo.lastBackup).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Backup Size:</span>
                        <span className="font-medium">{backupInfo.backupSize}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Next Scheduled:</span>
                        <span className="font-medium">{new Date(backupInfo.nextScheduled).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Retention:</span>
                        <span className="font-medium">{backupInfo.retentionDays} days</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button onClick={performBackup} disabled={isLoading} className="w-full gap-2">
                        {isLoading ? (
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        Create Backup Now
                      </Button>
                      <Button variant="outline" className="w-full gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Restart Services
                      </Button>
                      <Button variant="outline" className="w-full gap-2">
                        <Clock className="w-4 h-4" />
                        Schedule Maintenance
                      </Button>
                    </div>
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
