import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, X, Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { showCopySuccess } from './toast-notification';

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any;
  type: 'alert' | 'vendor' | 'project' | 'ip';
}

export const DetailsModal: React.FC<DetailsModalProps> = ({
  isOpen,
  onClose,
  title,
  data,
  type
}) => {
  const copyToClipboard = (text: string, buttonElement: HTMLElement) => {
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
        showCopySuccess(buttonElement, 'Copied!');
      }
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const renderAlertDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Alert ID</label>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{data?.id || 'N/A'}</span>
            {data?.id && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => copyToClipboard(data.id, e.currentTarget)}
                className="h-6 w-6 p-0"
              >
                <Copy className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Type</label>
          <div className="mt-1">
            <Badge className="bg-blue-100 text-blue-800">{data?.type?.replace('-', ' ') || 'Unknown'}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Severity</label>
          <div className="mt-1">
            <Badge className={
              data?.severity === 'critical' ? 'bg-red-100 text-red-800' :
              data?.severity === 'high' ? 'bg-orange-100 text-orange-800' :
              data?.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }>
              {data?.severity || 'low'}
            </Badge>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Status</label>
          <div className="mt-1">
            <Badge className={
              data?.status === 'resolved' ? 'bg-green-100 text-green-800' :
              data?.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }>
              {data?.status?.replace('-', ' ') || 'pending'}
            </Badge>
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Details</label>
        <p className="mt-1 text-sm bg-gray-50 p-3 rounded border">{data?.details || 'No details available'}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Vendor</label>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm">{data.vendorName} ({data.vendorId})</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => copyToClipboard(data.vendorId, e.currentTarget)}
              className="h-6 w-6 p-0"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Project</label>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm">{data.projectId}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => copyToClipboard(data.projectId, e.currentTarget)}
              className="h-6 w-6 p-0"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Affected Responses</label>
        <div className="mt-1 bg-gray-50 p-3 rounded border">
          <div className="flex flex-wrap gap-2">
            {data.affectedResponses.map((response: string) => (
              <div key={response} className="flex items-center gap-1">
                <span className="font-mono text-xs bg-white px-2 py-1 rounded border">{response}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => copyToClipboard(response, e.currentTarget)}
                  className="h-5 w-5 p-0"
                >
                  <Copy className="w-2 h-2" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Timestamp</label>
        <p className="mt-1 text-sm">{new Date(data.timestamp).toLocaleString()}</p>
      </div>

      {data.investigatedBy && (
        <div>
          <label className="text-sm font-medium text-gray-700">Investigated By</label>
          <p className="mt-1 text-sm">{data.investigatedBy}</p>
        </div>
      )}

      {data.resolution && (
        <div>
          <label className="text-sm font-medium text-gray-700">Resolution</label>
          <p className="mt-1 text-sm bg-green-50 p-3 rounded border">{data.resolution}</p>
        </div>
      )}
    </div>
  );

  const renderVendorDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Vendor ID</label>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{data?.vendorId || 'N/A'}</span>
            {data?.vendorId && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => copyToClipboard(data.vendorId, e.currentTarget)}
                className="h-6 w-6 p-0"
              >
                <Copy className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Risk Level</label>
          <div className="mt-1">
            <Badge className={
              data?.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
              data?.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
              data?.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }>
              {data?.riskLevel?.toUpperCase() || 'LOW'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded border">
        <h4 className="font-medium mb-3">Performance Metrics</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>Overall Score: <span className="font-bold">{data?.overallScore || data?.fraudScore || 0}/5</span></div>
          <div>Completion Rate: <span className="font-bold">{data?.completionRate || 0}%</span></div>
          <div>Terminate Rate: <span className="font-bold">{data?.terminateRate || 0}%</span></div>
          <div>Total Responses: <span className="font-bold">{data?.totalResponses || data?.totalCompletes || 0}</span></div>
        </div>
      </div>

      {data?.earnings && (
        <div>
          <label className="text-sm font-medium text-gray-700">Total Earnings</label>
          <p className="mt-1 text-lg font-bold text-green-600">${data.earnings.toLocaleString()}</p>
        </div>
      )}

      {(data?.lastActivity || data?.lastActive) && (
        <div>
          <label className="text-sm font-medium text-gray-700">Last Activity</label>
          <p className="mt-1 text-sm">{new Date(data.lastActivity || data.lastActive).toLocaleString()}</p>
        </div>
      )}
    </div>
  );

  const renderIpDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">IP Address</label>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{data?.ip || 'N/A'}</span>
            {data?.ip && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => copyToClipboard(data.ip, e.currentTarget)}
                className="h-6 w-6 p-0"
              >
                <Copy className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Risk Score</label>
          <div className="mt-1">
            <span className={`font-bold ${(data?.riskScore || 0) >= 8 ? 'text-red-600' : (data?.riskScore || 0) >= 6 ? 'text-orange-600' : 'text-green-600'}`}>
              {data?.riskScore || 0}/10
            </span>
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Location</label>
        <p className="mt-1 text-sm">{data.city}, {data.country}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded border">
        <h4 className="font-medium mb-3">Activity Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>Response Count: <span className="font-bold">{data.responseCount}</span></div>
          <div>Unique UIDs: <span className="font-bold">{data.uniqueUIDs}</span></div>
          <div>Vendors: <span className="font-bold">{data.vendors?.join(', ')}</span></div>
          <div>Projects: <span className="font-bold">{data.projects?.join(', ')}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">First Seen</label>
          <p className="mt-1 text-sm">{new Date(data.firstSeen).toLocaleString()}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Last Seen</label>
          <p className="mt-1 text-sm">{new Date(data.lastSeen).toLocaleString()}</p>
        </div>
      </div>

      {data.suspiciousActivity && (
        <div>
          <label className="text-sm font-medium text-gray-700">Suspicious Activity</label>
          <div className="mt-1 space-y-1">
            {data.suspiciousActivity.map((activity: string, index: number) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <AlertTriangle className="w-3 h-3 text-orange-500" />
                <span>{activity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    // Return early if data is null or undefined
    if (!data) {
      return <div className="text-center py-8 text-muted-foreground">No data available</div>;
    }

    switch (type) {
      case 'alert':
        return renderAlertDetails();
      case 'vendor':
        return renderVendorDetails();
      case 'ip':
        return renderIpDetails();
      default:
        return <div>No details available</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'alert' && <Shield className="w-5 h-5" />}
            {type === 'vendor' && <CheckCircle className="w-5 h-5" />}
            {type === 'ip' && <Info className="w-5 h-5" />}
            {title}
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};
