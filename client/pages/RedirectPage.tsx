import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { CheckCircle, XCircle, Users, Lock } from "lucide-react";

interface RedirectPageProps {
  type: 'complete' | 'terminate' | 'quota-full' | 'study-closed';
}

interface RedirectConfig {
  title: string;
  message: string;
  customQuote: string;
  backgroundColor: string;
  textColor: string;
  showPID: boolean;
  showUID: boolean;
  showIP: boolean;
  showDateTime: boolean;
}

export default function RedirectPage({ type }: RedirectPageProps) {
  const [searchParams] = useSearchParams();
  const [config, setConfig] = useState<RedirectConfig | null>(null);
  const [userInfo, setUserInfo] = useState({
    pid: '',
    uid: '',
    ip: '',
    dateTime: ''
  });

  useEffect(() => {
    // Extract URL parameters
    const pid = searchParams.get('pid') || 'Unknown';
    const uid = searchParams.get('uid') || 'Unknown';
    const ip = searchParams.get('ip') || 'Unknown';
    const dateTime = new Date().toLocaleString();

    setUserInfo({ pid, uid, ip, dateTime });

    // Load redirect configuration (in real app, this would come from API)
    const configs = {
      complete: {
        title: "Thank You!",
        message: "Your survey response has been successfully recorded. Thank you for your valuable participation!",
        customQuote: "Your insights help us make better decisions for everyone.",
        backgroundColor: "#f0fdf4",
        textColor: "#166534",
        showPID: true,
        showUID: true,
        showIP: true,
        showDateTime: true
      },
      terminate: {
        title: "Survey Complete",
        message: "Thank you for your time. Unfortunately, you do not meet the requirements for this particular survey.",
        customQuote: "We appreciate your interest and encourage you to check back for future opportunities.",
        backgroundColor: "#fef2f2",
        textColor: "#991b1b",
        showPID: true,
        showUID: true,
        showIP: true,
        showDateTime: true
      },
      'quota-full': {
        title: "Survey Capacity Reached",
        message: "Thank you for your interest! This survey has reached its maximum capacity for your demographic group.",
        customQuote: "Your participation is valuable - please check back for new survey opportunities.",
        backgroundColor: "#fffbeb",
        textColor: "#92400e",
        showPID: true,
        showUID: true,
        showIP: true,
        showDateTime: true
      },
      'study-closed': {
        title: "Survey Closed",
        message: "This survey is no longer accepting responses. The data collection period has ended.",
        customQuote: "Thank you for your continued interest in our research studies.",
        backgroundColor: "#f8fafc",
        textColor: "#475569",
        showPID: true,
        showUID: true,
        showIP: true,
        showDateTime: true
      }
    };

    setConfig(configs[type]);

    // Log the redirect event (in real app, this would be sent to analytics)
    console.log(`Redirect event: ${type}`, { pid, uid, ip, dateTime });
  }, [type, searchParams]);

  const getIcon = () => {
    switch(type) {
      case 'complete': return <CheckCircle className="w-16 h-16" />;
      case 'terminate': return <XCircle className="w-16 h-16" />;
      case 'quota-full': return <Users className="w-16 h-16" />;
      case 'study-closed': return <Lock className="w-16 h-16" />;
      default: return <CheckCircle className="w-16 h-16" />;
    }
  };

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: config.backgroundColor, color: config.textColor }}
    >
      <div className="max-w-2xl mx-auto text-center">
        {/* Icon */}
        <div className="mb-8">
          <div 
            className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: config.textColor + '20' }}
          >
            {getIcon()}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{config.title}</h1>
          
          <p className="text-lg md:text-xl leading-relaxed mb-8 opacity-90">
            {config.message}
          </p>

          {config.customQuote && (
            <blockquote 
              className="text-base md:text-lg italic border-l-4 pl-6 my-8"
              style={{ borderColor: config.textColor + '40' }}
            >
              "{config.customQuote}"
            </blockquote>
          )}
        </div>

        {/* Information Display */}
        {(config.showPID || config.showUID || config.showIP || config.showDateTime) && (
          <div className="mt-12 pt-8 border-t border-current border-opacity-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm opacity-75">
              {config.showPID && (
                <div className="flex flex-col">
                  <span className="font-semibold mb-1">Project ID</span>
                  <span className="font-mono text-base">{userInfo.pid}</span>
                </div>
              )}
              {config.showUID && (
                <div className="flex flex-col">
                  <span className="font-semibold mb-1">Response ID</span>
                  <span className="font-mono text-base">{userInfo.uid}</span>
                </div>
              )}
              {config.showIP && (
                <div className="flex flex-col">
                  <span className="font-semibold mb-1">IP Address</span>
                  <span className="font-mono text-base">{userInfo.ip}</span>
                </div>
              )}
              {config.showDateTime && (
                <div className="flex flex-col">
                  <span className="font-semibold mb-1">Timestamp</span>
                  <span className="font-mono text-base">{userInfo.dateTime}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-sm opacity-60">
          <p>© 2024 SurveyPanel. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

// Individual redirect page components
export function CompletePage() {
  return <RedirectPage type="complete" />;
}

export function TerminatePage() {
  return <RedirectPage type="terminate" />;
}

export function QuotaFullPage() {
  return <RedirectPage type="quota-full" />;
}

export function StudyClosedPage() {
  return <RedirectPage type="study-closed" />;
}
