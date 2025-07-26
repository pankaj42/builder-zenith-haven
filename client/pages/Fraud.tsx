import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Eye,
  Ban,
  Clock,
  Users,
  Activity,
  MapPin,
  Zap,
  CheckCircle,
  XCircle,
  Settings,
  Filter,
  Download
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface FraudAlert {
  id: string;
  type: 'duplicate-uid' | 'duplicate-ip' | 'fast-completion' | 'high-terminate' | 'suspicious-pattern' | 'geolocation-mismatch';
  severity: 'low' | 'medium' | 'high' | 'critical';
  vendorId: string;
  vendorName: string;
  projectId: string;
  details: string;
  affectedResponses: string[];
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved' | 'false-positive';
  investigatedBy?: string;
  resolution?: string;
}

interface VendorFraudScore {
  vendorId: string;
  vendorName: string;
  overallScore: number;
  duplicateIPRate: number;
  duplicateUIDRate: number;
  fastCompletionRate: number;
  highTerminateRate: number;
  suspiciousPatterns: number;
  totalResponses: number;
  flaggedResponses: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastActivity: string;
}

interface IPMonitoring {
  ip: string;
  country: string;
  city: string;
  responseCount: number;
  uniqueUIDs: number;
  vendors: string[];
  projects: string[];
  firstSeen: string;
  lastSeen: string;
  riskScore: number;
  isBlocked: boolean;
  suspiciousActivity: string[];
}

export default function Fraud() {
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([
    {
      id: "FA001",
      type: "duplicate-uid",
      severity: "high",
      vendorId: "V003",
      vendorName: "Panel Partners LLC",
      projectId: "P12345",
      details: "Same UID 'VU12349' used 5 times from different IP addresses",
      affectedResponses: ["R001", "R002", "R003", "R004", "R005"],
      timestamp: "2024-01-25T10:30:00Z",
      status: "open"
    },
    {
      id: "FA002",
      type: "fast-completion",
      severity: "medium",
      vendorId: "V002",
      vendorName: "Survey Source Network",
      projectId: "P12346",
      details: "15-minute survey completed in 45 seconds",
      affectedResponses: ["R006"],
      timestamp: "2024-01-25T09:45:00Z",
      status: "investigating",
      investigatedBy: "Admin"
    },
    {
      id: "FA003",
      type: "duplicate-ip",
      severity: "critical",
      vendorId: "V001",
      vendorName: "Quality Traffic Solutions",
      projectId: "P12345",
      details: "IP 192.168.1.100 completed survey 12 times with different UIDs",
      affectedResponses: ["R007", "R008", "R009", "R010", "R011", "R012"],
      timestamp: "2024-01-25T08:15:00Z",
      status: "open"
    },
    {
      id: "FA004",
      type: "high-terminate",
      severity: "medium",
      vendorId: "V003",
      vendorName: "Panel Partners LLC",
      projectId: "P12347",
      details: "Terminate rate of 65% over last 100 responses (threshold: 30%)",
      affectedResponses: ["R013", "R014", "R015"],
      timestamp: "2024-01-25T07:20:00Z",
      status: "resolved",
      resolution: "Vendor confirmed screener changes, monitoring continues"
    }
  ]);

  const [vendorScores, setVendorScores] = useState<VendorFraudScore[]>([
    {
      vendorId: "V001",
      vendorName: "Quality Traffic Solutions",
      overallScore: 2.8,
      duplicateIPRate: 8.5,
      duplicateUIDRate: 1.2,
      fastCompletionRate: 3.1,
      highTerminateRate: 18.2,
      suspiciousPatterns: 3,
      totalResponses: 2450,
      flaggedResponses: 68,
      riskLevel: "medium",
      lastActivity: "2024-01-25T10:28:45Z"
    },
    {
      vendorId: "V002",
      vendorName: "Survey Source Network",
      overallScore: 1.5,
      duplicateIPRate: 2.1,
      duplicateUIDRate: 0.8,
      fastCompletionRate: 1.9,
      highTerminateRate: 15.3,
      suspiciousPatterns: 1,
      totalResponses: 1890,
      flaggedResponses: 28,
      riskLevel: "low",
      lastActivity: "2024-01-25T10:25:30Z"
    },
    {
      vendorId: "V003",
      vendorName: "Panel Partners LLC",
      overallScore: 4.8,
      duplicateIPRate: 15.2,
      duplicateUIDRate: 8.7,
      fastCompletionRate: 12.3,
      highTerminateRate: 28.7,
      suspiciousPatterns: 12,
      totalResponses: 1245,
      flaggedResponses: 156,
      riskLevel: "critical",
      lastActivity: "2024-01-25T09:45:15Z"
    }
  ]);

  const [ipMonitoring, setIpMonitoring] = useState<IPMonitoring[]>([
    {
      ip: "192.168.1.100",
      country: "United States",
      city: "New York",
      responseCount: 12,
      uniqueUIDs: 12,
      vendors: ["V001"],
      projects: ["P12345"],
      firstSeen: "2024-01-25T08:00:00Z",
      lastSeen: "2024-01-25T10:30:00Z",
      riskScore: 9.2,
      isBlocked: false,
      suspiciousActivity: ["Multiple unique UIDs", "High frequency"]
    },
    {
      ip: "203.0.113.50",
      country: "Australia",
      city: "Sydney",
      responseCount: 8,
      uniqueUIDs: 3,
      vendors: ["V002", "V003"],
      projects: ["P12346", "P12347"],
      firstSeen: "2024-01-24T15:30:00Z",
      lastSeen: "2024-01-25T09:45:00Z",
      riskScore: 6.7,
      isBlocked: false,
      suspiciousActivity: ["Cross-vendor activity", "Repeated UIDs"]
    },
    {
      ip: "10.0.0.150",
      country: "Canada",
      city: "Toronto",
      responseCount: 15,
      uniqueUIDs: 1,
      vendors: ["V001", "V002", "V003"],
      projects: ["P12345", "P12346", "P12347"],
      firstSeen: "2024-01-23T12:00:00Z",
      lastSeen: "2024-01-25T10:15:00Z",
      riskScore: 8.9,
      isBlocked: true,
      suspiciousActivity: ["Same UID across vendors", "Multi-project participation", "Blocked by admin"]
    }
  ]);

  const [fraudSettings, setFraudSettings] = useState({
    duplicateIPThreshold: 5,
    duplicateUIDEnabled: true,
    fastCompletionThreshold: 0.3, // 30% of expected time
    highTerminateThreshold: 30,
    geoLocationCheck: true,
    autoBlockEnabled: false,
    alertEmailEnabled: true
  });

  // Simulate real-time fraud monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly generate new fraud alerts
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const newAlert: FraudAlert = {
          id: `FA${Date.now().toString().slice(-3)}`,
          type: ["duplicate-uid", "duplicate-ip", "fast-completion", "high-terminate"][Math.floor(Math.random() * 4)] as any,
          severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as any,
          vendorId: ["V001", "V002", "V003"][Math.floor(Math.random() * 3)],
          vendorName: ["Quality Traffic Solutions", "Survey Source Network", "Panel Partners LLC"][Math.floor(Math.random() * 3)],
          projectId: ["P12345", "P12346", "P12347"][Math.floor(Math.random() * 3)],
          details: "Automated fraud detection triggered",
          affectedResponses: [`R${Math.floor(Math.random() * 999)}`],
          timestamp: new Date().toISOString(),
          status: "open"
        };
        
        setFraudAlerts(prev => [newAlert, ...prev].slice(0, 20));
      }

      // Update vendor fraud scores
      setVendorScores(prev => prev.map(vendor => ({
        ...vendor,
        overallScore: Math.max(0, vendor.overallScore + (Math.random() - 0.5) * 0.2),
        flaggedResponses: vendor.flaggedResponses + Math.floor(Math.random() * 2),
        lastActivity: new Date().toISOString()
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const updateAlertStatus = (alertId: string, status: FraudAlert['status'], resolution?: string) => {
    setFraudAlerts(alerts => alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, status, resolution, investigatedBy: status !== 'open' ? 'Admin' : undefined }
        : alert
    ));
  };

  const blockIP = (ip: string) => {
    setIpMonitoring(ips => ips.map(ipData => 
      ipData.ip === ip 
        ? { ...ipData, isBlocked: true, suspiciousActivity: [...ipData.suspiciousActivity, "Blocked by admin"] }
        : ipData
    ));
  };

  const unblockIP = (ip: string) => {
    setIpMonitoring(ips => ips.map(ipData => 
      ipData.ip === ip 
        ? { ...ipData, isBlocked: false, suspiciousActivity: ipData.suspiciousActivity.filter(s => s !== "Blocked by admin") }
        : ipData
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch(level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'open': return 'bg-red-100 text-red-800 border-red-200';
      case 'investigating': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'false-positive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFraudTypeIcon = (type: string) => {
    switch(type) {
      case 'duplicate-uid': return <Users className="w-4 h-4" />;
      case 'duplicate-ip': return <Globe className="w-4 h-4" />;
      case 'fast-completion': return <Zap className="w-4 h-4" />;
      case 'high-terminate': return <TrendingUp className="w-4 h-4" />;
      case 'suspicious-pattern': return <Activity className="w-4 h-4" />;
      case 'geolocation-mismatch': return <MapPin className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const openAlerts = fraudAlerts.filter(a => a.status === 'open').length;
  const criticalAlerts = fraudAlerts.filter(a => a.severity === 'critical' && a.status === 'open').length;
  const highRiskVendors = vendorScores.filter(v => v.riskLevel === 'high' || v.riskLevel === 'critical').length;
  const blockedIPs = ipMonitoring.filter(ip => ip.isBlocked).length;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Fraud Prevention</h2>
              <p className="text-muted-foreground">Monitor duplicate UIDs, IP patterns, and fraud scoring with real-time alerts</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live Monitoring
              </Badge>
              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                Configure
              </Button>
            </div>
          </div>
        </header>

        {/* Alert Summary */}
        <div className="border-b border-border px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{openAlerts}</div>
                <div className="text-sm text-muted-foreground">Open Alerts</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{criticalAlerts}</div>
                <div className="text-sm text-muted-foreground">Critical Alerts</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{highRiskVendors}</div>
                <div className="text-sm text-muted-foreground">High Risk Vendors</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Ban className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{blockedIPs}</div>
                <div className="text-sm text-muted-foreground">Blocked IPs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs defaultValue="alerts" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="alerts">Fraud Alerts</TabsTrigger>
              <TabsTrigger value="vendor-scores">Vendor Scores</TabsTrigger>
              <TabsTrigger value="ip-monitoring">IP Monitoring</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="alerts" className="space-y-6">
              {criticalAlerts > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800">Critical Fraud Alerts Detected</AlertTitle>
                  <AlertDescription className="text-red-700">
                    {criticalAlerts} critical fraud alert{criticalAlerts > 1 ? 's' : ''} require immediate attention. Review and take action to prevent further fraudulent activity.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                {fraudAlerts.map((alert) => (
                  <Card key={alert.id} className={alert.severity === 'critical' ? 'border-red-200 bg-red-50' : ''}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            {getFraudTypeIcon(alert.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold capitalize">{alert.type.replace('-', ' ')}</h3>
                              <Badge className={getSeverityColor(alert.severity)}>
                                {alert.severity}
                              </Badge>
                              <Badge className={getStatusColor(alert.status)}>
                                {alert.status.replace('-', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Vendor: {alert.vendorName} ({alert.vendorId}) • Project: {alert.projectId}
                            </p>
                            <p className="text-sm font-medium">{alert.details}</p>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Affected responses: {alert.affectedResponses.length} 
                          {alert.investigatedBy && (
                            <span className="ml-4">Investigated by: {alert.investigatedBy}</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {alert.status === 'open' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateAlertStatus(alert.id, 'investigating')}
                              >
                                Investigate
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateAlertStatus(alert.id, 'false-positive', 'Marked as false positive')}
                              >
                                False Positive
                              </Button>
                            </>
                          )}
                          {alert.status === 'investigating' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateAlertStatus(alert.id, 'resolved', 'Investigation completed')}
                            >
                              Mark Resolved
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="gap-1">
                            <Eye className="w-3 h-3" />
                            Details
                          </Button>
                        </div>
                      </div>

                      {alert.resolution && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <p className="text-sm"><strong>Resolution:</strong> {alert.resolution}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="vendor-scores" className="space-y-6">
              <div className="grid gap-4">
                {vendorScores.map((vendor) => (
                  <Card key={vendor.vendorId} className={vendor.riskLevel === 'critical' ? 'border-red-200 bg-red-50' : vendor.riskLevel === 'high' ? 'border-orange-200 bg-orange-50' : ''}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{vendor.vendorName}</h3>
                            <Badge className="font-mono">{vendor.vendorId}</Badge>
                            <Badge className={`${getRiskLevelColor(vendor.riskLevel)} border-current`}>
                              {vendor.riskLevel} risk
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Last activity: {new Date(vendor.lastActivity).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${getRiskLevelColor(vendor.riskLevel)}`}>
                            {vendor.overallScore.toFixed(1)}
                          </div>
                          <div className="text-sm text-muted-foreground">Fraud Score</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{vendor.totalResponses}</div>
                          <div className="text-xs text-muted-foreground">Total Responses</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600">{vendor.flaggedResponses}</div>
                          <div className="text-xs text-muted-foreground">Flagged</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-600">{vendor.suspiciousPatterns}</div>
                          <div className="text-xs text-muted-foreground">Suspicious Patterns</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">{((vendor.flaggedResponses / vendor.totalResponses) * 100).toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Flag Rate</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Duplicate IP</span>
                            <span>{vendor.duplicateIPRate}%</span>
                          </div>
                          <Progress value={vendor.duplicateIPRate} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Duplicate UID</span>
                            <span>{vendor.duplicateUIDRate}%</span>
                          </div>
                          <Progress value={vendor.duplicateUIDRate} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Fast Completion</span>
                            <span>{vendor.fastCompletionRate}%</span>
                          </div>
                          <Progress value={vendor.fastCompletionRate} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>High Terminate</span>
                            <span>{vendor.highTerminateRate}%</span>
                          </div>
                          <Progress value={vendor.highTerminateRate} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ip-monitoring" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    IP Address Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Responses</TableHead>
                        <TableHead>Unique UIDs</TableHead>
                        <TableHead>Risk Score</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ipMonitoring.map((ip) => (
                        <TableRow key={ip.ip}>
                          <TableCell className="font-mono">{ip.ip}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              {ip.city}, {ip.country}
                            </div>
                          </TableCell>
                          <TableCell>{ip.responseCount}</TableCell>
                          <TableCell>{ip.uniqueUIDs}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold ${ip.riskScore >= 8 ? 'text-red-600' : ip.riskScore >= 6 ? 'text-orange-600' : 'text-green-600'}`}>
                                {ip.riskScore.toFixed(1)}
                              </span>
                              <Progress value={ip.riskScore * 10} className="w-16 h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={ip.isBlocked ? 'bg-red-100 text-red-800 border-red-200' : 'bg-green-100 text-green-800 border-green-200'}>
                              {ip.isBlocked ? 'Blocked' : 'Active'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {ip.isBlocked ? (
                                <Button variant="outline" size="sm" onClick={() => unblockIP(ip.ip)}>
                                  Unblock
                                </Button>
                              ) : (
                                <Button variant="outline" size="sm" onClick={() => blockIP(ip.ip)}>
                                  Block
                                </Button>
                              )}
                              <Button variant="outline" size="sm" className="gap-1">
                                <Eye className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fraud Detection Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Duplicate UID Detection</Label>
                          <p className="text-sm text-muted-foreground">Monitor for reused vendor UIDs</p>
                        </div>
                        <Switch
                          checked={fraudSettings.duplicateUIDEnabled}
                          onCheckedChange={(checked) => setFraudSettings({...fraudSettings, duplicateUIDEnabled: checked})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ip-threshold">Duplicate IP Threshold</Label>
                        <Input
                          id="ip-threshold"
                          type="number"
                          value={fraudSettings.duplicateIPThreshold}
                          onChange={(e) => setFraudSettings({...fraudSettings, duplicateIPThreshold: parseInt(e.target.value)})}
                        />
                        <p className="text-xs text-muted-foreground">Alert when IP has more than this many responses</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="terminate-threshold">High Terminate Rate Threshold (%)</Label>
                        <Input
                          id="terminate-threshold"
                          type="number"
                          value={fraudSettings.highTerminateThreshold}
                          onChange={(e) => setFraudSettings({...fraudSettings, highTerminateThreshold: parseInt(e.target.value)})}
                        />
                        <p className="text-xs text-muted-foreground">Alert when vendor terminate rate exceeds this percentage</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Geolocation Verification</Label>
                          <p className="text-sm text-muted-foreground">Check for location inconsistencies</p>
                        </div>
                        <Switch
                          checked={fraudSettings.geoLocationCheck}
                          onCheckedChange={(checked) => setFraudSettings({...fraudSettings, geoLocationCheck: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Auto-Block High Risk IPs</Label>
                          <p className="text-sm text-muted-foreground">Automatically block IPs with high fraud scores</p>
                        </div>
                        <Switch
                          checked={fraudSettings.autoBlockEnabled}
                          onCheckedChange={(checked) => setFraudSettings({...fraudSettings, autoBlockEnabled: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Email Alerts</Label>
                          <p className="text-sm text-muted-foreground">Send email notifications for fraud alerts</p>
                        </div>
                        <Switch
                          checked={fraudSettings.alertEmailEnabled}
                          onCheckedChange={(checked) => setFraudSettings({...fraudSettings, alertEmailEnabled: checked})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="completion-threshold">Fast Completion Threshold</Label>
                        <Input
                          id="completion-threshold"
                          type="number"
                          step="0.1"
                          value={fraudSettings.fastCompletionThreshold}
                          onChange={(e) => setFraudSettings({...fraudSettings, fastCompletionThreshold: parseFloat(e.target.value)})}
                        />
                        <p className="text-xs text-muted-foreground">Alert when survey completed in less than this ratio of expected time</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button>Save Settings</Button>
                    <Button variant="outline">Reset to Defaults</Button>
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
