﻿import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, Vote, Shield, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to BlockVote Administration Panel",
        });
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-glow animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
            <Vote className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-poppins bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            BlockVote
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Secure Election Management Platform
          </CardDescription>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary-light/20 p-3 rounded-lg">
            <Shield className="w-4 h-4 text-primary" />
            Super Admin Access Only
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@blockvote.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover-primary-hover font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In to BlockVote'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-accent-light/30 rounded-lg">
            <h4 className="text-sm font-semibold text-accent mb-2">Demo Credentials:</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><strong>Email:</strong> admin@blockvote.in</p>
              <p><strong>Password:</strong> BlockVote@2024</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
