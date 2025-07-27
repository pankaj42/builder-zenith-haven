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
import {
  Plus,
  Edit,
  Trash2,
  Archive,
  Copy,
  ExternalLink,
  Users,
  Target,
  Calendar,
  Settings,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FolderOpen,
  Mail,
  UserPlus,
  Send
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { usePanelContext } from "@/contexts/PanelContext";

interface Project {
  id: string;
  name: string;
  clientName: string;
  clientLink: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  createdDate: string;
  completes: number;
  terminates: number;
  quotaFull: number;
  totalQuota: number;
  quotas: {
    age: { min: number; max: number; quota: number; current: number };
    gender: { male: number; female: number; maleQuota: number; femaleQuota: number };
    location: { countries: string[]; quotaPerCountry: number };
  };
  vendors: string[];
  estimatedDuration: number;
  incentive: string;
}

export default function Projects() {
  const { state, createProject, updateProject, deleteProject, assignVendorToProject, removeVendorFromProject } = usePanelContext();

  const projects = state.projects;
  const setProjects = (newProjects: Project[] | ((prev: Project[]) => Project[])) => {
    // This will be handled by the context actions, but we keep the interface for compatibility
    console.log('Projects update triggered');
  };

  const [staticProjects] = useState<Project[]>([
    {
      id: "P12345",
      name: "Consumer Behavior Study 2024",
      clientName: "Market Research Corp",
      clientLink: "https://survey.client.com/study/12345",
      description: "Comprehensive study on consumer purchasing behavior and preferences in the retail sector.",
      status: "active",
      createdDate: "2024-01-15",
      completes: 847,
      terminates: 312,
      quotaFull: 89,
      totalQuota: 1000,
      quotas: {
        age: { min: 18, max: 65, quota: 1000, current: 847 },
        gender: { male: 420, female: 427, maleQuota: 500, femaleQuota: 500 },
        location: { countries: ["US", "CA", "UK"], quotaPerCountry: 333 }
      },
      vendors: ["V001", "V002", "V003"],
      estimatedDuration: 15,
      incentive: "$2.50"
    },
    {
      id: "P12346",
      name: "Brand Awareness Survey",
      clientName: "BrandCorp Inc",
      clientLink: "https://surveys.brandcorp.com/awareness/456",
      description: "Survey to measure brand awareness and perception across different demographics.",
      status: "active",
      createdDate: "2024-01-20",
      completes: 234,
      terminates: 89,
      quotaFull: 12,
      totalQuota: 500,
      quotas: {
        age: { min: 25, max: 55, quota: 500, current: 234 },
        gender: { male: 112, female: 122, maleQuota: 250, femaleQuota: 250 },
        location: { countries: ["US"], quotaPerCountry: 500 }
      },
      vendors: ["V001", "V004"],
      estimatedDuration: 10,
      incentive: "$1.75"
    },
    {
      id: "P12347",
      name: "Product Feedback Collection",
      clientName: "TechStart Solutions",
      clientLink: "https://feedback.techstart.io/product/789",
      description: "Gathering user feedback on new product features and usability.",
      status: "paused",
      createdDate: "2024-01-10",
      completes: 156,
      terminates: 67,
      quotaFull: 5,
      totalQuota: 300,
      quotas: {
        age: { min: 18, max: 45, quota: 300, current: 156 },
        gender: { male: 78, female: 78, maleQuota: 150, femaleQuota: 150 },
        location: { countries: ["US", "CA"], quotaPerCountry: 150 }
      },
      vendors: ["V002"],
      estimatedDuration: 8,
      incentive: "$1.25"
    }
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showVendorAssignDialog, setShowVendorAssignDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProjectForDetails, setSelectedProjectForDetails] = useState<Project | null>(null);
  const [selectedProjectForVendors, setSelectedProjectForVendors] = useState<Project | null>(null);

  // Available vendors list
  const [availableVendors] = useState([
    { id: "V001", name: "Quality Traffic Solutions", email: "john@qualitytraffic.com" },
    { id: "V002", name: "Survey Source Network", email: "sarah@surveysource.net" },
    { id: "V003", name: "Panel Partners LLC", email: "mike@panelpartners.com" },
  ]);

  const [emailSettings, setEmailSettings] = useState({
    subject: "",
    message: "",
    includeQuotas: true,
    includeStartLink: true,
    selectedVendors: [] as string[]
  });
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: "",
    clientName: "",
    clientLink: "",
    description: "",
    status: "active",
    estimatedDuration: 10,
    incentive: "$2.00",
    totalQuota: 1000,
    quotas: {
      age: { min: 18, max: 65, quota: 1000, current: 0 },
      gender: { male: 0, female: 0, maleQuota: 500, femaleQuota: 500 },
      location: { countries: ["US"], quotaPerCountry: 1000 }
    }
  });

  const generateProjectId = () => {
    return "P" + Math.floor(Math.random() * 90000 + 10000);
  };

  const createProjectAction = () => {
    createProject(newProject as Omit<Project, 'id' | 'createdDate' | 'completes' | 'terminates' | 'quotaFull' | 'vendors'>);
    setShowCreateDialog(false);
    setNewProject({
      name: "",
      clientName: "",
      clientLink: "",
      description: "",
      status: "active",
      estimatedDuration: 10,
      incentive: "$2.00",
      totalQuota: 1000,
      quotas: {
        age: { min: 18, max: 65, quota: 1000, current: 0 },
        gender: { male: 0, female: 0, maleQuota: 500, femaleQuota: 500 },
        location: { countries: ["US"], quotaPerCountry: 1000 }
      }
    });
  };

  const updateProjectStatus = (projectId: string, status: Project['status']) => {
    updateProject(projectId, { status });
  };

  const deleteProjectAction = (projectId: string) => {
    deleteProject(projectId);
  };

  // Reusable copy function that works in all contexts
  const copyToClipboard = (text: string, description: string = "text") => {
    try {
      // Use fallback method that works in all contexts
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
        alert(`✅ ${description} Copied!\n\n${text}`);
      } else {
        // Show link in prompt for manual copy
        prompt(`Copy this ${description.toLowerCase()}:`, text);
      }
    } catch (err) {
      console.error("Copy failed:", err);
      // Last resort - show in prompt
      prompt(`Copy this ${description.toLowerCase()}:`, text);
    }
  };

  const copyProjectLink = (projectId: string, vendorId: string = "VENDOR_ID") => {
    const link = `https://yourpanel.com/start/${projectId}/${vendorId}/?ID=`;
    copyToClipboard(link, "Vendor Start Link");
  };

  const generatePanelLink = (project: Project) => {
    return `https://yourpanel.com/start/${project.id}/VENDOR_ID/?ID=`;
  };

  const getRedirectParameter = (project: Project) => {
    // This is what you add to your client's original survey link
    const redirectBase = "https://yourpanel.com/collect";
    return `&redirect_url=${encodeURIComponent(redirectBase)}/${project.id}`;
  };

  const showProjectDetails = (project: Project) => {
    setSelectedProjectForDetails(project);
    setShowDetailsDialog(true);
  };

  const showVendorAssignment = (project: Project) => {
    setSelectedProjectForVendors(project);
    setShowVendorAssignDialog(true);
  };

  const showEmailVendors = (project: Project) => {
    setSelectedProjectForVendors(project);
    setEmailSettings({
      subject: `New Project Assignment: ${project.name}`,
      message: `Hello,\n\nYou have been assigned to work on our new project "${project.name}" for client ${project.clientName}.\n\nProject Details:\n- Expected Duration: ${project.estimatedDuration} minutes\n- Incentive: ${project.incentive}\n- Total Quota: ${project.totalQuota} completes\n\nYour unique start link and quota details are included below.\n\nBest regards,\nSurveyPanel Team`,
      includeQuotas: true,
      includeStartLink: true,
      selectedVendors: project.vendors
    });
    setShowEmailDialog(true);
  };

  const assignVendorToProjectAction = (projectId: string, vendorId: string) => {
    assignVendorToProject(projectId, vendorId);
  };

  const removeVendorFromProjectAction = (projectId: string, vendorId: string) => {
    removeVendorFromProject(projectId, vendorId);
  };

  const sendVendorEmails = () => {
    if (!selectedProjectForVendors) return;

    const project = selectedProjectForVendors;
    const vendorsToEmail = emailSettings.selectedVendors;

    // Simulate email sending
    vendorsToEmail.forEach(vendorId => {
      const vendor = availableVendors.find(v => v.id === vendorId);
      if (vendor) {
        const startLink = `https://yourpanel.com/start/${project.id}/${vendorId}/?ID=`;

        console.log(`📧 Email sent to ${vendor.name} (${vendor.email})`);
        console.log(`Subject: ${emailSettings.subject}`);
        console.log(`Start Link: ${startLink}`);
        console.log(`Message: ${emailSettings.message}`);

        if (emailSettings.includeQuotas) {
          console.log(`Quotas: Age ${project.quotas.age.min}-${project.quotas.age.max}, Total: ${project.totalQuota}`);
        }
      }
    });

    alert(`✅ Emails sent successfully to ${vendorsToEmail.length} vendor(s)!\n\nVendors will receive:\n- Unique start links\n- Project quotas\n- Assignment details\n\nCheck console for email details.`);
    setShowEmailDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'paused': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
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
              <h2 className="text-2xl font-bold text-foreground">Project Management</h2>
              <p className="text-muted-foreground">Create and manage survey projects with quotas and client links</p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                        placeholder="Enter project name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-name">Client Name</Label>
                      <Input
                        id="client-name"
                        value={newProject.clientName}
                        onChange={(e) => setNewProject({...newProject, clientName: e.target.value})}
                        placeholder="Enter client name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-link">Client Survey Link</Label>
                      <Input
                        id="client-link"
                        value={newProject.clientLink}
                        onChange={(e) => setNewProject({...newProject, clientLink: e.target.value})}
                        placeholder="https://client.com/survey/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        placeholder="Enter project description"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Quotas and Settings */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="total-quota">Total Quota</Label>
                        <Input
                          id="total-quota"
                          type="number"
                          value={newProject.totalQuota}
                          onChange={(e) => setNewProject({...newProject, totalQuota: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Est. Duration (min)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={newProject.estimatedDuration}
                          onChange={(e) => setNewProject({...newProject, estimatedDuration: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="incentive">Incentive</Label>
                      <Input
                        id="incentive"
                        value={newProject.incentive}
                        onChange={(e) => setNewProject({...newProject, incentive: e.target.value})}
                        placeholder="$2.00"
                      />
                    </div>

                    {/* Age Quotas */}
                    <div className="space-y-2">
                      <Label>Age Range</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="Min age"
                          value={newProject.quotas?.age.min}
                          onChange={(e) => setNewProject({
                            ...newProject,
                            quotas: {
                              ...newProject.quotas!,
                              age: { ...newProject.quotas!.age, min: parseInt(e.target.value) }
                            }
                          })}
                        />
                        <Input
                          type="number"
                          placeholder="Max age"
                          value={newProject.quotas?.age.max}
                          onChange={(e) => setNewProject({
                            ...newProject,
                            quotas: {
                              ...newProject.quotas!,
                              age: { ...newProject.quotas!.age, max: parseInt(e.target.value) }
                            }
                          })}
                        />
                      </div>
                    </div>

                    {/* Gender Quotas */}
                    <div className="space-y-2">
                      <Label>Gender Quotas</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="Male quota"
                          value={newProject.quotas?.gender.maleQuota}
                          onChange={(e) => setNewProject({
                            ...newProject,
                            quotas: {
                              ...newProject.quotas!,
                              gender: { ...newProject.quotas!.gender, maleQuota: parseInt(e.target.value) }
                            }
                          })}
                        />
                        <Input
                          type="number"
                          placeholder="Female quota"
                          value={newProject.quotas?.gender.femaleQuota}
                          onChange={(e) => setNewProject({
                            ...newProject,
                            quotas: {
                              ...newProject.quotas!,
                              gender: { ...newProject.quotas!.gender, femaleQuota: parseInt(e.target.value) }
                            }
                          })}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={createProject} className="flex-1">Create Project</Button>
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Projects Grid */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{project.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{project.clientName}</p>
                    </div>
                    <Badge className={`${getStatusColor(project.status)} flex items-center gap-1`}>
                      {getStatusIcon(project.status)}
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-mono">{project.id}</span>
                    <span>{project.createdDate}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.completes}/{project.totalQuota}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(project.completes / project.totalQuota) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-green-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-green-700">{project.completes}</div>
                      <div className="text-xs text-green-600">Completes</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-orange-700">{project.terminates}</div>
                      <div className="text-xs text-orange-600">Terminates</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-blue-700">{project.quotaFull}</div>
                      <div className="text-xs text-blue-600">Quota Full</div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{project.estimatedDuration} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Incentive:</span>
                      <span className="font-medium">{project.incentive}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vendors:</span>
                      <span>{project.vendors.length} assigned</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-1 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => showProjectDetails(project)}
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1"
                            onClick={() => copyProjectLink(project.id)}
                            title="Copy Vendor Start Link">
                      <Copy className="w-3 h-3" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1"
                            onClick={() => showVendorAssignment(project)}
                            title="Assign Vendors">
                      <UserPlus className="w-3 h-3" />
                      Assign
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1"
                            onClick={() => showEmailVendors(project)}
                            title="Email Vendors">
                      <Mail className="w-3 h-3" />
                      Email
                    </Button>
                  </div>

                  {/* Status Actions */}
                  <div className="flex gap-2">
                    {project.status === 'active' && (
                      <Button variant="outline" size="sm" className="flex-1"
                              onClick={() => updateProjectStatus(project.id, 'paused')}>
                        Pause
                      </Button>
                    )}
                    {project.status === 'paused' && (
                      <Button variant="outline" size="sm" className="flex-1"
                              onClick={() => updateProjectStatus(project.id, 'active')}>
                        Resume
                      </Button>
                    )}
                    {(project.status === 'active' || project.status === 'paused') && (
                      <Button variant="outline" size="sm" className="flex-1"
                              onClick={() => updateProjectStatus(project.id, 'completed')}>
                        Complete
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Project</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{project.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteProject(project.id)} className="bg-red-600 hover:bg-red-700">
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
        </main>
      </div>

      {/* Project Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Project Details - {selectedProjectForDetails?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedProjectForDetails && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Project ID:</span>
                    <span className="font-mono font-medium">{selectedProjectForDetails.id}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Project Name:</span>
                    <span className="font-medium">{selectedProjectForDetails.name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Client Name:</span>
                    <span className="font-medium">{selectedProjectForDetails.clientName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={getStatusColor(selectedProjectForDetails.status)}>
                      {getStatusIcon(selectedProjectForDetails.status)}
                      {selectedProjectForDetails.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created Date:</span>
                    <span className="font-medium">{selectedProjectForDetails.createdDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{selectedProjectForDetails.estimatedDuration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Incentive:</span>
                    <span className="font-medium text-green-600">{selectedProjectForDetails.incentive}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-4">
                  <h4 className="text-md font-semibold mb-2">Description</h4>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{selectedProjectForDetails.description}</p>
                  </div>
                </div>

                {/* Link Flow Management */}
                <div className="mt-4 space-y-4">
                  <h4 className="text-md font-semibold mb-2">Link Flow Management</h4>

                  {/* Original Client Link */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-blue-600">1. Original Client Survey Link</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={selectedProjectForDetails.clientLink}
                        readOnly
                        className="text-sm bg-blue-50"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(selectedProjectForDetails.clientLink, "Client Survey URL")}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(selectedProjectForDetails.clientLink, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Modified Client Link with Redirect */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-green-600">2. Modified Client Link (Add this to your client's survey)</Label>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-700 mb-2">Add this parameter to your client's survey URL:</p>
                      <div className="flex items-center gap-2">
                        <Input
                          value={getRedirectParameter(selectedProjectForDetails)}
                          readOnly
                          className="text-xs font-mono bg-white"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(getRedirectParameter(selectedProjectForDetails), "Redirect Parameter")}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-green-600 mt-2">This ensures responses flow back to your panel for tracking</p>
                    </div>
                  </div>

                  {/* Panel Start Link */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-purple-600">3. Panel Start Link (Share with Vendors)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={generatePanelLink(selectedProjectForDetails)}
                        readOnly
                        className="text-sm bg-purple-50 font-mono"
                      />
                      <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatePanelLink(selectedProjectForDetails), "Panel Start Link")}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    </div>
                    <p className="text-xs text-purple-600">Vendors append their respondent ID after 'ID=' parameter</p>
                  </div>

                  {/* Flow Explanation */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h5 className="text-sm font-semibold mb-2">How the Flow Works:</h5>
                    <div className="space-y-2 text-xs text-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Vendor sends traffic to your Panel Start Link</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Panel redirects to your client's modified survey link</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Survey completes and redirects back to your panel</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Panel logs response and shows custom redirect page</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Client gets responses; vendors get dashboard updates</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics and Progress */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-3">Statistics & Progress</h3>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{selectedProjectForDetails.completes}/{selectedProjectForDetails.totalQuota}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full"
                      style={{ width: `${(selectedProjectForDetails.completes / selectedProjectForDetails.totalQuota) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                    {((selectedProjectForDetails.completes / selectedProjectForDetails.totalQuota) * 100).toFixed(1)}% completed
                  </div>
                </div>

                {/* Response Statistics */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">{selectedProjectForDetails.completes}</div>
                    <div className="text-sm text-green-600">Completes</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-700">{selectedProjectForDetails.terminates}</div>
                    <div className="text-sm text-orange-600">Terminates</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">{selectedProjectForDetails.quotaFull}</div>
                    <div className="text-sm text-blue-600">Quota Full</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700">{selectedProjectForDetails.totalQuota}</div>
                    <div className="text-sm text-purple-600">Target Quota</div>
                  </div>
                </div>

                {/* Completion Rate */}
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-700">
                      {((selectedProjectForDetails.completes / (selectedProjectForDetails.completes + selectedProjectForDetails.terminates)) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-blue-600">Completion Rate</div>
                  </div>
                </div>

                {/* Assigned Vendors */}
                <div className="mt-4">
                  <h4 className="text-md font-semibold mb-2">Assigned Vendors ({selectedProjectForDetails.vendors.length})</h4>
                  <div className="space-y-2">
                    {selectedProjectForDetails.vendors.length > 0 ? (
                      selectedProjectForDetails.vendors.map((vendorId, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                          <span className="font-mono text-sm">{vendorId}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyProjectLink(selectedProjectForDetails.id, vendorId)}
                              className="gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              Copy Start Link
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">No vendors assigned</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quota Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-3">Quota Settings</h3>

                {/* Age Quota */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-md font-semibold mb-2 text-blue-800">Age Requirements</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Age Range:</span>
                      <span className="font-medium text-blue-900">
                        {selectedProjectForDetails.quotas.age.min} - {selectedProjectForDetails.quotas.age.max} years
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Target Quota:</span>
                      <span className="font-medium text-blue-900">{selectedProjectForDetails.quotas.age.quota}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Current:</span>
                      <span className="font-medium text-blue-900">{selectedProjectForDetails.quotas.age.current}</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(selectedProjectForDetails.quotas.age.current / selectedProjectForDetails.quotas.age.quota) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Gender Quota */}
                <div className="p-4 bg-pink-50 rounded-lg">
                  <h4 className="text-md font-semibold mb-2 text-pink-800">Gender Distribution</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-pink-700">Male:</span>
                        <span className="font-medium text-pink-900">
                          {selectedProjectForDetails.quotas.gender.male} / {selectedProjectForDetails.quotas.gender.maleQuota}
                        </span>
                      </div>
                      <div className="w-full bg-pink-200 rounded-full h-2">
                        <div
                          className="bg-pink-600 h-2 rounded-full"
                          style={{ width: `${(selectedProjectForDetails.quotas.gender.male / selectedProjectForDetails.quotas.gender.maleQuota) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-pink-700">Female:</span>
                        <span className="font-medium text-pink-900">
                          {selectedProjectForDetails.quotas.gender.female} / {selectedProjectForDetails.quotas.gender.femaleQuota}
                        </span>
                      </div>
                      <div className="w-full bg-pink-200 rounded-full h-2">
                        <div
                          className="bg-pink-600 h-2 rounded-full"
                          style={{ width: `${(selectedProjectForDetails.quotas.gender.female / selectedProjectForDetails.quotas.gender.femaleQuota) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Quota */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="text-md font-semibold mb-2 text-green-800">Location Requirements</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-green-700">Target Countries:</span>
                      <span className="font-medium text-green-900">
                        {selectedProjectForDetails.quotas.location.countries.join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Quota per Country:</span>
                      <span className="font-medium text-green-900">{selectedProjectForDetails.quotas.location.quotaPerCountry}</span>
                    </div>
                  </div>
                </div>

                {/* Project Actions */}
                <div className="mt-6 space-y-2">
                  <h4 className="text-md font-semibold mb-2">Quick Actions</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => copyProjectLink(selectedProjectForDetails.id)}
                    >
                      <Copy className="w-4 h-4" />
                      Copy Vendor Start Link Template
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => window.open(selectedProjectForDetails.clientLink, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Test Client Survey Link
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Project Settings
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Vendor Assignment Dialog */}
      <Dialog open={showVendorAssignDialog} onOpenChange={setShowVendorAssignDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Assign Vendors - {selectedProjectForVendors?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedProjectForVendors && (
            <div className="space-y-6">
              {/* Project Info */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Project Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Project ID:</span>
                    <span className="font-mono ml-2">{selectedProjectForVendors.id}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Client:</span>
                    <span className="ml-2">{selectedProjectForVendors.clientName}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Total Quota:</span>
                    <span className="ml-2">{selectedProjectForVendors.totalQuota} completes</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Incentive:</span>
                    <span className="ml-2">{selectedProjectForVendors.incentive}</span>
                  </div>
                </div>
              </div>

              {/* Currently Assigned Vendors */}
              <div>
                <h4 className="font-semibold mb-3">Currently Assigned Vendors ({selectedProjectForVendors.vendors.length})</h4>
                <div className="space-y-2">
                  {selectedProjectForVendors.vendors.length > 0 ? (
                    selectedProjectForVendors.vendors.map((vendorId) => {
                      const vendor = availableVendors.find(v => v.id === vendorId);
                      return (
                        <div key={`assigned-${vendorId}`} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <div>
                              <p className="font-medium">{vendor?.name || vendorId}</p>
                              <p className="text-sm text-gray-600">{vendor?.email}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyProjectLink(selectedProjectForVendors.id, vendorId)}
                              className="gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              Copy Link
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeVendorFromProject(selectedProjectForVendors.id, vendorId)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-center py-4">No vendors assigned yet</p>
                  )}
                </div>
              </div>

              {/* Available Vendors */}
              <div>
                <h4 className="font-semibold mb-3">Available Vendors</h4>
                <div className="space-y-2">
                  {availableVendors
                    .filter(vendor => !selectedProjectForVendors.vendors.includes(vendor.id))
                    .map((vendor) => (
                      <div key={`available-${vendor.id}`} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Users className="w-4 h-4 text-gray-600" />
                          <div>
                            <p className="font-medium">{vendor.name}</p>
                            <p className="text-sm text-gray-600">{vendor.email}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => assignVendorToProject(selectedProjectForVendors.id, vendor.id)}
                          className="gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Assign
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Vendors Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Vendors - {selectedProjectForVendors?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedProjectForVendors && (
            <div className="space-y-6">
              {/* Email Recipients */}
              <div>
                <h4 className="font-semibold mb-3">Select Recipients</h4>
                <div className="space-y-2">
                  {selectedProjectForVendors.vendors.map((vendorId) => {
                    const vendor = availableVendors.find(v => v.id === vendorId);
                    return (
                      <div key={`email-${vendorId}`} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Switch
                          checked={emailSettings.selectedVendors.includes(vendorId)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setEmailSettings({
                                ...emailSettings,
                                selectedVendors: [...emailSettings.selectedVendors, vendorId]
                              });
                            } else {
                              setEmailSettings({
                                ...emailSettings,
                                selectedVendors: emailSettings.selectedVendors.filter(v => v !== vendorId)
                              });
                            }
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{vendor?.name || vendorId}</p>
                          <p className="text-sm text-gray-600">{vendor?.email}</p>
                        </div>
                        <Badge variant="outline">{vendorId}</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Email Settings */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Email Settings</Label>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={emailSettings.includeStartLink}
                        onCheckedChange={(checked) => setEmailSettings({...emailSettings, includeStartLink: checked})}
                      />
                      <Label>Include Start Links</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={emailSettings.includeQuotas}
                        onCheckedChange={(checked) => setEmailSettings({...emailSettings, includeQuotas: checked})}
                      />
                      <Label>Include Project Quotas</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input
                    id="email-subject"
                    value={emailSettings.subject}
                    onChange={(e) => setEmailSettings({...emailSettings, subject: e.target.value})}
                    placeholder="Email subject"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-message">Message</Label>
                  <Textarea
                    id="email-message"
                    value={emailSettings.message}
                    onChange={(e) => setEmailSettings({...emailSettings, message: e.target.value})}
                    placeholder="Email message"
                    rows={8}
                  />
                </div>
              </div>

              {/* Email Preview */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Email Preview</h4>
                <div className="text-sm space-y-2">
                  <p><strong>To:</strong> {emailSettings.selectedVendors.length} selected vendor(s)</p>
                  <p><strong>Subject:</strong> {emailSettings.subject}</p>
                  <div className="mt-3 p-3 bg-white rounded border">
                    <div className="whitespace-pre-wrap">{emailSettings.message}</div>
                    {emailSettings.includeStartLink && (
                      <div className="mt-4 p-2 bg-blue-50 rounded">
                        <strong>Your Start Link:</strong>
                        <br />
                        <code className="text-xs">https://yourpanel.com/start/{selectedProjectForVendors.id}/[VENDOR_ID]/?ID=</code>
                      </div>
                    )}
                    {emailSettings.includeQuotas && (
                      <div className="mt-2 p-2 bg-green-50 rounded">
                        <strong>Project Quotas:</strong>
                        <br />
                        <span className="text-xs">
                          Age: {selectedProjectForVendors.quotas.age.min}-{selectedProjectForVendors.quotas.age.max} |
                          Total: {selectedProjectForVendors.totalQuota} completes |
                          Incentive: {selectedProjectForVendors.incentive}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Send Button */}
              <div className="flex gap-2">
                <Button
                  onClick={sendVendorEmails}
                  className="flex-1 gap-2"
                  disabled={emailSettings.selectedVendors.length === 0}
                >
                  <Send className="w-4 h-4" />
                  Send Emails ({emailSettings.selectedVendors.length})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowEmailDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
