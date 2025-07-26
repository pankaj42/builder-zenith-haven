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
  AlertTriangle
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

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
  const [projects, setProjects] = useState<Project[]>([
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
  const [editingProject, setEditingProject] = useState<Project | null>(null);
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

  const createProject = () => {
    const project: Project = {
      ...newProject as Project,
      id: generateProjectId(),
      createdDate: new Date().toISOString().split('T')[0],
      completes: 0,
      terminates: 0,
      quotaFull: 0,
      vendors: []
    };
    setProjects([...projects, project]);
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
    setProjects(projects.map(p => p.id === projectId ? { ...p, status } : p));
  };

  const deleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const copyProjectLink = (projectId: string, vendorId: string = "VENDOR_ID") => {
    const link = `https://yourpanel.com/start/${projectId}/${vendorId}/?ID=`;
    navigator.clipboard.writeText(link);
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

  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", href: "/", active: false },
    { icon: Globe, label: "Projects", href: "/projects", active: true },
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
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Eye className="w-3 h-3" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1"
                            onClick={() => copyProjectLink(project.id)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1"
                            onClick={() => window.open(project.clientLink, '_blank')}>
                      <ExternalLink className="w-3 h-3" />
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
    </div>
  );
}
