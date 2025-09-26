import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Monitor, 
  Plus, 
  Search, 
  Power,
  Wifi,
  MapPin,
  Clock,
  Smartphone,
  Laptop,
  Tablet,
  LogOut,
} from 'lucide-react';

const mockDevices = [
  {
    id: 'DEV001',
    name: 'Polling Station Alpha',
    type: 'desktop',
    location: 'Delhi Central - Booth #1',
    ip: '192.168.1.101',
    lastActive: '2 minutes ago',
    status: 'online',
    user: 'Rajesh Kumar',
  },
  {
    id: 'DEV002',
    name: 'Mobile Unit Beta',
    type: 'mobile',
    location: 'Mumbai North - Mobile Unit',
    ip: '192.168.1.102',
    lastActive: '5 minutes ago',
    status: 'online',
    user: 'Priya Sharma',
  },
  {
    id: 'DEV003',
    name: 'Backup Station Gamma',
    type: 'laptop',
    location: 'Kolkata South - Backup Center',
    ip: '192.168.1.103',
    lastActive: '1 hour ago',
    status: 'offline',
    user: 'Mohammed Hassan',
  },
];

const deviceIcons = {
  desktop: Monitor,
  mobile: Smartphone,
  laptop: Laptop,
  tablet: Tablet,
};

export default function DeviceManagement() {
  const [devices] = useState(mockDevices);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-primary">Device Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage all connected devices and user sessions
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Device
            </Button>
          </DialogTrigger>
          <DialogContent className="card-elegant max-w-xl">
            <DialogHeader>
              <DialogTitle>Add New Device</DialogTitle>
              <DialogDescription>
                Register a new device for election management access
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="form-label">Device Name</Label>
                <Input placeholder="e.g., Polling Station Alpha" className="form-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="form-label">Device Type</Label>
                  <select className="form-input">
                    <option value="">Select type</option>
                    <option value="desktop">Desktop</option>
                    <option value="laptop">Laptop</option>
                    <option value="tablet">Tablet</option>
                    <option value="mobile">Mobile</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="form-label">Location</Label>
                  <Input placeholder="e.g., Delhi Central - Booth #1" className="form-input" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="form-label">User Email</Label>
                <Input placeholder="user@example.com" type="email" className="form-input" />
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={() => setIsAddDialogOpen(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1 btn-primary">
                  Add Device
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-stats">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Devices</p>
                <p className="text-2xl font-bold">{devices.length}</p>
              </div>
              <Monitor className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-stats">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Online</p>
                <p className="text-2xl font-bold">{devices.filter(d => d.status === 'online').length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                <Wifi className="h-4 w-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-stats">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Offline</p>
                <p className="text-2xl font-bold">{devices.filter(d => d.status === 'offline').length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center">
                <Power className="h-4 w-4 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-stats">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{new Set(devices.map(d => d.user)).size}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device List */}
      <Card className="card-elegant">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Devices</CardTitle>
              <CardDescription>Monitor all connected devices and user sessions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by device name, location, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 form-input"
              />
            </div>
          </div>

          {/* Device Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDevices.map((device) => {
              const DeviceIcon = deviceIcons[device.type as keyof typeof deviceIcons] || Monitor;
              return (
                <Card key={device.id} className="card-feature">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${device.status === 'online' ? 'bg-success/20' : 'bg-destructive/20'}`}>
                          <DeviceIcon className={`w-5 h-5 ${device.status === 'online' ? 'text-success' : 'text-destructive'}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{device.name}</h3>
                          <p className="text-sm text-muted-foreground">{device.id}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={device.status === 'online' ? 'default' : 'destructive'}
                        className={device.status === 'online' ? 'bg-success text-success-foreground' : ''}
                      >
                        {device.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{device.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Wifi className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{device.ip}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Last active: {device.lastActive}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-sm font-medium">{device.user}</p>
                        <p className="text-xs text-muted-foreground">Logged in user</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <LogOut className="w-3 h-3 mr-1" />
                        Logout
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredDevices.length === 0 && (
            <div className="text-center py-8">
              <Monitor className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No devices found matching your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}