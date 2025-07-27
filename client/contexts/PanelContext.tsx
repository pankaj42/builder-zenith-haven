import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
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

interface Response {
  id: string;
  projectId: string;
  vendorId: string;
  uid: string;
  status: 'complete' | 'terminate' | 'quota-full' | 'study-closed';
  ip: string;
  timestamp: string;
  duration?: number;
  fraudScore?: number;
}

interface PanelState {
  projects: Project[];
  vendors: Vendor[];
  responses: Response[];
  stats: {
    totalCompletes: number;
    totalTerminates: number;
    totalQuotaFull: number;
    overallCompletionRate: number;
    totalEarnings: number;
    avgResponseTime: number;
  };
}

interface PanelContextType {
  state: PanelState;
  
  // Project actions
  createProject: (project: Omit<Project, 'id' | 'createdDate' | 'completes' | 'terminates' | 'quotaFull' | 'vendors'>) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  assignVendorToProject: (projectId: string, vendorId: string) => void;
  removeVendorFromProject: (projectId: string, vendorId: string) => void;
  
  // Vendor actions
  createVendor: (vendor: Omit<Vendor, 'id' | 'createdDate' | 'assignedProjects'>) => void;
  updateVendor: (vendorId: string, updates: Partial<Vendor>) => void;
  deleteVendor: (vendorId: string) => void;
  
  // Response actions
  addResponse: (response: Omit<Response, 'id' | 'timestamp'>) => void;
  
  // Utility functions
  getProjectById: (id: string) => Project | undefined;
  getVendorById: (id: string) => Vendor | undefined;
  getProjectsByVendor: (vendorId: string) => Project[];
  getVendorsByProject: (projectId: string) => Vendor[];
  getResponsesByProject: (projectId: string) => Response[];
  getResponsesByVendor: (vendorId: string) => Response[];
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

// Initial data
const initialProjects: Project[] = [
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
    vendors: ["V001", "V002"],
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
    vendors: ["V001"],
    estimatedDuration: 10,
    incentive: "$1.75"
  }
];

const initialVendors: Vendor[] = [
  {
    id: "V001",
    name: "Quality Traffic Solutions",
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
    name: "Survey Source Network",
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
    assignedProjects: ["P12345"],
    paymentMethod: "Bank Transfer",
    notes: "Reliable vendor with consistent quality and quick response times."
  }
];

export function PanelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PanelState>({
    projects: initialProjects,
    vendors: initialVendors,
    responses: [],
    stats: {
      totalCompletes: 0,
      totalTerminates: 0,
      totalQuotaFull: 0,
      overallCompletionRate: 0,
      totalEarnings: 0,
      avgResponseTime: 12.0
    }
  });

  // Calculate stats whenever data changes
  useEffect(() => {
    const totalCompletes = state.projects.reduce((sum, p) => sum + p.completes, 0);
    const totalTerminates = state.projects.reduce((sum, p) => sum + p.terminates, 0);
    const totalQuotaFull = state.projects.reduce((sum, p) => sum + p.quotaFull, 0);
    const totalResponses = totalCompletes + totalTerminates + totalQuotaFull;
    const overallCompletionRate = totalResponses > 0 ? (totalCompletes / totalResponses) * 100 : 0;
    const totalEarnings = state.projects.reduce((sum, p) => {
      const incentiveAmount = parseFloat(p.incentive.replace('$', ''));
      return sum + (p.completes * incentiveAmount);
    }, 0);

    setState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        totalCompletes,
        totalTerminates,
        totalQuotaFull,
        overallCompletionRate,
        totalEarnings
      }
    }));
  }, [state.projects, state.responses]);

  // Project actions
  const createProject = (projectData: Omit<Project, 'id' | 'createdDate' | 'completes' | 'terminates' | 'quotaFull' | 'vendors'>) => {
    const newProject: Project = {
      ...projectData,
      id: `P${Math.floor(Math.random() * 90000 + 10000)}`,
      createdDate: new Date().toISOString().split('T')[0],
      completes: 0,
      terminates: 0,
      quotaFull: 0,
      vendors: []
    };
    
    setState(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => 
        p.id === projectId ? { ...p, ...updates } : p
      )
    }));
  };

  const deleteProject = (projectId: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId),
      vendors: prev.vendors.map(v => ({
        ...v,
        assignedProjects: v.assignedProjects.filter(pid => pid !== projectId)
      })),
      responses: prev.responses.filter(r => r.projectId !== projectId)
    }));
  };

  const assignVendorToProject = (projectId: string, vendorId: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => 
        p.id === projectId 
          ? { ...p, vendors: [...new Set([...p.vendors, vendorId])] }
          : p
      ),
      vendors: prev.vendors.map(v => 
        v.id === vendorId 
          ? { ...v, assignedProjects: [...new Set([...v.assignedProjects, projectId])] }
          : v
      )
    }));
  };

  const removeVendorFromProject = (projectId: string, vendorId: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => 
        p.id === projectId 
          ? { ...p, vendors: p.vendors.filter(v => v !== vendorId) }
          : p
      ),
      vendors: prev.vendors.map(v => 
        v.id === vendorId 
          ? { ...v, assignedProjects: v.assignedProjects.filter(pid => pid !== projectId) }
          : v
      )
    }));
  };

  // Vendor actions
  const createVendor = (vendorData: Omit<Vendor, 'id' | 'createdDate' | 'assignedProjects'>) => {
    const newVendor: Vendor = {
      ...vendorData,
      id: `V${Math.floor(Math.random() * 900 + 100)}`,
      createdDate: new Date().toISOString().split('T')[0],
      assignedProjects: []
    };
    
    setState(prev => ({
      ...prev,
      vendors: [...prev.vendors, newVendor]
    }));
  };

  const updateVendor = (vendorId: string, updates: Partial<Vendor>) => {
    setState(prev => ({
      ...prev,
      vendors: prev.vendors.map(v => 
        v.id === vendorId ? { ...v, ...updates } : v
      )
    }));
  };

  const deleteVendor = (vendorId: string) => {
    setState(prev => ({
      ...prev,
      vendors: prev.vendors.filter(v => v.id !== vendorId),
      projects: prev.projects.map(p => ({
        ...p,
        vendors: p.vendors.filter(vid => vid !== vendorId)
      })),
      responses: prev.responses.filter(r => r.vendorId !== vendorId)
    }));
  };

  // Response actions
  const addResponse = (responseData: Omit<Response, 'id' | 'timestamp'>) => {
    const newResponse: Response = {
      ...responseData,
      id: `R${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    
    setState(prev => {
      // Update project stats
      const updatedProjects = prev.projects.map(p => {
        if (p.id === responseData.projectId) {
          const updates: Partial<Project> = {};
          if (responseData.status === 'complete') {
            updates.completes = p.completes + 1;
          } else if (responseData.status === 'terminate') {
            updates.terminates = p.terminates + 1;
          } else if (responseData.status === 'quota-full') {
            updates.quotaFull = p.quotaFull + 1;
          }
          return { ...p, ...updates };
        }
        return p;
      });

      // Update vendor stats
      const updatedVendors = prev.vendors.map(v => {
        if (v.id === responseData.vendorId) {
          const updates: Partial<Vendor> = {
            totalSent: v.totalSent + 1
          };
          if (responseData.status === 'complete') {
            updates.totalCompletes = v.totalCompletes + 1;
          }
          return { ...v, ...updates };
        }
        return v;
      });

      return {
        ...prev,
        projects: updatedProjects,
        vendors: updatedVendors,
        responses: [...prev.responses, newResponse]
      };
    });
  };

  // Utility functions
  const getProjectById = (id: string) => state.projects.find(p => p.id === id);
  const getVendorById = (id: string) => state.vendors.find(v => v.id === id);
  const getProjectsByVendor = (vendorId: string) => 
    state.projects.filter(p => p.vendors.includes(vendorId));
  const getVendorsByProject = (projectId: string) => 
    state.vendors.filter(v => v.assignedProjects.includes(projectId));
  const getResponsesByProject = (projectId: string) => 
    state.responses.filter(r => r.projectId === projectId);
  const getResponsesByVendor = (vendorId: string) => 
    state.responses.filter(r => r.vendorId === vendorId);

  const contextValue: PanelContextType = {
    state,
    createProject,
    updateProject,
    deleteProject,
    assignVendorToProject,
    removeVendorFromProject,
    createVendor,
    updateVendor,
    deleteVendor,
    addResponse,
    getProjectById,
    getVendorById,
    getProjectsByVendor,
    getVendorsByProject,
    getResponsesByProject,
    getResponsesByVendor
  };

  return (
    <PanelContext.Provider value={contextValue}>
      {children}
    </PanelContext.Provider>
  );
}

export function usePanelContext() {
  const context = useContext(PanelContext);
  if (context === undefined) {
    throw new Error('usePanelContext must be used within a PanelProvider');
  }
  return context;
}
