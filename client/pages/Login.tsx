import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Mail, 
  Smartphone, 
  Key, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Clock,
  Globe,
  Lock,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'credentials' | 'otp' | 'success'>('credentials');
  const [method, setMethod] = useState<'email' | 'google-auth'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  
  // Mock user for demo
  const mockUser = {
    username: 'admin',
    password: 'admin123',
    email: 'admin@surveypanel.com'
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (credentials.username === mockUser.username && credentials.password === mockUser.password) {
      setStep('otp');
      // Start countdown timer
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setError('Invalid username or password');
    }
    
    setIsLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const otpValue = otpCode.join('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo, accept any 6-digit code
    if (otpValue.length === 6) {
      setStep('success');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setError('Invalid verification code');
    }
    
    setIsLoading(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setTimeLeft(300); // Reset timer
    setOtpCode(['', '', '', '', '', '']);
    setIsLoading(false);
    
    // Restart countdown
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Successful!</h2>
            <p className="text-gray-600 mb-6">
              Welcome back to SurveyPanel. Redirecting to dashboard...
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <span className="text-sm text-gray-500">Loading dashboard</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Two-Factor Authentication</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              {method === 'email' 
                ? `We've sent a verification code to ${mockUser.email}`
                : 'Enter the 6-digit code from your authenticator app'
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={method} onValueChange={(value: any) => setMethod(value)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email" className="gap-2">
                  <Mail className="w-4 h-4" />
                  Email OTP
                </TabsTrigger>
                <TabsTrigger value="google-auth" className="gap-2">
                  <Smartphone className="w-4 h-4" />
                  Authenticator
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4">
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Verification Code</Label>
                    <div className="flex gap-2 justify-center">
                      {otpCode.map((digit, index) => (
                        <Input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-12 text-center text-lg font-bold"
                        />
                      ))}
                    </div>
                  </div>

                  {error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Code expires in {formatTime(timeLeft)}
                    </div>
                    {timeLeft > 0 ? (
                      <span className="text-muted-foreground">
                        Didn't receive code?
                      </span>
                    ) : (
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        onClick={resendOtp}
                        disabled={isLoading}
                        className="gap-1 p-0 h-auto"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Resend Code
                      </Button>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || otpCode.join('').length !== 6}
                  >
                    {isLoading ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      'Verify Code'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="google-auth" className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                    <Smartphone className="w-12 h-12 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Open your authenticator app and enter the 6-digit code
                    </p>
                    <Badge variant="outline" className="gap-1">
                      <Key className="w-3 h-3" />
                      Google Authenticator
                    </Badge>
                  </div>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Authenticator Code</Label>
                    <div className="flex gap-2 justify-center">
                      {otpCode.map((digit, index) => (
                        <Input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-12 text-center text-lg font-bold"
                        />
                      ))}
                    </div>
                  </div>

                  {error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || otpCode.join('').length !== 6}
                  >
                    {isLoading ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      'Verify Code'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setStep('credentials')}
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">SurveyPanel Admin</CardTitle>
          <p className="text-muted-foreground">Secure admin access with 2FA protection</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Sign In
                </div>
              )}
            </Button>
          </form>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Security Features</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="flex flex-col items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
                <div className="text-xs font-medium">Two-Factor Auth</div>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Lock className="w-5 h-5 text-green-600" />
                <div className="text-xs font-medium">Secure Sessions</div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              For demo purposes, use:
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
              <div><strong>Username:</strong> admin</div>
              <div><strong>Password:</strong> admin123</div>
              <div><strong>2FA:</strong> Any 6-digit code</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
