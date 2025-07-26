import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Eye,
  CheckCircle,
  XCircle,
  Users,
  Lock,
  Copy,
  ExternalLink,
  Palette,
  Save
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface RedirectConfig {
  id: string;
  type: 'complete' | 'terminate' | 'quota-full' | 'study-closed';
  title: string;
  message: string;
  customQuote: string;
  backgroundColor: string;
  textColor: string;
  showPID: boolean;
  showUID: boolean;
  showIP: boolean;
  showDateTime: boolean;
  enabled: boolean;
}

export default function Redirects() {
  const [activeTab, setActiveTab] = useState("complete");
  const [redirectConfigs, setRedirectConfigs] = useState<RedirectConfig[]>([
    {
      id: "complete",
      type: "complete",
      title: "Thank You!",
      message: "Your survey response has been successfully recorded. Thank you for your valuable participation!",
      customQuote: "Your insights help us make better decisions for everyone.",
      backgroundColor: "#f0fdf4",
      textColor: "#166534",
      showPID: true,
      showUID: true,
      showIP: true,
      showDateTime: true,
      enabled: true
    },
    {
      id: "terminate",
      type: "terminate",
      title: "Survey Complete",
      message: "Thank you for your time. Unfortunately, you do not meet the requirements for this particular survey.",
      customQuote: "We appreciate your interest and encourage you to check back for future opportunities.",
      backgroundColor: "#fef2f2",
      textColor: "#991b1b",
      showPID: true,
      showUID: true,
      showIP: true,
      showDateTime: true,
      enabled: true
    },
    {
      id: "quota-full",
      type: "quota-full",
      title: "Survey Capacity Reached",
      message: "Thank you for your interest! This survey has reached its maximum capacity for your demographic group.",
      customQuote: "Your participation is valuable - please check back for new survey opportunities.",
      backgroundColor: "#fffbeb",
      textColor: "#92400e",
      showPID: true,
      showUID: true,
      showIP: true,
      showDateTime: true,
      enabled: true
    },
    {
      id: "study-closed",
      type: "study-closed",
      title: "Survey Closed",
      message: "This survey is no longer accepting responses. The data collection period has ended.",
      customQuote: "Thank you for your continued interest in our research studies.",
      backgroundColor: "#f8fafc",
      textColor: "#475569",
      showPID: true,
      showUID: true,
      showIP: true,
      showDateTime: true,
      enabled: true
    }
  ]);

  const [previewData] = useState({
    pid: "P12345",
    uid: "P12345-00187-XY9",
    ip: "192.168.1.1",
    dateTime: new Date().toLocaleString()
  });

  const updateConfig = (id: string, updates: Partial<RedirectConfig>) => {
    setRedirectConfigs(configs => 
      configs.map(config => 
        config.id === id ? { ...config, ...updates } : config
      )
    );
  };

  const getConfigById = (id: string) => {
    return redirectConfigs.find(config => config.id === id) || redirectConfigs[0];
  };

  const getIconForType = (type: string) => {
    switch(type) {
      case 'complete': return <CheckCircle className="w-5 h-5" />;
      case 'terminate': return <XCircle className="w-5 h-5" />;
      case 'quota-full': return <Users className="w-5 h-5" />;
      case 'study-closed': return <Lock className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  const copyRedirectUrl = (type: string) => {
    const url = `https://yourpanel.com/redirect/${type}?pid={PID}&uid={UID}&ip={IP}`;
    navigator.clipboard.writeText(url);
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
              <h2 className="text-2xl font-bold text-foreground">Redirect Management</h2>
              <p className="text-muted-foreground">Configure custom redirect pages for all survey outcomes</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                {redirectConfigs.filter(c => c.enabled).length} Active
              </Badge>
              <Button className="gap-2">
                <Save className="w-4 h-4" />
                Save All Changes
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex">
          {/* Configuration Panel */}
          <div className="flex-1 p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="complete" className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Complete
                </TabsTrigger>
                <TabsTrigger value="terminate" className="gap-2">
                  <XCircle className="w-4 h-4" />
                  Terminate
                </TabsTrigger>
                <TabsTrigger value="quota-full" className="gap-2">
                  <Users className="w-4 h-4" />
                  Quota Full
                </TabsTrigger>
                <TabsTrigger value="study-closed" className="gap-2">
                  <Lock className="w-4 h-4" />
                  Study Closed
                </TabsTrigger>
              </TabsList>

              {redirectConfigs.map((config) => (
                <TabsContent key={config.id} value={config.id} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {getIconForType(config.type)}
                          {config.title} Page Configuration
                        </CardTitle>
                        <Switch
                          checked={config.enabled}
                          onCheckedChange={(enabled) => updateConfig(config.id, { enabled })}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Basic Settings */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`title-${config.id}`}>Page Title</Label>
                          <Input
                            id={`title-${config.id}`}
                            value={config.title}
                            onChange={(e) => updateConfig(config.id, { title: e.target.value })}
                            placeholder="Enter page title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Redirect URL</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              value={`https://yourpanel.com/redirect/${config.type}`}
                              readOnly
                              className="font-mono text-sm"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyRedirectUrl(config.type)}
                              className="gap-1"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Message and Quote */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`message-${config.id}`}>Main Message</Label>
                          <Textarea
                            id={`message-${config.id}`}
                            value={config.message}
                            onChange={(e) => updateConfig(config.id, { message: e.target.value })}
                            placeholder="Enter the main message displayed to users"
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`quote-${config.id}`}>Custom Quote</Label>
                          <Textarea
                            id={`quote-${config.id}`}
                            value={config.customQuote}
                            onChange={(e) => updateConfig(config.id, { customQuote: e.target.value })}
                            placeholder="Enter an optional custom quote or additional message"
                            rows={2}
                          />
                        </div>
                      </div>

                      {/* Display Options */}
                      <div>
                        <Label className="text-base font-medium">Information Display</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`show-pid-${config.id}`}
                              checked={config.showPID}
                              onCheckedChange={(showPID) => updateConfig(config.id, { showPID })}
                            />
                            <Label htmlFor={`show-pid-${config.id}`}>Show PID</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`show-uid-${config.id}`}
                              checked={config.showUID}
                              onCheckedChange={(showUID) => updateConfig(config.id, { showUID })}
                            />
                            <Label htmlFor={`show-uid-${config.id}`}>Show UID</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`show-ip-${config.id}`}
                              checked={config.showIP}
                              onCheckedChange={(showIP) => updateConfig(config.id, { showIP })}
                            />
                            <Label htmlFor={`show-ip-${config.id}`}>Show IP</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`show-datetime-${config.id}`}
                              checked={config.showDateTime}
                              onCheckedChange={(showDateTime) => updateConfig(config.id, { showDateTime })}
                            />
                            <Label htmlFor={`show-datetime-${config.id}`}>Show Date/Time</Label>
                          </div>
                        </div>
                      </div>

                      {/* Color Customization */}
                      <div>
                        <Label className="text-base font-medium mb-3 block">
                          <Palette className="w-4 h-4 inline mr-2" />
                          Color Theme
                        </Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`bg-color-${config.id}`}>Background Color</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id={`bg-color-${config.id}`}
                                type="color"
                                value={config.backgroundColor}
                                onChange={(e) => updateConfig(config.id, { backgroundColor: e.target.value })}
                                className="w-12 h-10 p-1"
                              />
                              <Input
                                value={config.backgroundColor}
                                onChange={(e) => updateConfig(config.id, { backgroundColor: e.target.value })}
                                placeholder="#f0fdf4"
                                className="font-mono"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`text-color-${config.id}`}>Text Color</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id={`text-color-${config.id}`}
                                type="color"
                                value={config.textColor}
                                onChange={(e) => updateConfig(config.id, { textColor: e.target.value })}
                                className="w-12 h-10 p-1"
                              />
                              <Input
                                value={config.textColor}
                                onChange={(e) => updateConfig(config.id, { textColor: e.target.value })}
                                placeholder="#166534"
                                className="font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Live Preview Panel */}
          <div className="w-96 border-l border-border p-6 bg-muted/10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </h3>
                <Button variant="outline" size="sm" className="gap-1">
                  <ExternalLink className="w-3 h-3" />
                  Open Full
                </Button>
              </div>

              {/* Preview Container */}
              <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
                <div className="p-1 bg-gray-100 border-b flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-xs text-gray-600 font-mono">
                    yourpanel.com/redirect/{getConfigById(activeTab).type}
                  </div>
                </div>

                {/* Preview Content */}
                <div 
                  className="p-8 min-h-[400px] flex flex-col items-center justify-center text-center"
                  style={{ 
                    backgroundColor: getConfigById(activeTab).backgroundColor,
                    color: getConfigById(activeTab).textColor 
                  }}
                >
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                         style={{ backgroundColor: getConfigById(activeTab).textColor + '20' }}>
                      {getIconForType(getConfigById(activeTab).type)}
                    </div>
                    <h1 className="text-2xl font-bold mb-4">{getConfigById(activeTab).title}</h1>
                    <p className="text-base mb-4 leading-relaxed">{getConfigById(activeTab).message}</p>
                    {getConfigById(activeTab).customQuote && (
                      <blockquote className="text-sm italic border-l-4 pl-4 mt-4"
                                  style={{ borderColor: getConfigById(activeTab).textColor + '40' }}>
                        "{getConfigById(activeTab).customQuote}"
                      </blockquote>
                    )}
                  </div>

                  {/* Information Display */}
                  <div className="mt-8 space-y-2 text-sm opacity-75">
                    {getConfigById(activeTab).showPID && (
                      <div>Project ID: <span className="font-mono">{previewData.pid}</span></div>
                    )}
                    {getConfigById(activeTab).showUID && (
                      <div>Response ID: <span className="font-mono">{previewData.uid}</span></div>
                    )}
                    {getConfigById(activeTab).showIP && (
                      <div>IP Address: <span className="font-mono">{previewData.ip}</span></div>
                    )}
                    {getConfigById(activeTab).showDateTime && (
                      <div>Timestamp: <span className="font-mono">{previewData.dateTime}</span></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Redirect Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Total Redirects Today:</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{getConfigById(activeTab).title} Rate:</span>
                    <span className="font-semibold">
                      {getConfigById(activeTab).type === 'complete' ? '72%' : 
                       getConfigById(activeTab).type === 'terminate' ? '18%' :
                       getConfigById(activeTab).type === 'quota-full' ? '7%' : '3%'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Average Load Time:</span>
                    <span className="font-semibold">0.8s</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
