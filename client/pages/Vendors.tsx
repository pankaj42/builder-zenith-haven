import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Users,
  Target,
  Settings,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Link as LinkIcon,
  Shield,
  TrendingUp,
  Activity
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'suspended';
  createdDate: string;
  completionRate: number;
  terminateRate: number;
  fraudScore: number;
  totalSent: number;
  totalCompletes: number;
  redirectUrls: {
    complete: string;
    terminate: string;
    quotaFull: string;
    studyClosed?: string;
  };
  redirectSettings: {
    enabled: boolean;
    passthrough: boolean;
    appendParams: boolean;
    customParams: string;
  };
  assignedProjects: string[];
  paymentMethod: string;
  notes: string;
}

interface ProjectAssignment {
  projectId: string;
  projectName: string;
  vendorId: string;
  startLink: string;
  status: 'active' | 'paused';
  sent: number;
  completes: number;
  terminates: number;
  quotaFull: number;
}

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: "V001",
      name: "John Thompson",
      email: "john@qualitytraffic.com",
      phone: "+1-555-0123",
      company: "Quality Traffic Solutions",
      status: "active",
      createdDate: "2024-01-10",
      completionRate: 78.5,
      terminateRate: 18.2,
      fraudScore: 2.1,
      totalSent: 2450,
      totalCompletes: 1923,
      redirectUrls: {
        complete: "https://dynamic-survey-view.vercel.app/thankyou",
        terminate: "https://dynamic-survey-view.vercel.app/terminate",
        quotaFull: "https://dynamic-survey-view.vercel.app/quotafull",
        studyClosed: "https://dynamic-survey-view.vercel.app/closed"
      },
      redirectSettings: {
        enabled: true,
        passthrough: true,
        appendParams: true,
        customParams: "source=panel&vendor=V001"
      },
      assignedProjects: ["P12345", "P12346"],
      paymentMethod: "PayPal",
      notes: "High-quality traffic provider with excellent completion rates."
    },
    {
      id: "V002",
      name: "Sarah Mitchell",
      email: "sarah@surveysource.net",
      phone: "+1-555-0124",
      company: "Survey Source Network",
      status: "active",
      createdDate: "2024-01-12",
      completionRate: 82.1,
      terminateRate: 15.3,
      fraudScore: 1.8,
      totalSent: 1890,
      totalCompletes: 1551,
      redirectUrls: {
        complete: "https://surveysource.net/redirect/complete",
        terminate: "https://surveysource.net/redirect/terminate",
        quotaFull: "https://surveysource.net/redirect/quota",
        studyClosed: "https://surveysource.net/redirect/closed"
      },
      redirectSettings: {
        enabled: true,
        passthrough: true,
        appendParams: true,
        customParams: "utm_source=panel&vendor_id=V002"
      },
      assignedProjects: ["P12345", "P12347"],
      paymentMethod: "Bank Transfer",
      notes: "Reliable vendor with consistent quality and quick response times."
    },
    {
      id: "V003",
      name: "Mike Rodriguez",
      email: "mike@panelpartners.com",
      phone: "+1-555-0125",
      company: "Panel Partners LLC",
      status: "suspended",
      createdDate: "2024-01-08",
      completionRate: 65.4,
      terminateRate: 28.7,
      fraudScore: 4.2,
      totalSent: 1245,
      totalCompletes: 814,
      redirectUrls: {
        complete: "https://panelpartners.com/done",
        terminate: "https://panelpartners.com/exit",
        quotaFull: "https://panelpartners.com/full",
        studyClosed: "https://panelpartners.com/closed"
      },
      redirectSettings: {
        enabled: false,
        passthrough: false,
        appendParams: true,
        customParams: "panel_source=survey&v=V003"
      },
      assignedProjects: [],
      paymentMethod: "PayPal",
      notes: "Suspended due to high fraud score and poor completion rates."
    }
  ]);

  const [projects] = useState([
    { id: "P12345", name: "Consumer Behavior Study 2024" },
    { id: "P12346", name: "Brand Awareness Survey" },
    { id: "P12347", name: "Product Feedback Collection" }
  ]);

  const [assignments, setAssignments] = useState<ProjectAssignment[]>([
    {
      projectId: "P12345",
      projectName: "Consumer Behavior Study 2024",
      vendorId: "V001",
      startLink: "https://yourpanel.com/start/P12345/V001/?ID=",
      status: "active",
      sent: 1200,
      completes: 942,
      terminates: 218,
      quotaFull: 40
    },
    {
      projectId: "P12346",
      projectName: "Brand Awareness Survey",
      vendorId: "V001",
      startLink: "https://yourpanel.com/start/P12346/V001/?ID=",
      status: "active",
      sent: 800,
      completes: 628,
      terminates: 152,
      quotaFull: 20
    },
    {
      projectId: "P12345",
      projectName: "Consumer Behavior Study 2024",
      vendorId: "V002",
      startLink: "https://yourpanel.com/start/P12345/V002/?ID=",
      status: "active",
      sent: 950,
      completes: 779,
      terminates: 145,
      quotaFull: 26
    }
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [selectedVendorForDetails, setSelectedVendorForDetails] = useState<Vendor | null>(null);
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "active",
    redirectUrls: {
      complete: "",
      terminate: "",
      quotaFull: ""
    },
    paymentMethod: "PayPal",
    notes: ""
  });

  const generateVendorId = () => {
    const num = Math.floor(Math.random() * 900 + 100);
    return `V${num.toString().padStart(3, '0')}`;
  };

  const createVendor = () => {
    const vendor: Vendor = {
      ...newVendor as Vendor,
      id: generateVendorId(),
      createdDate: new Date().toISOString().split('T')[0],
      completionRate: 0,
      terminateRate: 0,
      fraudScore: 0,
      totalSent: 0,
      totalCompletes: 0,
      assignedProjects: []
    };
    setVendors([...vendors, vendor]);
    setShowCreateDialog(false);
    setNewVendor({
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "active",
      redirectUrls: {
        complete: "",
        terminate: "",
        quotaFull: ""
      },
      paymentMethod: "PayPal",
      notes: ""
    });
  };

  const updateVendorStatus = (vendorId: string, status: Vendor['status']) => {
    setVendors(vendors.map(v => v.id === vendorId ? { ...v, status } : v));
  };

  const deleteVendor = (vendorId: string) => {
    setVendors(vendors.filter(v => v.id !== vendorId));
    setAssignments(assignments.filter(a => a.vendorId !== vendorId));
  };

  const generateStartLink = (projectId: string, vendorId: string) => {
    return `https://yourpanel.com/start/${projectId}/${vendorId}/?ID=`;
  };

  const copyStartLink = (projectId: string, vendorId: string) => {
    const link = generateStartLink(projectId, vendorId);
    navigator.clipboard.writeText(link);
  };

  const showVendorDetails = (vendor: Vendor) => {
    setSelectedVendorForDetails(vendor);
    setShowDetailsDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'suspended': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getFraudScoreColor = (score: number) => {
    if (score <= 2) return 'text-green-600';
    if (score <= 3.5) return 'text-yellow-600';
    return 'text-red-600';
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
              <h2 className="text-2xl font-bold text-foreground">Vendor Management</h2>
              <p className="text-muted-foreground">Manage vendors, assign to projects, and configure redirect URLs</p>
            </div>
            <div className="flex gap-2">
              <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Target className="w-4 h-4" />
                    Assign Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Vendor to Project</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Vendor</Label>
                      <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a vendor" />
                        </SelectTrigger>
                        <SelectContent>
                          {vendors.filter(v => v.status === 'active').map((vendor) => (
                            <SelectItem key={vendor.id} value={vendor.id}>
                              {vendor.name} ({vendor.id}) - {vendor.company}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Select Project</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name} ({project.id})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">Assign</Button>
                      <Button variant="outline" onClick={() => setShowAssignDialog(false)}>Cancel</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Vendor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Vendor</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="vendor-name">Contact Name</Label>
                        <Input
                          id="vendor-name"
                          value={newVendor.name}
                          onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                          placeholder="Enter contact name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vendor-email">Email</Label>
                        <Input
                          id="vendor-email"
                          type="email"
                          value={newVendor.email}
                          onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                          placeholder="vendor@company.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vendor-phone">Phone</Label>
                        <Input
                          id="vendor-phone"
                          value={newVendor.phone}
                          onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                          placeholder="+1-555-0123"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vendor-company">Company</Label>
                        <Input
                          id="vendor-company"
                          value={newVendor.company}
                          onChange={(e) => setNewVendor({...newVendor, company: e.target.value})}
                          placeholder="Company name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="payment-method">Payment Method</Label>
                        <Select value={newVendor.paymentMethod} onValueChange={(value) => setNewVendor({...newVendor, paymentMethod: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PayPal">PayPal</SelectItem>
                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                            <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                            <SelectItem value="Check">Check</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Redirect URLs */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="complete-url">Complete Redirect URL</Label>
                        <Input
                          id="complete-url"
                          value={newVendor.redirectUrls?.complete}
                          onChange={(e) => setNewVendor({
                            ...newVendor,
                            redirectUrls: { ...newVendor.redirectUrls!, complete: e.target.value }
                          })}
                          placeholder="https://vendor.com/complete"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="terminate-url">Terminate Redirect URL</Label>
                        <Input
                          id="terminate-url"
                          value={newVendor.redirectUrls?.terminate}
                          onChange={(e) => setNewVendor({
                            ...newVendor,
                            redirectUrls: { ...newVendor.redirectUrls!, terminate: e.target.value }
                          })}
                          placeholder="https://vendor.com/terminate"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quota-full-url">Quota Full Redirect URL</Label>
                        <Input
                          id="quota-full-url"
                          value={newVendor.redirectUrls?.quotaFull}
                          onChange={(e) => setNewVendor({
                            ...newVendor,
                            redirectUrls: { ...newVendor.redirectUrls!, quotaFull: e.target.value }
                          })}
                          placeholder="https://vendor.com/quota-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vendor-notes">Notes</Label>
                        <Textarea
                          id="vendor-notes"
                          value={newVendor.notes}
                          onChange={(e) => setNewVendor({...newVendor, notes: e.target.value})}
                          placeholder="Additional notes about vendor"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button onClick={createVendor} className="flex-1">Add Vendor</Button>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs defaultValue="vendors" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="assignments">Project Assignments</TabsTrigger>
            </TabsList>

            <TabsContent value="vendors" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {vendors.map((vendor) => (
                  <Card key={vendor.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{vendor.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{vendor.company}</p>
                          <p className="text-xs text-muted-foreground">{vendor.email}</p>
                        </div>
                        <Badge className={`${getStatusColor(vendor.status)} flex items-center gap-1`}>
                          {getStatusIcon(vendor.status)}
                          {vendor.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-mono">{vendor.id}</span>
                        <span>{vendor.createdDate}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-green-700">{vendor.completionRate}%</div>
                          <div className="text-xs text-green-600">Completion Rate</div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-orange-700">{vendor.terminateRate}%</div>
                          <div className="text-xs text-orange-600">Terminate Rate</div>
                        </div>
                      </div>

                      {/* Traffic Stats */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Sent:</span>
                          <span className="font-semibold">{vendor.totalSent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Completes:</span>
                          <span className="font-semibold">{vendor.totalCompletes.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fraud Score:</span>
                          <span className={`font-semibold ${getFraudScoreColor(vendor.fraudScore)}`}>
                            {vendor.fraudScore.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Projects:</span>
                          <span>{vendor.assignedProjects.length} assigned</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-1"
                            onClick={() => showVendorDetails(vendor)}
                          >
                            <Eye className="w-3 h-3" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* Status Actions */}
                        <div className="flex gap-2">
                          {vendor.status === 'active' && (
                            <Button variant="outline" size="sm" className="flex-1"
                                    onClick={() => updateVendorStatus(vendor.id, 'inactive')}>
                              Deactivate
                            </Button>
                          )}
                          {vendor.status === 'inactive' && (
                            <Button variant="outline" size="sm" className="flex-1"
                                    onClick={() => updateVendorStatus(vendor.id, 'active')}>
                              Activate
                            </Button>
                          )}
                          {(vendor.status === 'active' || vendor.status === 'inactive') && (
                            <Button variant="outline" size="sm" className="flex-1 text-red-600"
                                    onClick={() => updateVendorStatus(vendor.id, 'suspended')}>
                              Suspend
                            </Button>
                          )}
                          {vendor.status === 'suspended' && (
                            <Button variant="outline" size="sm" className="flex-1 text-green-600"
                                    onClick={() => updateVendorStatus(vendor.id, 'active')}>
                              Unsuspend
                            </Button>
                          )}
                        </div>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full text-red-600 hover:text-red-700">
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete Vendor
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{vendor.name}"? This will also remove all project assignments.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteVendor(vendor.id)} className="bg-red-600 hover:bg-red-700">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="assignments" className="space-y-6">
              <div className="grid gap-4">
                {assignments.map((assignment, index) => (
                  <Card key={`${assignment.projectId}-${assignment.vendorId}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{assignment.projectName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Vendor: {vendors.find(v => v.id === assignment.vendorId)?.name} ({assignment.vendorId})
                          </p>
                        </div>
                        <Badge className={assignment.status === 'active' ? getStatusColor('active') : getStatusColor('paused')}>
                          {assignment.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{assignment.sent}</div>
                          <div className="text-xs text-muted-foreground">Sent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{assignment.completes}</div>
                          <div className="text-xs text-muted-foreground">Completes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{assignment.terminates}</div>
                          <div className="text-xs text-muted-foreground">Terminates</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{assignment.quotaFull}</div>
                          <div className="text-xs text-muted-foreground">Quota Full</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Vendor Start Link</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={assignment.startLink}
                            readOnly
                            className="font-mono text-sm"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyStartLink(assignment.projectId, assignment.vendorId)}
                            className="gap-1"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(assignment.startLink, '_blank')}
                            className="gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Vendor Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Vendor Details - {selectedVendorForDetails?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedVendorForDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vendor ID:</span>
                    <span className="font-mono font-medium">{selectedVendorForDetails.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact Name:</span>
                    <span className="font-medium">{selectedVendorForDetails.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company:</span>
                    <span className="font-medium">{selectedVendorForDetails.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{selectedVendorForDetails.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{selectedVendorForDetails.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={getStatusColor(selectedVendorForDetails.status)}>
                      {getStatusIcon(selectedVendorForDetails.status)}
                      {selectedVendorForDetails.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created Date:</span>
                    <span className="font-medium">{selectedVendorForDetails.createdDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="font-medium">{selectedVendorForDetails.paymentMethod}</span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="mt-6">
                  <h4 className="text-md font-semibold mb-3">Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">{selectedVendorForDetails.completionRate}%</div>
                      <div className="text-sm text-green-600">Completion Rate</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-700">{selectedVendorForDetails.terminateRate}%</div>
                      <div className="text-sm text-orange-600">Terminate Rate</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-700">{selectedVendorForDetails.fraudScore.toFixed(1)}</div>
                      <div className="text-sm text-red-600">Fraud Score</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">{selectedVendorForDetails.totalSent.toLocaleString()}</div>
                      <div className="text-sm text-blue-600">Total Sent</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Redirect URL Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Vendor Redirect URLs</h3>
                  <Badge className={selectedVendorForDetails.redirectSettings.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {selectedVendorForDetails.redirectSettings.enabled ? "Active" : "Disabled"}
                  </Badge>
                </div>

                {/* Redirect Settings */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-md font-semibold mb-3 text-blue-800">Redirect Configuration</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Enable Redirects</Label>
                      <Switch checked={selectedVendorForDetails.redirectSettings.enabled} readOnly />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Pass-through Mode</Label>
                      <Switch checked={selectedVendorForDetails.redirectSettings.passthrough} readOnly />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Append Parameters</Label>
                      <Switch checked={selectedVendorForDetails.redirectSettings.appendParams} readOnly />
                    </div>
                    <div className="text-sm">
                      <Label className="text-muted-foreground">Custom Params:</Label>
                      <p className="font-mono text-xs mt-1">{selectedVendorForDetails.redirectSettings.customParams}</p>
                    </div>
                  </div>
                </div>

                {/* Dual Redirect Flow Explanation */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <h4 className="text-md font-semibold mb-2 text-green-800">How Dual Redirects Work</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Survey completes → Your panel records response</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Panel updates vendor dashboard → Forwards to vendor URL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Client gets data; vendor tracks completion</span>
                    </div>
                  </div>
                </div>

                {/* Vendor URLs */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-green-700 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Complete URL
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        value={selectedVendorForDetails.redirectUrls.complete}
                        readOnly
                        className="text-sm font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(selectedVendorForDetails.redirectUrls.complete)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(selectedVendorForDetails.redirectUrls.complete + "?pid=test123&uid=user456", '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-green-600 mt-1">Example: {selectedVendorForDetails.redirectUrls.complete}?pid=P12345&uid=P12345-001-RESP123</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-orange-700 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      Terminate URL
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        value={selectedVendorForDetails.redirectUrls.terminate}
                        readOnly
                        className="text-sm font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(selectedVendorForDetails.redirectUrls.terminate)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(selectedVendorForDetails.redirectUrls.terminate + "?pid=test123&uid=user456", '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-orange-600 mt-1">Example: {selectedVendorForDetails.redirectUrls.terminate}?pid=P12345&uid=P12345-001-RESP123</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-blue-700 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Quota Full URL
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        value={selectedVendorForDetails.redirectUrls.quotaFull}
                        readOnly
                        className="text-sm font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(selectedVendorForDetails.redirectUrls.quotaFull)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(selectedVendorForDetails.redirectUrls.quotaFull + "?pid=test123&uid=user456", '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">Example: {selectedVendorForDetails.redirectUrls.quotaFull}?pid=P12345&uid=P12345-001-RESP123</p>
                  </div>

                  {selectedVendorForDetails.redirectUrls.studyClosed && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        Study Closed URL
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          value={selectedVendorForDetails.redirectUrls.studyClosed}
                          readOnly
                          className="text-sm font-mono"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(selectedVendorForDetails.redirectUrls.studyClosed!)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(selectedVendorForDetails.redirectUrls.studyClosed + "?pid=test123&uid=user456", '_blank')}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Example: {selectedVendorForDetails.redirectUrls.studyClosed}?pid=P12345&uid=P12345-001-RESP123</p>
                    </div>
                  )}
                </div>

                {/* Assigned Projects */}
                <div className="mt-6">
                  <h4 className="text-md font-semibold mb-3">Assigned Projects ({selectedVendorForDetails.assignedProjects.length})</h4>
                  <div className="space-y-2">
                    {selectedVendorForDetails.assignedProjects.length > 0 ? (
                      selectedVendorForDetails.assignedProjects.map((projectId) => (
                        <div key={projectId} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                          <span className="font-mono text-sm">{projectId}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyStartLink(projectId, selectedVendorForDetails.id)}
                              className="gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              Copy Start Link
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(generateStartLink(projectId, selectedVendorForDetails.id), '_blank')}
                              className="gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Test
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">No projects assigned</p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {selectedVendorForDetails.notes && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-3">Notes</h4>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">{selectedVendorForDetails.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
