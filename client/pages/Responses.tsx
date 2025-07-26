import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Download, 
  Search, 
  Filter, 
  RefreshCw, 
  Eye, 
  MapPin,
  Globe,
  ArrowLeft,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  FileText,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";

interface ResponseRecord {
  id: string;
  pid: string;
  vendorId: string;
  vendorUID: string;
  clientUID: string;
  status: 'complete' | 'terminate' | 'quota-full' | 'in-progress';
  ip: string;
  geoLocation: {
    country: string;
    city: string;
    region: string;
  };
  userAgent: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  timestamp: string;
  fraudScore: number;
  redirectUrl?: string;
}

export default function Responses() {
  const [responses, setResponses] = useState<ResponseRecord[]>([
    {
      id: "R001",
      pid: "P12345",
      vendorId: "V001",
      vendorUID: "VU12345",
      clientUID: "P12345-00187-XY9",
      status: "complete",
      ip: "192.168.1.100",
      geoLocation: { country: "United States", city: "New York", region: "NY" },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      startTime: "2024-01-25T10:15:30Z",
      endTime: "2024-01-25T10:28:45Z",
      duration: 13.25,
      timestamp: "2024-01-25T10:28:45Z",
      fraudScore: 1.2,
      redirectUrl: "https://vendor1.com/complete"
    },
    {
      id: "R002",
      pid: "P12346",
      vendorId: "V002",
      vendorUID: "VU12346",
      clientUID: "P12346-00098-AB3",
      status: "terminate",
      ip: "10.0.0.150",
      geoLocation: { country: "Canada", city: "Toronto", region: "ON" },
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      startTime: "2024-01-25T10:12:15Z",
      endTime: "2024-01-25T10:14:30Z",
      duration: 2.25,
      timestamp: "2024-01-25T10:14:30Z",
      fraudScore: 0.8,
      redirectUrl: "https://surveysource.net/redirect/terminate"
    },
    {
      id: "R003",
      pid: "P12345",
      vendorId: "V001",
      vendorUID: "VU12347",
      clientUID: "P12345-00188-CD7",
      status: "complete",
      ip: "172.16.0.200",
      geoLocation: { country: "United Kingdom", city: "London", region: "England" },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      startTime: "2024-01-25T10:10:00Z",
      endTime: "2024-01-25T10:25:15Z",
      duration: 15.25,
      timestamp: "2024-01-25T10:25:15Z",
      fraudScore: 1.5,
      redirectUrl: "https://vendor1.com/complete"
    },
    {
      id: "R004",
      pid: "P12347",
      vendorId: "V002",
      vendorUID: "VU12348",
      clientUID: "P12347-00056-EF1",
      status: "quota-full",
      ip: "203.0.113.50",
      geoLocation: { country: "Australia", city: "Sydney", region: "NSW" },
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15",
      startTime: "2024-01-25T10:08:45Z",
      endTime: "2024-01-25T10:09:30Z",
      duration: 0.75,
      timestamp: "2024-01-25T10:09:30Z",
      fraudScore: 2.1,
      redirectUrl: "https://surveysource.net/redirect/quota"
    },
    {
      id: "R005",
      pid: "P12345",
      vendorId: "V003",
      vendorUID: "VU12349",
      clientUID: "P12345-00189-GH2",
      status: "in-progress",
      ip: "198.51.100.75",
      geoLocation: { country: "United States", city: "Los Angeles", region: "CA" },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      startTime: "2024-01-25T10:20:00Z",
      timestamp: "2024-01-25T10:20:00Z",
      fraudScore: 0.5
    }
  ]);

  const [filteredResponses, setFilteredResponses] = useState<ResponseRecord[]>(responses);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const interval = setInterval(() => {
      // Simulate new responses coming in
      const shouldAddNew = Math.random() < 0.3; // 30% chance
      
      if (shouldAddNew) {
        const newResponse: ResponseRecord = {
          id: `R${Date.now().toString().slice(-3)}`,
          pid: ["P12345", "P12346", "P12347"][Math.floor(Math.random() * 3)],
          vendorId: ["V001", "V002", "V003"][Math.floor(Math.random() * 3)],
          vendorUID: `VU${Math.floor(Math.random() * 99999)}`,
          clientUID: `P12345-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
          status: ["complete", "terminate", "quota-full"][Math.floor(Math.random() * 3)] as any,
          ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          geoLocation: {
            country: ["United States", "Canada", "United Kingdom", "Australia"][Math.floor(Math.random() * 4)],
            city: ["New York", "Toronto", "London", "Sydney"][Math.floor(Math.random() * 4)],
            region: ["NY", "ON", "England", "NSW"][Math.floor(Math.random() * 4)]
          },
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          duration: Math.random() * 20 + 5,
          timestamp: new Date().toISOString(),
          fraudScore: Math.random() * 5,
          redirectUrl: "https://vendor.com/redirect"
        };

        setResponses(prev => [newResponse, ...prev].slice(0, 50)); // Keep only latest 50
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isRealTimeEnabled]);

  // Filter responses based on search and filters
  useEffect(() => {
    let filtered = responses;

    if (searchTerm) {
      filtered = filtered.filter(response => 
        response.clientUID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.vendorUID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.pid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.ip.includes(searchTerm) ||
        response.geoLocation.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(response => response.status === statusFilter);
    }

    if (projectFilter !== "all") {
      filtered = filtered.filter(response => response.pid === projectFilter);
    }

    if (vendorFilter !== "all") {
      filtered = filtered.filter(response => response.vendorId === vendorFilter);
    }

    setFilteredResponses(filtered);
  }, [responses, searchTerm, statusFilter, projectFilter, vendorFilter]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'complete': return 'bg-green-100 text-green-800 border-green-200';
      case 'terminate': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'quota-full': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'complete': return <CheckCircle className="w-4 h-4" />;
      case 'terminate': return <XCircle className="w-4 h-4" />;
      case 'quota-full': return <Users className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getFraudScoreColor = (score: number) => {
    if (score <= 2) return 'text-green-600';
    if (score <= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return "-";
    const minutes = Math.floor(duration);
    const seconds = Math.round((duration - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const exportToExcel = () => {
    // Simulate Excel export
    const csvContent = [
      ["PID", "Vendor UID", "Client UID", "Status", "IP", "Geo Location", "Date", "Time", "Duration", "Fraud Score"].join(","),
      ...filteredResponses.map(r => [
        r.pid,
        r.vendorUID,
        r.clientUID,
        r.status,
        r.ip,
        `${r.geoLocation.city}, ${r.geoLocation.country}`,
        new Date(r.timestamp).toLocaleDateString(),
        new Date(r.timestamp).toLocaleTimeString(),
        formatDuration(r.duration),
        r.fraudScore.toFixed(1)
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'survey_responses.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // Simulate PDF export
    alert("PDF export functionality would be implemented here");
  };

  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", href: "/", active: false },
    { icon: FileText, label: "Responses", href: "/responses", active: true },
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
              <h2 className="text-2xl font-bold text-foreground">Response Data</h2>
              <p className="text-muted-foreground">Real-time response tracking with UID mapping and export capabilities</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1">
                <div className={`w-2 h-2 rounded-full ${isRealTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                {isRealTimeEnabled ? 'Live' : 'Paused'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {isRealTimeEnabled ? 'Pause' : 'Resume'}
              </Button>
              <Button variant="outline" onClick={exportToExcel} className="gap-2">
                <Download className="w-4 h-4" />
                Export Excel
              </Button>
              <Button variant="outline" onClick={exportToPDF} className="gap-2">
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="border-b border-border px-6 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by UID, PID, IP, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="terminate">Terminate</SelectItem>
                <SelectItem value="quota-full">Quota Full</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
              </SelectContent>
            </Select>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="P12345">P12345</SelectItem>
                <SelectItem value="P12346">P12346</SelectItem>
                <SelectItem value="P12347">P12347</SelectItem>
              </SelectContent>
            </Select>

            <Select value={vendorFilter} onValueChange={setVendorFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                <SelectItem value="V001">V001</SelectItem>
                <SelectItem value="V002">V002</SelectItem>
                <SelectItem value="V003">V003</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground">
              Showing {filteredResponses.length} of {responses.length} responses
            </div>
          </div>
        </div>

        {/* Response Table */}
        <main className="flex-1 p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Live Response Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PID</TableHead>
                      <TableHead>Vendor UID</TableHead>
                      <TableHead>Client UID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Geo Location</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Fraud Score</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResponses.map((response) => (
                      <TableRow key={response.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">{response.pid}</TableCell>
                        <TableCell className="font-mono text-sm">{response.vendorUID}</TableCell>
                        <TableCell className="font-mono text-sm font-medium">{response.clientUID}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(response.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(response.status)}
                            {response.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{response.ip}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">{response.geoLocation.city}, {response.geoLocation.country}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDuration(response.duration)}
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${getFraudScoreColor(response.fraudScore)}`}>
                            {response.fraudScore.toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div>
                            <div>{new Date(response.timestamp).toLocaleDateString()}</div>
                            <div className="text-muted-foreground">{new Date(response.timestamp).toLocaleTimeString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Eye className="w-3 h-3" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredResponses.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No responses match your current filters.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
