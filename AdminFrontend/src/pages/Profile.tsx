import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Bell,
  Eye,
  Settings,
  History,
  Camera,
  Save,
  Lock,
} from 'lucide-react';

const mockUser = {
  id: 'USR001',
  name: 'Dr. Rajesh Kumar',
  email: 'rajesh.kumar@blockvote.gov.in',
  phone: '+91 98765-43210',
  role: 'Election Administrator',
  department: 'Election Commission of India',
  location: 'New Delhi',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  lastLogin: '2024-01-15 14:30:00',
  accountCreated: '2023-06-15',
};

const loginHistory = [
  { id: 1, device: 'Desktop - Chrome', ip: '192.168.1.100', location: 'New Delhi', time: '2024-01-15 14:30:00', status: 'success' },
  { id: 2, device: 'Mobile - Safari', ip: '192.168.1.101', location: 'New Delhi', time: '2024-01-15 09:15:00', status: 'success' },
  { id: 3, device: 'Desktop - Firefox', ip: '203.0.113.1', location: 'Mumbai', time: '2024-01-14 18:45:00', status: 'failed' },
  { id: 4, device: 'Laptop - Chrome', ip: '192.168.1.102', location: 'New Delhi', time: '2024-01-14 11:20:00', status: 'success' },
];

export default function Profile() {
  const [user, setUser] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    security: true,
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would save the user data
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-primary">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="btn-primary">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="btn-primary">
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1 card-feature">
          <CardContent className="pt-6 text-center">
            <div className="relative inline-block mb-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
              />
              {isEditing && (
                <Button
                  size="icon"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 bg-primary hover:bg-primary-hover"
                >
                  <Camera className="w-3 h-3" />
                </Button>
              )}
            </div>
            <h3 className="font-semibold text-lg">{user.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{user.role}</p>
            <Badge variant="outline" className="mb-4">
              {user.department}
            </Badge>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 justify-center">
                <Mail className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Phone className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">{user.phone}</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">{user.location}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="form-label">Full Name</Label>
                      <Input 
                        value={user.name} 
                        disabled={!isEditing}
                        className="form-input"
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="form-label">Email Address</Label>
                      <Input 
                        value={user.email} 
                        disabled={!isEditing}
                        className="form-input"
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="form-label">Phone Number</Label>
                      <Input 
                        value={user.phone} 
                        disabled={!isEditing}
                        className="form-input"
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="form-label">Location</Label>
                      <Input 
                        value={user.location} 
                        disabled={!isEditing}
                        className="form-input"
                        onChange={(e) => setUser({ ...user, location: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="form-label">Department</Label>
                    <Input 
                      value={user.department} 
                      disabled={!isEditing}
                      className="form-input"
                      onChange={(e) => setUser({ ...user, department: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Manage your account security and authentication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="w-4 h-4 mr-2" />
                      View Active Sessions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Configure how you want to receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Switch 
                        checked={notifications.email} 
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Alerts</p>
                        <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                      </div>
                      <Switch 
                        checked={notifications.sms} 
                        onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                      </div>
                      <Switch 
                        checked={notifications.push} 
                        onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Security Alerts</p>
                        <p className="text-sm text-muted-foreground">Important security notifications</p>
                      </div>
                      <Switch 
                        checked={notifications.security} 
                        onCheckedChange={(checked) => setNotifications({ ...notifications, security: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Login History
                  </CardTitle>
                  <CardDescription>Recent login attempts and device access</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loginHistory.map((login) => (
                      <div key={login.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${login.status === 'success' ? 'bg-success' : 'bg-destructive'}`} />
                          <div>
                            <p className="font-medium">{login.device}</p>
                            <p className="text-sm text-muted-foreground">{login.location} • {login.ip}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={login.status === 'success' ? 'default' : 'destructive'}>
                            {login.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{login.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}