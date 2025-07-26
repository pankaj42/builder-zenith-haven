import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Users, 
  Target, 
  AlertTriangle, 
  TrendingUp,
  Shield,
  Globe,
  Settings,
  FolderOpen,
  UserCheck,
  RotateCcw,
  Database,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardStats {
  totalCompletes: number;
  totalTerminates: number;
  totalQuotaFull: number;
  activeProjects: number;
  activeVendors: number;
  fraudAlerts: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCompletes: 1247,
    totalTerminates: 532,
    totalQuotaFull: 89,
    activeProjects: 12,
    activeVendors: 8,
    fraudAlerts: 3
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalCompletes: prev.totalCompletes + Math.floor(Math.random() * 3),
        totalTerminates: prev.totalTerminates + Math.floor(Math.random() * 2),
        totalQuotaFull: prev.totalQuotaFull + Math.floor(Math.random() * 1),
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", href: "/", active: true },
    { icon: FolderOpen, label: "Projects", href: "/projects" },
    { icon: Users, label: "Vendors", href: "/vendors" },
    { icon: RotateCcw, label: "Redirects", href: "/redirects" },
    { icon: Database, label: "Responses", href: "/responses" },
    { icon: Target, label: "Quotas", href: "/quotas" },
    { icon: Shield, label: "Fraud Prevention", href: "/fraud" },
    { icon: Activity, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">SurveyPanel</h1>
              <p className="text-xs text-sidebar-foreground/60">Admin Dashboard</p>
            </div>
          </div>
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
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
              <p className="text-muted-foreground">Real-time survey management and analytics</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live
              </Badge>
              <Button variant="outline" size="sm">
                <UserCheck className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Total Completes</CardTitle>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">{stats.totalCompletes.toLocaleString()}</div>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-800">Total Terminates</CardTitle>
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900">{stats.totalTerminates.toLocaleString()}</div>
                <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +8% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Total Quota Full</CardTitle>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{stats.totalQuotaFull.toLocaleString()}</div>
                <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +5% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <FolderOpen className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeProjects}</div>
                <p className="text-xs text-muted-foreground">2 new this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
                <UserCheck className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeVendors}</div>
                <p className="text-xs text-muted-foreground">All verified</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-800">Fraud Alerts</CardTitle>
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-900">{stats.fraudAlerts}</div>
                <p className="text-xs text-red-600">Requires attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Responses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { pid: "P12345", uid: "P12345-00187-XY9", status: "Complete", ip: "192.168.1.1", time: "2 min ago" },
                    { pid: "P12346", uid: "P12346-00098-AB3", status: "Terminate", ip: "10.0.0.1", time: "3 min ago" },
                    { pid: "P12345", uid: "P12345-00188-CD7", status: "Complete", ip: "172.16.0.1", time: "5 min ago" },
                    { pid: "P12347", uid: "P12347-00056-EF1", status: "Quota Full", ip: "203.0.113.1", time: "7 min ago" },
                  ].map((response, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-mono text-sm">{response.uid}</div>
                        <div className="text-xs text-muted-foreground">{response.ip} • {response.time}</div>
                      </div>
                      <Badge 
                        variant={response.status === "Complete" ? "default" : response.status === "Terminate" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {response.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Duplicate IP Detection</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">UID Validation</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Response Time Analysis</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Geolocation Tracking</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                  </div>
                  
                  {stats.fraudAlerts > 0 && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-medium">{stats.fraudAlerts} fraud alerts require review</span>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2 border-red-200 text-red-700 hover:bg-red-100">
                        Review Alerts
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
