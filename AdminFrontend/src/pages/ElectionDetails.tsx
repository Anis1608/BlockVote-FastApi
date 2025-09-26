import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Vote,
  Bell,
  Megaphone,
  CheckCircle,
  AlertCircle,
  Play,
} from 'lucide-react';

const mockElections = [
  {
    id: 1,
    title: 'General Assembly Elections 2024',
    type: 'General',
    status: 'active',
    startDate: '2024-04-15',
    endDate: '2024-04-20',
    phase: 'Phase 2 of 3',
    constituency: 'All India',
    totalVoters: 900000000,
    registeredCandidates: 8000,
  },
  {
    id: 2,
    title: 'State Assembly - Maharashtra',
    type: 'State',
    status: 'upcoming',
    startDate: '2024-05-10',
    endDate: '2024-05-15',
    phase: 'Registration Open',
    constituency: 'Maharashtra',
    totalVoters: 89000000,
    registeredCandidates: 1200,
  },
];

const timeline = [
  {
    date: '2024-03-01',
    title: 'Nomination Filing Opens',
    status: 'completed',
    description: 'Candidates can start filing their nominations',
  },
  {
    date: '2024-03-15',
    title: 'Nomination Filing Closes',
    status: 'completed',
    description: 'Last date for filing nominations',
  },
  {
    date: '2024-04-01',
    title: 'Campaign Period Begins',
    status: 'active',
    description: 'Official campaign period starts',
  },
  {
    date: '2024-04-15',
    title: 'Voting Phase 1',
    status: 'upcoming',
    description: 'First phase of voting begins',
  },
  {
    date: '2024-04-20',
    title: 'Voting Phase 2',
    status: 'upcoming',
    description: 'Second phase of voting',
  },
  {
    date: '2024-04-25',
    title: 'Final Voting Phase',
    status: 'upcoming',
    description: 'Final phase of voting',
  },
  {
    date: '2024-05-02',
    title: 'Result Declaration',
    status: 'upcoming',
    description: 'Official results will be declared',
  },
];

const announcements = [
  {
    id: 1,
    title: 'Voting Hours Extended',
    time: '2 hours ago',
    content: 'Voting hours have been extended by 1 hour due to high turnout in Phase 2.',
    priority: 'high',
  },
  {
    id: 2,
    title: 'New Polling Stations Added',
    time: '5 hours ago',
    content: '50 additional polling stations have been set up in rural areas.',
    priority: 'medium',
  },
  {
    id: 3,
    title: 'Weather Advisory',
    time: '1 day ago',
    content: 'Heavy rainfall expected in northern regions. Special arrangements made.',
    priority: 'low',
  },
];

export default function ElectionDetails() {
  const [selectedElection, setSelectedElection] = useState(mockElections[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-primary">Election Details</h1>
          <p className="text-muted-foreground">
            Manage election schedules, phases, and announcements
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="btn-secondary">
            <Bell className="w-4 h-4 mr-2" />
            Send Alert
          </Button>
          <Button className="btn-primary">
            <Megaphone className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        </div>
      </div>

      {/* Election Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 card-feature">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Vote className="w-5 h-5" />
                  {selectedElection.title}
                </CardTitle>
                <CardDescription>{selectedElection.type} Election</CardDescription>
              </div>
              <Badge 
                variant={selectedElection.status === 'active' ? 'default' : 'secondary'}
                className={selectedElection.status === 'active' ? 'bg-success text-success-foreground' : ''}
              >
                {selectedElection.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-xs text-muted-foreground">{selectedElection.startDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">End Date</p>
                  <p className="text-xs text-muted-foreground">{selectedElection.endDate}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Constituency</p>
                <p className="text-xs text-muted-foreground">{selectedElection.constituency}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="text-center p-3 bg-primary/5 rounded-lg">
                <p className="text-2xl font-bold text-primary">{selectedElection.totalVoters.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Voters</p>
              </div>
              <div className="text-center p-3 bg-accent/5 rounded-lg">
                <p className="text-2xl font-bold text-accent">{selectedElection.registeredCandidates}</p>
                <p className="text-xs text-muted-foreground">Candidates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-feature">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Current Phase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto animate-pulse-glow">
                <Vote className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="font-semibold text-lg">{selectedElection.phase}</p>
                <p className="text-sm text-muted-foreground">Active Now</p>
              </div>
              <Button className="w-full btn-primary">
                View Live Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline">Election Timeline</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle>Election Timeline</CardTitle>
              <CardDescription>Track the progress of election phases and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {timeline.map((event, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event.status === 'completed' ? 'bg-success text-success-foreground' :
                      event.status === 'active' ? 'bg-primary text-primary-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {event.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : event.status === 'active' ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {event.date}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle>Live Updates & Announcements</CardTitle>
              <CardDescription>Latest updates and official announcements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <Card key={announcement.id} className="card-feature">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{announcement.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={announcement.priority === 'high' ? 'destructive' : 
                                   announcement.priority === 'medium' ? 'default' : 'secondary'}
                          >
                            {announcement.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{announcement.time}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{announcement.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-stats">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Voter Turnout</p>
                    <p className="text-2xl font-bold">67.8%</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="card-stats">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Polling Stations</p>
                    <p className="text-2xl font-bold">12,450</p>
                  </div>
                  <MapPin className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            <Card className="card-stats">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Votes Cast</p>
                    <p className="text-2xl font-bold">610M</p>
                  </div>
                  <Vote className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>
            <Card className="card-stats">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Wait Time</p>
                    <p className="text-2xl font-bold">15min</p>
                  </div>
                  <Clock className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}