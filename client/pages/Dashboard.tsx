import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Target,
  AlertTriangle,
  TrendingUp,
  Shield,
  UserCheck,
  Activity,
  RotateCcw,
  FolderOpen
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { usePanelContext } from "@/contexts/PanelContext";

interface DashboardStats {
  totalCompletes: number;
  totalTerminates: number;
  totalQuotaFull: number;
  activeProjects: number;
  activeVendors: number;
  fraudAlerts: number;
  completionRate: number;
  avgResponseTime: number;
  totalEarnings: number;
  responsesLast24h: number;
}

interface RecentActivity {
  id: string;
  type: 'response' | 'vendor' | 'project' | 'alert';
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'success';
}

export default function Dashboard() {
  const { state, addResponse } = usePanelContext();
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);

  // Enhanced real-time simulation with activity tracking
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const interval = setInterval(() => {
      if (state.projects.length > 0 && state.vendors.length > 0) {
        const activeProjects = state.projects.filter(p => p.status === 'active');
        if (activeProjects.length > 0) {
          const randomProject = activeProjects[Math.floor(Math.random() * activeProjects.length)];
          const projectVendors = state.vendors.filter(v => v.assignedProjects.includes(randomProject.id));

          if (projectVendors.length > 0) {
            const randomVendor = projectVendors[Math.floor(Math.random() * projectVendors.length)];
            const randomStatus = Math.random() < 0.7 ? 'complete' :
                                Math.random() < 0.8 ? 'terminate' : 'quota-full';

            addResponse({
              projectId: randomProject.id,
              vendorId: randomVendor.id,
              uid: `${randomProject.id}-${Date.now()}-${Math.random().toString(36).substr(2, 3)}`,
              status: randomStatus as any,
              ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
              duration: Math.floor(Math.random() * 20) + 5
            });

            // Add activity log
            const newActivity: RecentActivity = {
              id: Date.now().toString(),
              type: 'response',
              message: `New ${randomStatus} from ${randomVendor.name} on ${randomProject.name}`,
              timestamp: new Date().toISOString(),
              severity: randomStatus === 'complete' ? 'success' :
                       randomStatus === 'terminate' ? 'warning' : 'info'
            };

            setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]);
          }
        }
      }
    }, 8000); // Every 8 seconds

    return () => clearInterval(interval);
  }, [state.projects, state.vendors, addResponse, isRealTimeEnabled]);

  const stats: DashboardStats = {
    totalCompletes: state.stats.totalCompletes,
    totalTerminates: state.stats.totalTerminates,
    totalQuotaFull: state.stats.totalQuotaFull,
    activeProjects: state.projects.filter(p => p.status === 'active').length,
    activeVendors: state.vendors.filter(v => v.status === 'active').length,
    fraudAlerts: state.vendors.filter(v => v.fraudScore > 3.5).length,
    completionRate: state.stats.overallCompletionRate,
    avgResponseTime: state.stats.avgResponseTime,
    totalEarnings: state.stats.totalEarnings,
    responsesLast24h: state.responses.filter(r => {
      const responseTime = new Date(r.timestamp);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return responseTime > yesterday;
    }).length
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
                className="gap-2"
              >
                <Activity className={`w-4 h-4 ${isRealTimeEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                {isRealTimeEnabled ? 'Live Updates' : 'Paused'}
              </Button>
              <Badge variant="outline" className={`gap-1 ${isRealTimeEnabled ? 'animate-pulse' : ''}`}>
                <div className={`w-2 h-2 rounded-full ${isRealTimeEnabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                {isRealTimeEnabled ? 'Live' : 'Paused'}
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
