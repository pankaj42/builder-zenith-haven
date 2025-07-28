import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Search, 
  Filter, 
  RefreshCw, 
  Eye, 
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  Activity,
  TrendingUp,
  BarChart3,
  Target
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { usePanelContext } from "@/contexts/PanelContext";

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
  const { state } = usePanelContext();

  // Use dynamic responses from global state with stable additional data
  const [responseDataCache] = useState(new Map());

  const allResponses: ResponseRecord[] = state.responses.map(response => {
    // Use cached additional data to prevent random regeneration
    let cachedData = responseDataCache.get(response.id);
    if (!cachedData) {
      cachedData = {
        deviceInfo: {
          type: Math.random() > 0.5 ? 'Desktop' : 'Mobile',
          browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)],
          os: ['Windows', 'macOS', 'iOS', 'Android'][Math.floor(Math.random() * 4)]
        },
        geoLocation: {
          country: ['United States', 'Canada', 'United Kingdom'][Math.floor(Math.random() * 3)],
          city: ['New York', 'Toronto', 'London'][Math.floor(Math.random() * 3)],
          region: ['NY', 'ON', 'LN'][Math.floor(Math.random() * 3)]
        },
        fraudScore: Math.random() * 5
      };
      responseDataCache.set(response.id, cachedData);
    }

    return {
      id: response.id,
      pid: response.projectId,
      vendorId: response.vendorId,
      vendorUID: response.uid,
      clientUID: response.uid,
      status: response.status,
      ip: response.ip,
      timestamp: response.timestamp,
      geoLocation: cachedData.geoLocation,
      userAgent: 'Mozilla/5.0 (compatible)',
      startTime: response.timestamp,
      endTime: response.timestamp,
      duration: response.duration || Math.floor(Math.random() * 20) + 5,
      fraudScore: cachedData.fraudScore
    };
  });

  // Generate additional sample data if needed
  const generateSampleData = () => {
    const statuses = ['complete', 'terminate', 'quota-full', 'in-progress'];
    const projects = ['P12345', 'P12346', 'P12347'];
    const vendors = ['V001', 'V002', 'V003'];
    const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France'];
    const cities = ['New York', 'Toronto', 'London', 'Sydney', 'Berlin', 'Paris'];
    
    const data: ResponseRecord[] = [];
    
    // Generate data for the last 30 days
    for (let i = 0; i < 500; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      const status = statuses[Math.floor(Math.random() * statuses.length)] as any;
      const project = projects[Math.floor(Math.random() * projects.length)];
      const vendor = vendors[Math.floor(Math.random() * vendors.length)];
      
      data.push({
        id: `R${String(i + 1).padStart(4, '0')}`,
        pid: project,
        vendorId: vendor,
        vendorUID: `VU${Math.floor(Math.random() * 99999)}`,
        clientUID: `${project}-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
        status,
        ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        geoLocation: {
          country: countries[Math.floor(Math.random() * countries.length)],
          city: cities[Math.floor(Math.random() * cities.length)],
          region: 'Region'
        },
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        startTime: date.toISOString(),
        endTime: status !== 'in-progress' ? new Date(date.getTime() + Math.random() * 20 * 60000).toISOString() : undefined,
        duration: status !== 'in-progress' ? Math.random() * 20 + 5 : undefined,
        timestamp: date.toISOString(),
        fraudScore: Math.random() * 5,
        redirectUrl: "https://vendor.com/redirect"
      });
    }
    
    return data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  // Add sample data if we have limited responses (only generate once)
  const [sampleData] = useState(() => generateSampleData());
  const combinedResponses = allResponses.length < 50 ? [...allResponses, ...sampleData] : allResponses;
  const [filteredResponses, setFilteredResponses] = useState<ResponseRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);

  // Calculate totals from combined responses
  const totalCompletes = combinedResponses.filter(r => r.status === 'complete').length;
  const totalTerminates = combinedResponses.filter(r => r.status === 'terminate').length;
  const totalQuotaFull = combinedResponses.filter(r => r.status === 'quota-full').length;
  const totalInProgress = combinedResponses.filter(r => r.status === 'in-progress').length;

  // Filter responses based on all criteria
  useEffect(() => {
    if (!isRealTimeEnabled && filteredResponses.length > 0) {
      return; // Don't update if real-time is paused and we already have data
    }

    let filtered = combinedResponses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(response =>
        response.clientUID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.vendorUID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.pid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.ip.includes(searchTerm) ||
        response.geoLocation.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.geoLocation.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(response => response.status === statusFilter);
    }

    // Project filter
    if (projectFilter !== "all") {
      filtered = filtered.filter(response => response.pid === projectFilter);
    }

    // Vendor filter
    if (vendorFilter !== "all") {
      filtered = filtered.filter(response => response.vendorId === vendorFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      let startDate = new Date();

      switch(dateFilter) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "yesterday":
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(startDate);
          endDate.setHours(23, 59, 59, 999);
          filtered = filtered.filter(response => {
            const responseDate = new Date(response.timestamp);
            return responseDate >= startDate && responseDate <= endDate;
          });
          break;
        case "last7days":
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "last30days":
          startDate.setDate(startDate.getDate() - 30);
          break;
        case "last90days":
          startDate.setDate(startDate.getDate() - 90);
          break;
      }

      if (dateFilter !== "yesterday") {
        filtered = filtered.filter(response =>
          new Date(response.timestamp) >= startDate
        );
      }
    }

    // Year filter
    if (yearFilter !== "all") {
      filtered = filtered.filter(response =>
        new Date(response.timestamp).getFullYear().toString() === yearFilter
      );
    }

    setFilteredResponses(filtered);
    if (currentPage === 1 || filtered.length <= (currentPage - 1) * itemsPerPage) {
      setCurrentPage(1); // Only reset to first page when necessary
    }
  }, [combinedResponses, searchTerm, statusFilter, projectFilter, vendorFilter, dateFilter, yearFilter, isRealTimeEnabled]);

  // Pagination
  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResponses = filteredResponses.slice(startIndex, startIndex + itemsPerPage);

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

  const formatDuration = (duration?: number) => {
    if (!duration) return "-";
    const minutes = Math.floor(duration);
    const seconds = Math.round((duration - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const exportToExcel = () => {
    const csvContent = [
      ["PID", "Vendor UID", "Client UID", "Status", "IP", "Country", "City", "Date", "Time", "Duration", "Fraud Score"].join(","),
      ...filteredResponses.map(r => [
        r.pid,
        r.vendorUID,
        r.clientUID,
        r.status,
        r.ip,
        r.geoLocation.country,
        r.geoLocation.city,
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
    a.download = `survey_responses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const uniqueYears = Array.from(new Set(combinedResponses.map(r => new Date(r.timestamp).getFullYear()))).sort((a, b) => b - a);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Response Data</h2>
              <p className="text-muted-foreground">Real-time response tracking with comprehensive filtering and export capabilities</p>
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
                Export ({filteredResponses.length} records)
              </Button>
            </div>
          </div>
        </header>

        {/* Summary Statistics */}
        <div className="border-b border-border px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{totalCompletes.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Completes</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{totalTerminates.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Terminates</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalQuotaFull.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Quota Full</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{totalInProgress.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="border-b border-border px-6 py-4">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by PID, UID, IP, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
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
                  <SelectValue placeholder="All Projects" />
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
                  <SelectValue placeholder="All Vendors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vendors</SelectItem>
                  <SelectItem value="V001">V001</SelectItem>
                  <SelectItem value="V002">V002</SelectItem>
                  <SelectItem value="V003">V003</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="last90days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>

              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {uniqueYears.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Per Page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                  <SelectItem value="250">250 per page</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground">
                Showing {filteredResponses.length.toLocaleString()} of {combinedResponses.length.toLocaleString()} responses
              </div>
            </div>
          </div>
        </div>

        {/* Response Table */}
        <main className="flex-1 p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Response Data
                <Badge variant="outline" className="ml-auto">
                  Page {currentPage} of {totalPages}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">S.No.</TableHead>
                      <TableHead>PID</TableHead>
                      <TableHead>Vendor UID</TableHead>
                      <TableHead>Client UID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Geo Location</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Fraud Score</TableHead>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedResponses.map((response, index) => (
                      <TableRow key={response.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {startIndex + index + 1}
                        </TableCell>
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
                          <span className={`font-semibold ${
                            response.fraudScore <= 2 ? 'text-green-600' :
                            response.fraudScore <= 3.5 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredResponses.length)} of {filteredResponses.length} entries
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    {/* Page numbers */}
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="w-8"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

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
