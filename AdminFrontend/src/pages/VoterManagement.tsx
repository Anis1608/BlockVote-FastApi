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
  UserCheck, 
  Upload, 
  Search, 
  Filter, 
  Download,
  Users,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const mockVoters = [
  {
    id: 'VID001',
    name: 'Amit Patel',
    age: 32,
    constituency: 'Delhi Central',
    state: 'Delhi',
    phone: '+91 98765-43210',
    status: 'verified',
  },
  {
    id: 'VID002',
    name: 'Sneha Gupta',
    age: 28,
    constituency: 'Mumbai North',
    state: 'Maharashtra',
    phone: '+91 87654-32109',
    status: 'verified',
  },
  {
    id: 'VID003',
    name: 'Ravi Kumar',
    age: 45,
    constituency: 'Kolkata South',
    state: 'West Bengal',
    phone: '+91 76543-21098',
    status: 'pending',
  },
];

export default function VoterManagement() {
  const [voters] = useState(mockVoters);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const filteredVoters = voters.filter(voter => 
    voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voter.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voter.constituency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-primary">Voter Management</h1>
          <p className="text-muted-foreground">
            Manage voter registrations, bulk uploads, and verification status
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Upload className="w-4 h-4 mr-2" />
                Bulk Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="card-elegant max-w-xl">
              <DialogHeader>
                <DialogTitle>Bulk Upload Voters</DialogTitle>
                <DialogDescription>
                  Upload voter data using Excel or CSV files
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <FileSpreadsheet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm font-medium mb-2">Upload Excel/CSV File</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Maximum file size: 10MB. Supported formats: .xlsx, .csv
                  </p>
                  <Button variant="outline" className="btn-secondary">
                    Choose File
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <Label className="form-label">File Requirements:</Label>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Voter ID, Name, Age, Constituency, State, Phone</p>
                    <p>• Use the provided template for best results</p>
                    <p>• Duplicate entries will be automatically skipped</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="w-3 h-3 mr-2" />
                    Download Template
                  </Button>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={() => setIsUploadDialogOpen(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button className="flex-1 btn-primary">
                    Upload & Process
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-stats">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Voters</p>
                <p className="text-2xl font-bold">{voters.length.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-stats">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold">{voters.filter(v => v.status === 'verified').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-stats">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{voters.filter(v => v.status === 'pending').length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-stats">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Constituencies</p>
                <p className="text-2xl font-bold">{new Set(voters.map(v => v.constituency)).size}</p>
              </div>
              <UserCheck className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voter Search and List */}
      <Card className="card-elegant">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Voter Database</CardTitle>
              <CardDescription>Search and manage registered voters</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Voter ID, name, or constituency..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 form-input"
              />
            </div>
            <Button variant="outline" className="btn-secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Voters Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="bg-muted/50 px-6 py-4 border-b border-border">
              <div className="grid grid-cols-6 gap-4 font-medium text-sm">
                <div>Voter ID</div>
                <div>Name</div>
                <div>Age</div>
                <div>Constituency</div>
                <div>Phone</div>
                <div>Status</div>
              </div>
            </div>
            <div className="divide-y divide-border">
              {filteredVoters.map((voter) => (
                <div key={voter.id} className="px-6 py-4 hover:bg-muted/30 transition-colors">
                  <div className="grid grid-cols-6 gap-4 items-center">
                    <div className="font-mono text-sm">{voter.id}</div>
                    <div className="font-medium">{voter.name}</div>
                    <div className="text-sm text-muted-foreground">{voter.age}</div>
                    <div className="text-sm">
                      <p>{voter.constituency}</p>
                      <p className="text-xs text-muted-foreground">{voter.state}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{voter.phone}</div>
                    <div>
                      <Badge 
                        variant={voter.status === 'verified' ? 'default' : 'secondary'}
                        className={voter.status === 'verified' ? 'bg-success text-success-foreground' : ''}
                      >
                        {voter.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredVoters.length === 0 && (
            <div className="text-center py-8">
              <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No voters found matching your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}