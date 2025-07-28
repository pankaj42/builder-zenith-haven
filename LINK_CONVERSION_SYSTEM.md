# 🔗 Link Conversion System - Complete Guide

## 📖 **Overview**

This guide explains exactly how client survey links are converted into panel links that you can send to vendors, and how the 3-redirect system works to track responses.

## 🎯 **The Complete Flow**

### **Step 1: Client Gives You Their Survey Link**
```
Client provides: https://client-survey.com/study/12345
```

### **Step 2: You Create Panel Entry Link**
```
Your panel link: https://surveypanel.com/start?project=P001&vendor=V001&uid=[UID]
```

### **Step 3: Vendor Sends Traffic to Your Panel**
```
Vendor clicks: https://surveypanel.com/start?project=P001&vendor=V001&uid=12345
```

### **Step 4: Panel Redirects to Client Survey**
```
Panel redirects to: https://client-survey.com/study/12345?uid=12345&source=panel
```

### **Step 5: Client Survey Redirects Back Based on Result**

#### **If Complete:**
```
Client redirects to: https://surveypanel.com/complete?project=P001&vendor=V001&uid=12345&status=complete
```

#### **If Terminate:**
```
Client redirects to: https://surveypanel.com/terminate?project=P001&vendor=V001&uid=12345&status=terminate
```

#### **If Quota Full:**
```
Client redirects to: https://surveypanel.com/quota?project=P001&vendor=V001&uid=12345&status=quota
```

### **Step 6: Panel Redirects Back to Vendor**
```
Panel redirects to vendor's appropriate URL with final status
```

## 🔧 **How to Set This Up**

### **1. When Client Gives You Survey Link**

**Example:** Client says "Here's our survey: `https://research.com/survey/consumer-behavior`"

**You do this in the panel:**
1. Go to Projects → Create Project
2. Enter project details:
   - Name: "Consumer Behavior Study"
   - Client Name: "Research Corp"
   - **Client Link**: `https://research.com/survey/consumer-behavior`
3. Save project (gets ID like P001)

### **2. Setting Up Vendor Redirects**

**When you add/edit a vendor, they must provide 3 URLs:**

#### **Complete URL** (when respondent finishes survey)
```
Vendor provides: https://vendor-site.com/complete.php
Panel will redirect to: https://vendor-site.com/complete.php?uid=[UID]&payout=2.50&status=complete
```

#### **Terminate URL** (when respondent doesn't qualify)
```
Vendor provides: https://vendor-site.com/terminate.php
Panel will redirect to: https://vendor-site.com/terminate.php?uid=[UID]&status=terminate
```

#### **Quota Full URL** (when survey is full)
```
Vendor provides: https://vendor-site.com/quota.php
Panel will redirect to: https://vendor-site.com/quota.php?uid=[UID]&status=quota
```

### **3. Generating Links for Vendors**

**The panel automatically creates these links:**

#### **For Vendor V001 and Project P001:**
```
Entry Link: https://surveypanel.com/start?project=P001&vendor=V001&uid=[UID]
```

**You give this to the vendor and say:**
> "Replace [UID] with your unique respondent ID for each person you send"

#### **Example vendor usage:**
```
Vendor sends person with ID "RESP_67890":
https://surveypanel.com/start?project=P001&vendor=V001&uid=RESP_67890
```

## 🔄 **Complete Example Flow**

### **Scenario:** 
- Project: Consumer Study (P001)
- Vendor: Panel Partners (V001)  
- Respondent: ID "USER_123"
- Client Survey: https://research.com/survey/behavior

### **Step-by-Step:**

#### **1. Vendor Link (What vendor clicks)**
```
https://surveypanel.com/start?project=P001&vendor=V001&uid=USER_123
```

#### **2. Panel Processing**
- Panel receives the request
- Logs the entry in responses table
- Checks if project is active and has quota
- Validates vendor is assigned to project

#### **3. Panel Redirects to Client**
```
https://research.com/survey/behavior?uid=USER_123&source=panel&vendor=V001&project=P001
```

#### **4. Client Survey Results**

**If person completes survey:**
```
Client redirects to: https://surveypanel.com/complete?project=P001&vendor=V001&uid=USER_123&status=complete
```

**If person doesn't qualify:**
```
Client redirects to: https://surveypanel.com/terminate?project=P001&vendor=V001&uid=USER_123&status=terminate
```

**If survey is full:**
```
Client redirects to: https://surveypanel.com/quota?project=P001&vendor=V001&uid=USER_123&status=quota
```

#### **5. Panel Final Redirect**

**For Complete:**
```
Panel redirects to: https://vendor-complete.com/done.php?uid=USER_123&payout=2.50&status=complete
```

**For Terminate:**
```
Panel redirects to: https://vendor-terminate.com/sorry.php?uid=USER_123&status=terminate
```

**For Quota:**
```
Panel redirects to: https://vendor-quota.com/full.php?uid=USER_123&status=quota
```

## 📊 **What Gets Tracked**

### **In Responses Table:**
```json
{
  "id": "R001",
  "project_id": "P001",
  "vendor_id": "V001", 
  "vendor_uid": "USER_123",
  "status": "complete",
  "ip_address": "192.168.1.1",
  "country": "United States",
  "city": "New York",
  "timestamp": "2024-01-25T10:30:00Z",
  "completion_time": 480
}
```

### **In Analytics:**
- Vendor V001 gets credit for 1 complete
- Project P001 quota decreases by 1
- Revenue tracking updates
- Fraud detection analyzes the response

## 🛠️ **Technical Implementation**

### **Panel URL Handlers:**

#### **Entry Handler (`/start`)**
```javascript
// When vendor sends traffic
app.get('/start', async (req, res) => {
  const { project, vendor, uid } = req.query;
  
  // Log entry
  await logResponse({
    project_id: project,
    vendor_id: vendor,
    vendor_uid: uid,
    status: 'started',
    ip_address: req.ip
  });
  
  // Get project details
  const projectData = await getProject(project);
  
  // Redirect to client survey
  const clientUrl = `${projectData.client_link}?uid=${uid}&source=panel&vendor=${vendor}&project=${project}`;
  res.redirect(clientUrl);
});
```

#### **Complete Handler (`/complete`)**
```javascript
app.get('/complete', async (req, res) => {
  const { project, vendor, uid, status } = req.query;
  
  // Update response status
  await updateResponse(uid, { status: 'complete' });
  
  // Get vendor redirect URL
  const vendorData = await getVendor(vendor);
  const projectData = await getProject(project);
  
  // Redirect to vendor complete URL
  const vendorUrl = `${vendorData.redirect_urls.complete}?uid=${uid}&payout=${projectData.incentive}&status=complete`;
  res.redirect(vendorUrl);
});
```

## 📝 **What You Need from Vendors**

### **Information Required:**
1. **Company Details:**
   - Company name
   - Contact email
   - Phone number

2. **Three Redirect URLs:**
   - Complete URL (successful finish)
   - Terminate URL (didn't qualify)  
   - Quota Full URL (survey is full)

3. **Technical Specifications:**
   - Do they want additional parameters?
   - What tracking pixels do they need?
   - Any special requirements?

### **Example Email to Vendor:**
```
Subject: Redirect URLs Required for Survey Panel Integration

Hi [Vendor Name],

To integrate you into our survey panel, please provide these 3 redirect URLs:

1. COMPLETE URL: Where we send people who finish surveys
   Example: https://yoursite.com/complete.php

2. TERMINATE URL: Where we send people who don't qualify  
   Example: https://yoursite.com/terminate.php

3. QUOTA FULL URL: Where we send people when survey is full
   Example: https://yoursite.com/quota.php

We will append these parameters to your URLs:
- uid=[respondent_id] 
- status=[complete/terminate/quota]
- payout=[amount] (only for completes)

Your entry link will be:
https://surveypanel.com/start?project=[PROJECT]&vendor=[YOUR_ID]&uid=[UID]

Replace [UID] with your unique respondent ID for each person you send.

Questions? Reply to this email.

Best regards,
Survey Panel Team
```

## 🔒 **Security & Fraud Prevention**

### **What Panel Validates:**
- Vendor is assigned to the project
- Project is active and has quota
- IP address patterns (for fraud detection)
- Completion time (flag if too fast)
- Duplicate UIDs from same vendor

### **What Client Survey Should Do:**
- Validate the source parameter
- Check if respondent ID is genuine
- Verify project is still active
- Return proper status codes

### **What Vendor Should Track:**
- Click-through rates
- Completion percentages  
- Revenue per respondent
- Quality scores from panel

## 🚨 **Common Issues & Solutions**

### **Problem:** Vendor says "no responses coming back"
**Solution:** Check their redirect URLs are correct and accessible

### **Problem:** High terminate rate
**Solution:** Review project targeting - might be too specific

### **Problem:** Fraud alerts
**Solution:** Check if vendor is sending same UID multiple times

### **Problem:** Client survey rejects respondents
**Solution:** Verify source parameter is being sent correctly

## 📱 **Mobile Considerations**

- All redirects work on mobile devices
- Panel tracks device type for analytics
- Some vendors prefer mobile-optimized redirect pages
- Consider shorter URLs for SMS campaigns

This system ensures complete tracking and proper payment flow for all parties involved!
