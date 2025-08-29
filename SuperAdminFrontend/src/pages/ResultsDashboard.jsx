import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  Filter,
  Download,
  RefreshCw,
  MapPin,
  Calendar,
  PieChart,
  Activity
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ResultsDashboard = () => {
  const [selectedState, setSelectedState] = useState('all');
  const [selectedElection, setSelectedElection] = useState('all');

  const electionResults = [
    {
      state: 'Maharashtra',
      election: 'Assembly Elections 2024',
      status: 'Completed',
      totalSeats: 288,
      countedSeats: 288,
      leadingParty: 'BJP',
      totalVotes: 8900000,
      turnout: '71.2%',
      winner: 'Bharatiya Janata Party',
      margin: '15.3%'
    },
    {
      state: 'Karnataka',
      election: 'Legislative Council 2024',
      status: 'Counting',
      totalSeats: 75,
      countedSeats: 68,
      leadingParty: 'INC',
      totalVotes: 3200000,
      turnout: '68.9%',
      winner: 'Indian National Congress',
      margin: '8.7%'
    }
  ];

  const partyWiseResults = {
    labels: ['BJP', 'INC', 'AAP', 'TRS', 'AITC', 'SP', 'Others'],
    datasets: [
      {
        label: 'Seats Won',
        data: [145, 89, 23, 45, 67, 34, 78],
        backgroundColor: [
          '#FF6B35', // BJP Orange
          '#1E3A8A', // INC Blue  
          '#0EA5E9', // AAP Cyan
          '#EC4899', // TRS Pink
          '#10B981', // AITC Green
          '#EF4444', // SP Red
          '#6B7280'  // Others Gray
        ],
        borderWidth: 0,
      },
    ],
  };

  const stateWiseComparison = {
    labels: ['Maharashtra', 'Karnataka', 'Gujarat', 'Tamil Nadu', 'Uttar Pradesh'],
    datasets: [
      {
        label: 'Voter Turnout (%)',
        data: [71.2, 68.9, 74.5, 69.8, 67.3],
        backgroundColor: 'hsl(220 91% 15%)',
        borderColor: 'hsl(220 91% 15%)',
        borderWidth: 1,
      },
      {
        label: 'NOTA Votes (%)',
        data: [2.1, 1.8, 2.5, 1.9, 2.3],
        backgroundColor: 'hsl(0 84% 60%)',
        borderColor: 'hsl(0 84% 60%)',
        borderWidth: 1,
      },
    ],
  };

  const turnoutTrends = {
    labels: ['2014', '2016', '2018', '2020', '2022', '2024'],
    datasets: [
      {
        label: 'Average Turnout %',
        data: [65.2, 67.1, 69.8, 71.2, 68.9, 70.5],
        borderColor: 'hsl(138 76% 25%)',
        backgroundColor: 'hsl(138 76% 25% / 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const liveResults = [
    {
      constituency: 'Mumbai North',
      winner: 'Dr. Rajesh Kumar (BJP)',
      votes: 125000,
      margin: 15000,
      turnout: '68.5%',
      status: 'Declared'
    },
    {
      constituency: 'Pune Central',
      leading: 'Smt. Priya Sharma (INC)',
      votes: 98000,
      margin: 5500,
      turnout: '72.3%',
      status: 'Leading'
    },
    {
      constituency: 'Mumbai South',
      winner: 'Shri Amit Verma (AAP)',
      votes: 110000,
      margin: 8200,
      turnout: '65.8%',
      status: 'Declared'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-foreground">
            Results Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time election results and analytics across all states
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button className="bg-gradient-primary">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Elections
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              5 completed, 2 ongoing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Seats
            </CardTitle>
            <Award className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,847</div>
            <p className="text-xs text-muted-foreground">
              Across all constituencies
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Votes
            </CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5M</div>
            <p className="text-xs text-muted-foreground">
              70.2% average turnout
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Live Updates
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">
              Results being counted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="gujarat">Gujarat</SelectItem>
                <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedElection} onValueChange={setSelectedElection}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select election type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Elections</SelectItem>
                <SelectItem value="assembly">Assembly Elections</SelectItem>
                <SelectItem value="municipal">Municipal Elections</SelectItem>
                <SelectItem value="council">Legislative Council</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Party-wise Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              National Party Performance
            </CardTitle>
            <CardDescription>
              Seat distribution across major political parties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Pie
                data={partyWiseResults}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        usePointStyle: true,
                        padding: 20,
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Turnout Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Voter Turnout Trends
            </CardTitle>
            <CardDescription>
              Historical voter turnout percentage over the years
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Line
                data={turnoutTrends}
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
                      min: 60,
                      max: 80,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* State-wise Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            State-wise Comparison
          </CardTitle>
          <CardDescription>
            Voter turnout and NOTA votes comparison across states
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Bar
              data={stateWiseComparison}
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
                    max: 80,
                  },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Live Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Live Results Feed
          </CardTitle>
          <CardDescription>
            Real-time constituency results and leading candidates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {liveResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold">{result.constituency}</h3>
                    <Badge className={result.status === 'Declared' ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'}>
                      {result.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {result.winner || result.leading} • {result.votes.toLocaleString()} votes
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Victory Margin: {result.margin.toLocaleString()} votes • Turnout: {result.turnout}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    +{((result.margin / result.votes) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Lead</div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View All Constituency Results
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDashboard;
