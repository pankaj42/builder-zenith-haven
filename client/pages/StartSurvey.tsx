import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { AlertTriangle, Shield, CheckCircle, ExternalLink } from "lucide-react";

export default function StartSurvey() {
  const { projectId, vendorId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'validating' | 'valid' | 'invalid' | 'redirecting'>('validating');
  const [errorMessage, setErrorMessage] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');

  useEffect(() => {
    validateAndRedirect();
  }, [projectId, vendorId, searchParams]);

  const validateAndRedirect = async () => {
    try {
      // Get vendor UID from URL parameter
      const vendorUID = searchParams.get('ID');
      
      if (!vendorUID) {
        setStatus('invalid');
        setErrorMessage('Missing required ID parameter. Traffic rejected.');
        return;
      }

      if (!projectId || !vendorId) {
        setStatus('invalid');
        setErrorMessage('Invalid project or vendor configuration.');
        return;
      }

      // Simulate validation and UID generation
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate client UID using hybrid format: PROJECTID-SEQ-RANDOM
      const sequence = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
      const random = Math.random().toString(36).substring(2, 5).toUpperCase();
      const clientUID = `${projectId}-${sequence}-${random}`;

      // Store mapping (in real app, this would be saved to database)
      const mapping = {
        project_id: projectId,
        vendor_id: vendorId,
        vendor_uid: vendorUID,
        client_uid: clientUID,
        status: 'started',
        ip: '192.168.1.1', // In real app, get actual IP
        date_time: new Date().toISOString()
      };

      console.log('UID Mapping created:', mapping);

      // Generate client survey URL with redirect back to panel
      const baseClientUrl = 'https://operation4m3r2c.com/Replica_Page/drkm4FiBohdPDq3lMBeWh9mIl5Shc8.php';
      const redirectBackUrl = `https://yourpanel.com/collect/${projectId}`;
      const clientUrl = `${baseClientUrl}?ID=${vendorUID}&redirect_url=${encodeURIComponent(redirectBackUrl)}&uid=${clientUID}`;
      setRedirectUrl(clientUrl);
      setStatus('valid');

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        setStatus('redirecting');
        window.location.href = clientUrl;
      }, 3000);

    } catch (error) {
      setStatus('invalid');
      setErrorMessage('System error occurred. Please try again later.');
      console.error('Validation error:', error);
    }
  };

  const getContent = () => {
    switch (status) {
      case 'validating':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6">
              <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Validating Request</h1>
            <p className="text-gray-600 mb-4">Please wait while we verify your survey invitation...</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3 text-sm text-blue-800">
                <Shield className="w-4 h-4" />
                <span>Checking security parameters and generating unique identifier</span>
              </div>
            </div>
          </div>
        );

      case 'valid':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Survey Ready</h1>
            <p className="text-gray-600 mb-6">Your survey invitation has been validated. You will be redirected shortly.</p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="text-sm text-green-800 space-y-2">
                <div className="flex justify-between">
                  <span>Project:</span>
                  <span className="font-mono">{projectId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vendor:</span>
                  <span className="font-mono">{vendorId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Response ID:</span>
                  <span className="font-mono">{searchParams.get('ID')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                 onClick={() => window.location.href = redirectUrl}>
              <ExternalLink className="w-4 h-4" />
              <span>Click here if not redirected automatically</span>
            </div>
          </div>
        );

      case 'redirecting':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6">
              <div className="animate-pulse w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <ExternalLink className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Redirecting...</h1>
            <p className="text-gray-600">Taking you to the survey now.</p>
          </div>
        );

      case 'invalid':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-red-600 mb-6">{errorMessage}</p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-sm text-red-800">
                <p className="font-medium mb-2">Common issues:</p>
                <ul className="list-disc list-inside space-y-1 text-left">
                  <li>Missing or invalid ID parameter in the URL</li>
                  <li>Expired or malformed survey link</li>
                  <li>Project or vendor configuration error</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">SurveyPanel</h2>
            <p className="text-xs text-gray-500">Secure Survey Gateway</p>
          </div>

          {/* Content */}
          {getContent()}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              Powered by SurveyPanel Security System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
