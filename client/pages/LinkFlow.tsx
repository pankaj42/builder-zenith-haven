import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Copy,
  ExternalLink,
  ArrowRight,
  ArrowDown,
  Settings,
  Users,
  Target,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
  Eye,
  Info,
  Zap,
  Activity
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { usePanelContext } from "@/contexts/PanelContext";
import { showCopySuccess } from "@/components/ui/toast-notification";

interface LinkFlowStep {
  id: string;
  title: string;
  description: string;
  url: string;
  color: string;
  icon: React.ReactNode;
}

export default function LinkFlow() {
  const { state } = usePanelContext();
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [respondentId, setRespondentId] = useState("RESP_123456");
  const [linkFlowSteps, setLinkFlowSteps] = useState<LinkFlowStep[]>([]);

  // Initialize with first project and vendor if available
  useEffect(() => {
    if (state.projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(state.projects[0].id);
    }
    if (state.vendors.length > 0 && !selectedVendorId) {
      setSelectedVendorId(state.vendors[0].id);
    }
  }, [state.projects, state.vendors, selectedProjectId, selectedVendorId]);

  // Generate dynamic link flow based on selected project and vendor
  useEffect(() => {
    const selectedProject = state.projects.find(p => p.id === selectedProjectId);
    const selectedVendor = state.vendors.find(v => v.id === selectedVendorId);

    if (!selectedProject || !selectedVendor) return;

    const baseUrl = "https://surveypanel.com";
    const vendorParam = `?vendor=${selectedVendor.id}`;
    const projectParam = `&project=${selectedProject.id}`;
    const uidParam = `&uid=${respondentId}`;

    const dynamicSteps: LinkFlowStep[] = [
      {
        id: "vendor",
        title: "Vendor Link",
        description: `${selectedVendor.name} sends respondent to our panel`,
        url: `${baseUrl}/start${vendorParam}${projectParam}${uidParam}`,
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <Users className="w-4 h-4" />
      },
      {
        id: "screening",
        title: "Screening Questions",
        description: `Check if respondent qualifies for "${selectedProject.name}"`,
        url: `${baseUrl}/screen${vendorParam}${projectParam}${uidParam}`,
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: <Target className="w-4 h-4" />
      },
      {
        id: "survey",
        title: "Client Survey",
        description: `Redirect to ${selectedProject.clientName} survey`,
        url: selectedProject.clientLink + `${selectedProject.clientLink.includes('?') ? '&' : '?'}vendor_uid=${respondentId}&source=panel`,
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <ExternalLink className="w-4 h-4" />
      },
      {
        id: "complete",
        title: "Survey Complete",
        description: "Client redirects back to our complete page",
        url: selectedVendor.redirectUrls.complete + `?uid=${respondentId}&status=complete`,
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: <CheckCircle className="w-4 h-4" />
      },
      {
        id: "vendor-complete",
        title: "Vendor Complete Page",
        description: `${selectedVendor.name} receives completed respondent`,
        url: selectedVendor.redirectUrls.complete,
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <Activity className="w-4 h-4" />
      }
    ];

    setLinkFlowSteps(dynamicSteps);
  }, [selectedProjectId, selectedVendorId, respondentId, state.projects, state.vendors]);

  const selectedProject = state.projects.find(p => p.id === selectedProjectId);
  const selectedVendor = state.vendors.find(v => v.id === selectedVendorId);

  const copyToClipboard = (text: string, element: HTMLElement) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
          showCopySuccess(element, 'Copied!');
        });
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          showCopySuccess(element, 'Copied!');
        }
      }
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const getAlternativeFlows = () => {
    if (!selectedVendor) return [];

    return [
      {
        title: "Terminate Flow",
        description: "Respondent doesn't qualify for survey",
        url: selectedVendor.redirectUrls.terminate + `?uid=${respondentId}&status=terminate`,
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircle className="w-4 h-4" />
      },
      {
        title: "Quota Full Flow",
        description: "Survey quota is already filled",
        url: selectedVendor.redirectUrls.quotaFull + `?uid=${respondentId}&status=quota_full`,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <AlertTriangle className="w-4 h-4" />
      }
    ];
  };

  const [linkStats] = useState({
    totalClicks: 15847,
    uniqueVisitors: 12453,
    conversionRate: 78.6,
    avgResponseTime: "8.4 minutes",
    lastUpdated: new Date().toLocaleString()
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Globe className="w-6 h-6" />
                Link Flow Manager
              </h2>
              <p className="text-muted-foreground">Visualize and test survey link flows</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                {linkStats.totalClicks.toLocaleString()} Total Clicks
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                {linkStats.conversionRate}% Conversion
              </Badge>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {/* Configuration */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Flow Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-select">Select Project</Label>
                  <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {state.projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor-select">Select Vendor</Label>
                  <Select value={selectedVendorId} onValueChange={setSelectedVendorId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {state.vendors.map(vendor => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="respondent-id">Respondent ID</Label>
                  <Input
                    id="respondent-id"
                    value={respondentId}
                    onChange={(e) => setRespondentId(e.target.value)}
                    placeholder="Enter respondent ID"
                  />
                </div>
              </div>
              
              {selectedProject && selectedVendor && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Project Details</Label>
                    <p className="text-sm text-muted-foreground">{selectedProject.name}</p>
                    <p className="text-sm text-muted-foreground">Client: {selectedProject.clientName}</p>
                    <p className="text-sm text-muted-foreground">Status: {selectedProject.status}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Vendor Details</Label>
                    <p className="text-sm text-muted-foreground">{selectedVendor.name}</p>
                    <p className="text-sm text-muted-foreground">Email: {selectedVendor.email}</p>
                    <p className="text-sm text-muted-foreground">Status: {selectedVendor.status}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="flow" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="flow">Main Flow</TabsTrigger>
              <TabsTrigger value="alternatives">Alternative Flows</TabsTrigger>
              <TabsTrigger value="testing">Link Testing</TabsTrigger>
            </TabsList>

            <TabsContent value="flow" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="w-5 h-5" />
                    Survey Link Flow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {linkFlowSteps.map((step, index) => (
                      <div key={step.id} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`rounded-full p-3 ${step.color.split(' ')[0]} border`}>
                            {step.icon}
                          </div>
                          {index < linkFlowSteps.length - 1 && (
                            <ArrowDown className="w-4 h-4 text-muted-foreground mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">{step.title}</h3>
                            <Badge className={step.color}>
                              Step {index + 1}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{step.description}</p>
                          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                            <code className="flex-1 text-sm text-muted-foreground break-all">
                              {step.url}
                            </code>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => copyToClipboard(step.url, e.currentTarget)}
                              className="gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              Copy
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(step.url, '_blank')}
                              className="gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Test
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alternatives" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Alternative Flows
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getAlternativeFlows().map((flow, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className={`rounded-full p-2 ${flow.color.split(' ')[0]} border`}>
                          {flow.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{flow.title}</h3>
                          <p className="text-sm text-muted-foreground">{flow.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <code className="text-xs text-muted-foreground">{flow.url}</code>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => copyToClipboard(flow.url, e.currentTarget)}
                              className="gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              Copy
                            </Button>
                          </div>
                        </div>
                        <Badge className={flow.color}>
                          Alternative
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Link Testing & Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{linkStats.totalClicks.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Total Clicks</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{linkStats.uniqueVisitors.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Unique Visitors</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">{linkStats.conversionRate}%</p>
                          <p className="text-sm text-muted-foreground">Conversion Rate</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">{linkStats.avgResponseTime}</p>
                          <p className="text-sm text-muted-foreground">Avg Response Time</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="test-url">Test URL</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="test-url"
                          placeholder="Enter URL to test"
                          className="flex-1"
                        />
                        <Button className="gap-2">
                          <Eye className="w-4 h-4" />
                          Test Link
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="batch-test">Batch Test URLs</Label>
                      <Textarea
                        id="batch-test"
                        placeholder="Enter multiple URLs (one per line) to test"
                        rows={5}
                        className="mt-1"
                      />
                      <Button className="mt-2 gap-2">
                        <Activity className="w-4 h-4" />
                        Run Batch Test
                      </Button>
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
