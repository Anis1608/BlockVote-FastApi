import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  MapPin,
  Calendar,
  Users,
  Award,
  FileText,
  User
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CandidateManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [partyFilter, setPartyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const candidates = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      age: 45,
      qualification: 'PhD in Public Administration',
      party: 'Bharatiya Janata Party',
      constituency: 'Mumbai North',
      state: 'Maharashtra',
      city: 'Mumbai',
      status: 'Approved',
      electionType: 'Assembly',
      experience: '12 years',
      previousWins: 2,
      manifesto: 'Infrastructure development and digital governance',
      avatar: '/api/placeholder/60/60'
    },
    {
      id: 2,
      name: 'Smt. Priya Sharma',
      age: 39,
      qualification: 'MA Political Science',
      party: 'Indian National Congress',
      constituency: 'Pune Central',
      state: 'Maharashtra',
      city: 'Pune',
      status: 'Under Review',
      electionType: 'Assembly',
      experience: '8 years',
      previousWins: 1,
      manifesto: 'Women empowerment and education reform',
      avatar: '/api/placeholder/60/60'
    },
    {
      id: 3,
      name: 'Shri Amit Patel',
      age: 52,
      qualification: 'MBA, Former IAS Officer',
      party: 'Aam Aadmi Party',
      constituency: 'Ahmedabad East',
      state: 'Gujarat',
      city: 'Ahmedabad',
      status: 'Approved',
      electionType: 'Municipal',
      experience: '15 years',
      previousWins: 3,
      manifesto: 'Anti-corruption and transparent governance',
      avatar: '/api/placeholder/60/60'
    },
    {
      id: 4,
      name: 'Dr. Sunita Reddy',
      age: 43,
      qualification: 'MBBS, MD',
      party: 'Telangana Rashtra Samithi',
      constituency: 'Hyderabad Central',
      state: 'Telangana',
      city: 'Hyderabad',
      status: 'Rejected',
      electionType: 'Assembly',
      experience: '6 years',
      previousWins: 0,
      manifesto: 'Healthcare reform and rural development',
      avatar: '/api/placeholder/60/60'
    }
  ];

  const states = [
    'Maharashtra', 'Gujarat', 'Telangana', 'Karnataka', 'Tamil Nadu',
    'Uttar Pradesh', 'Rajasthan', 'West Bengal', 'Madhya Pradesh', 'Punjab'
  ];

  const parties = [
    'Bharatiya Janata Party', 'Indian National Congress', 'Aam Aadmi Party',
    'Telangana Rashtra Samithi', 'All India Trinamool Congress', 'Samajwadi Party'
  ];

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.constituency.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.party.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = stateFilter === 'all' || candidate.state === stateFilter;
    const matchesParty = partyFilter === 'all' || candidate.party === partyFilter;
    const matchesStatus = statusFilter === 'all' || candidate.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesState && matchesParty && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-success text-success-foreground';
      case 'Under Review': return 'bg-warning text-warning-foreground';
      case 'Rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPartyColor = (party) => {
    // Simple color mapping for major parties
    const colors = {
      'Bharatiya Janata Party': 'bg-orange-100 text-orange-800',
      'Indian National Congress': 'bg-blue-100 text-blue-800',
      'Aam Aadmi Party': 'bg-cyan-100 text-cyan-800',
      'Telangana Rashtra Samithi': 'bg-pink-100 text-pink-800'
    };
    return colors[party] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6 p-4 md:p-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-poppins font-bold text-foreground">
            Candidate Management
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage candidate profiles and applications across all states
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover w-full md:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add New Candidate
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Total Candidates
            </CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">
              +156 this month
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
            <Award className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold">1,089</div>
            <p className="text-xs text-muted-foreground">
              87.3% approval rate
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Under Review
            </CardTitle>
            <FileText className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              Pending verification
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Active Parties
            </CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              Registered political parties
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={partyFilter} onValueChange={setPartyFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by party" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Parties</SelectItem>
                {parties.map(party => (
                  <SelectItem key={party} value={party}>{party}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="under review">Under Review</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Grid - Modified for side-by-side layout on larger screens */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {filteredCandidates.map((candidate) => (
          <Card key={candidate.id} className="hover:shadow-lg transition-all h-full flex flex-col">
            <CardHeader className="p-4 md:p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-14 h-14 md:w-16 md:h-16">
                  <AvatarImage src={candidate.avatar} alt={candidate.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm md:text-lg">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg md:text-xl truncate">{candidate.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`${getStatusColor(candidate.status)} text-xs`}>
                      {candidate.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {candidate.age} years • {candidate.qualification}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 md:p-6 pt-0 flex-grow flex flex-col">
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{candidate.constituency}, {candidate.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <Badge variant="outline" className={`${getPartyColor(candidate.party)} text-xs`}>
                    {candidate.party}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{candidate.experience} experience • {candidate.previousWins} wins</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{candidate.electionType} Election</span>
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded-lg mb-4">
                <h4 className="text-sm font-semibold mb-1">Manifesto:</h4>
                <p className="text-sm text-muted-foreground">{candidate.manifesto}</p>
              </div>

              <div className="flex gap-2 mt-auto">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  View Profile
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <Card className="md:col-span-2 xl:col-span-3">
          <CardContent className="text-center py-8">
            <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No candidates found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or add a new candidate
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Candidate
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CandidateManagement;