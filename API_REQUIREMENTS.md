# 🌐 API Requirements for Survey Panel

## 📖 **Overview**

Your survey panel needs several APIs to function properly. This guide covers all required APIs, free options, and how to integrate them.

## 🔍 **1. IP Geolocation API**

### **What it does:**
- Gets location from IP address
- Detects country, city, ISP
- Fraud detection based on location
- Timezone and region identification

### **Required for:**
- Response tracking
- Fraud detection
- Geographic reporting
- Vendor quality analysis

### **Free Options:**

#### **🎯 ipapi.co (Recommended)**
- **Free tier**: 1,000 requests/day
- **Cost**: $0
- **Features**: Country, city, ISP, timezone
- **Integration**: Simple REST API

```javascript
// Example usage
const response = await fetch(`https://ipapi.co/${ip}/json/`);
const data = await response.json();
// Returns: country, city, region, latitude, longitude, timezone, ISP
```

#### **🌍 ipinfo.io**
- **Free tier**: 1,000 requests/day  
- **Features**: Basic location data
- **Accuracy**: Very good

#### **🗺️ ip-api.com**
- **Free tier**: 45 requests/minute
- **Features**: Detailed location + ISP
- **No API key required**

### **Supabase Integration:**
```typescript
// Create Edge Function for IP lookup
create function get_ip_location(ip_address text)
returns json
language plpgsql
as $$
declare
  result json;
begin
  select content into result
  from http_get('https://ipapi.co/' || ip_address || '/json/');
  
  return result;
end;
$$;
```

## 📧 **2. Email API**

### **What it does:**
- Send project invitations to vendors
- Fraud alert notifications
- Weekly/monthly reports
- System status updates

### **Required for:**
- Vendor communication
- Admin notifications
- Automated reporting
- Fraud alerts

### **Free Options:**

#### **🎯 Resend (Recommended)**
- **Free tier**: 100 emails/day, 3,000/month
- **Cost**: $0
- **Features**: Templates, analytics, delivery tracking
- **Developer-friendly**: Made for developers

```javascript
// Resend example
const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Survey Panel <admin@surveypanel.com>',
    to: ['vendor@example.com'],
    subject: 'New Project Available',
    html: '<h1>New survey project ready for your traffic</h1>'
  })
});
```

#### **📬 EmailJS**
- **Free tier**: 200 emails/month
- **Features**: Frontend email sending
- **No backend required**

#### **📮 SendGrid**
- **Free tier**: 100 emails/day
- **Features**: Advanced analytics
- **Enterprise-grade**

### **Email Templates Needed:**

#### **Vendor Invitation:**
```html
<h1>New Survey Project: {{project_name}}</h1>
<p>Hi {{vendor_name}},</p>
<p>A new project is available:</p>
<ul>
  <li>Project: {{project_name}}</li>
  <li>Incentive: {{incentive}}</li>
  <li>Target: {{target_demographics}}</li>
  <li>Quota: {{total_quota}}</li>
</ul>
<p>Your entry link: {{entry_link}}</p>
```

#### **Fraud Alert:**
```html
<h1>🚨 Fraud Alert</h1>
<p>Fraud detected in project {{project_name}}</p>
<p>Vendor: {{vendor_name}}</p>
<p>Issue: {{fraud_type}}</p>
<p>Action: {{action_taken}}</p>
<a href="{{panel_link}}">View Details</a>
```

## 📊 **3. Data Punches API**

### **What it does:**
- Real-time data synchronization
- Push response data to client systems
- Automated reporting
- Third-party integrations

### **Required for:**
- Client data delivery
- Real-time dashboards
- Automated workflows
- Data synchronization

### **Implementation Options:**

#### **🎯 Webhooks (Recommended)**
```javascript
// Send data when response completes
const sendDataPunch = async (responseData) => {
  const webhook = await fetch(client.webhook_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${client.api_key}`
    },
    body: JSON.stringify({
      response_id: responseData.id,
      project_id: responseData.project_id,
      status: responseData.status,
      timestamp: responseData.timestamp,
      vendor_info: responseData.vendor,
      demographics: responseData.demographics
    })
  });
};
```

#### **📡 Real-time Streaming**
```javascript
// Using Supabase real-time
const subscription = supabase
  .channel('responses')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'responses' }, 
    (payload) => {
      // Send to client systems immediately
      sendDataPunch(payload.new);
    }
  )
  .subscribe();
```

#### **📋 Scheduled Reports**
```javascript
// Daily/weekly automated reports
const generateReport = async () => {
  const data = await supabase
    .from('responses')
    .select('*')
    .gte('timestamp', yesterday)
    .lt('timestamp', today);
    
  // Send to client via email or API
  await sendReportToClient(data);
};
```

## 🔐 **4. Authentication API**

### **What it does:**
- Secure admin login
- Session management  
- Role-based access
- Security logging

### **Supabase Auth (Recommended):**
```javascript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@surveypanel.com',
  password: 'secure_password'
});

// Check authentication
const { data: { user } } = await supabase.auth.getUser();

// Logout
await supabase.auth.signOut();
```

## 🛡️ **5. Fraud Detection APIs**

### **What it does:**
- Advanced IP analysis
- Device fingerprinting
- Risk scoring
- Behavioral analysis

### **Free Options:**

#### **🔍 AbuseIPDB**
- **Free tier**: 1,000 requests/day
- **Features**: IP reputation checking
- **Data**: Known malicious IPs

```javascript
const checkIP = async (ip) => {
  const response = await fetch(`https://api.abuseipdb.com/api/v2/check`, {
    headers: {
      'Key': ABUSE_API_KEY,
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      ipAddress: ip,
      maxAgeInDays: 90
    })
  });
};
```

#### **🌐 IPQualityScore**
- **Free tier**: 5,000 requests/month
- **Features**: Fraud probability, VPN detection
- **Accuracy**: High

## 📈 **6. Analytics API**

### **What it does:**
- Track user behavior
- Performance monitoring
- Error tracking
- Usage analytics

### **Free Options:**

#### **📊 Google Analytics 4**
- **Free tier**: Unlimited (with limits on events)
- **Features**: Detailed analytics
- **Integration**: gtag.js

```javascript
// Track survey completion
gtag('event', 'survey_complete', {
  'project_id': 'P001',
  'vendor_id': 'V001',
  'completion_time': 480
});
```

#### **📈 Mixpanel**
- **Free tier**: 100,000 events/month
- **Features**: Real-time analytics
- **User tracking**: Advanced

## 🔄 **7. Real-time Updates API**

### **What it does:**
- Live dashboard updates
- Real-time notifications
- Instant fraud alerts
- Live response tracking

### **Supabase Real-time:**
```javascript
// Listen to new responses
const subscription = supabase
  .channel('public:responses')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'responses' },
    (payload) => {
      // Update dashboard immediately
      updateDashboard(payload.new);
    }
  )
  .subscribe();
```

## 💾 **8. Backup & Storage API**

### **What it does:**
- Automated data backups
- File storage for exports
- Archive old data
- Disaster recovery

### **Supabase Storage:**
```javascript
// Backup data
const backupData = async () => {
  const data = await getAllPanelData();
  
  const { data: upload, error } = await supabase.storage
    .from('backups')
    .upload(`backup_${new Date().toISOString()}.json`, data);
};
```

## 🚀 **Complete API Setup Guide**

### **Step 1: Sign up for required services**
1. Supabase (database + auth + storage)
2. Resend (emails)
3. ipapi.co (IP lookup)
4. AbuseIPDB (fraud detection)

### **Step 2: Get API keys**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
RESEND_API_KEY=your_resend_key
IPAPI_KEY=your_ipapi_key (optional)
ABUSE_API_KEY=your_abuse_key
```

### **Step 3: Create Supabase Edge Functions**

#### **IP Lookup Function:**
```typescript
// supabase/functions/ip-lookup/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { ip } = await req.json();
  
  const response = await fetch(`https://ipapi.co/${ip}/json/`);
  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
```

#### **Email Function:**
```typescript
// supabase/functions/send-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

serve(async (req) => {
  const { to, subject, html } = await req.json();

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Survey Panel <admin@yourdomain.com>',
      to: [to],
      subject: subject,
      html: html,
    }),
  });

  return new Response(await res.text(), {
    headers: { "Content-Type": "application/json" },
  });
});
```

### **Step 4: Deploy Edge Functions**
```bash
supabase functions deploy ip-lookup
supabase functions deploy send-email
```

## 💰 **Cost Summary (FREE Tier)**

| Service | Free Tier | Cost |
|---------|-----------|------|
| Supabase | 500MB DB, 50K users | $0 |
| Resend | 100 emails/day | $0 |
| ipapi.co | 1,000 IP lookups/day | $0 |
| AbuseIPDB | 1,000 IP checks/day | $0 |
| Google Analytics | Unlimited (with limits) | $0 |
| **Total** | **Enough for small-medium panel** | **$0** |

## 📊 **Usage Estimates**

**For 1,000 responses/day:**
- IP lookups: 1,000/day (within free limit)
- Emails: ~10-20/day (notifications)
- Database: ~50MB/month
- All within free tiers! 💚

## 🆘 **Error Handling**

### **API Failures:**
```javascript
const safeAPICall = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    // Use fallback or cached data
    return null;
  }
};
```

### **Rate Limiting:**
```javascript
const rateLimitedAPI = async (fn, maxCalls = 100, timeWindow = 3600000) => {
  // Implement rate limiting logic
  if (callCount >= maxCalls) {
    throw new Error('Rate limit exceeded');
  }
  return await fn();
};
```

This setup gives you a fully functional survey panel with all necessary APIs for free! 🚀
