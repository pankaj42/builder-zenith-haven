import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Try to import Supabase, fallback to localStorage if not available
let supabase: any = null;
let Database: any = null;

try {
  const supabaseModule = await import('@/lib/supabase');
  supabase = supabaseModule.supabase;
  Database = supabaseModule.Database;
} catch (error) {
  console.log('Supabase not available, using localStorage fallback');
}

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
}

interface Response {
  id: string;
  projectId: string;
  vendorId: string;
  vendorUID: string;
  status: 'complete' | 'terminate' | 'quota-full' | 'in-progress';
  ipAddress: string;
  country: string;
  city: string;
  browser: string;
  device: string;
  completionTime: number;
  timestamp: string;
}

interface PanelStats {
  totalResponses: number;
  totalRevenue: number;
  averageCompletionTime: number;
  topPerformingVendor: string;
  activeProjects: number;
  completionRate: number;
}

interface PanelContextType {
  state: {
    projects: Project[];
    vendors: Vendor[];
    responses: Response[];
    stats: PanelStats;
    loading: boolean;
    error: string | null;
    isSupabaseConnected: boolean;
  };
  actions: {
    createProject: (project: Omit<Project, 'id' | 'createdDate'>) => Promise<void>;
    updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    createVendor: (vendor: Omit<Vendor, 'id' | 'createdDate'>) => Promise<void>;
    updateVendor: (id: string, updates: Partial<Vendor>) => Promise<void>;
    deleteVendor: (id: string) => Promise<void>;
    addResponse: (response: Omit<Response, 'id' | 'timestamp'>) => Promise<void>;
    assignVendorToProject: (projectId: string, vendorId: string) => Promise<void>;
    refreshData: () => Promise<void>;
  };
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

// Check if Supabase is properly configured
const isSupabaseAvailable = () => {
  return supabase && 
         import.meta.env.VITE_SUPABASE_URL && 
         import.meta.env.VITE_SUPABASE_ANON_KEY;
};

export function PanelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PanelContextType['state']>({
    projects: [],
    vendors: [],
    responses: [],
    stats: {
      totalResponses: 0,
      totalRevenue: 0,
      averageCompletionTime: 0,
      topPerformingVendor: '',
      activeProjects: 0,
      completionRate: 0
    },
    loading: true,
    error: null,
    isSupabaseConnected: false
  });

  // Initialize data on component mount
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      if (isSupabaseAvailable()) {
        console.log('🚀 Supabase connected! Loading data from database...');
        await loadDataFromSupabase();
        setState(prev => ({ ...prev, isSupabaseConnected: true }));
      } else {
        console.log('📁 Using localStorage fallback...');
        loadDataFromLocalStorage();
        setState(prev => ({ ...prev, isSupabaseConnected: false }));
      }
    } catch (error) {
      console.error('Error initializing data:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to load data',
        isSupabaseConnected: false 
      }));
      // Fallback to localStorage if Supabase fails
      loadDataFromLocalStorage();
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const loadDataFromSupabase = async () => {
    if (!supabase) throw new Error('Supabase not available');

    // Load projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('created_date', { ascending: false });
    
    if (projectsError) throw projectsError;

    // Load vendors
    const { data: vendors, error: vendorsError } = await supabase
      .from('vendors')
      .select('*')
      .order('created_date', { ascending: false });
    
    if (vendorsError) throw vendorsError;

    // Load responses
    const { data: responses, error: responsesError } = await supabase
      .from('responses')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1000);
    
    if (responsesError) throw responsesError;

    // Transform Supabase data to match our interface
    const transformedProjects = (projects || []).map(transformSupabaseProject);
    const transformedVendors = (vendors || []).map(transformSupabaseVendor);
    const transformedResponses = (responses || []).map(transformSupabaseResponse);

    setState(prev => ({
      ...prev,
      projects: transformedProjects,
      vendors: transformedVendors,
      responses: transformedResponses,
      stats: calculateStats(transformedProjects, transformedVendors, transformedResponses)
    }));
  };

  const loadDataFromLocalStorage = () => {
    try {
      const savedProjects = localStorage.getItem('survey-panel-projects');
      const savedVendors = localStorage.getItem('survey-panel-vendors');
      const savedResponses = localStorage.getItem('survey-panel-responses');

      const projects = savedProjects ? JSON.parse(savedProjects) : generateDefaultProjects();
      const vendors = savedVendors ? JSON.parse(savedVendors) : generateDefaultVendors();
      const responses = savedResponses ? JSON.parse(savedResponses) : generateDefaultResponses();

      setState(prev => ({
        ...prev,
        projects,
        vendors,
        responses,
        stats: calculateStats(projects, vendors, responses)
      }));

      // Save defaults if nothing was saved before
      if (!savedProjects) localStorage.setItem('survey-panel-projects', JSON.stringify(projects));
      if (!savedVendors) localStorage.setItem('survey-panel-vendors', JSON.stringify(vendors));
      if (!savedResponses) localStorage.setItem('survey-panel-responses', JSON.stringify(responses));

    } catch (error) {
      console.error('Error loading from localStorage:', error);
      // Use defaults if localStorage fails
      const projects = generateDefaultProjects();
      const vendors = generateDefaultVendors();
      const responses = generateDefaultResponses();

      setState(prev => ({
        ...prev,
        projects,
        vendors,
        responses,
        stats: calculateStats(projects, vendors, responses)
      }));
    }
  };

  // Transform functions for Supabase data
  const transformSupabaseProject = (dbProject: any): Project => ({
    id: dbProject.id,
    name: dbProject.name,
    clientName: dbProject.client_name,
    clientLink: dbProject.client_link || '',
    description: dbProject.description || '',
    status: dbProject.status,
    createdDate: dbProject.created_date,
    completes: dbProject.completes || 0,
    terminates: dbProject.terminates || 0,
    quotaFull: dbProject.quota_full || 0,
    totalQuota: dbProject.total_quota || 1000,
    quotas: dbProject.quotas || {
      age: { min: 18, max: 65, quota: 500, current: 0 },
      gender: { male: 50, female: 50, maleQuota: 500, femaleQuota: 500 },
      location: { countries: ['US'], quotaPerCountry: 1000 }
    },
    vendors: dbProject.vendors || [],
    estimatedDuration: dbProject.estimated_duration || 15,
    incentive: dbProject.incentive || '$2.50'
  });

  const transformSupabaseVendor = (dbVendor: any): Vendor => ({
    id: dbVendor.id,
    name: dbVendor.name,
    email: dbVendor.email,
    phone: dbVendor.phone || '',
    company: dbVendor.company || '',
    status: dbVendor.status,
    createdDate: dbVendor.created_date,
    completionRate: dbVendor.completion_rate || 0,
    terminateRate: dbVendor.terminate_rate || 0,
    fraudScore: dbVendor.fraud_score || 1.0,
    totalSent: dbVendor.total_sent || 0,
    totalCompletes: dbVendor.total_completes || 0,
    redirectUrls: dbVendor.redirect_urls || {
      complete: '',
      terminate: '',
      quotaFull: ''
    },
    redirectSettings: dbVendor.redirect_settings || {
      enabled: true,
      passthrough: false,
      appendParams: true,
      customParams: ''
    }
  });

  const transformSupabaseResponse = (dbResponse: any): Response => ({
    id: dbResponse.id,
    projectId: dbResponse.project_id || '',
    vendorId: dbResponse.vendor_id || '',
    vendorUID: dbResponse.vendor_uid || '',
    status: dbResponse.status,
    ipAddress: dbResponse.ip_address || '',
    country: dbResponse.country || '',
    city: dbResponse.city || '',
    browser: dbResponse.browser || '',
    device: dbResponse.device || '',
    completionTime: dbResponse.completion_time || 0,
    timestamp: dbResponse.timestamp
  });

  // Save data functions
  const saveToStorage = async (key: string, data: any) => {
    if (state.isSupabaseConnected && supabase) {
      // Save to Supabase - implement based on the operation
      return;
    } else {
      // Save to localStorage
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  // Action implementations
  const createProject = async (projectData: Omit<Project, 'id' | 'createdDate'>) => {
    const newProject: Project = {
      ...projectData,
      id: `P${Date.now()}`,
      createdDate: new Date().toISOString()
    };

    if (state.isSupabaseConnected && supabase) {
      const { error } = await supabase.from('projects').insert([{
        id: newProject.id,
        name: newProject.name,
        client_name: newProject.clientName,
        client_link: newProject.clientLink,
        description: newProject.description,
        status: newProject.status,
        total_quota: newProject.totalQuota,
        quotas: newProject.quotas,
        vendors: newProject.vendors,
        estimated_duration: newProject.estimatedDuration,
        incentive: newProject.incentive
      }]);
      
      if (error) throw error;
    }

    const updatedProjects = [...state.projects, newProject];
    setState(prev => ({
      ...prev,
      projects: updatedProjects,
      stats: calculateStats(updatedProjects, prev.vendors, prev.responses)
    }));

    if (!state.isSupabaseConnected) {
      await saveToStorage('survey-panel-projects', updatedProjects);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    if (state.isSupabaseConnected && supabase) {
      const { error } = await supabase
        .from('projects')
        .update({
          name: updates.name,
          client_name: updates.clientName,
          client_link: updates.clientLink,
          description: updates.description,
          status: updates.status,
          completes: updates.completes,
          terminates: updates.terminates,
          quota_full: updates.quotaFull,
          total_quota: updates.totalQuota,
          quotas: updates.quotas,
          vendors: updates.vendors,
          estimated_duration: updates.estimatedDuration,
          incentive: updates.incentive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    }

    const updatedProjects = state.projects.map(project =>
      project.id === id ? { ...project, ...updates } : project
    );

    setState(prev => ({
      ...prev,
      projects: updatedProjects,
      stats: calculateStats(updatedProjects, prev.vendors, prev.responses)
    }));

    if (!state.isSupabaseConnected) {
      await saveToStorage('survey-panel-projects', updatedProjects);
    }
  };

  const deleteProject = async (id: string) => {
    if (state.isSupabaseConnected && supabase) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    }

    const updatedProjects = state.projects.filter(project => project.id !== id);
    
    setState(prev => ({
      ...prev,
      projects: updatedProjects,
      stats: calculateStats(updatedProjects, prev.vendors, prev.responses)
    }));

    if (!state.isSupabaseConnected) {
      await saveToStorage('survey-panel-projects', updatedProjects);
    }
  };

  const createVendor = async (vendorData: Omit<Vendor, 'id' | 'createdDate'>) => {
    const newVendor: Vendor = {
      ...vendorData,
      id: `V${Date.now()}`,
      createdDate: new Date().toISOString()
    };

    if (state.isSupabaseConnected && supabase) {
      const { error } = await supabase.from('vendors').insert([{
        id: newVendor.id,
        name: newVendor.name,
        email: newVendor.email,
        phone: newVendor.phone,
        company: newVendor.company,
        status: newVendor.status,
        completion_rate: newVendor.completionRate,
        terminate_rate: newVendor.terminateRate,
        fraud_score: newVendor.fraudScore,
        total_sent: newVendor.totalSent,
        total_completes: newVendor.totalCompletes,
        redirect_urls: newVendor.redirectUrls,
        redirect_settings: newVendor.redirectSettings
      }]);
      
      if (error) throw error;
    }

    const updatedVendors = [...state.vendors, newVendor];
    setState(prev => ({
      ...prev,
      vendors: updatedVendors,
      stats: calculateStats(prev.projects, updatedVendors, prev.responses)
    }));

    if (!state.isSupabaseConnected) {
      await saveToStorage('survey-panel-vendors', updatedVendors);
    }
  };

  const updateVendor = async (id: string, updates: Partial<Vendor>) => {
    if (state.isSupabaseConnected && supabase) {
      const { error } = await supabase
        .from('vendors')
        .update({
          name: updates.name,
          email: updates.email,
          phone: updates.phone,
          company: updates.company,
          status: updates.status,
          completion_rate: updates.completionRate,
          terminate_rate: updates.terminateRate,
          fraud_score: updates.fraudScore,
          total_sent: updates.totalSent,
          total_completes: updates.totalCompletes,
          redirect_urls: updates.redirectUrls,
          redirect_settings: updates.redirectSettings,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    }

    const updatedVendors = state.vendors.map(vendor =>
      vendor.id === id ? { ...vendor, ...updates } : vendor
    );

    setState(prev => ({
      ...prev,
      vendors: updatedVendors,
      stats: calculateStats(prev.projects, updatedVendors, prev.responses)
    }));

    if (!state.isSupabaseConnected) {
      await saveToStorage('survey-panel-vendors', updatedVendors);
    }
  };

  const deleteVendor = async (id: string) => {
    if (state.isSupabaseConnected && supabase) {
      const { error } = await supabase.from('vendors').delete().eq('id', id);
      if (error) throw error;
    }

    const updatedVendors = state.vendors.filter(vendor => vendor.id !== id);
    
    setState(prev => ({
      ...prev,
      vendors: updatedVendors,
      stats: calculateStats(prev.projects, updatedVendors, prev.responses)
    }));

    if (!state.isSupabaseConnected) {
      await saveToStorage('survey-panel-vendors', updatedVendors);
    }
  };

  const addResponse = async (responseData: Omit<Response, 'id' | 'timestamp'>) => {
    const newResponse: Response = {
      ...responseData,
      id: `R${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    if (state.isSupabaseConnected && supabase) {
      const { error } = await supabase.from('responses').insert([{
        id: newResponse.id,
        project_id: newResponse.projectId,
        vendor_id: newResponse.vendorId,
        vendor_uid: newResponse.vendorUID,
        status: newResponse.status,
        ip_address: newResponse.ipAddress,
        country: newResponse.country,
        city: newResponse.city,
        browser: newResponse.browser,
        device: newResponse.device,
        completion_time: newResponse.completionTime
      }]);
      
      if (error) throw error;
    }

    const updatedResponses = [newResponse, ...state.responses].slice(0, 1000);
    setState(prev => ({
      ...prev,
      responses: updatedResponses,
      stats: calculateStats(prev.projects, prev.vendors, updatedResponses)
    }));

    if (!state.isSupabaseConnected) {
      await saveToStorage('survey-panel-responses', updatedResponses);
    }
  };

  const assignVendorToProject = async (projectId: string, vendorId: string) => {
    const project = state.projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedVendors = project.vendors.includes(vendorId) 
      ? project.vendors 
      : [...project.vendors, vendorId];

    await updateProject(projectId, { vendors: updatedVendors });
  };

  const refreshData = async () => {
    await initializeData();
  };

  // Helper functions
  const calculateStats = (projects: Project[], vendors: Vendor[], responses: Response[]): PanelStats => {
    const totalResponses = responses.length;
    const completedResponses = responses.filter(r => r.status === 'complete').length;
    const totalRevenue = completedResponses * 2.50; // Assuming $2.50 per completion
    const completionTimes = responses.filter(r => r.completionTime > 0).map(r => r.completionTime);
    const averageCompletionTime = completionTimes.length > 0 
      ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length 
      : 0;

    // Calculate top performing vendor
    const vendorPerformance = vendors.map(vendor => {
      const vendorResponses = responses.filter(r => r.vendorId === vendor.id);
      const vendorCompletes = vendorResponses.filter(r => r.status === 'complete').length;
      return { vendorId: vendor.id, vendorName: vendor.name, completes: vendorCompletes };
    });
    
    const topVendor = vendorPerformance.reduce((prev, current) => 
      (prev.completes > current.completes) ? prev : current, { vendorName: 'None', completes: 0 }
    );

    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completionRate = totalResponses > 0 ? (completedResponses / totalResponses) * 100 : 0;

    return {
      totalResponses,
      totalRevenue,
      averageCompletionTime,
      topPerformingVendor: topVendor.vendorName,
      activeProjects,
      completionRate
    };
  };

  // Generate default data
  const generateDefaultProjects = (): Project[] => [
    {
      id: 'P001',
      name: 'Consumer Behavior Study 2024',
      clientName: 'Market Research Corp',
      clientLink: 'https://survey.marketresearch.com/consumer-behavior',
      description: 'Understanding consumer preferences in digital shopping',
      status: 'active',
      createdDate: '2024-01-15T10:00:00Z',
      completes: 245,
      terminates: 89,
      quotaFull: 12,
      totalQuota: 1000,
      quotas: {
        age: { min: 18, max: 65, quota: 500, current: 245 },
        gender: { male: 50, female: 50, maleQuota: 500, femaleQuota: 500 },
        location: { countries: ['US', 'CA'], quotaPerCountry: 500 }
      },
      vendors: ['V001', 'V002'],
      estimatedDuration: 15,
      incentive: '$2.50'
    },
    {
      id: 'P002',
      name: 'Healthcare Technology Survey',
      clientName: 'TechHealth Solutions',
      clientLink: 'https://surveys.techhealth.com/technology-adoption',
      description: 'Adoption of telemedicine and digital health tools',
      status: 'active',
      createdDate: '2024-01-20T14:30:00Z',
      completes: 156,
      terminates: 67,
      quotaFull: 8,
      totalQuota: 750,
      quotas: {
        age: { min: 25, max: 75, quota: 375, current: 156 },
        gender: { male: 45, female: 55, maleQuota: 337, femaleQuota: 413 },
        location: { countries: ['US'], quotaPerCountry: 750 }
      },
      vendors: ['V001', 'V003'],
      estimatedDuration: 12,
      incentive: '$3.00'
    }
  ];

  const generateDefaultVendors = (): Vendor[] => [
    {
      id: 'V001',
      name: 'Premium Survey Partners',
      email: 'contact@premiumsurvey.com',
      phone: '+1 (555) 123-4567',
      company: 'Premium Survey Partners LLC',
      status: 'active',
      createdDate: '2024-01-10T09:00:00Z',
      completionRate: 78.5,
      terminateRate: 18.2,
      fraudScore: 1.2,
      totalSent: 1250,
      totalCompletes: 982,
      redirectUrls: {
        complete: 'https://premiumsurvey.com/complete',
        terminate: 'https://premiumsurvey.com/terminate',
        quotaFull: 'https://premiumsurvey.com/quota-full'
      },
      redirectSettings: {
        enabled: true,
        passthrough: false,
        appendParams: true,
        customParams: 'source=panel&tracking=enabled'
      }
    },
    {
      id: 'V002',
      name: 'Global Response Network',
      email: 'partnerships@globalresponse.net',
      phone: '+1 (555) 987-6543',
      company: 'Global Response Network Inc',
      status: 'active',
      createdDate: '2024-01-12T11:15:00Z',
      completionRate: 82.1,
      terminateRate: 15.8,
      fraudScore: 0.8,
      totalSent: 890,
      totalCompletes: 731,
      redirectUrls: {
        complete: 'https://globalresponse.net/success',
        terminate: 'https://globalresponse.net/end',
        quotaFull: 'https://globalresponse.net/full'
      },
      redirectSettings: {
        enabled: true,
        passthrough: true,
        appendParams: true,
        customParams: 'vendor=grn&quality=premium'
      }
    },
    {
      id: 'V003',
      name: 'Panel Partners LLC',
      email: 'hello@panelpartners.com',
      phone: '+1 (555) 456-7890',
      company: 'Panel Partners LLC',
      status: 'inactive',
      createdDate: '2024-01-18T16:45:00Z',
      completionRate: 65.3,
      terminateRate: 28.1,
      fraudScore: 2.8,
      totalSent: 456,
      totalCompletes: 298,
      redirectUrls: {
        complete: 'https://panelpartners.com/done',
        terminate: 'https://panelpartners.com/sorry',
        quotaFull: 'https://panelpartners.com/quota'
      },
      redirectSettings: {
        enabled: false,
        passthrough: false,
        appendParams: false,
        customParams: ''
      }
    }
  ];

  const generateDefaultResponses = (): Response[] => {
    const responses: Response[] = [];
    const statuses: Response['status'][] = ['complete', 'terminate', 'quota-full'];
    const countries = ['United States', 'Canada', 'United Kingdom', 'Australia'];
    const cities = ['New York', 'Los Angeles', 'Toronto', 'London', 'Sydney'];
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
    const devices = ['Desktop', 'Mobile', 'Tablet'];

    for (let i = 1; i <= 50; i++) {
      const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();
      responses.push({
        id: `R${String(i).padStart(3, '0')}`,
        projectId: i <= 30 ? 'P001' : 'P002',
        vendorId: ['V001', 'V002', 'V003'][Math.floor(Math.random() * 3)],
        vendorUID: `UID_${Date.now()}_${i}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        country: countries[Math.floor(Math.random() * countries.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        device: devices[Math.floor(Math.random() * devices.length)],
        completionTime: Math.floor(Math.random() * 1200) + 300, // 5-25 minutes
        timestamp
      });
    }

    return responses.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const value: PanelContextType = {
    state,
    actions: {
      createProject,
      updateProject,
      deleteProject,
      createVendor,
      updateVendor,
      deleteVendor,
      addResponse,
      assignVendorToProject,
      refreshData
    }
  };

  return (
    <PanelContext.Provider value={value}>
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
