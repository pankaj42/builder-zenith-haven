import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            The page <code className="bg-gray-100 px-2 py-1 rounded text-sm">{location.pathname}</code> doesn't exist.
          </p>
          <p className="text-sm text-gray-500">
            This might be a typo in the URL or the page may have been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button asChild variant="default">
              <Link to="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Go to Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" onClick={() => window.history.back()}>
              <span className="flex items-center gap-2 cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </span>
            </Button>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              Survey Panel Administration System
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
