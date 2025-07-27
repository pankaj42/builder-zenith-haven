import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Clock,
  Download,
  Calendar,
  Filter,
  Eye,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Zap,
  Settings
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { usePanelContext } from "@/contexts/PanelContext";
import { DetailsModal } from "@/components/ui/details-modal";
import { showCopySuccess } from "@/components/ui/toast-notification";

interface VendorPerformance {
  vendorId: string;
  vendorName: string;
  completionRate: number;
  terminateRate: number;
  avgResponseTime: number;
  totalSent: number;
  totalCompletes: number;
  totalTerminates: number;
  totalQuotaFull: number;
  fraudScore: number;
  rating: number;
  trend: 'up' | 'down' | 'stable';
  recentProjects: string[];
  earnings: number;
  lastActive: string;
}

interface ProjectAnalytics {
  projectId: string;
  projectName: string;
  status: string;
  totalResponses: number;
  completionRate: number;
  avgCompletionTime: number;
  topVendors: { vendorId: string; vendorName: string; completes: number }[];
  demographics: {
    gender: { male: number; female: number };
    ageGroups: { '18-24': number; '25-34': number; '35-44': number; '45-54': number; '55+': number };
    countries: { country: string; count: number }[];
  };
  dailyStats: { date: string; completes: number; terminates: number }[];
}

interface TimeSeriesData {
  date: string;
  completes: number;
  terminates: number;
  quotaFull: number;
  fraudAlerts: number;
}

export default function Analytics() {
  const { state } = usePanelContext();
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Generate dynamic vendor performance from global state
  const generateVendorPerformance = (): VendorPerformance[] => {
    return state.vendors.map(vendor => {
      const vendorResponses = state.responses.filter(r => r.vendorId === vendor.id);
      const completes = vendorResponses.filter(r => r.status === 'complete').length;
      const terminates = vendorResponses.filter(r => r.status === 'terminate').length;
      const quotaFull = vendorResponses.filter(r => r.status === 'quota-full').length;
      const totalResponses = vendorResponses.length;

      const completionRate = totalResponses > 0 ? (completes / totalResponses) * 100 : 0;
      const terminateRate = totalResponses > 0 ? (terminates / totalResponses) * 100 : 0;

      // Calculate earnings from assigned projects
      const earnings = vendor.assignedProjects.reduce((total, projectId) => {
        const project = state.projects.find(p => p.id === projectId);
        const projectCompletes = vendorResponses.filter(r => r.projectId === projectId && r.status === 'complete').length;
        const incentive = project?.incentive ? parseFloat(project.incentive.replace('$', '')) : 0;
        return total + (projectCompletes * incentive);
      }, 0);

      // Calculate rating based on performance
      const fraudPenalty = Math.max(0, (vendor.fraudScore - 2) * 0.5);
      const rating = Math.max(1, Math.min(5, completionRate / 20 - fraudPenalty));

      // Determine trend based on recent performance
      const recentResponses = vendorResponses.slice(-10);
      const recentCompletionRate = recentResponses.length > 0 ?
        (recentResponses.filter(r => r.status === 'complete').length / recentResponses.length) * 100 : 0;
      const trend = recentCompletionRate > completionRate ? 'up' :
                   recentCompletionRate < completionRate ? 'down' : 'stable';

      return {
        vendorId: vendor.id,
        vendorName: vendor.name,
        completionRate: Math.round(completionRate * 10) / 10,
        terminateRate: Math.round(terminateRate * 10) / 10,
        avgResponseTime: 8 + Math.random() * 10, // Mock response time
        totalSent: vendor.totalSent,
        totalCompletes: completes,
        totalTerminates: terminates,
        totalQuotaFull: quotaFull,
        fraudScore: vendor.fraudScore,
        rating: Math.round(rating * 10) / 10,
        trend: trend as 'up' | 'down' | 'stable',
        recentProjects: vendor.assignedProjects,
        earnings: Math.round(earnings * 100) / 100,
        lastActive: new Date().toISOString()
      };
    });
  };

  const [vendorPerformance, setVendorPerformance] = useState<VendorPerformance[]>([]);

  // Generate dynamic project analytics from global state
  const generateProjectAnalytics = (): ProjectAnalytics[] => {
    return state.projects.map(project => {
      const projectResponses = state.responses.filter(r => r.projectId === project.id);
      const completes = projectResponses.filter(r => r.status === 'complete').length;
      const terminates = projectResponses.filter(r => r.status === 'terminate').length;
      const totalResponses = projectResponses.length;

      const completionRate = totalResponses > 0 ? (completes / totalResponses) * 100 : 0;

      // Calculate top vendors for this project
      const vendorStats = project.vendors.map(vendorId => {
        const vendor = state.vendors.find(v => v.id === vendorId);
        const vendorCompletes = projectResponses.filter(r => r.vendorId === vendorId && r.status === 'complete').length;
        return {
          vendorId,
          vendorName: vendor?.name || 'Unknown',
          completes: vendorCompletes
        };
      }).sort((a, b) => b.completes - a.completes);

      // Generate mock demographics based on project data
      const mockDemographics = {
        gender: {
          male: Math.floor(completes * 0.48),
          female: Math.floor(completes * 0.52)
        },
        ageGroups: {
          '18-24': Math.floor(completes * 0.15),
          '25-34': Math.floor(completes * 0.25),
          '35-44': Math.floor(completes * 0.22),
          '45-54': Math.floor(completes * 0.23),
          '55+': Math.floor(completes * 0.15)
        },
        countries: [
          { country: "United States", count: Math.floor(completes * 0.6) },
          { country: "Canada", count: Math.floor(completes * 0.25) },
          { country: "United Kingdom", count: Math.floor(completes * 0.15) }
        ]
      };

      // Generate daily stats for last 6 days
      const dailyStats = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (5 - i));
        const dayCompletes = Math.floor(completes / 6) + Math.floor(Math.random() * 10);
        const dayTerminates = Math.floor(terminates / 6) + Math.floor(Math.random() * 5);
        return {
          date: date.toISOString().split('T')[0],
          completes: dayCompletes,
          terminates: dayTerminates
        };
      });

      return {
        projectId: project.id,
        projectName: project.name,
        status: project.status,
        totalResponses,
        completionRate: Math.round(completionRate * 10) / 10,
        avgCompletionTime: project.estimatedDuration + Math.random() * 5,
        topVendors: vendorStats,
        demographics: mockDemographics,
        dailyStats
      };
    });
  };

  const [projectAnalytics, setProjectAnalytics] = useState<ProjectAnalytics[]>([]);

  // Generate dynamic time series data from global state
  const generateTimeSeriesData = (): TimeSeriesData[] => {
    const data: TimeSeriesData[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayResponses = state.responses.filter(r =>
        r.timestamp.startsWith(dateStr)
      );

      const completes = dayResponses.filter(r => r.status === 'complete').length;
      const terminates = dayResponses.filter(r => r.status === 'terminate').length;
      const quotaFull = dayResponses.filter(r => r.status === 'quota-full').length;

      // Calculate fraud alerts based on fraud scores
      const fraudAlerts = state.vendors.filter(v => v.fraudScore > 3.5).length;

      data.push({
        date: dateStr,
        completes: completes + Math.floor(Math.random() * 20), // Add some mock data for demo
        terminates: terminates + Math.floor(Math.random() * 10),
        quotaFull: quotaFull + Math.floor(Math.random() * 5),
        fraudAlerts: Math.max(0, fraudAlerts + Math.floor(Math.random() * 3) - 1)
      });
    }

    return data;
  };

  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);

  const [selectedPeriod, setSelectedPeriod] = useState("7days");

  // Calculate summary metrics from global state
  const totalCompletes = state.stats.totalCompletes;
  const totalSent = state.vendors.reduce((sum, v) => sum + v.totalSent, 0);
  const overallCompletionRate = state.stats.overallCompletionRate;
  const avgResponseTime = state.stats.avgResponseTime;
  const totalEarnings = state.stats.totalEarnings;

  const topPerformingVendor = vendorPerformance.length > 0 ?
    vendorPerformance.reduce((top, vendor) =>
      vendor.completionRate > top.completionRate ? vendor : top
    ) : null;

  const getPerformanceColor = (rate: number, type: 'completion' | 'terminate' | 'fraud') => {
    switch (type) {
      case 'completion':
        if (rate >= 80) return 'text-green-600';
        if (rate >= 70) return 'text-yellow-600';
        return 'text-red-600';
      case 'terminate':
        if (rate <= 20) return 'text-green-600';
        if (rate <= 30) return 'text-yellow-600';
        return 'text-red-600';
      case 'fraud':
        if (rate <= 2) return 'text-green-600';
        if (rate <= 3.5) return 'text-yellow-600';
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </div>
    ));
  };

  // Update analytics data when global state changes
  useEffect(() => {
    setVendorPerformance(generateVendorPerformance());
    setProjectAnalytics(generateProjectAnalytics());
    setTimeSeriesData(generateTimeSeriesData());
  }, [state.vendors, state.projects, state.responses]);

  const exportReport = (type: 'vendor' | 'project' | 'overview') => {
    const data = type === 'vendor' ? vendorPerformance :
                type === 'project' ? projectAnalytics :
                { vendors: vendorPerformance, projects: projectAnalytics, timeSeries: timeSeriesData };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${type}_analytics_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Analytics & Reports</h2>
              <p className="text-muted-foreground">Vendor performance analytics, completion rates, and automated reporting</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </div>
          </div>
        </header>

        {/* Key Metrics */}
        <div className="border-b border-border px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{overallCompletionRate.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Overall Completion Rate</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{avgResponseTime.toFixed(1)}m</div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{totalCompletes.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Completes</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">${totalEarnings.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Earnings</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs defaultValue="vendor-performance" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vendor-performance">Vendor Performance</TabsTrigger>
              <TabsTrigger value="project-analytics">Project Analytics</TabsTrigger>
              <TabsTrigger value="trends">Trends & Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="vendor-performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Top Performing Vendor
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Best Completion Rate
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {topPerformingVendor ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{topPerformingVendor.vendorName}</h3>
                        <p className="text-muted-foreground">{topPerformingVendor.vendorId}</p>
                        <div className="flex items-center gap-1 mt-2">
                          {getRatingStars(topPerformingVendor.rating)}
                          <span className="ml-2 text-sm text-muted-foreground">
                            {topPerformingVendor.rating.toFixed(1)}/5.0
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-600">
                          {topPerformingVendor.completionRate}%
                        </div>
                        <div className="text-sm text-muted-foreground">Completion Rate</div>
                        <div className="text-sm font-medium mt-1">
                          ${topPerformingVendor.earnings.toLocaleString()} earned
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No vendor data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid gap-4">
                {vendorPerformance.map((vendor) => (
                  <Card key={vendor.vendorId}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{vendor.vendorName}</h3>
                            <Badge className="font-mono">{vendor.vendorId}</Badge>
                            {getTrendIcon(vendor.trend)}
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {getRatingStars(vendor.rating)}
                            <span className="ml-2 text-sm text-muted-foreground">
                              {vendor.rating.toFixed(1)}/5.0
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Last active: {new Date(vendor.lastActive).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            ${vendor.earnings.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Earnings</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        <div className="text-center">
                          <div className={`text-xl font-bold ${getPerformanceColor(vendor.completionRate, 'completion')}`}>
                            {vendor.completionRate}%
                          </div>
                          <div className="text-xs text-muted-foreground">Completion Rate</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-xl font-bold ${getPerformanceColor(vendor.terminateRate, 'terminate')}`}>
                            {vendor.terminateRate}%
                          </div>
                          <div className="text-xs text-muted-foreground">Terminate Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-600">{vendor.avgResponseTime}m</div>
                          <div className="text-xs text-muted-foreground">Avg Response Time</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-purple-600">{vendor.totalCompletes}</div>
                          <div className="text-xs text-muted-foreground">Total Completes</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-xl font-bold ${getPerformanceColor(vendor.fraudScore, 'fraud')}`}>
                            {vendor.fraudScore.toFixed(1)}
                          </div>
                          <div className="text-xs text-muted-foreground">Fraud Score</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Performance Score</span>
                          <span>{vendor.completionRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={vendor.completionRate} className="h-2" />
                        
                        <div className="flex justify-between items-center text-sm pt-2">
                          <span className="text-muted-foreground">
                            Active on {vendor.recentProjects.length} project{vendor.recentProjects.length !== 1 ? 's' : ''}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={() => setSelectedVendor(vendor)}
                            >
                              <Eye className="w-3 h-3" />
                              Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => exportReport('vendor')}
                              className="gap-1"
                            >
                              <Download className="w-3 h-3" />
                              Export
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="project-analytics" className="space-y-6">
              <div className="grid gap-4">
                {projectAnalytics.map((project) => (
                  <Card key={project.projectId}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{project.projectName}</h3>
                            <Badge className="font-mono">{project.projectId}</Badge>
                            <Badge className={project.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {project.totalResponses} total responses • {project.completionRate}% completion rate
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {project.avgCompletionTime}m
                          </div>
                          <div className="text-sm text-muted-foreground">Avg Completion Time</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Top Vendors */}
                        <div>
                          <h4 className="text-sm font-medium mb-3">Top Performing Vendors</h4>
                          <div className="space-y-2">
                            {project.topVendors.map((vendor, index) => (
                              <div key={vendor.vendorId} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-primary/10 rounded text-xs flex items-center justify-center font-medium">
                                    {index + 1}
                                  </div>
                                  <span className="text-sm font-medium">{vendor.vendorName}</span>
                                </div>
                                <span className="text-sm font-semibold">{vendor.completes}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Demographics */}
                        <div>
                          <h4 className="text-sm font-medium mb-3">Demographics</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Gender Distribution</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-center">
                                  Male: {project.demographics.gender.male}
                                </div>
                                <div className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-center">
                                  Female: {project.demographics.gender.female}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Top Countries</span>
                              </div>
                              <div className="space-y-1">
                                {project.demographics.countries.slice(0, 3).map((country) => (
                                  <div key={country.country} className="flex justify-between text-xs">
                                    <span>{country.country}</span>
                                    <span className="font-semibold">{country.count}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Recent Trend */}
                        <div>
                          <h4 className="text-sm font-medium mb-3">Recent Performance</h4>
                          <div className="space-y-2">
                            {project.dailyStats.slice(-3).map((stat) => (
                              <div key={stat.date} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(stat.date).toLocaleDateString()}
                                </span>
                                <div className="flex gap-2 text-xs">
                                  <span className="text-green-600 font-medium">
                                    {stat.completes}C
                                  </span>
                                  <span className="text-orange-600 font-medium">
                                    {stat.terminates}T
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-border/50">
                        <div className="text-sm text-muted-foreground">
                          Project completion: {((project.totalResponses / 1000) * 100).toFixed(1)}% of target
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => setSelectedProject(project)}
                          >
                            <Eye className="w-3 h-3" />
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => exportReport('project')}
                            className="gap-1"
                          >
                            <Download className="w-3 h-3" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Response Trends (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timeSeriesData.map((data, index) => (
                      <div key={data.date} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                        <div className="text-sm font-medium w-20">
                          {new Date(data.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex-1 grid grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{data.completes}</div>
                            <div className="text-xs text-muted-foreground">Completes</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-orange-600">{data.terminates}</div>
                            <div className="text-xs text-muted-foreground">Terminates</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{data.quotaFull}</div>
                            <div className="text-xs text-muted-foreground">Quota Full</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-red-600">{data.fraudAlerts}</div>
                            <div className="text-xs text-muted-foreground">Fraud Alerts</div>
                          </div>
                        </div>
                        <div className="w-20">
                          <Progress value={(data.completes / (data.completes + data.terminates)) * 100} className="h-2" />
                          <div className="text-xs text-center text-muted-foreground mt-1">
                            {((data.completes / (data.completes + data.terminates)) * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Strong Performance Trend</p>
                        <p className="text-xs text-muted-foreground">
                          Completion rates increased by 8.2% over the last week
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Monitor Vendor V003</p>
                        <p className="text-xs text-muted-foreground">
                          High terminate rate and fraud score require attention
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Optimal Response Times</p>
                        <p className="text-xs text-muted-foreground">
                          Average completion time is within expected range
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Automated Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Daily Performance Summary</p>
                          <p className="text-xs text-muted-foreground">Sent daily at 9:00 AM</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Weekly Vendor Report</p>
                          <p className="text-xs text-muted-foreground">Sent Mondays at 10:00 AM</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Monthly Analytics Report</p>
                          <p className="text-xs text-muted-foreground">Sent 1st of each month</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => {
                        const reportTypes = ['Daily Performance Summary', 'Weekly Vendor Report', 'Monthly Analytics Report'];
                        const frequencies = ['Daily at 9:00 AM', 'Weekly on Mondays', 'Monthly on 1st'];
                        const settings = reportTypes.map((type, i) => `${type}: ${frequencies[i]}`).join('\\n');

                        const newSettings = prompt(`Configure Automated Reports:\\n\\nCurrent Settings:\\n${settings}\\n\\nEnter new frequency for Daily Reports (e.g., '10:00 AM'):`);
                        if (newSettings) {
                          showCopySuccess(document.body, `Report configuration updated for ${newSettings}`);
                        }
                      }}
                    >
                      <Settings className="w-4 h-4" />
                      Configure Reports
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Vendor Details Modal */}
      <DetailsModal
        data={selectedVendor}
        type="vendor"
        isOpen={!!selectedVendor}
        onClose={() => setSelectedVendor(null)}
        title={`Vendor Details - ${selectedVendor?.vendorName || ''}`}
      />

      {/* Project Details Modal */}
      <DetailsModal
        data={selectedProject}
        type="project"
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={`Project Details - ${selectedProject?.projectName || ''}`}
      />
    </div>
  );
}
