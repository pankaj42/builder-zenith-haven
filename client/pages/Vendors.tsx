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
import { usePanelContext } from "@/contexts/PanelContext";
import { showCopySuccess } from "@/components/ui/toast-notification";

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
  redirectSettings?: {
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
  const { state, createVendor, updateVendor, deleteVendor } = usePanelContext();

  const vendors = state.vendors;
  const projects = state.projects.map(p => ({ id: p.id, name: p.name, incentive: p.incentive }));

  // Calculate dynamic vendor performance metrics
  const calculateVendorMetrics = (vendor: any) => {
    const vendorResponses = state.responses.filter(r => r.vendorId === vendor.id);
    const completes = vendorResponses.filter(r => r.status === 'complete').length;
    const terminates = vendorResponses.filter(r => r.status === 'terminate').length;
    const totalResponses = vendorResponses.length;

    const completionRate = totalResponses > 0 ? (completes / totalResponses) * 100 : vendor.completionRate || 0;
    const terminateRate = totalResponses > 0 ? (terminates / totalResponses) * 100 : vendor.terminateRate || 0;

    return {
      ...vendor,
      completionRate: Math.round(completionRate * 10) / 10,
      terminateRate: Math.round(terminateRate * 10) / 10,
      totalCompletes: completes || vendor.totalCompletes || 0,
      totalSent: Math.max(vendor.totalSent || 0, totalResponses)
    };
  };

  // Get dynamic vendor data with updated metrics
  const getDynamicVendors = () => {
    return vendors.map(vendor => calculateVendorMetrics(vendor));
  };

  const dynamicVendors = getDynamicVendors();

  // Projects now come from global state via: const projects = state.projects.map(p => ({ id: p.id, name: p.name }));

  const generateStartLink = (projectId: string, vendorId: string) => {
    return `https://yourpanel.com/start/${projectId}/${vendorId}/?ID=`;
  };

  // Generate dynamic assignments from global state
  const generateAssignments = (): ProjectAssignment[] => {
    const assignments: ProjectAssignment[] = [];

    state.vendors.forEach(vendor => {
      vendor.assignedProjects.forEach(projectId => {
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
          const vendorResponses = state.responses.filter(r => r.projectId === projectId && r.vendorId === vendor.id);
          const completes = vendorResponses.filter(r => r.status === 'complete').length;
          const terminates = vendorResponses.filter(r => r.status === 'terminate').length;
          const quotaFull = vendorResponses.filter(r => r.status === 'quota-full').length;
          const sent = vendorResponses.length + Math.floor(Math.random() * 200); // Add some mock sent count

          assignments.push({
            projectId: project.id,
            projectName: project.name,
            vendorId: vendor.id,
            startLink: generateStartLink(project.id, vendor.id),
            status: project.status === 'active' ? 'active' : 'paused',
            sent,
            completes,
            terminates,
            quotaFull
          });
        }
      });
    });

    return assignments;
  };

  const dynamicAssignments = generateAssignments(); // Always use dynamic data

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [selectedVendorForDetails, setSelectedVendorForDetails] = useState<Vendor | null>(null);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
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

  const createVendorAction = () => {
    const vendorData = {
      ...newVendor as Omit<Vendor, 'id' | 'createdDate' | 'assignedProjects'>,
      completionRate: 0,
      terminateRate: 0,
      fraudScore: 0,
      totalSent: 0,
      totalCompletes: 0
    };
    createVendor(vendorData);
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
    updateVendor(vendorId, { status });
  };

  const deleteVendorAction = (vendorId: string) => {
    deleteVendor(vendorId);
  };

  const editVendorAction = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setShowEditDialog(true);
  };

  const updateVendorAction = () => {
    if (editingVendor) {
      updateVendor(editingVendor.id, editingVendor);
      setShowEditDialog(false);
      setEditingVendor(null);
      showCopySuccess(document.body, "Vendor updated successfully!");
    }
  };

  // Reusable copy function that works in all contexts
  const copyToClipboard = (text: string, buttonElement: HTMLElement, description: string = "Copied!") => {
    try {
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
        showCopySuccess(buttonElement, description);
      } else {
        prompt(`Copy this text:`, text);
      }
    } catch (err) {
      console.error("Copy failed:", err);
      prompt(`Copy this text:`, text);
    }
  };

  const copyStartLink = (projectId: string, vendorId: string, buttonElement: HTMLElement) => {
    const link = generateStartLink(projectId, vendorId);
    copyToClipboard(link, buttonElement, "Start Link Copied!");
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
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
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
                        <Button onClick={createVendorAction} className="flex-1">Add Vendor</Button>
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
                {dynamicVendors.map((vendor) => (
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
                          <div className="text-xs text-green-500 mt-1">
                            {vendor.completionRate >= 80 ? '↗ Excellent' :
                             vendor.completionRate >= 70 ? '→ Good' : '�� Needs Improvement'}
                          </div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-orange-700">{vendor.terminateRate}%</div>
                          <div className="text-xs text-orange-600">Terminate Rate</div>
                          <div className="text-xs text-orange-500 mt-1">
                            {vendor.terminateRate <= 20 ? '↗ Excellent' :
                             vendor.terminateRate <= 30 ? '→ Acceptable' : '↘ High'}
                          </div>
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
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Projects:</span>
                            <span className="font-semibold">{vendor.assignedProjects.length} assigned</span>
                          </div>
                          {vendor.assignedProjects.length > 0 && (
                            <div className="space-y-1">
                              {vendor.assignedProjects.map((projectId) => {
                                const project = projects.find(p => p.id === projectId);
                                const projectData = state.projects.find(p => p.id === projectId);
                                const vendorResponses = state.responses.filter(r => r.projectId === projectId && r.vendorId === vendor.id);
                                const completes = vendorResponses.filter(r => r.status === 'complete').length;
                                const incentiveAmount = project?.incentive ? parseFloat(project.incentive.replace('$', '')) : 0;
                                const cpi = completes > 0 ? (incentiveAmount).toFixed(2) : '0.00';

                                return (
                                  <div key={projectId} className="text-xs bg-gray-50 rounded p-2 space-y-1">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono text-blue-600">{projectId}</span>
                                        <span className="text-gray-600 truncate max-w-[80px]">
                                          {project?.name || "Unknown Project"}
                                        </span>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0"
                                        onClick={(e) => copyStartLink(projectId, vendor.id, e.currentTarget)}
                                        title="Copy start link"
                                      >
                                        <Copy className="w-3 h-3" />
                                      </Button>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-green-600">{completes} completes</span>
                                      <span className="text-blue-600 font-mono">CPI: ${cpi}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
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
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => editVendorAction(vendor)}
                          >
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
                              <AlertDialogAction onClick={() => deleteVendorAction(vendor.id)} className="bg-red-600 hover:bg-red-700">
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
              {/* Assignment Tracking Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{dynamicAssignments.length}</div>
                    <div className="text-sm text-muted-foreground">Total Assignments</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {dynamicAssignments.filter(a => a.status === 'active').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Active</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {dynamicAssignments.filter(a => a.status === 'paused').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Paused</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {new Set(dynamicAssignments.map(a => a.projectId)).size}
                    </div>
                    <div className="text-sm text-muted-foreground">Unique Projects</div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Search and Filter */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <Input
                        placeholder="Search by project name, vendor name, or ID..."
                        className="w-full"
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4">
                {dynamicAssignments.map((assignment, index) => (
                  <Card key={`${assignment.projectId}-${assignment.vendorId}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{assignment.projectName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Vendor: {vendors.find(v => v.id === assignment.vendorId)?.name} ({assignment.vendorId})
                          </p>
                          {(() => {
                            const project = state.projects.find(p => p.id === assignment.projectId);
                            const incentiveAmount = project?.incentive ? parseFloat(project.incentive.replace('$', '')) : 0;
                            const cpi = assignment.completes > 0 ? incentiveAmount.toFixed(2) : '0.00';
                            const totalEarnings = (assignment.completes * incentiveAmount).toFixed(2);
                            const completionRate = assignment.sent > 0 ? ((assignment.completes / assignment.sent) * 100).toFixed(1) : '0.0';
                            return (
                              <p className="text-xs text-blue-600 font-mono">
                                CPI: ${cpi} | Total Earned: ${totalEarnings} | CR: {completionRate}%
                              </p>
                            );
                          })()}
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
                            onClick={(e) => copyStartLink(assignment.projectId, assignment.vendorId, e.currentTarget)}
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
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
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
                  <Badge className={selectedVendorForDetails.redirectSettings?.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {selectedVendorForDetails.redirectSettings?.enabled ? "Active" : "Disabled"}
                  </Badge>
                </div>

                {/* Redirect Settings */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-md font-semibold mb-3 text-blue-800">Redirect Configuration</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Enable Redirects</Label>
                      <Switch checked={selectedVendorForDetails.redirectSettings?.enabled || false} readOnly />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Pass-through Mode</Label>
                      <Switch checked={selectedVendorForDetails.redirectSettings?.passthrough || false} readOnly />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Append Parameters</Label>
                      <Switch checked={selectedVendorForDetails.redirectSettings?.appendParams || false} readOnly />
                    </div>
                    <div className="text-sm">
                      <Label className="text-muted-foreground">Custom Params:</Label>
                      <p className="font-mono text-xs mt-1">{selectedVendorForDetails.redirectSettings?.customParams || 'None'}</p>
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
                        onClick={(e) => copyToClipboard(selectedVendorForDetails.redirectUrls.complete, e.currentTarget, "Complete URL Copied!")}
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
                        onClick={(e) => copyToClipboard(selectedVendorForDetails.redirectUrls.terminate, e.currentTarget, "Terminate URL Copied!")}
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
                        onClick={(e) => copyToClipboard(selectedVendorForDetails.redirectUrls.quotaFull, e.currentTarget, "Quota Full URL Copied!")}
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
                          onClick={(e) => copyToClipboard(selectedVendorForDetails.redirectUrls.studyClosed!, e.currentTarget, "Study Closed URL Copied!")}
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
                              onClick={(e) => copyStartLink(projectId, selectedVendorForDetails.id, e.currentTarget)}
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

      {/* Edit Vendor Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vendor - {editingVendor?.name}</DialogTitle>
          </DialogHeader>
          {editingVendor && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-vendor-name">Contact Name</Label>
                  <Input
                    id="edit-vendor-name"
                    value={editingVendor.name}
                    onChange={(e) => setEditingVendor({...editingVendor, name: e.target.value})}
                    placeholder="Enter contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-vendor-email">Email</Label>
                  <Input
                    id="edit-vendor-email"
                    type="email"
                    value={editingVendor.email}
                    onChange={(e) => setEditingVendor({...editingVendor, email: e.target.value})}
                    placeholder="vendor@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-vendor-phone">Phone</Label>
                  <Input
                    id="edit-vendor-phone"
                    value={editingVendor.phone}
                    onChange={(e) => setEditingVendor({...editingVendor, phone: e.target.value})}
                    placeholder="+1-555-0123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-vendor-company">Company</Label>
                  <Input
                    id="edit-vendor-company"
                    value={editingVendor.company}
                    onChange={(e) => setEditingVendor({...editingVendor, company: e.target.value})}
                    placeholder="Company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-payment-method">Payment Method</Label>
                  <Select
                    value={editingVendor.paymentMethod}
                    onValueChange={(value) => setEditingVendor({...editingVendor, paymentMethod: value})}
                  >
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
                  <Label htmlFor="edit-complete-url">Complete Redirect URL</Label>
                  <Input
                    id="edit-complete-url"
                    value={editingVendor.redirectUrls?.complete || ''}
                    onChange={(e) => setEditingVendor({
                      ...editingVendor,
                      redirectUrls: { ...editingVendor.redirectUrls!, complete: e.target.value }
                    })}
                    placeholder="https://vendor.com/complete"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-terminate-url">Terminate Redirect URL</Label>
                  <Input
                    id="edit-terminate-url"
                    value={editingVendor.redirectUrls?.terminate || ''}
                    onChange={(e) => setEditingVendor({
                      ...editingVendor,
                      redirectUrls: { ...editingVendor.redirectUrls!, terminate: e.target.value }
                    })}
                    placeholder="https://vendor.com/terminate"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-quota-full-url">Quota Full Redirect URL</Label>
                  <Input
                    id="edit-quota-full-url"
                    value={editingVendor.redirectUrls?.quotaFull || ''}
                    onChange={(e) => setEditingVendor({
                      ...editingVendor,
                      redirectUrls: { ...editingVendor.redirectUrls!, quotaFull: e.target.value }
                    })}
                    placeholder="https://vendor.com/quota-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-vendor-notes">Notes</Label>
                  <Textarea
                    id="edit-vendor-notes"
                    value={editingVendor.notes}
                    onChange={(e) => setEditingVendor({...editingVendor, notes: e.target.value})}
                    placeholder="Additional notes about vendor"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={updateVendorAction} className="flex-1">Save Changes</Button>
                  <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
