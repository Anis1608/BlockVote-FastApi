import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  UserCheck, 
  BarChart3, 
  TrendingUp, 
  Activity,
  Shield
} from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const statsCards = [
    {
      title: 'Total Elections',
      value: '12',
      change: '+2 this month',
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary-light',
    },
    {
      title: 'Active Candidates',
      value: '1,248',
      change: '+156 new',
      icon: Users,
      color: 'text-success',
      bgColor: 'bg-success-light',
    },
    {
      title: 'State Admins',
      value: '28',
      change: 'All states covered',
      icon: UserCheck,
      color: 'text-accent',
      bgColor: 'bg-accent-light',
    },
    {
      title: 'Total Votes Cast',
      value: '2.4M',
      change: '+12% from last election',
      icon: BarChart3,
      color: 'text-primary',
      bgColor: 'bg-primary-light',
    },
  ];

  const recentElections = [
    { state: 'Maharashtra', status: 'Active', phase: 'Phase 2', endDate: '2024-02-15' },
    { state: 'Karnataka', status: 'Completed', phase: 'Results', endDate: '2024-01-28' },
    { state: 'Gujarat', status: 'Upcoming', phase: 'Registration', endDate: '2024-03-10' },
    { state: 'Tamil Nadu', status: 'Active', phase: 'Phase 1', endDate: '2024-02-20' },
  ];

  const electionData = {
    labels: ['Maharashtra', 'Karnataka', 'Gujarat', 'Tamil Nadu', 'Rajasthan', 'Punjab'],
    datasets: [
      {
        label: 'Registered Candidates',
        data: [85, 92, 78, 105, 67, 89],
        backgroundColor: 'hsl(220 91% 15%)',
        borderColor: 'hsl(220 91% 15%)',
        borderWidth: 1,
      },
      {
        label: 'Approved Candidates',
        data: [82, 89, 75, 98, 64, 85],
        backgroundColor: 'hsl(138 76% 25%)',
        borderColor: 'hsl(138 76% 25%)',
        borderWidth: 1,
      },
    ],
  };

  const voteDistribution = {
    labels: ['Completed Elections', 'Active Elections', 'Upcoming Elections'],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: [
          'hsl(138 76% 25%)',
          'hsl(28 100% 58%)',
          'hsl(220 91% 15%)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-success text-success-foreground';
      case 'Completed': return 'bg-primary text-primary-foreground';
      case 'Upcoming': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-foreground">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage elections across all Indian states
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-success" />
          <span className="text-sm text-success font-medium">Blockchain Secured</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="card-interactive animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Elections */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Elections
            </CardTitle>
            <CardDescription>
              Current status of ongoing and recent elections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentElections.map((election, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div>
                      <p className="font-medium">{election.state} Assembly Elections</p>
                      <p className="text-sm text-muted-foreground">{election.phase}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(election.status)}>
                      {election.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {election.endDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Elections
            </Button>
          </CardContent>
        </Card>

        {/* Vote Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Election Status
            </CardTitle>
            <CardDescription>
              Distribution of election phases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Doughnut
                data={voteDistribution}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidates Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            State-wise Candidate Statistics
          </CardTitle>
          <CardDescription>
            Registered vs Approved candidates across major states
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Bar
              data={electionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
