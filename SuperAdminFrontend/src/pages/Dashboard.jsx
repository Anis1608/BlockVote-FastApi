import React, { useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  UserCheck,
  BarChart3,
  TrendingUp,
  Activity,
  Shield,
} from "lucide-react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useState } from "react";
import { SuperAdminDataContext } from "../context_api/SuperAdminDataState";
import { SuperAdminLogContext } from "../context_api/SuperAdminLogState";
import RecentActivityModal from "../components/layout/RecentActivityModal";

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
  const [candidateCounts, setCandidateCounts] = useState([]);
  const [health, setHealth] = useState(0);
  const [interactions, setInteractions] = useState(0);
  const [logs, setLogs] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const { getCandidateCountsByState } = useContext(SuperAdminDataContext);
  const { getlogs } = useContext(SuperAdminLogContext);

  useEffect(() => {
    const fetchCandidateCounts = async () => {
      const counts = await getCandidateCountsByState();
      setCandidateCounts(counts);
    };
    fetchCandidateCounts();
  }, []);

  // WebSocket for health
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:9000/ws/health");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setHealth(data.health_percentage);
      setInteractions(data.interaction_count);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await getlogs();
      setLogs(res);
    };
    fetchLogs();
  }, []);

  // console.log(candidateCounts);

  const getHealthColors = (health) => {
    if (health < 25)
      return {
        color: "text-red-600",
        bgColor: "bg-red-200",
        status: "Unstable",
      };
    if (health < 50)
      return {
        color: "text-orange-600",
        bgColor: "bg-orange-200",
        status: "Warning",
      };
    if (health < 75)
      return {
        color: "text-yellow-600",
        bgColor: "bg-yellow-200",
        status: "Moderate",
      };
    return {
      color: "text-green-600",
      bgColor: "bg-green-200",
      status: "Stable",
    };
  };

  const { color, bgColor, status } = getHealthColors(health);

  const statsCards = [
    {
      title: "Blockchain Health",
      value: health + "%",
      change: status,
      icon: UserCheck,
      color: color,
      bgColor: bgColor,
    },
    {
      title: "Total Elections",
      value: "12",
      change: "+2 this month",
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary-light",
    },
    {
      title: "Currently Blockchain Interaction",
      value: interactions,
      change: "Live updates",
      icon: Users,
      color: "text-success",
      bgColor: "bg-success-light",
    },

    {
      title: "Total Votes Cast",
      value: "2.4M",
      change: "+12% from last election",
      icon: BarChart3,
      color: "text-primary",
      bgColor: "bg-primary-light",
    },
  ];

  const electionData = {
    labels: [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal",
      "Andaman & Nicobar Islands",
      "Chandigarh",
      "Dadra & Nagar Haveli and Daman & Diu",
      "Delhi",
      "Jammu & Kashmir",
      "Ladakh",
      "Lakshadweep",
      "Puducherry",
    ],
    datasets: [
      {
        label: "Registered Candidates",
        data: candidateCounts || [50, 75, 150, 100, 200, 175, 80],
        backgroundColor: "hsl(220 91% 15%)",
        borderColor: "hsl(220 91% 15%)",
        borderWidth: 1,
      },
    ],
  };

  const voteDistribution = {
    labels: ["Completed Elections", "Active Elections", "Upcoming Elections"],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: [
          "hsl(138 76% 25%)",
          "hsl(28 100% 58%)",
          "hsl(220 91% 15%)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const getLogStatusColor = (status) => {
    switch (status) {
      case "Success":
        return "bg-success text-success-foreground";
      case "Failed":
        return "bg-red-400 text-red-foreground";
      default:
        return "bg-muted text-muted-foreground";
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
          <span className="text-sm text-success font-medium">
            Blockchain Secured
          </span>
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
              <div
                className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
              >
                <stat.icon className="h-5 w-5 text-gray-500" />{" "}
                {/* Icon static color */}
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>{" "}
              {/* Value text dynamic */}
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
              Recent Activity
            </CardTitle>
            <CardDescription>
              Status of recent actions and system logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs.length > 0 ? (
                logs.slice(0,5).map((log) => (
                  <div
                    key={log.log_id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div>
                        <p className="font-medium">{log.action_title}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.action}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getLogStatusColor(log.status)}>
                        {" "}
                        {log.status}{" "}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No logs available</p>
              )}
            </div>

       <Button variant="outline" className="w-full mt-4" onClick={() => setOpenModal(true)}>
    View All Activity
  </Button>
    <RecentActivityModal open={openModal} onClose={setOpenModal} logs={logs} />
          </CardContent>
        </Card>

        {/* Vote Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Election Status
            </CardTitle>
            <CardDescription>Distribution of election phases</CardDescription>
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
                      position: "bottom",
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
                    position: "top",
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
