import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  MapPin,
  User,
  FileText,
  Image,
} from 'lucide-react';

const mockCandidates = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    party: 'Indian National Congress',
    constituency: 'Delhi Central',
    state: 'Delhi',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    manifesto: 'https://example.com/manifesto1.pdf',
    status: 'approved',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    party: 'Bharatiya Janata Party',
    constituency: 'Mumbai North',
    state: 'Maharashtra',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b890?w=150&h=150&fit=crop&crop=face',
    manifesto: 'https://example.com/manifesto2.pdf',
    status: 'pending',
  },
  {
    id: 3,
    name: 'Mohammed Hassan',
    party: 'Aam Aadmi Party',
    constituency: 'Kolkata South',
    state: 'West Bengal',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    manifesto: 'https://example.com/manifesto3.pdf',
    status: 'approved',
  },
];

export default function CandidateManagement() {
  const [candidates] = useState(mockCandidates);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredCandidates = candidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.constituency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-primary">Candidate Management</h1>
          <p className="text-muted-foreground">
            Manage election candidates, their profiles, and documentation
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Candidate
            </Button>
          </DialogTrigger>
          <DialogContent className="card-elegant max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Candidate</DialogTitle>
              <DialogDescription>
                Fill in the candidate details and upload required documents
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="form-label">Full Name</Label>
                  <Input placeholder="Enter candidate name" className="form-input" />
                </div>
                <div className="space-y-2">
                  <Label className="form-label">Party</Label>
                  <Input placeholder="Political party" className="form-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="form-label">Constituency</Label>
                  <Input placeholder="Constituency name" className="form-input" />
                </div>
                <div className="space-y-2">
                  <Label className="form-label">State</Label>
                  <Input placeholder="State name" className="form-input" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="form-label">Profile Photo</Label>
                <div className="flex items-center gap-4">
                  <Button variant="outline" className="btn-secondary">
                    <Image className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  <span className="text-sm text-muted-foreground">Max 2MB, JPG/PNG only</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="form-label">Manifesto Link</Label>
                <Input placeholder="https://example.com/manifesto.pdf" className="form-input" />
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={() => setIsAddDialogOpen(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1 btn-primary">
                  Add Candidate
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
                <p className="text-sm font-medium text-muted-foreground">Total Candidates</p>
                <p className="text-2xl font-bold">{candidates.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-stats">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{candidates.filter(c => c.status === 'approved').length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-stats">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{candidates.filter(c => c.status === 'pending').length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-warning/20 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-stats">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">States</p>
                <p className="text-2xl font-bold">{new Set(candidates.map(c => c.state)).size}</p>
              </div>
              <MapPin className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="card-elegant">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Candidate List</CardTitle>
              <CardDescription>Search and filter candidates by various criteria</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, party, or constituency..."
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

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => (
              <Card key={candidate.id} className="card-feature">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={candidate.photo}
                      alt={candidate.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{candidate.party}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{candidate.constituency}, {candidate.state}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={candidate.status === 'approved' ? 'default' : 'secondary'}
                      className={candidate.status === 'approved' ? 'bg-success text-success-foreground' : ''}
                    >
                      {candidate.status}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}