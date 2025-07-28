import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Target,
  Users,
  Settings,
  Play,
  Pause,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Activity,
  Globe
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { usePanelContext } from "@/contexts/PanelContext";

interface QuotaRule {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  type: 'global' | 'vendor-specific' | 'demographic';
  vendorId?: string;
  vendorName?: string;
  criteria: {
    gender?: 'male' | 'female' | 'any';
    ageMin?: number;
    ageMax?: number;
    country?: string;
    region?: string;
  };
  quotaLimit: number;
  currentCount: number;
  autoAction: 'pause-vendor' | 'redirect-quota-full' | 'notify-admin';
  isActive: boolean;
  createdDate: string;
  lastTriggered?: string;
}

interface VendorQuotaStatus {
  vendorId: string;
  vendorName: string;
  projectId: string;
  projectName: string;
  totalSent: number;
  completes: number;
  terminates: number;
  quotaFull: number;
  completionRate: number;
  isPaused: boolean;
  pauseReason?: string;
  quotaRules: QuotaRule[];
}

export default function Quotas() {
  const { state } = usePanelContext();

  // Generate dynamic quota rules based on project data
  const generateDynamicQuotaRules = (): QuotaRule[] => {
    const rules: QuotaRule[] = [];

    // Create global quotas for each project
    state.projects.forEach(project => {
      rules.push({
        id: `QR-Global-${project.id}`,
        name: `Global Quota - ${project.name}`,
        projectId: project.id,
        projectName: project.name,
        type: 'global',
        criteria: {},
        quotaLimit: project.totalQuota,
        currentCount: project.completes,
        autoAction: 'redirect-quota-full',
        isActive: project.status === 'active',
        createdDate: project.createdDate,
        lastTriggered: project.completes >= project.totalQuota ? new Date().toISOString() : undefined
      });

      // Create vendor-specific quotas for assigned vendors
      project.vendors.forEach(vendorId => {
        const vendor = state.vendors.find(v => v.id === vendorId);
        if (vendor) {
          const vendorResponses = state.responses.filter(r => r.vendorId === vendorId && r.projectId === project.id);
          const vendorCompletes = vendorResponses.filter(r => r.status === 'complete').length;

          rules.push({
            id: `QR-Vendor-${project.id}-${vendorId}`,
            name: `Daily Limit - ${vendor.name}`,
            projectId: project.id,
            projectName: project.name,
            type: 'vendor-specific',
            vendorId: vendorId,
            vendorName: vendor.name,
            criteria: {},
            quotaLimit: Math.floor(project.totalQuota / project.vendors.length * 0.3), // 30% of proportional share as daily limit
            currentCount: vendorCompletes,
            autoAction: 'pause-vendor',
            isActive: vendor.status === 'active' && project.status === 'active',
            createdDate: project.createdDate
          });
        }
      });
    });

    return rules;
  };

  const dynamicQuotaRules = generateDynamicQuotaRules();
  const [quotaRules, setQuotaRules] = useState<QuotaRule[]>(dynamicQuotaRules);

  // Generate dynamic vendor statuses from global state
  const generateDynamicVendorStatuses = (): VendorQuotaStatus[] => {
    const statuses: VendorQuotaStatus[] = [];

    state.vendors.forEach(vendor => {
      vendor.assignedProjects.forEach(projectId => {
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
          const vendorResponses = state.responses.filter(r => r.vendorId === vendor.id && r.projectId === projectId);
          const completes = vendorResponses.filter(r => r.status === 'complete').length;
          const terminates = vendorResponses.filter(r => r.status === 'terminate').length;
          const quotaFull = vendorResponses.filter(r => r.status === 'quota-full').length;
          const totalResponses = vendorResponses.length;
          const completionRate = totalResponses > 0 ? (completes / totalResponses) * 100 : 0;

          statuses.push({
            vendorId: vendor.id,
            vendorName: vendor.name,
            projectId: projectId,
            projectName: project.name,
            totalSent: vendor.totalSent,
            completes: completes,
            terminates: terminates,
            quotaFull: quotaFull,
            completionRate: Math.round(completionRate * 10) / 10,
            isPaused: vendor.status !== 'active',
            pauseReason: vendor.status !== 'active' ? `Vendor status: ${vendor.status}` : undefined,
            quotaRules: dynamicQuotaRules.filter(r => r.vendorId === vendor.id || r.type === 'global')
          });
        }
      });
    });

    return statuses;
  };

  const dynamicVendorStatuses = generateDynamicVendorStatuses();
  const [vendorStatuses, setVendorStatuses] = useState<VendorQuotaStatus[]>(dynamicVendorStatuses);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newQuotaRule, setNewQuotaRule] = useState<Partial<QuotaRule>>({
    name: "",
    projectId: "",
    type: "global",
    criteria: {},
    quotaLimit: 100,
    autoAction: "redirect-quota-full",
    isActive: true
  });

  // Simulate real-time quota monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setQuotaRules(prevRules => 
        prevRules.map(rule => {
          // Simulate quota progress (only if active and not at limit)
          if (rule.isActive && rule.currentCount < rule.quotaLimit && Math.random() < 0.4) {
            const increment = Math.floor(Math.random() * 3) + 1;
            const newCount = Math.min(rule.currentCount + increment, rule.quotaLimit);
            
            // Check if quota reached and trigger auto action
            if (newCount >= rule.quotaLimit && rule.currentCount < rule.quotaLimit) {
              console.log(`Quota rule ${rule.name} triggered! Auto action: ${rule.autoAction}`);
              
              if (rule.autoAction === 'pause-vendor' && rule.vendorId) {
                setVendorStatuses(prevStatuses =>
                  prevStatuses.map(status =>
                    status.vendorId === rule.vendorId
                      ? { ...status, isPaused: true, pauseReason: `Quota rule ${rule.name} triggered` }
                      : status
                  )
                );
              }
              
              return {
                ...rule,
                currentCount: newCount,
                lastTriggered: new Date().toISOString()
              };
            }
            
            return { ...rule, currentCount: newCount };
          }
          return rule;
        })
      );

      // Update vendor statistics
      setVendorStatuses(prevStatuses =>
        prevStatuses.map(status => {
          if (Math.random() < 0.3 && !status.isPaused) {
            return {
              ...status,
              totalSent: status.totalSent + Math.floor(Math.random() * 5),
              completes: status.completes + Math.floor(Math.random() * 3),
              terminates: status.terminates + Math.floor(Math.random() * 2)
            };
          }
          return status;
        })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const createQuotaRule = () => {
    const rule: QuotaRule = {
      ...newQuotaRule as QuotaRule,
      id: `QR${Date.now().toString().slice(-3)}`,
      projectName: "Project Name", // In real app, lookup from projectId
      currentCount: 0,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setQuotaRules([...quotaRules, rule]);
    setShowCreateDialog(false);
    setNewQuotaRule({
      name: "",
      projectId: "",
      type: "global",
      criteria: {},
      quotaLimit: 100,
      autoAction: "redirect-quota-full",
      isActive: true
    });
  };

  const toggleQuotaRule = (ruleId: string) => {
    setQuotaRules(quotaRules.map(rule =>
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const pauseVendor = (vendorId: string, reason: string) => {
    setVendorStatuses(vendorStatuses.map(status =>
      status.vendorId === vendorId
        ? { ...status, isPaused: true, pauseReason: reason }
        : status
    ));
  };

  const resumeVendor = (vendorId: string) => {
    setVendorStatuses(vendorStatuses.map(status =>
      status.vendorId === vendorId
        ? { ...status, isPaused: false, pauseReason: undefined }
        : status
    ));
  };

  const deleteQuotaRule = (ruleId: string) => {
    setQuotaRules(quotaRules.filter(rule => rule.id !== ruleId));
  };

  const getQuotaProgress = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 90) return "bg-orange-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'global': return <Globe className="w-4 h-4" />;
      case 'vendor-specific': return <Users className="w-4 h-4" />;
      case 'demographic': return <Target className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch(type) {
      case 'global': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'vendor-specific': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'demographic': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
              <h2 className="text-2xl font-bold text-foreground">Quota Management</h2>
              <p className="text-muted-foreground">Configure global and vendor-specific quotas with automated controls</p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Quota Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Quota Rule</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rule-name">Rule Name</Label>
                      <Input
                        id="rule-name"
                        value={newQuotaRule.name}
                        onChange={(e) => setNewQuotaRule({...newQuotaRule, name: e.target.value})}
                        placeholder="Enter rule name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quota-limit">Quota Limit</Label>
                      <Input
                        id="quota-limit"
                        type="number"
                        value={newQuotaRule.quotaLimit}
                        onChange={(e) => setNewQuotaRule({...newQuotaRule, quotaLimit: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Project</Label>
                    <Select value={newQuotaRule.projectId} onValueChange={(value) => setNewQuotaRule({...newQuotaRule, projectId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="P12345">Consumer Behavior Study 2024</SelectItem>
                        <SelectItem value="P12346">Brand Awareness Survey</SelectItem>
                        <SelectItem value="P12347">Product Feedback Collection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Rule Type</Label>
                    <Select value={newQuotaRule.type} onValueChange={(value: any) => setNewQuotaRule({...newQuotaRule, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">Global Quota</SelectItem>
                        <SelectItem value="vendor-specific">Vendor Specific</SelectItem>
                        <SelectItem value="demographic">Demographic Quota</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newQuotaRule.type === 'vendor-specific' && (
                    <div className="space-y-2">
                      <Label>Vendor</Label>
                      <Select value={newQuotaRule.vendorId} onValueChange={(value) => setNewQuotaRule({...newQuotaRule, vendorId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vendor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="V001">V001 - Quality Traffic Solutions</SelectItem>
                          <SelectItem value="V002">V002 - Survey Source Network</SelectItem>
                          <SelectItem value="V003">V003 - Panel Partners LLC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Auto Action When Quota Reached</Label>
                    <Select value={newQuotaRule.autoAction} onValueChange={(value: any) => setNewQuotaRule({...newQuotaRule, autoAction: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="redirect-quota-full">Redirect to Quota Full Page</SelectItem>
                        <SelectItem value="pause-vendor">Pause Vendor Traffic</SelectItem>
                        <SelectItem value="notify-admin">Notify Admin Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={createQuotaRule} className="flex-1">Create Rule</Button>
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs defaultValue="rules" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rules">Quota Rules</TabsTrigger>
              <TabsTrigger value="vendor-status">Vendor Status</TabsTrigger>
            </TabsList>

            <TabsContent value="rules" className="space-y-6">
              <div className="grid gap-4">
                {quotaRules.map((rule) => {
                  const progress = getQuotaProgress(rule.currentCount, rule.quotaLimit);
                  const isAtLimit = rule.currentCount >= rule.quotaLimit;
                  
                  return (
                    <Card key={rule.id} className={`${isAtLimit ? 'border-red-200 bg-red-50' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{rule.name}</h3>
                              <Badge className={`${getTypeBadgeColor(rule.type)} flex items-center gap-1`}>
                                {getTypeIcon(rule.type)}
                                {rule.type.replace('-', ' ')}
                              </Badge>
                              {isAtLimit && (
                                <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Quota Reached
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{rule.projectName}</p>
                            {rule.vendorName && (
                              <p className="text-xs text-muted-foreground">Vendor: {rule.vendorName}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={rule.isActive}
                              onCheckedChange={() => toggleQuotaRule(rule.id)}
                            />
                            <Button variant="outline" size="sm" className="gap-1">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1 text-red-600 hover:text-red-700"
                              onClick={() => deleteQuotaRule(rule.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-semibold">
                              {rule.currentCount} / {rule.quotaLimit} ({progress.toFixed(1)}%)
                            </span>
                          </div>
                          <Progress value={progress} className="h-3" />
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Current Count:</span>
                              <div className="font-semibold">{rule.currentCount.toLocaleString()}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Quota Limit:</span>
                              <div className="font-semibold">{rule.quotaLimit.toLocaleString()}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Auto Action:</span>
                              <div className="font-semibold capitalize">{rule.autoAction.replace('-', ' ')}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Status:</span>
                              <div className={`font-semibold ${rule.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                {rule.isActive ? 'Active' : 'Inactive'}
                              </div>
                            </div>
                          </div>

                          {rule.lastTriggered && (
                            <div className="text-sm text-muted-foreground">
                              Last triggered: {new Date(rule.lastTriggered).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="vendor-status" className="space-y-6">
              <div className="grid gap-4">
                {vendorStatuses.map((status) => (
                  <Card key={`${status.vendorId}-${status.projectId}`} className={`${status.isPaused ? 'border-orange-200 bg-orange-50' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{status.vendorName}</h3>
                            <Badge className="font-mono">{status.vendorId}</Badge>
                            <Badge className={status.isPaused ? 'bg-orange-100 text-orange-800 border-orange-200' : 'bg-green-100 text-green-800 border-green-200'}>
                              {status.isPaused ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                              {status.isPaused ? 'Paused' : 'Active'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{status.projectName}</p>
                          {status.pauseReason && (
                            <p className="text-sm text-orange-600 mt-1">
                              <AlertTriangle className="w-3 h-3 inline mr-1" />
                              {status.pauseReason}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {status.isPaused ? (
                            <Button variant="outline" size="sm" onClick={() => resumeVendor(status.vendorId)}>
                              <Play className="w-3 h-3 mr-1" />
                              Resume
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => pauseVendor(status.vendorId, "Manually paused by admin")}>
                              <Pause className="w-3 h-3 mr-1" />
                              Pause
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{status.totalSent}</div>
                          <div className="text-xs text-muted-foreground">Total Sent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{status.completes}</div>
                          <div className="text-xs text-muted-foreground">Completes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{status.terminates}</div>
                          <div className="text-xs text-muted-foreground">Terminates</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{status.quotaFull}</div>
                          <div className="text-xs text-muted-foreground">Quota Full</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-indigo-600">{status.completionRate}%</div>
                          <div className="text-xs text-muted-foreground">Completion Rate</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Applied Quota Rules:</h4>
                        <div className="grid gap-2">
                          {status.quotaRules.map((rule) => {
                            const progress = getQuotaProgress(rule.currentCount, rule.quotaLimit);
                            return (
                              <div key={rule.id} className="bg-muted/50 rounded-lg p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium">{rule.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {rule.currentCount} / {rule.quotaLimit}
                                  </span>
                                </div>
                                <Progress value={progress} className="h-2" />
                              </div>
                            );
                          })}
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
    </div>
  );
}
