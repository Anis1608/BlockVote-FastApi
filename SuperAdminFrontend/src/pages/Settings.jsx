import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Moon, 
  Sun, 
  Lock, 
  Database,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-poppins font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and system preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Settings
          </CardTitle>
          <CardDescription>
            Update your personal information and account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="role"
                  value="Super Administrator"
                  disabled
                  className="bg-muted/30"
                />
                <Badge className="bg-success text-success-foreground">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              defaultValue="System Administrator"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio / Description</Label>
            <Textarea
              id="bio"
              placeholder="Brief description about yourself and role"
              rows={3}
              defaultValue="Super Administrator responsible for overseeing election management platform across all Indian states."
            />
          </div>

          <Button>Update Profile</Button>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes
              </p>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-base">Theme Preview</Label>
            <div className="grid gap-4 md-cols-2">
              <div className={`p-4 border rounded-lg ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-muted'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="w-4 h-4" />
                  <span className="font-medium">Light Theme</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-primary rounded"></div>
                  <div className="h-2 bg-muted rounded"></div>
                  <div className="h-2 bg-accent rounded"></div>
                </div>
              </div>
              <div className={`p-4 border rounded-lg ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-muted'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Moon className="w-4 h-4" />
                  <span className="font-medium">Dark Theme</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-primary rounded"></div>
                  <div className="h-2 bg-muted rounded"></div>
                  <div className="h-2 bg-accent rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security & Authentication
          </CardTitle>
          <CardDescription>
            Manage your account security and login preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Badge className="bg-warning text-warning-foreground">
              Not Enabled
            </Badge>
          </div>

          <Button variant="outline">
            <Shield className="w-4 h-4 mr-2" />
            Enable 2FA
          </Button>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              placeholder="Enter current password"
            />
          </div>

          <div className="grid gap-4 md-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <Button>Update Password</Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {[
              {
                title: 'Election Updates',
                description: 'Get notified about election status changes and results',
                enabled: true,
              },
              {
                title: 'Candidate Applications',
                description: 'Notifications for new candidate registrations and approvals',
                enabled: true,
              },
              {
                title: 'Admin Activities',
                description: 'State admin login activities and system changes',
                enabled: true,
              },
              {
                title: 'System Alerts',
                description: 'Critical system alerts and security notifications',
                enabled: true,
              },
            ].map((notification, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{notification.title}</Label>
                  <p className="text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                </div>
                <Switch defaultChecked={notification.enabled} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            System Management
          </CardTitle>
          <CardDescription>
            System maintenance and data management tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md-cols-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export System Data
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import Configuration
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success-light rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="font-medium">System Status</p>
                  <p className="text-sm text-muted-foreground">All services operational</p>
                </div>
              </div>
              <Badge className="bg-success text-success-foreground">Healthy</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Database</p>
                  <p className="text-sm text-muted-foreground">Last backup: 2 hours ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-1" />
                Backup Now
              </Button>
            </div>
          </div>

          <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <h4 className="font-semibold text-destructive">Danger Zone</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  These actions are permanent and cannot be undone.
                </p>
                <Button variant="destructive" size="sm">
                  Reset System Configuration
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
