import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  UserCheck,
  Calendar,
  TrendingUp,
  Activity,
  Vote,
  ArrowRight,
  BarChart3,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  {
    title: 'Total Candidates',
    value: '1,247',
    change: '+12.5%',
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'Registered Voters',
    value: '45,678',
    change: '+8.2%',
    icon: UserCheck,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    title: 'Active Devices',
    value: '234',
    change: '+3.1%',
    icon: Activity,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    title: 'Elections This Month',
    value: '12',
    change: '+25%',
    icon: Calendar,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
];

const recentActivity = [
  { action: 'New candidate registered', time: '2 minutes ago', status: 'success' },
  { action: 'Bulk voter upload completed', time: '15 minutes ago', status: 'success' },
  { action: 'Device authentication failed', time: '1 hour ago', status: 'warning' },
  { action: 'Election schedule updated', time: '2 hours ago', status: 'info' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-primary">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to BlockVote India Election Management System
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            System Active
          </Badge>
          <Button className="btn-primary">
            <Vote className="w-4 h-4 mr-2" />
            Start New Election
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="card-elegant hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-success" />
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="card-feature">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks and shortcuts for efficient management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/candidates">
              <Button variant="ghost" className="w-full justify-between hover:bg-primary/10">
                Add New Candidate
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/voters">
              <Button variant="ghost" className="w-full justify-between hover:bg-accent/10">
                Upload Voters (CSV)
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/elections">
              <Button variant="ghost" className="w-full justify-between hover:bg-success/10">
                Schedule Election
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/devices">
              <Button variant="ghost" className="w-full justify-between hover:bg-warning/10">
                Manage Devices
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="card-feature">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest system activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-success' :
                  activity.status === 'warning' ? 'bg-warning' :
                  'bg-primary'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}