# 🚀 Complete Supabase Integration Guide for Survey Panel

## 📖 **Overview**

This guide shows you exactly how to connect your survey panel with Supabase to get a fully functional backend with database, authentication, APIs, and real-time features - all for FREE.

## 🎯 **Why Supabase?**

✅ **FREE Tier Includes:**
- PostgreSQL database (500MB)
- Authentication (50,000 users)
- Real-time subscriptions
- Edge functions for APIs
- Row Level Security
- Dashboard for managing everything

✅ **Perfect for Survey Panel:**
- Handles all vendor data
- Stores survey responses
- Manages project information
- IP tracking and geolocation
- Email sending capabilities
- Real-time fraud detection

## 🛠️ **Step 1: Setup Supabase Project**

### **Create Account & Project**
```bash
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommended)
4. Create new project:
   - Name: "Survey Panel"
   - Database Password: (save this!)
   - Region: Choose closest to you
```

### **Install Supabase in Your Project**
```bash
npm install @supabase/supabase-js
npm install @supabase/auth-helpers-react
```

## 🗄️ **Step 2: Database Schema Setup**

Copy and paste this SQL in your Supabase SQL Editor:

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  client_name VARCHAR NOT NULL,
  client_link TEXT,
  description TEXT,
  status VARCHAR NOT NULL DEFAULT 'active',
  created_date TIMESTAMP DEFAULT NOW(),
  completes INTEGER DEFAULT 0,
  terminates INTEGER DEFAULT 0,
  quota_full INTEGER DEFAULT 0,
  total_quota INTEGER DEFAULT 1000,
  quotas JSONB DEFAULT '{}',
  vendors TEXT[] DEFAULT '{}',
  estimated_duration INTEGER DEFAULT 15,
  incentive VARCHAR DEFAULT '$2.50',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vendors table
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  phone VARCHAR,
  company VARCHAR,
  status VARCHAR NOT NULL DEFAULT 'active',
  created_date TIMESTAMP DEFAULT NOW(),
  completion_rate DECIMAL DEFAULT 0,
  terminate_rate DECIMAL DEFAULT 0,
  fraud_score DECIMAL DEFAULT 1.0,
  total_sent INTEGER DEFAULT 0,
  total_completes INTEGER DEFAULT 0,
  redirect_urls JSONB DEFAULT '{}',
  redirect_settings JSONB DEFAULT '{}',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Responses table
CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  vendor_id UUID REFERENCES vendors(id),
  vendor_uid VARCHAR,
  status VARCHAR NOT NULL,
  ip_address INET,
  country VARCHAR,
  city VARCHAR,
  browser VARCHAR,
  device VARCHAR,
  completion_time INTEGER,
  fraud_indicators JSONB DEFAULT '{}',
  timestamp TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Fraud alerts table
CREATE TABLE fraud_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR NOT NULL,
  severity VARCHAR NOT NULL,
  vendor_id UUID REFERENCES vendors(id),
  vendor_name VARCHAR,
  project_id UUID REFERENCES projects(id),
  details TEXT,
  affected_responses TEXT[],
  status VARCHAR DEFAULT 'open',
  investigated_by VARCHAR,
  resolution TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Panel settings table
CREATE TABLE panel_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  panel_name VARCHAR DEFAULT 'Survey Panel',
  panel_url VARCHAR DEFAULT 'https://surveypanel.com',
  admin_email VARCHAR,
  timezone VARCHAR DEFAULT 'UTC',
  session_timeout INTEGER DEFAULT 60,
  email_notifications BOOLEAN DEFAULT true,
  fraud_alerts BOOLEAN DEFAULT true,
  quota_alerts BOOLEAN DEFAULT true,
  response_retention INTEGER DEFAULT 90,
  auto_backup BOOLEAN DEFAULT true,
  backup_frequency VARCHAR DEFAULT 'daily',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_responses_project_id ON responses(project_id);
CREATE INDEX idx_responses_vendor_id ON responses(vendor_id);
CREATE INDEX idx_responses_ip_address ON responses(ip_address);
CREATE INDEX idx_responses_timestamp ON responses(timestamp);
CREATE INDEX idx_fraud_alerts_vendor_id ON fraud_alerts(vendor_id);
CREATE INDEX idx_fraud_alerts_status ON fraud_alerts(status);

-- Insert default settings
INSERT INTO panel_settings (panel_name, admin_email) 
VALUES ('Survey Panel', 'admin@surveypanel.com');
```

## 🔐 **Step 3: Setup Authentication**

### **Configure Auth Settings**
```bash
1. Go to Supabase Dashboard → Authentication → Settings
2. Disable "Enable email confirmations" (for admin-only access)
3. Disable "Enable phone confirmations"
4. Set Site URL to your domain (or localhost:5173 for development)
```

### **Create Admin User**
```sql
-- Run this in SQL Editor to create admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@surveypanel.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin"}',
  false
);
```

## ⚡ **Step 4: Environment Configuration**

### **Create .env.local file**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### **Get Your Keys**
```bash
1. Go to Supabase Dashboard → Settings → API
2. Copy Project URL
3. Copy anon/public key
4. Copy service_role key (keep this secret!)
```

## 🔧 **Step 5: Create Supabase Client**

Create `client/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          client_name: string
          client_link: string | null
          description: string | null
          status: string
          created_date: string
          completes: number
          terminates: number
          quota_full: number
          total_quota: number
          quotas: any
          vendors: string[]
          estimated_duration: number
          incentive: string
          updated_at: string
        }
        Insert: {
          name: string
          client_name: string
          client_link?: string
          description?: string
          status?: string
          total_quota?: number
          quotas?: any
          vendors?: string[]
          estimated_duration?: number
          incentive?: string
        }
        Update: {
          name?: string
          client_name?: string
          client_link?: string
          description?: string
          status?: string
          completes?: number
          terminates?: number
          quota_full?: number
          total_quota?: number
          quotas?: any
          vendors?: string[]
          estimated_duration?: number
          incentive?: string
        }
      }
      vendors: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          company: string | null
          status: string
          created_date: string
          completion_rate: number
          terminate_rate: number
          fraud_score: number
          total_sent: number
          total_completes: number
          redirect_urls: any
          redirect_settings: any
          updated_at: string
        }
        Insert: {
          name: string
          email: string
          phone?: string
          company?: string
          status?: string
          completion_rate?: number
          terminate_rate?: number
          fraud_score?: number
          total_sent?: number
          total_completes?: number
          redirect_urls?: any
          redirect_settings?: any
        }
        Update: {
          name?: string
          email?: string
          phone?: string
          company?: string
          status?: string
          completion_rate?: number
          terminate_rate?: number
          fraud_score?: number
          total_sent?: number
          total_completes?: number
          redirect_urls?: any
          redirect_settings?: any
        }
      }
      responses: {
        Row: {
          id: string
          project_id: string | null
          vendor_id: string | null
          vendor_uid: string | null
          status: string
          ip_address: string | null
          country: string | null
          city: string | null
          browser: string | null
          device: string | null
          completion_time: number | null
          fraud_indicators: any
          timestamp: string
          updated_at: string
        }
        Insert: {
          project_id?: string
          vendor_id?: string
          vendor_uid?: string
          status: string
          ip_address?: string
          country?: string
          city?: string
          browser?: string
          device?: string
          completion_time?: number
          fraud_indicators?: any
        }
        Update: {
          project_id?: string
          vendor_id?: string
          vendor_uid?: string
          status?: string
          ip_address?: string
          country?: string
          city?: string
          browser?: string
          device?: string
          completion_time?: number
          fraud_indicators?: any
        }
      }
    }
  }
}
```

## 🔄 **Step 6: Update PanelContext for Supabase**

Replace your existing PanelContext with this Supabase-connected version:

```typescript
// client/contexts/PanelContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, Database } from '@/lib/supabase';

type Project = Database['public']['Tables']['projects']['Row'];
type Vendor = Database['public']['Tables']['vendors']['Row'];
type Response = Database['public']['Tables']['responses']['Row'];

interface PanelContextType {
  state: {
    projects: Project[];
    vendors: Vendor[];
    responses: Response[];
    stats: any;
    loading: boolean;
    error: string | null;
  };
  actions: {
    createProject: (project: Database['public']['Tables']['projects']['Insert']) => Promise<void>;
    updateProject: (id: string, updates: Database['public']['Tables']['projects']['Update']) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    createVendor: (vendor: Database['public']['Tables']['vendors']['Insert']) => Promise<void>;
    updateVendor: (id: string, updates: Database['public']['Tables']['vendors']['Update']) => Promise<void>;
    deleteVendor: (id: string) => Promise<void>;
    addResponse: (response: Database['public']['Tables']['responses']['Insert']) => Promise<void>;
    refreshData: () => Promise<void>;
  };
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export function PanelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({
    projects: [] as Project[],
    vendors: [] as Vendor[],
    responses: [] as Response[],
    stats: {},
    loading: true,
    error: null as string | null
  });

  // Load all data on component mount
  useEffect(() => {
    loadAllData();
    
    // Set up real-time subscriptions
    const projectsSub = supabase
      .channel('projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        loadProjects();
      })
      .subscribe();

    const vendorsSub = supabase
      .channel('vendors')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendors' }, () => {
        loadVendors();
      })
      .subscribe();

    const responsesSub = supabase
      .channel('responses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'responses' }, () => {
        loadResponses();
      })
      .subscribe();

    return () => {
      projectsSub.unsubscribe();
      vendorsSub.unsubscribe();
      responsesSub.unsubscribe();
    };
  }, []);

  const loadAllData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await Promise.all([loadProjects(), loadVendors(), loadResponses()]);
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to load data' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_date', { ascending: false });
    
    if (error) throw error;
    setState(prev => ({ ...prev, projects: data || [] }));
  };

  const loadVendors = async () => {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('created_date', { ascending: false });
    
    if (error) throw error;
    setState(prev => ({ ...prev, vendors: data || [] }));
  };

  const loadResponses = async () => {
    const { data, error } = await supabase
      .from('responses')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1000); // Limit for performance
    
    if (error) throw error;
    setState(prev => ({ ...prev, responses: data || [] }));
  };

  // Actions
  const createProject = async (project: Database['public']['Tables']['projects']['Insert']) => {
    const { error } = await supabase.from('projects').insert([project]);
    if (error) throw error;
  };

  const updateProject = async (id: string, updates: Database['public']['Tables']['projects']['Update']) => {
    const { error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  };

  const createVendor = async (vendor: Database['public']['Tables']['vendors']['Insert']) => {
    const { error } = await supabase.from('vendors').insert([vendor]);
    if (error) throw error;
  };

  const updateVendor = async (id: string, updates: Database['public']['Tables']['vendors']['Update']) => {
    const { error } = await supabase
      .from('vendors')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  };

  const deleteVendor = async (id: string) => {
    const { error } = await supabase.from('vendors').delete().eq('id', id);
    if (error) throw error;
  };

  const addResponse = async (response: Database['public']['Tables']['responses']['Insert']) => {
    const { error } = await supabase.from('responses').insert([response]);
    if (error) throw error;
  };

  const refreshData = async () => {
    await loadAllData();
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
```

## 📧 **Step 7: Email Integration**

### **Setup Edge Function for Emails**
Create a new Edge Function in Supabase:

```typescript
// supabase/functions/send-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  const { to, subject, html, projectName, vendorName } = await req.json()

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Survey Panel <noreply@yourdomain.com>',
      to: [to],
      subject: subject,
      html: html,
    }),
  })

  const data = await res.json()

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})
```

### **Setup Resend for Free Email Sending**
```bash
1. Go to https://resend.com (100 emails/day free)
2. Get API key
3. Add to Supabase Edge Functions secrets
```

## 🌍 **Step 8: IP Geolocation API**

### **Create Edge Function for IP Lookup**
```typescript
// supabase/functions/ip-lookup/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { ip } = await req.json()
  
  // Using ipapi.co (free tier: 1000 requests/day)
  const response = await fetch(`https://ipapi.co/${ip}/json/`)
  const data = await response.json()
  
  return new Response(
    JSON.stringify({
      ip: ip,
      country: data.country_name,
      city: data.city,
      region: data.region,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      isp: data.org
    }),
    { headers: { "Content-Type": "application/json" } },
  )
})
```

## 🔐 **Step 9: Row Level Security (RLS)**

Enable RLS for your tables:

```sql
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE panel_settings ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth setup)
CREATE POLICY "Allow authenticated users" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users" ON vendors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users" ON responses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users" ON fraud_alerts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users" ON panel_settings FOR ALL USING (auth.role() = 'authenticated');
```

## 🚀 **Step 10: Deploy Your Panel**

### **Deploy to Netlify with Supabase**
```bash
1. Connect your GitHub repo to Netlify
2. Add environment variables in Netlify dashboard
3. Set build command: npm run build
4. Set publish directory: dist/spa
5. Deploy!
```

## 📊 **What You Get with This Setup**

✅ **Full Database Backend**
- All your survey data stored securely
- Real-time updates across all users
- Automatic backups

✅ **Authentication System**
- Secure admin login
- Session management
- Role-based access

✅ **API Endpoints**
- Automatic REST APIs for all tables
- Real-time subscriptions
- Custom Edge Functions

✅ **Email Integration**
- Send project invitations to vendors
- Fraud alerts via email
- System notifications

✅ **IP Tracking**
- Geolocation for all responses
- Fraud detection based on location
- ISP and timezone tracking

✅ **Real-time Features**
- Live dashboard updates
- Instant fraud alerts
- Real-time response tracking

## 💰 **Costs (FREE for Small Scale)**

- **Supabase**: Free up to 500MB DB, 50K users
- **Resend**: Free up to 100 emails/day
- **ipapi.co**: Free up to 1,000 IP lookups/day
- **Netlify**: Free hosting with 100GB bandwidth

## 🆘 **Need Help?**

If you get stuck:
1. Check Supabase logs in dashboard
2. Use browser developer tools
3. Test API calls in Supabase dashboard
4. Check environment variables

This setup gives you a production-ready survey panel with all the features you need!
