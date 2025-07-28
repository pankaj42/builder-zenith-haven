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
  Download,
  Globe
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { usePanelContext } from "@/contexts/PanelContext";
import { DetailsModal } from "@/components/ui/details-modal";
import { showCopySuccess } from "@/components/ui/toast-notification";

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
  const { state } = usePanelContext();
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const [selectedIp, setSelectedIp] = useState<IPMonitoring | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<VendorFraudScore | null>(null);
  const [showConfigureDialog, setShowConfigureDialog] = useState(false);
  const [showReportsDialog, setShowReportsDialog] = useState(false);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [vendorFraudScores, setVendorFraudScores] = useState<VendorFraudScore[]>([]);
  const [ipMonitoring, setIpMonitoring] = useState<IPMonitoring[]>([]);

  // Generate dynamic fraud alerts based on actual response data
  useEffect(() => {
    const generateFraudAlerts = (): FraudAlert[] => {
      const alerts: FraudAlert[] = [];
      const ipCounts: { [key: string]: string[] } = {};
      const uidCounts: { [key: string]: string[] } = {};
      
      // Analyze responses for fraud patterns
      state.responses.forEach(response => {
        // Track IP duplicates
        if (response.ipAddress) {
          if (!ipCounts[response.ipAddress]) {
            ipCounts[response.ipAddress] = [];
          }
          ipCounts[response.ipAddress].push(response.id);
        }

        // Track UID duplicates
        if (response.vendorUID) {
          if (!uidCounts[response.vendorUID]) {
            uidCounts[response.vendorUID] = [];
          }
          uidCounts[response.vendorUID].push(response.id);
        }
      });

      // Generate duplicate IP alerts
      Object.entries(ipCounts).forEach(([ip, responseIds]) => {
        if (responseIds.length > 3) {
          const relatedResponses = state.responses.filter(r => r.ipAddress === ip);
          const vendor = state.vendors.find(v => v.id === relatedResponses[0]?.vendorId);
          
          alerts.push({
            id: `DIP_${ip.replace(/\./g, '_')}_${Date.now()}`,
            type: 'duplicate-ip',
            severity: responseIds.length > 10 ? 'critical' : responseIds.length > 6 ? 'high' : 'medium',
            vendorId: relatedResponses[0]?.vendorId || 'unknown',
            vendorName: vendor?.name || 'Unknown Vendor',
            projectId: relatedResponses[0]?.projectId || 'unknown',
            details: `IP ${ip} used ${responseIds.length} times across multiple responses`,
            affectedResponses: responseIds,
            timestamp: new Date().toISOString(),
            status: 'open'
          });
        }
      });

      // Generate duplicate UID alerts
      Object.entries(uidCounts).forEach(([uid, responseIds]) => {
        if (responseIds.length > 1) {
          const relatedResponses = state.responses.filter(r => r.vendorUID === uid);
          const vendor = state.vendors.find(v => v.id === relatedResponses[0]?.vendorId);
          
          alerts.push({
            id: `DUID_${uid}_${Date.now()}`,
            type: 'duplicate-uid',
            severity: responseIds.length > 5 ? 'critical' : responseIds.length > 3 ? 'high' : 'medium',
            vendorId: relatedResponses[0]?.vendorId || 'unknown',
            vendorName: vendor?.name || 'Unknown Vendor',
            projectId: relatedResponses[0]?.projectId || 'unknown',
            details: `Vendor UID '${uid}' used ${responseIds.length} times`,
            affectedResponses: responseIds,
            timestamp: new Date().toISOString(),
            status: 'open'
          });
        }
      });

      // Check vendor fraud scores and generate alerts for high risk vendors
      state.vendors.forEach(vendor => {
        if (vendor.fraudScore >= 4) {
          alerts.push({
            id: `HFS_${vendor.id}_${Date.now()}`,
            type: 'suspicious-pattern',
            severity: vendor.fraudScore >= 4.5 ? 'critical' : 'high',
            vendorId: vendor.id,
            vendorName: vendor.name,
            projectId: 'multiple',
            details: `Vendor has high fraud score of ${vendor.fraudScore}/5`,
            affectedResponses: state.responses.filter(r => r.vendorId === vendor.id).map(r => r.id),
            timestamp: new Date().toISOString(),
            status: 'open'
          });
        }
      });

      return alerts.slice(0, 10); // Limit to 10 most recent alerts
    };

    setFraudAlerts(generateFraudAlerts());
  }, [state.responses, state.vendors]);

  // Generate dynamic vendor fraud scores based on actual data
  useEffect(() => {
    const generateVendorFraudScores = (): VendorFraudScore[] => {
      return state.vendors.map(vendor => {
        const vendorResponses = state.responses.filter(r => r.vendorId === vendor.id);
        const totalResponses = vendorResponses.length;
        
        // Calculate fraud metrics
        const ipCounts: { [key: string]: number } = {};
        const uidCounts: { [key: string]: number } = {};
        let fastCompletions = 0;
        
        vendorResponses.forEach(response => {
          if (response.ipAddress) {
            ipCounts[response.ipAddress] = (ipCounts[response.ipAddress] || 0) + 1;
          }
          if (response.vendorUID) {
            uidCounts[response.vendorUID] = (uidCounts[response.vendorUID] || 0) + 1;
          }
          if (response.completionTime && response.completionTime < 300) { // Less than 5 minutes
            fastCompletions++;
          }
        });

        const duplicateIPs = Object.values(ipCounts).filter(count => count > 1).length;
        const duplicateUIDs = Object.values(uidCounts).filter(count => count > 1).length;
        
        const duplicateIPRate = totalResponses > 0 ? (duplicateIPs / totalResponses) * 100 : 0;
        const duplicateUIDRate = totalResponses > 0 ? (duplicateUIDs / totalResponses) * 100 : 0;
        const fastCompletionRate = totalResponses > 0 ? (fastCompletions / totalResponses) * 100 : 0;
        const highTerminateRate = vendor.terminateRate;
        
        const suspiciousPatterns = duplicateIPs + duplicateUIDs + (fastCompletions > totalResponses * 0.3 ? 1 : 0);
        const flaggedResponses = duplicateIPs + duplicateUIDs + fastCompletions;
        
        const overallScore = Math.min(5, vendor.fraudScore);
        const riskLevel: 'low' | 'medium' | 'high' | 'critical' = 
          overallScore >= 4 ? 'critical' :
          overallScore >= 3 ? 'high' :
          overallScore >= 2 ? 'medium' : 'low';

        return {
          vendorId: vendor.id,
          vendorName: vendor.name,
          overallScore,
          duplicateIPRate,
          duplicateUIDRate,
          fastCompletionRate,
          highTerminateRate,
          suspiciousPatterns,
          totalResponses,
          flaggedResponses,
          riskLevel,
          lastActivity: new Date().toISOString()
        };
      });
    };

    setVendorFraudScores(generateVendorFraudScores());
  }, [state.vendors, state.responses]);

  // Generate dynamic IP monitoring data
  useEffect(() => {
    const generateIPMonitoring = (): IPMonitoring[] => {
      const ipData: { [key: string]: IPMonitoring } = {};
      
      state.responses.forEach(response => {
        if (response.ipAddress) {
          const ip = response.ipAddress;
          if (!ipData[ip]) {
            ipData[ip] = {
              ip,
              country: response.country || 'Unknown',
              city: response.city || 'Unknown',
              responseCount: 0,
              uniqueUIDs: new Set<string>().size,
              vendors: [],
              projects: [],
              firstSeen: response.timestamp,
              lastSeen: response.timestamp,
              riskScore: 0,
              isBlocked: false,
              suspiciousActivity: []
            };
          }
          
          ipData[ip].responseCount++;
          if (response.vendorUID) {
            const uidSet = new Set(state.responses.filter(r => r.ipAddress === ip).map(r => r.vendorUID).filter(Boolean));
            ipData[ip].uniqueUIDs = uidSet.size;
          }
          
          if (response.vendorId && !ipData[ip].vendors.includes(response.vendorId)) {
            ipData[ip].vendors.push(response.vendorId);
          }
          
          if (response.projectId && !ipData[ip].projects.includes(response.projectId)) {
            ipData[ip].projects.push(response.projectId);
          }
          
          if (new Date(response.timestamp) > new Date(ipData[ip].lastSeen)) {
            ipData[ip].lastSeen = response.timestamp;
          }
          if (new Date(response.timestamp) < new Date(ipData[ip].firstSeen)) {
            ipData[ip].firstSeen = response.timestamp;
          }
        }
      });

      // Calculate risk scores and suspicious activities
      Object.values(ipData).forEach(ipInfo => {
        let riskScore = 0;
        const suspiciousActivity: string[] = [];
        
        if (ipInfo.responseCount > 10) {
          riskScore += 3;
          suspiciousActivity.push(`High response count: ${ipInfo.responseCount}`);
        }
        
        if (ipInfo.uniqueUIDs === 1 && ipInfo.responseCount > 5) {
          riskScore += 4;
          suspiciousActivity.push('Single UID with multiple responses');
        }
        
        if (ipInfo.vendors.length > 3) {
          riskScore += 2;
          suspiciousActivity.push(`Multiple vendors: ${ipInfo.vendors.length}`);
        }
        
        ipInfo.riskScore = Math.min(10, riskScore);
        ipInfo.suspiciousActivity = suspiciousActivity;
        ipInfo.isBlocked = riskScore >= 8;
      });

      return Object.values(ipData)
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 20); // Top 20 IPs by risk
    };

    setIpMonitoring(generateIPMonitoring());
  }, [state.responses]);

  const [fraudThresholds, setFraudThresholds] = useState({
    duplicateIPThreshold: 5,
    duplicateUIDThreshold: 3,
    fastCompletionThreshold: 300, // seconds
    highTerminateThreshold: 50, // percentage
    fraudScoreThreshold: 4.0,
    autoSuspendEnabled: true,
    realTimeMonitoring: true,
    emailAlertsEnabled: true,
  });

  const [fraudDetectionStats, setFraudDetectionStats] = useState({
    totalAlerts: 0,
    highSeverityAlerts: 0,
    vendorsUnderReview: 0,
    responsesBlocked: 0,
    suspiciousIPs: 0,
    flaggedUniqueUIDs: 0,
    averageDetectionTime: '2.3 minutes'
  });

  // Update fraud detection stats based on dynamic data
  useEffect(() => {
    setFraudDetectionStats({
      totalAlerts: fraudAlerts.length,
      highSeverityAlerts: fraudAlerts.filter(alert => alert.severity === 'high' || alert.severity === 'critical').length,
      vendorsUnderReview: vendorFraudScores.filter(vendor => vendor.riskLevel === 'high' || vendor.riskLevel === 'critical').length,
      responsesBlocked: fraudAlerts.reduce((sum, alert) => sum + alert.affectedResponses.length, 0),
      suspiciousIPs: ipMonitoring.filter(ip => ip.riskScore >= 6).length,
      flaggedUniqueUIDs: ipMonitoring.reduce((sum, ip) => sum + (ip.uniqueUIDs === 1 && ip.responseCount > 3 ? 1 : 0), 0),
      averageDetectionTime: '2.3 minutes'
    });
  }, [fraudAlerts, vendorFraudScores, ipMonitoring]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const exportFraudData = () => {
    const exportData = {
      alerts: fraudAlerts,
      vendorScores: vendorFraudScores,
      ipMonitoring: ipMonitoring,
      stats: fraudDetectionStats,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `fraud_report_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    showCopySuccess(document.body, 'Fraud report exported successfully!');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Fraud Detection
              </h2>
              <p className="text-muted-foreground">Monitor and prevent fraudulent survey responses</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Real-time Monitoring Active
              </Badge>
              <Button variant="outline" onClick={exportFraudData} className="gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Alerts</p>
                    <p className="text-2xl font-bold">{fraudDetectionStats.totalAlerts}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">High Priority</p>
                    <p className="text-2xl font-bold text-red-600">{fraudDetectionStats.highSeverityAlerts}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Vendors Under Review</p>
                    <p className="text-2xl font-bold text-yellow-600">{fraudDetectionStats.vendorsUnderReview}</p>
                  </div>
                  <Users className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Suspicious IPs</p>
                    <p className="text-2xl font-bold text-purple-600">{fraudDetectionStats.suspiciousIPs}</p>
                  </div>
                  <Globe className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="alerts" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
              <TabsTrigger value="vendors">Vendor Scores</TabsTrigger>
              <TabsTrigger value="ips">IP Monitoring</TabsTrigger>
              <TabsTrigger value="settings">Detection Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="alerts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Fraud Alerts ({fraudAlerts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Alert ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Affected</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fraudAlerts.map((alert) => (
                        <TableRow key={alert.id}>
                          <TableCell className="font-mono text-sm">{alert.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {alert.type.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>{alert.vendorName}</TableCell>
                          <TableCell>{alert.affectedResponses.length} responses</TableCell>
                          <TableCell>
                            <Badge className={
                              alert.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              alert.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {alert.status.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedAlert(alert)}
                              className="gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vendors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Vendor Fraud Scores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Overall Score</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Total Responses</TableHead>
                        <TableHead>Flagged</TableHead>
                        <TableHead>Duplicate IPs</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendorFraudScores.map((vendor) => (
                        <TableRow key={vendor.vendorId}>
                          <TableCell className="font-medium">{vendor.vendorName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{vendor.overallScore.toFixed(1)}/5</span>
                              <Progress value={(vendor.overallScore / 5) * 100} className="w-16 h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRiskLevelColor(vendor.riskLevel)}>
                              {vendor.riskLevel.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>{vendor.totalResponses}</TableCell>
                          <TableCell>{vendor.flaggedResponses}</TableCell>
                          <TableCell>{vendor.duplicateIPRate.toFixed(1)}%</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedVendor(vendor)}
                              className="gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ips" className="space-y-6">
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
                          <TableCell>{ip.city}, {ip.country}</TableCell>
                          <TableCell>{ip.responseCount}</TableCell>
                          <TableCell>{ip.uniqueUIDs}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${ip.riskScore >= 8 ? 'text-red-600' : ip.riskScore >= 6 ? 'text-orange-600' : 'text-green-600'}`}>
                                {ip.riskScore}/10
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={ip.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                              {ip.isBlocked ? 'Blocked' : 'Active'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedIp(ip)}
                              className="gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              View
                            </Button>
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
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Fraud Detection Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="duplicate-ip">Duplicate IP Threshold</Label>
                        <Input
                          id="duplicate-ip"
                          type="number"
                          value={fraudThresholds.duplicateIPThreshold}
                          onChange={(e) => setFraudThresholds({...fraudThresholds, duplicateIPThreshold: parseInt(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="duplicate-uid">Duplicate UID Threshold</Label>
                        <Input
                          id="duplicate-uid"
                          type="number"
                          value={fraudThresholds.duplicateUIDThreshold}
                          onChange={(e) => setFraudThresholds({...fraudThresholds, duplicateUIDThreshold: parseInt(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fast-completion">Fast Completion Threshold (seconds)</Label>
                        <Input
                          id="fast-completion"
                          type="number"
                          value={fraudThresholds.fastCompletionThreshold}
                          onChange={(e) => setFraudThresholds({...fraudThresholds, fastCompletionThreshold: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Auto-Suspend Vendors</Label>
                          <p className="text-sm text-muted-foreground">Automatically suspend high-risk vendors</p>
                        </div>
                        <Switch
                          checked={fraudThresholds.autoSuspendEnabled}
                          onCheckedChange={(checked) => setFraudThresholds({...fraudThresholds, autoSuspendEnabled: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Real-time Monitoring</Label>
                          <p className="text-sm text-muted-foreground">Enable real-time fraud detection</p>
                        </div>
                        <Switch
                          checked={fraudThresholds.realTimeMonitoring}
                          onCheckedChange={(checked) => setFraudThresholds({...fraudThresholds, realTimeMonitoring: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Email Alerts</Label>
                          <p className="text-sm text-muted-foreground">Send email notifications for fraud alerts</p>
                        </div>
                        <Switch
                          checked={fraudThresholds.emailAlertsEnabled}
                          onCheckedChange={(checked) => setFraudThresholds({...fraudThresholds, emailAlertsEnabled: checked})}
                        />
                      </div>
                    </div>
                  </div>

                  <Button className="gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Details Modals */}
      <DetailsModal
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        title="Fraud Alert Details"
        data={selectedAlert}
        type="alert"
      />

      <DetailsModal
        isOpen={!!selectedVendor}
        onClose={() => setSelectedVendor(null)}
        title="Vendor Fraud Analysis"
        data={selectedVendor}
        type="vendor"
      />

      <DetailsModal
        isOpen={!!selectedIp}
        onClose={() => setSelectedIp(null)}
        title="IP Address Analysis"
        data={selectedIp}
        type="ip"
      />
    </div>
  );
}
