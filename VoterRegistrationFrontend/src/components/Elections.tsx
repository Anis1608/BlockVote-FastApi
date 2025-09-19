import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ArrowRight,
  Vote,
  Flag
} from "lucide-react";
import indianFlag from "@/assets/indian-flag.jpg";

export function Elections() {
  const upcomingElections = [
    {
      title: "State Assembly Elections 2024",
      state: "Maharashtra",
      date: "November 15, 2024",
      status: "Registration Open",
      participants: "45.2M",
      timeLeft: "45 days",
      type: "State"
    },
    {
      title: "Municipal Corporation Elections",
      state: "Karnataka", 
      date: "December 8, 2024",
      status: "Upcoming",
      participants: "12.8M",
      timeLeft: "78 days",
      type: "Local"
    },
    {
      title: "Panchayat Elections",
      state: "Uttar Pradesh",
      date: "January 20, 2025",
      status: "Candidate Filing",
      participants: "89.1M",
      timeLeft: "121 days",
      type: "Local"
    },
    {
      title: "By-Elections",
      state: "West Bengal",
      date: "October 28, 2024",
      status: "Voting Active",
      participants: "2.1M",
      timeLeft: "Live",
      type: "By-Election"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Registration Open": return "bg-secondary text-secondary-foreground";
      case "Voting Active": return "bg-destructive text-destructive-foreground animate-pulse";
      case "Upcoming": return "bg-accent text-accent-foreground";
      case "Candidate Filing": return "bg-primary text-primary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section id="elections" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-accent-light/20 border border-accent/30 mb-6">
            <img src={indianFlag} alt="Indian Flag" className="h-5 w-7 mr-3 rounded-sm" />
            <Vote className="h-4 w-4 text-accent mr-2" />
            <span className="text-sm font-semibold text-accent">राष्ट्रीय चुनाव | National Elections</span>
            <Flag className="h-4 w-4 text-primary ml-2" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient mb-4">
            Upcoming Elections
          </h2>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Across Bharat
          </h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Stay informed about upcoming elections in your state and constituency. 
            Participate in the democratic process with complete transparency across all Indian states and union territories.
          </p>
        </div>

        {/* Elections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {upcomingElections.map((election, index) => (
            <Card key={index} className="indian-card group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-primary-light/10 rounded-xl border border-primary/20">
                      <Vote className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gradient group-hover:text-primary transition-colors">
                        {election.title}
                      </CardTitle>
                      <Badge variant="outline" className="mt-1 border-primary/30">
                        {election.type}
                      </Badge>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(election.status)} shadow-sm`}>
                    {election.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Election Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      {election.state}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      {election.date}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      {election.participants} voters
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      {election.timeLeft}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className={`w-full mt-4 group shadow-md ${election.status === "Voting Active" ? "btn-hero" : "tricolor-border border-2 hover:bg-primary-light/10"}`}
                    variant={election.status === "Voting Active" ? "default" : "outline"}
                  >
                    {election.status === "Voting Active" ? "अभी वोट करें | Vote Now" : "विवरण देखें | View Details"}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <Button className="btn-hero shadow-tricolor" size="lg">
            सभी चुनाव देखें | View All Elections
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}