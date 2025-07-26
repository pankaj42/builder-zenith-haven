import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface LinkFlowStep {
  id: string;
  title: string;
  description: string;
  url: string;
  color: string;
  icon: React.ReactNode;
}

export default function LinkFlow() {
  const [selectedProject] = useState({
    id: "P12345",
    name: "Consumer Behavior Study 2024",
    clientName: "Market Research Corp",
    clientLink: "https://survey.client.com/study/12345"
  });

  const [selectedVendor] = useState("V001");
  const [respondentId] = useState("RESP_123456");

  const linkFlowSteps: LinkFlowStep[] = [
    {
      id: "vendor-start",
      title: "Vendor Start Link",
      description: "The link you share with your vendors. They append respondent IDs to this.",
      url: `https://yourpanel.com/start/${selectedProject.id}/${selectedVendor}/?ID=${respondentId}`,
      color: "purple",
      icon: <Users className="w-5 h-5" />
    },
    {
      id: "panel-processing",
      title: "Panel Processing",
      description: "Your panel receives the request, logs the vendor and respondent, then redirects.",
      url: `https://yourpanel.com/process/${selectedProject.id}`,
      color: "blue",
      icon: <Settings className="w-5 h-5" />
    },
    {
      id: "client-survey",
      title: "Client Survey (Modified)",
      description: "Respondent takes your client's survey with redirect parameters added.",
      url: `${selectedProject.clientLink}?source=panel&redirect_url=https://yourpanel.com/collect/${selectedProject.id}&uid=${selectedProject.id}-001-${respondentId}`,
      color: "green",
      icon: <Target className="w-5 h-5" />
    },
    {
      id: "survey-complete",
      title: "Survey Completion",
      description: "Survey redirects back to your panel with completion status.",
      url: `https://yourpanel.com/collect/${selectedProject.id}?status=complete&uid=${selectedProject.id}-001-${respondentId}`,
      color: "orange",
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      id: "panel-redirect",
      title: "Panel Processing & Logging",
      description: "Your panel logs the response, updates dashboards, then forwards to vendor.",
      url: `https://yourpanel.com/collect/${selectedProject.id}?status=complete&uid=${selectedProject.id}-001-${respondentId}&vendor=${selectedVendor}`,
      color: "emerald",
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: "vendor-redirect",
      title: "Vendor Dashboard Update",
      description: "Vendor receives completion data on their dashboard with tracking parameters.",
      url: `https://dynamic-survey-view.vercel.app/thankyou?pid=${selectedProject.id}&uid=${selectedProject.id}-001-${respondentId}&source=panel&vendor=${selectedVendor}`,
      color: "purple",
      icon: <Activity className="w-5 h-5" />
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      purple: "bg-purple-50 border-purple-200 text-purple-800",
      blue: "bg-blue-50 border-blue-200 text-blue-800",
      green: "bg-green-50 border-green-200 text-green-800",
      orange: "bg-orange-50 border-orange-200 text-orange-800",
      emerald: "bg-emerald-50 border-emerald-200 text-emerald-800"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getImplementationCode = () => {
    return `// Step 1: Add redirect parameter to your client's survey URL
const modifiedClientUrl = "${selectedProject.clientLink}?redirect_url=" + 
  encodeURIComponent("https://yourpanel.com/collect/${selectedProject.id}");

// Step 2: Share this start link with vendors
const vendorStartLink = "https://yourpanel.com/start/${selectedProject.id}/VENDOR_ID/?ID=";

// Step 3: Vendor appends respondent ID
const finalVendorLink = vendorStartLink + "RESPONDENT_ID";

// Your panel will:
// 1. Log the vendor and respondent
// 2. Redirect to modified client survey
// 3. Receive completion data
// 4. Show custom redirect page
// 5. Update dashboards for all parties`;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Link Flow Management</h2>
              <p className="text-muted-foreground">Understand and configure how survey links flow through your panel</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Active Flow
              </Badge>
              <Button variant="outline" className="gap-2">
                <Eye className="w-4 h-4" />
                Test Flow
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">
          <Tabs defaultValue="flow-overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="flow-overview">Flow Overview</TabsTrigger>
              <TabsTrigger value="setup-guide">Setup Guide</TabsTrigger>
              <TabsTrigger value="implementation">Implementation</TabsTrigger>
            </TabsList>

            {/* Flow Overview Tab */}
            <TabsContent value="flow-overview">
              <div className="space-y-6">
                {/* Project Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Current Project: {selectedProject.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Project ID</Label>
                        <p className="font-mono font-medium">{selectedProject.id}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Client</Label>
                        <p className="font-medium">{selectedProject.clientName}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Example Vendor</Label>
                        <p className="font-mono font-medium">{selectedVendor}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Flow Steps */}
                <div className="space-y-4">
                  {linkFlowSteps.map((step, index) => (
                    <div key={step.id} className="relative">
                      <Card className={`${getColorClasses(step.color)} border-2`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                                  <span className="text-sm font-bold">{index + 1}</span>
                                </div>
                                {step.icon}
                                {step.title}
                              </div>
                            </CardTitle>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(step.url)}
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
                          <p className="text-sm mt-2">{step.description}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <Label className="text-xs font-medium">URL:</Label>
                            <Input
                              value={step.url}
                              readOnly
                              className="font-mono text-xs bg-white/50"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Arrow between steps */}
                      {index < linkFlowSteps.length - 1 && (
                        <div className="flex justify-center my-2">
                          <ArrowDown className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Benefits */}
                <Card className="bg-gradient-to-r from-blue-50 to-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Why This Flow Works
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-green-800">For You (Panel Owner):</h4>
                        <ul className="space-y-1 text-sm text-green-700">
                          <li>• Track all vendor traffic and responses</li>
                          <li>• Monitor completion rates by vendor</li>
                          <li>• Control quality and fraud prevention</li>
                          <li>• Manage quotas automatically</li>
                          <li>• Forward to vendor dashboards automatically</li>
                          <li>• Maintain complete audit trail</li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-blue-800">For Your Client:</h4>
                        <ul className="space-y-1 text-sm text-blue-700">
                          <li>• Receives clean, high-quality responses</li>
                          <li>• No indication of vendor involvement</li>
                          <li>• All traffic appears to come from your panel</li>
                          <li>• Gets responses in their preferred format</li>
                          <li>• Maintains survey experience consistency</li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-purple-800">For Your Vendors:</h4>
                        <ul className="space-y-1 text-sm text-purple-700">
                          <li>• Real-time completion tracking on dashboards</li>
                          <li>• Automatic status updates (complete/terminate/quota)</li>
                          <li>• Receive PIDs and UIDs for reconciliation</li>
                          <li>• Performance metrics and conversion data</li>
                          <li>• No manual reporting required</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Setup Guide Tab */}
            <TabsContent value="setup-guide">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Step-by-Step Setup Guide</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Step 1 */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">1</span>
                        </div>
                        <h3 className="text-lg font-semibold">Modify Your Client's Survey</h3>
                      </div>
                      <div className="ml-10 space-y-2">
                        <p className="text-sm text-muted-foreground">Add redirect parameters to your client's survey URL</p>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <Label className="text-xs font-medium text-blue-600">Original Client URL:</Label>
                          <Input
                            value={selectedProject.clientLink}
                            readOnly
                            className="mt-1 font-mono text-sm"
                          />
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <Label className="text-xs font-medium text-green-600">Add This Parameter:</Label>
                          <Input
                            value={`?redirect_url=${encodeURIComponent(`https://yourpanel.com/collect/${selectedProject.id}`)}`}
                            readOnly
                            className="mt-1 font-mono text-sm"
                          />
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <Label className="text-xs font-medium">Final URL for Client's Survey Platform:</Label>
                          <Textarea
                            value={`${selectedProject.clientLink}?redirect_url=${encodeURIComponent(`https://yourpanel.com/collect/${selectedProject.id}`)}`}
                            readOnly
                            className="mt-1 font-mono text-sm"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-purple-600">2</span>
                        </div>
                        <h3 className="text-lg font-semibold">Share Panel Start Link with Vendors</h3>
                      </div>
                      <div className="ml-10 space-y-2">
                        <p className="text-sm text-muted-foreground">This is the link you give to your vendors</p>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <Label className="text-xs font-medium text-purple-600">Vendor Start Link Template:</Label>
                          <Input
                            value={`https://yourpanel.com/start/${selectedProject.id}/VENDOR_ID/?ID=`}
                            readOnly
                            className="mt-1 font-mono text-sm"
                          />
                          <p className="text-xs text-purple-600 mt-2">Replace VENDOR_ID with actual vendor ID</p>
                        </div>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-green-600">3</span>
                        </div>
                        <h3 className="text-lg font-semibold">Configure Redirect Pages</h3>
                      </div>
                      <div className="ml-10 space-y-2">
                        <p className="text-sm text-muted-foreground">Set up custom pages for different completion statuses</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-green-50 rounded-lg">
                            <Label className="text-xs font-medium text-green-600">Complete:</Label>
                            <p className="text-xs font-mono">yourpanel.com/redirect/complete</p>
                          </div>
                          <div className="p-3 bg-orange-50 rounded-lg">
                            <Label className="text-xs font-medium text-orange-600">Terminate:</Label>
                            <p className="text-xs font-mono">yourpanel.com/redirect/terminate</p>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <Label className="text-xs font-medium text-blue-600">Quota Full:</Label>
                            <p className="text-xs font-mono">yourpanel.com/redirect/quota-full</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <Label className="text-xs font-medium text-gray-600">Study Closed:</Label>
                            <p className="text-xs font-mono">yourpanel.com/redirect/study-closed</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-50 border-yellow-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-800">
                      <Info className="w-5 h-5" />
                      Important Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-yellow-700">
                    <p>• Your client never knows vendors are involved - all traffic appears to come from your panel</p>
                    <p>• You maintain complete control over quality, quotas, and fraud prevention</p>
                    <p>• Both you and vendors get real-time dashboard updates</p>
                    <p>• Clients receive clean, deduplicated data in their preferred format</p>
                    <p>• Custom redirect pages maintain your brand throughout the experience</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Implementation Tab */}
            <TabsContent value="implementation">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Implementation Code</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">JavaScript Implementation:</Label>
                        <Textarea
                          value={getImplementationCode()}
                          readOnly
                          className="mt-2 font-mono text-sm"
                          rows={15}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 gap-1"
                          onClick={() => copyToClipboard(getImplementationCode())}
                        >
                          <Copy className="w-3 h-3" />
                          Copy Code
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Response Tracking</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm">
                        <Label className="font-medium">UID Format:</Label>
                        <p className="font-mono bg-gray-50 p-2 rounded mt-1">
                          {selectedProject.id}-001-{respondentId}
                        </p>
                      </div>
                      <div className="text-sm">
                        <Label className="font-medium">Components:</Label>
                        <ul className="mt-1 space-y-1 text-muted-foreground">
                          <li>• Project ID: {selectedProject.id}</li>
                          <li>• Sequence: 001 (auto-increment)</li>
                          <li>• Respondent ID: {respondentId}</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Status Handling</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Complete → Success Page</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span className="text-sm">Terminate → Qualify Page</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm">Quota Full → Capacity Page</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">Closed → Unavailable Page</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
