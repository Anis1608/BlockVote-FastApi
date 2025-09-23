import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  User,
  Award,
  MapPin,
  Users,
  FileText,
  Calendar,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";
import indianFlag from "@/assets/indian-flag.jpg";

export function Candidates() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const candidates = [
    {
      name: "Rajesh Kumar Sharma",
      party: "Indian National Congress",
      state: "Maharashtra",
      constituency: "Mumbai North",
      experience: "15 years",
      manifesto: "https://example.com/manifesto1",
      party_color: "bg-blue-600",
      profile: "/api/placeholder/80/80",
      education: "MBA, Harvard University",
      age: 48,
      previousPosition: "Member of Legislative Assembly",
      achievements: ["Education Reformer", "Infrastructure Development", "Youth Employment"],
      contact: "rajesh.sharma@example.com"
    },
    {
      name: "Priya Patel",
      party: "Bharatiya Janata Party", 
      state: "Gujarat",
      constituency: "Ahmedabad West",
      experience: "8 years",
      manifesto: "https://example.com/manifesto2",
      party_color: "bg-orange-600",
      profile: "/api/placeholder/80/80",
      education: "PhD in Economics",
      age: 42,
      previousPosition: "Corporate Executive",
      achievements: ["Women Empowerment", "Economic Development", "Healthcare Access"],
      contact: "priya.patel@example.com"
    },
    {
      name: "Mohammed Ali Khan",
      party: "Aam Aadmi Party",
      state: "Delhi",
      constituency: "New Delhi",
      experience: "5 years", 
      manifesto: "https://example.com/manifesto3",
      party_color: "bg-blue-400",
      profile: "/api/placeholder/80/80",
      education: "Law Degree, Delhi University",
      age: 38,
      previousPosition: "Social Activist",
      achievements: ["Anti-Corruption", "Public Service Reform", "Environmental Protection"],
      contact: "mohammed.khan@example.com"
    },
    {
      name: "Sunita Devi",
      party: "All India Trinamool Congress",
      state: "West Bengal",
      constituency: "Kolkata South",
      experience: "12 years",
      manifesto: "https://example.com/manifesto4",
      party_color: "bg-green-600",
      profile: "/api/placeholder/80/80",
      education: "MA in Political Science",
      age: 52,
      previousPosition: "Local Council Member",
      achievements: ["Rural Development", "Women's Safety", "Education Access"],
      contact: "sunita.devi@example.com"
    },
    {
      name: "Dr. Arjun Reddy",
      party: "Telugu Desam Party",
      state: "Andhra Pradesh",
      constituency: "Visakhapatnam",
      experience: "7 years",
      manifesto: "https://example.com/manifesto5",
      party_color: "bg-yellow-600",
      profile: "/api/placeholder/80/80",
      education: "MBBS, MD",
      age: 45,
      previousPosition: "Chief Medical Officer",
      achievements: ["Healthcare Reform", "Medical Infrastructure", "Public Health"],
      contact: "arjun.reddy@example.com"
    },
    {
      name: "Kavitha Nair",
      party: "Indian National Congress",
      state: "Kerala",
      constituency: "Thiruvananthapuram",
      experience: "10 years",
      manifesto: "https://example.com/manifesto6",
      party_color: "bg-blue-600",
      profile: "/api/placeholder/80/80",
      education: "MSW, Kerala University",
      age: 43,
      previousPosition: "Social Worker",
      achievements: ["Poverty Alleviation", "Child Welfare", "Community Development"],
      contact: "kavitha.nair@example.com"
    }
  ];

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <section 
      id="candidates" 
      className={`py-20 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-background to-secondary-light/5'}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary-light/20 border border-primary/30 mb-6">
            <img src={indianFlag} alt="Indian Flag" className="h-5 w-7 mr-3 rounded-sm" />
            <Users className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-semibold text-primary">
              उम्मीदवार सूची | Candidate Directory
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient mb-4">
            Election Candidates
          </h2>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            From Every State of India
          </h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Browse and research candidates running in upcoming elections across all Indian states. 
            Make informed decisions with detailed candidate information and manifestos.
          </p>
          
          {/* Dark Mode Toggle */}
          <div className="mt-6 flex justify-center">
            <Button 
              variant="outline" 
              onClick={toggleDarkMode}
              className="flex items-center gap-2 border border-gray-400 
                        text-black hover:text-black hover:bg-gray-100 
                        dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
            >
              {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </Button>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center">
              <User className="h-6 w-6 mr-2 text-primary" />
              Featured Candidates
            </h2>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-lg py-1 px-3 shadow-sm">
                {candidates.length} Candidates
              </Badge>
              <Button 
                asChild 
                variant="default" 
                size="sm" 
                className="bg-primary hover:bg-primary-glow text-black dark:text-white"
              >
                <Link to="/candidates">
                  View All Candidates
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate, index) => (
              <Card 
                key={index} 
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 
                           indian-card dark:bg-gray-800 dark:border-gray-700"
              >
                <div className={`h-2 ${candidate.party_color}`}></div>
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="relative">
                        <img 
                          src={candidate.profile} 
                          alt={candidate.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                        />
                        <div 
                          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full 
                                      ${candidate.party_color} border-2 border-white dark:border-gray-800`}
                        ></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold truncate dark:text-white">
                          {candidate.name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center dark:text-gray-300">
                          <MapPin className="h-3 w-3 mr-1" />
                          {candidate.constituency}, {candidate.state}
                        </p>
                        <div className="flex items-center mt-1">
                          <div className={`w-3 h-3 rounded-full mr-2 ${candidate.party_color}`}></div>
                          <span className="text-sm font-medium dark:text-gray-200">
                            {candidate.party}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center text-sm dark:text-gray-300">
                        <Award className="h-4 w-4 mr-1 text-accent" />
                        <span>{candidate.experience}</span>
                      </div>
                      <div className="flex items-center text-sm dark:text-gray-300">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{candidate.age} years</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-1 flex items-center dark:text-gray-200">
                        <FileText className="h-4 w-4 mr-1" />
                        Education
                      </h4>
                      <p className="text-sm dark:text-gray-300">{candidate.education}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-1 dark:text-gray-200">
                        Previous Position
                      </h4>
                      <p className="text-sm dark:text-gray-300">{candidate.previousPosition}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-1 dark:text-gray-200">
                        Key Achievements
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.achievements.map((achievement, i) => (
                          <Badge 
                            key={i} 
                            variant="secondary" 
                            className="text-xs dark:bg-gray-700 dark:text-gray-200"
                          >
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border px-6 pb-6 dark:border-gray-700">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="tricolor-border bg-white text-black hover:text-black hover:bg-gray-100
                                 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Manifesto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
