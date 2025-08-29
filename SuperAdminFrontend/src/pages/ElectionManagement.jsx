import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  MapPin,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  BarChart3
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const ElectionManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');

  const elections = [
    {
      id: 1,
      title: 'Maharashtra Assembly Elections 2024',
      description: 'State legislative assembly elections for Maharashtra',
      state: 'Maharashtra',
      startDate: '2024-02-10',
      endDate: '2024-02-25',
      status: 'Active',
      phase: 'Phase 2 of 3',
      progress: 65,
      totalConstituencies: 288,
      candidates: 1045,
      votersRegistered: '8.9M',
      turnout: '62.3%'
    },
    {
      id: 2,
      title: 'Karnataka Legislative Council Elections',
      description: 'Upper house elections for Karnataka state legislature',
      state: 'Karnataka',
      startDate: '2024-01-15',
      endDate: '2024-01-28',
      status: 'Completed',
      phase: 'Results Declared',
      progress: 100,
      totalConstituencies: 75,
      candidates: 245,
      votersRegistered: '3.2M',
      turnout: '71.8%'
    },
    {
      id: 3,
      title: 'Gujarat Municipal Corporation Elections',
      description: 'Local body elections across major cities in Gujarat',
      state: 'Gujarat',
      startDate: '2024-03-05',
      endDate: '2024-03-15',
      status: 'Upcoming',
      phase: 'Registration Open',
      progress: 25,
      totalConstituencies: 162,
      candidates: 578,
      votersRegistered: '4.5M',
      turnout: '0%'
    },
    {
      id: 4,
      title: 'Tamil Nadu Panchayat Elections',
      description: 'Rural local body elections for Tamil Nadu',
      state: 'Tamil Nadu',
      startDate: '2024-02-20',
      endDate: '2024-03-02',
      status: 'Active',
      phase: 'Phase 1 of 2',
      progress: 40,
      totalConstituencies: 385,
      candidates: 892,
      votersRegistered: '5.7M',
      turnout: '45.2%'
    }
  ];

  const states = [
    'Maharashtra', 'Karnataka', 'Gujarat', 'Tamil Nadu', 'Uttar Pradesh', 
    'Rajasthan', 'West Bengal', 'Madhya Pradesh', 'Punjab', 'Telangana'
  ];

  const filteredElections = elections.filter(election => {
    const matchesSearch = election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         election.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || election.status.toLowerCase() === statusFilter;
    const matchesState = stateFilter === 'all' || election.state === stateFilter;
    return matchesSearch && matchesStatus && matchesState;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-success text-success-foreground';
      case 'Completed': return 'bg-primary text-primary-foreground';
      case 'Upcoming': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <Play className="w-3 h-3" />;
      case 'Completed': return <CheckCircle className="w-3 h-3" />;
      case 'Upcoming': return <Clock className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-poppins font-bold text-foreground">
            Election Management
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage elections across all Indian states and territories
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover w-full md:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Create New Election
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Total Elections
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 scheduled this month
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Active Elections
            </CardTitle>
            <Play className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Across 3 states
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Total Candidates
            </CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold">2,760</div>
            <p className="text-xs text-muted-foreground">
              +245 this week
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Avg. Turnout
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold">67.8%</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last cycle
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
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search elections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
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
          </div>
        </CardContent>
      </Card>

      {/* Elections Grid - Modified for side-by-side layout on larger screens */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {filteredElections.map((election) => (
          <Card key={election.id} className="hover:shadow-lg transition-all h-full flex flex-col">
            <CardHeader className="p-4 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg md:text-xl">{election.title}</CardTitle>
                  <CardDescription className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                    <span className="flex items-center gap-1 text-xs md:text-sm">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                      {election.state}
                    </span>
                    <span className="flex items-center gap-1 text-xs md:text-sm">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                      {election.startDate} to {election.endDate}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 self-start">
                  <Badge className={`${getStatusColor(election.status)} text-xs`}>
                    {getStatusIcon(election.status)}
                    {election.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 flex-grow flex flex-col">
              <p className="text-sm md:text-base text-muted-foreground mb-4">{election.description}</p>
              
              <div className="grid gap-2 grid-cols-2 md:grid-cols-4 mb-4">
                <div className="text-center p-2 md:p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg md:text-2xl font-bold text-primary">{election.totalConstituencies}</div>
                  <div className="text-xs text-muted-foreground">Constituencies</div>
                </div>
                <div className="text-center p-2 md:p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg md:text-2xl font-bold text-success">{election.candidates}</div>
                  <div className="text-xs text-muted-foreground">Candidates</div>
                </div>
                <div className="text-center p-2 md:p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg md:text-2xl font-bold text-accent">{election.votersRegistered}</div>
                  <div className="text-xs text-muted-foreground">Registered Voters</div>
                </div>
                <div className="text-center p-2 md:p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg md:text-2xl font-bold text-primary">{election.turnout}</div>
                  <div className="text-xs text-muted-foreground">Turnout</div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground text-xs md:text-sm">{election.phase}</span>
                  <span className="font-medium text-xs md:text-sm">{election.progress}%</span>
                </div>
                <Progress value={election.progress} className="h-2" />
              </div>

              <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center mt-auto">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="text-xs flex-1 md:flex-initial">
                    <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs flex-1 md:flex-initial">
                    <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    Edit Election
                  </Button>
                  {election.status === 'Active' && (
                    <Button variant="outline" size="sm" className="text-xs flex-1 md:flex-initial">
                      <Pause className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      Pause Election
                    </Button>
                  )}
                </div>
                <Button variant="secondary" size="sm" className="text-xs mt-2 md:mt-0">
                  <BarChart3 className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredElections.length === 0 && (
        <Card className="lg:col-span-2">
          <CardContent className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No elections found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or create a new election
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Election
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ElectionManagement;