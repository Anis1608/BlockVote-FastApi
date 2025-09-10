﻿import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SuperAdminAuthContext } from '../../context_api/SuperAdminAuthState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, Vote, Shield, AlertCircle, KeyRound, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const LoginPage = () => {
  const [superAdminId, setSuperAdminId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const navigate = useNavigate();

  const { Super_Admin_Login_Request, Super_Admin_Login_verifyOtp, loading  , isAuthenticated} = useContext(SuperAdminAuthContext);
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [isAuthenticated , navigate]);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsSendingOtp(true);
    
    // Validate inputs
    if (!superAdminId || !email || !password) {
      setError("Please fill in all required fields.");
      setIsSendingOtp(false);
      return;
    }
    
    const success = await Super_Admin_Login_Request(superAdminId, email, password);
    setIsSendingOtp(false);
    
    if (success) {
      toast({
        title: "OTP Sent Successfully",
        description: "Check your email for the verification code.",
        variant: "success"
      });
      setOtpSent(true);
    } else {
      setError("Failed to send OTP. Please check your credentials.");
    }
  };

  // Step 2: Verify OTP and Login
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!otp) {
      setError("Please enter the OTP sent to your email.");
      return;
    }
    
    const success = await Super_Admin_Login_verifyOtp(email, otp);
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome to BlockVote Administration Panel",
        variant: "success"
      });
      // Redirect to dashboard after a brief delay to show the success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setError("Invalid or expired OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-xl border-0 rounded-xl overflow-hidden animate-fade-in">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent"></div>
        
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
            <Vote className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-poppins font-bold text-gray-900">
              BlockVote
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Secure Election Management Platform
            </CardDescription>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-primary bg-primary-light/20 p-3 rounded-lg border border-primary/20">
            <Shield className="w-4 h-4 text-primary" />
            <span>Super Admin Access Only</span>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Super Admin ID */}
            <div className="space-y-2">
              <Label htmlFor="superAdminId" className="text-gray-700 font-medium">
                Super Admin ID
              </Label>
              <Input
                id="superAdminId"
                type="text"
                placeholder="Enter your Super Admin ID"
                value={superAdminId}
                onChange={(e) => setSuperAdminId(e.target.value)}
                required
                className="py-2 px-4 border-gray-300 focus:border-primary focus:ring-primary"
                disabled={otpSent || loading}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@blockvote.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 py-2 border-gray-300 focus:border-primary focus:ring-primary"
                  required
                  disabled={otpSent || loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 py-2 border-gray-300 focus:border-primary focus:ring-primary"
                  required
                  disabled={otpSent || loading}
                />
              </div>
            </div>

            {/* OTP (shown only after sending OTP) */}
            {otpSent && (
              <div className="space-y-2 animate-slide-up">
                <Label htmlFor="otp" className="text-gray-700 font-medium">
                  Verification Code
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter the 6-digit code sent to your email"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="pl-9 py-2 border-gray-300 focus:border-primary focus:ring-primary"
                    required
                    maxLength={6}
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Check your email for the verification code. It may take a few minutes to arrive.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary h-11 text-white font-semibold text-base shadow-md transition-all duration-200"
                disabled={loading || isSendingOtp}
              >
                {loading || isSendingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {otpSent ? 'Verifying...' : 'Sending OTP...'}
                  </>
                ) : (
                  <>
                    {otpSent ? 'Login to Dashboard' : 'Send Verification Code'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {/* Resend OTP option */}
            {otpSent && (
              <div className="text-center pt-2">
                <button 
                  type="button" 
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || loading}
                  className="text-sm text-primary hover:text-primary-dark font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingOtp ? 'Resending...' : 'Resend OTP'}
                </button>
              </div>
            )}
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              <Shield className="w-3 h-3 inline mr-1" />
              Your login is protected with two-factor authentication for enhanced security.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};