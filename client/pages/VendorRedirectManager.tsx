import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Copy,
  ExternalLink,
  Settings,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  Plus,
  ArrowRight,
  Zap,
  Target
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { showCopySuccess } from "@/components/ui/toast-notification";

interface VendorRedirectConfig {
  vendorId: string;
  vendorName: string;
  redirectUrls: {
    complete: string;
    terminate: string;
    quotaFull: string;
    studyClosed: string;
  };
  settings: {
    enabled: boolean;
    passthrough: boolean;
    appendParams: boolean;
    customParams: string;
    delay: number;
  };
  status: 'active' | 'inactive' | 'testing';
}

export default function VendorRedirectManager() {
  const [vendorConfigs, setVendorConfigs] = useState<VendorRedirectConfig[]>([
    {
      vendorId: "V001",
      vendorName: "Quality Traffic Solutions",
      redirectUrls: {
        complete: "https://dynamic-survey-view.vercel.app/thankyou",
        terminate: "https://dynamic-survey-view.vercel.app/terminate",
        quotaFull: "https://dynamic-survey-view.vercel.app/quotafull",
        studyClosed: "https://dynamic-survey-view.vercel.app/closed"
      },
      settings: {
        enabled: true,
        passthrough: true,
        appendParams: true,
        customParams: "source=panel&vendor=V001",
        delay: 2000
      },
      status: 'active'
    },
    {
      vendorId: "V002",
      vendorName: "Survey Source Network",
      redirectUrls: {
        complete: "https://surveysource.dashboard.com/complete",
        terminate: "https://surveysource.dashboard.com/terminate",
        quotaFull: "https://surveysource.dashboard.com/quotafull",
        studyClosed: "https://surveysource.dashboard.com/closed"
      },
      settings: {
        enabled: true,
        passthrough: true,
        appendParams: true,
        customParams: "utm_source=panel&vendor_id=V002",
        delay: 1500
      },
      status: 'active'
    },
    {
      vendorId: "V003",
      vendorName: "Panel Partners LLC",
      redirectUrls: {
        complete: "https://panelpartners.tracking.com/success",
        terminate: "https://panelpartners.tracking.com/failed",
        quotaFull: "https://panelpartners.tracking.com/full",
        studyClosed: "https://panelpartners.tracking.com/closed"
      },
      settings: {
        enabled: false,
        passthrough: false,
        appendParams: true,
        customParams: "panel_source=survey&v=V003",
        delay: 3000
      },
      status: 'inactive'
    }
  ]);

  const [selectedConfig, setSelectedConfig] = useState<VendorRedirectConfig | null>(null);
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [globalSettings, setGlobalSettings] = useState({
    defaultDelay: 2000,
    timeout: 30000,
    retryAttempts: 3,
    globalParams: "source=panel&timestamp={TIMESTAMP}"
  });

  // New vendor form state
  const [newVendor, setNewVendor] = useState<Partial<VendorRedirectConfig>>({
    vendorId: "",
    vendorName: "",
    redirectUrls: {
      complete: "",
      terminate: "",
      quotaFull: "",
      studyClosed: ""
    },
    settings: {
      enabled: true,
      passthrough: true,
      appendParams: true,
      customParams: "",
      delay: 2000
    },
    status: 'active'
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'; 
      case 'testing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'testing': return <Activity className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const testRedirectUrl = (url: string, type: string) => {
    const testParams = "?pid=TEST123&uid=TEST123-001-SAMPLE&source=panel&test=true";
    window.open(url + testParams, '_blank');
  };

  const copyRedirectUrl = (url: string, type: string, buttonElement: HTMLElement) => {
    const fullUrl = url + "?pid={PID}&uid={UID}&source=panel";

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(fullUrl).then(() => {
        showCopySuccess(buttonElement, `${type} URL Copied!`);
      }).catch((err) => {
        console.warn("Clipboard API failed, using fallback:", err.message);
        fallbackCopyMethod(fullUrl, buttonElement, `${type} URL Copied!`);
      });
    } else {
      fallbackCopyMethod(fullUrl, buttonElement, `${type} URL Copied!`);
    }
  };

  const fallbackCopyMethod = (text: string, buttonElement: HTMLElement, message: string) => {
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
        showCopySuccess(buttonElement, message);
      } else {
        prompt("Copy this text:", text);
      }
    } catch (err) {
      console.error("Fallback copy failed:", err);
      prompt("Copy this text:", text);
    }
  };

  // Update vendor configuration
  const updateVendorConfig = (vendorId: string, updates: Partial<VendorRedirectConfig>) => {
    setVendorConfigs(prev => prev.map(config =>
      config.vendorId === vendorId ? { ...config, ...updates } : config
    ));
    showCopySuccess(document.body, "Configuration updated successfully!");
  };

  // Add new vendor
  const addVendor = () => {
    if (!newVendor.vendorId || !newVendor.vendorName) {
      showCopySuccess(document.body, "Please fill vendor ID and name");
      return;
    }

    const vendor: VendorRedirectConfig = {
      vendorId: newVendor.vendorId,
      vendorName: newVendor.vendorName,
      redirectUrls: newVendor.redirectUrls || {
        complete: "",
        terminate: "",
        quotaFull: "",
        studyClosed: ""
      },
      settings: newVendor.settings || {
        enabled: true,
        passthrough: true,
        appendParams: true,
        customParams: `source=panel&vendor=${newVendor.vendorId}`,
        delay: globalSettings.defaultDelay
      },
      status: newVendor.status || 'active'
    };

    setVendorConfigs(prev => [...prev, vendor]);
    setNewVendor({
      vendorId: "",
      vendorName: "",
      redirectUrls: { complete: "", terminate: "", quotaFull: "", studyClosed: "" },
      settings: { enabled: true, passthrough: true, appendParams: true, customParams: "", delay: 2000 },
      status: 'active'
    });
    setShowAddDialog(false);
    showCopySuccess(document.body, "Vendor added successfully!");
  };

  // Delete vendor
  const deleteVendor = (vendorId: string) => {
    setVendorConfigs(prev => prev.filter(config => config.vendorId !== vendorId));
    if (selectedConfig?.vendorId === vendorId) {
      setSelectedConfig(null);
    }
    showCopySuccess(document.body, "Vendor deleted successfully!");
  };

  const generateDualRedirectExample = (config: VendorRedirectConfig) => {
    return `// Dual Redirect Flow for ${config.vendorName}
// 1. Survey completes → Panel receives data
POST https://yourpanel.com/collect/P12345
{
  "status": "complete",
  "uid": "P12345-001-RESP123",
  "vendor": "${config.vendorId}",
  "responseData": {...}
}

// 2. Panel processes and logs response
// 3. Panel forwards to vendor (${config.settings.delay}ms delay)
${config.settings.enabled ?
`GET ${config.redirectUrls.complete}?pid=P12345&uid=P12345-001-RESP123&${config.settings.customParams}` :
'// Vendor redirects disabled for this vendor'
}

// 4. Both panel and vendor dashboards updated
// 5. Client receives clean data without vendor visibility`;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Vendor Redirect Manager</h2>
              <p className="text-muted-foreground">Configure dual redirect URLs for vendor dashboard integration</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                {vendorConfigs.filter(c => c.status === 'active').length} Active
              </Badge>
              <Button variant="outline" className="gap-2" onClick={() => setShowAddDialog(true)}>
                <Plus className="w-4 h-4" />
                Add Vendor
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
              <TabsTrigger value="testing">Testing & Logs</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Dual Redirect Explanation */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                    How Dual Redirects Work
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-white/60 rounded-lg">
                      <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <h4 className="font-semibold text-sm">Survey Completes</h4>
                      <p className="text-xs text-muted-foreground">Client survey finishes</p>
                    </div>
                    <div className="text-center p-3 bg-white/60 rounded-lg">
                      <Zap className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <h4 className="font-semibold text-sm">Panel Processes</h4>
                      <p className="text-xs text-muted-foreground">Logs response & status</p>
                    </div>
                    <div className="text-center p-3 bg-white/60 rounded-lg">
                      <ArrowRight className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <h4 className="font-semibold text-sm">Forward to Vendor</h4>
                      <p className="text-xs text-muted-foreground">Automatic redirect</p>
                    </div>
                    <div className="text-center p-3 bg-white/60 rounded-lg">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                      <h4 className="font-semibold text-sm">Dashboards Updated</h4>
                      <p className="text-xs text-muted-foreground">Both sides track</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vendor Configurations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {vendorConfigs.map((config) => (
                  <Card key={config.vendorId} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{config.vendorName}</CardTitle>
                          <p className="text-sm text-muted-foreground font-mono">{config.vendorId}</p>
                        </div>
                        <Badge className={`${getStatusColor(config.status)} flex items-center gap-1`}>
                          {getStatusIcon(config.status)}
                          {config.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Redirect Settings Summary */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Redirects:</span>
                          <span className={config.settings.enabled ? "text-green-600" : "text-red-600"}>
                            {config.settings.enabled ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Passthrough:</span>
                          <span className={config.settings.passthrough ? "text-green-600" : "text-gray-600"}>
                            {config.settings.passthrough ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Delay:</span>
                          <span className="font-mono">{config.settings.delay}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Params:</span>
                          <span className={config.settings.appendParams ? "text-green-600" : "text-gray-600"}>
                            {config.settings.appendParams ? "Added" : "None"}
                          </span>
                        </div>
                      </div>

                      {/* Quick URL Preview */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Redirect URLs:</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 bg-green-50 rounded">
                            <span className="text-green-700 font-medium">Complete:</span>
                            <p className="font-mono truncate">{config.redirectUrls.complete}</p>
                          </div>
                          <div className="p-2 bg-orange-50 rounded">
                            <span className="text-orange-700 font-medium">Terminate:</span>
                            <p className="font-mono truncate">{config.redirectUrls.terminate}</p>
                          </div>
                          <div className="p-2 bg-blue-50 rounded">
                            <span className="text-blue-700 font-medium">Quota Full:</span>
                            <p className="font-mono truncate">{config.redirectUrls.quotaFull}</p>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <span className="text-gray-700 font-medium">Closed:</span>
                            <p className="font-mono truncate">{config.redirectUrls.studyClosed}</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedConfig(config)}
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Configure
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedConfig(config);
                            setShowTestDialog(true);
                          }}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Configuration Tab */}
            <TabsContent value="configuration" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Global Redirect Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Default Delay (ms)</Label>
                      <Input
                        type="number"
                        value={globalSettings.defaultDelay}
                        onChange={(e) => setGlobalSettings(prev => ({ ...prev, defaultDelay: parseInt(e.target.value) || 2000 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Timeout (ms)</Label>
                      <Input
                        type="number"
                        value={globalSettings.timeout}
                        onChange={(e) => setGlobalSettings(prev => ({ ...prev, timeout: parseInt(e.target.value) || 30000 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Retry Attempts</Label>
                      <Input
                        type="number"
                        value={globalSettings.retryAttempts}
                        onChange={(e) => setGlobalSettings(prev => ({ ...prev, retryAttempts: parseInt(e.target.value) || 3 }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Global Custom Parameters</Label>
                    <Input
                      value={globalSettings.globalParams}
                      onChange={(e) => setGlobalSettings(prev => ({ ...prev, globalParams: e.target.value }))}
                      placeholder="source=panel&timestamp={TIMESTAMP}"
                    />
                  </div>
                  <Button
                    onClick={() => showCopySuccess(document.body, "Global settings saved!")}
                    className="w-full mt-4"
                  >
                    Save Global Settings
                  </Button>
                </CardContent>
              </Card>

              {selectedConfig && (
                <Card>
                  <CardHeader>
                    <CardTitle>Configure {selectedConfig.vendorName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* URL Configuration */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">Redirect URLs</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label className="text-green-700">Complete URL</Label>
                          <Input
                            value={selectedConfig.redirectUrls.complete}
                            onChange={(e) => updateVendorConfig(selectedConfig.vendorId, {
                              redirectUrls: { ...selectedConfig.redirectUrls, complete: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-orange-700">Terminate URL</Label>
                          <Input
                            value={selectedConfig.redirectUrls.terminate}
                            onChange={(e) => updateVendorConfig(selectedConfig.vendorId, {
                              redirectUrls: { ...selectedConfig.redirectUrls, terminate: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-blue-700">Quota Full URL</Label>
                          <Input
                            value={selectedConfig.redirectUrls.quotaFull}
                            onChange={(e) => updateVendorConfig(selectedConfig.vendorId, {
                              redirectUrls: { ...selectedConfig.redirectUrls, quotaFull: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700">Study Closed URL</Label>
                          <Input
                            value={selectedConfig.redirectUrls.studyClosed}
                            onChange={(e) => updateVendorConfig(selectedConfig.vendorId, {
                              redirectUrls: { ...selectedConfig.redirectUrls, studyClosed: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Settings */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">Settings</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <Label>Enable Redirects</Label>
                          <Switch
                            checked={selectedConfig.settings.enabled}
                            onCheckedChange={(checked) => updateVendorConfig(selectedConfig.vendorId, {
                              settings: { ...selectedConfig.settings, enabled: checked }
                            })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Passthrough Mode</Label>
                          <Switch
                            checked={selectedConfig.settings.passthrough}
                            onCheckedChange={(checked) => updateVendorConfig(selectedConfig.vendorId, {
                              settings: { ...selectedConfig.settings, passthrough: checked }
                            })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Append Parameters</Label>
                          <Switch
                            checked={selectedConfig.settings.appendParams}
                            onCheckedChange={(checked) => updateVendorConfig(selectedConfig.vendorId, {
                              settings: { ...selectedConfig.settings, appendParams: checked }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Delay (ms)</Label>
                          <Input
                            type="number"
                            value={selectedConfig.settings.delay}
                            onChange={(e) => updateVendorConfig(selectedConfig.vendorId, {
                              settings: { ...selectedConfig.settings, delay: parseInt(e.target.value) || 0 }
                            })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Custom Parameters</Label>
                        <Input
                          value={selectedConfig.settings.customParams}
                          onChange={(e) => updateVendorConfig(selectedConfig.vendorId, {
                            settings: { ...selectedConfig.settings, customParams: e.target.value }
                          })}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        onClick={() => deleteVendor(selectedConfig.vendorId)}
                        className="flex-1"
                      >
                        Delete Vendor
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => updateVendorConfig(selectedConfig.vendorId, {
                          status: selectedConfig.status === 'active' ? 'inactive' : 'active'
                        })}
                        className="flex-1"
                      >
                        {selectedConfig.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Testing Tab */}
            <TabsContent value="testing" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Test Redirects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {vendorConfigs.map((config) => (
                      <div key={config.vendorId} className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-3">{config.vendorName}</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => testRedirectUrl(config.redirectUrls.complete, 'complete')}
                            className="gap-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Test Complete
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => testRedirectUrl(config.redirectUrls.terminate, 'terminate')}
                            className="gap-1"
                          >
                            <XCircle className="w-3 h-3" />
                            Test Terminate
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => testRedirectUrl(config.redirectUrls.quotaFull, 'quotaFull')}
                            className="gap-1"
                          >
                            <AlertTriangle className="w-3 h-3" />
                            Test Quota
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => testRedirectUrl(config.redirectUrls.studyClosed, 'studyClosed')}
                            className="gap-1"
                          >
                            <Activity className="w-3 h-3" />
                            Test Closed
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Implementation Example</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedConfig && (
                      <div className="space-y-3">
                        <Textarea
                          value={generateDualRedirectExample(selectedConfig)}
                          readOnly
                          className="font-mono text-xs"
                          rows={12}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const code = generateDualRedirectExample(selectedConfig);
                            try {
                              const textArea = document.createElement("textarea");
                              textArea.value = code;
                              textArea.style.position = "fixed";
                              textArea.style.left = "-999999px";
                              textArea.style.top = "-999999px";
                              document.body.appendChild(textArea);
                              textArea.focus();
                              textArea.select();

                              const successful = document.execCommand('copy');
                              document.body.removeChild(textArea);

                              if (successful) {
                                showCopySuccess(document.body, `Implementation Code Copied!`);
                              } else {
                                prompt("Copy this implementation code:", code);
                              }
                            } catch (err) {
                              console.error("Copy failed:", err);
                              prompt("Copy this implementation code:", code);
                            }
                          }}
                          className="gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          Copy Code
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Test Dialog */}
      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Test Vendor Redirects - {selectedConfig?.vendorName}</DialogTitle>
          </DialogHeader>
          {selectedConfig && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Test redirects will open in new tabs with sample parameters: pid=TEST123&uid=TEST123-001-SAMPLE
              </p>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedConfig.redirectUrls).map(([type, url]) => (
                  <div key={type} className="space-y-2">
                    <Label className="capitalize">{type} URL:</Label>
                    <div className="flex gap-2">
                      <Input value={url} readOnly className="text-sm" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testRedirectUrl(url, type)}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
