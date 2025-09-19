import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  ExternalLink, 
  User,
  Award,
  MapPin,
  Users
} from "lucide-react";
import indianFlag from "@/assets/indian-flag.jpg";

export function Candidates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("all");

  const candidates = [
    {
      name: "Rajesh Kumar Sharma",
      party: "Indian National Congress",
      state: "Maharashtra",
      constituency: "Mumbai North",
      experience: "15 years",
      manifesto: "https://example.com/manifesto1",
      party_color: "bg-blue-600"
    },
    {
      name: "Priya Patel",
      party: "Bharatiya Janata Party", 
      state: "Gujarat",
      constituency: "Ahmedabad West",
      experience: "8 years",
      manifesto: "https://example.com/manifesto2",
      party_color: "bg-orange-600"
    },
    {
      name: "Mohammed Ali Khan",
      party: "Aam Aadmi Party",
      state: "Delhi",
      constituency: "New Delhi",
      experience: "5 years", 
      manifesto: "https://example.com/manifesto3",
      party_color: "bg-blue-400"
    },
    {
      name: "Sunita Devi",
      party: "All India Trinamool Congress",
      state: "West Bengal",
      constituency: "Kolkata South",
      experience: "12 years",
      manifesto: "https://example.com/manifesto4",
      party_color: "bg-green-600"
    },
    {
      name: "Dr. Arjun Reddy",
      party: "Telugu Desam Party",
      state: "Andhra Pradesh",
      constituency: "Visakhapatnam",
      experience: "7 years",
      manifesto: "https://example.com/manifesto5",
      party_color: "bg-yellow-600"
    },
    {
      name: "Kavitha Nair",
      party: "Indian National Congress",
      state: "Kerala",
      constituency: "Thiruvananthapuram",
      experience: "10 years",
      manifesto: "https://example.com/manifesto6",
      party_color: "bg-blue-600"
    }
  ];

  const states = [...new Set(candidates.map(c => c.state))];

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.constituency.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === "all" || candidate.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <section id="candidates" className="py-20 bg-gradient-to-br from-background to-secondary-light/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary-light/20 border border-primary/30 mb-6">
            <img src={indianFlag} alt="Indian Flag" className="h-5 w-7 mr-3 rounded-sm" />
            <Users className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-semibold text-primary">उम्मीदवार सूची | Candidate Directory</span>
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
        </div>

        {/* Search and Filter */}
        <Card className="mb-8 indian-card">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-gradient">
              <Search className="h-5 w-5 mr-2 text-primary" />
              खोजें और फ़िल्टर करें | Search & Filter Candidates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, party, or constituency..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {states.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidates Table */}
        <Card className="indian-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-xl text-gradient">
                <User className="h-5 w-5 mr-2 text-primary" />
                उम्मीदवार ({filteredCandidates.length}) | Candidates ({filteredCandidates.length})
              </CardTitle>
              <Badge variant="outline" className="shadow-sm">
                {candidates.length} Total Candidates
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead>Constituency</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Manifesto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-light/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">
                              {candidate.name}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {candidate.state}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${candidate.party_color}`}></div>
                          <span className="font-medium">{candidate.party}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {candidate.constituency}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Award className="h-4 w-4 text-accent" />
                          <span>{candidate.experience}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="group tricolor-border hover:bg-primary-light/10">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          घोषणापत्र | Manifesto
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredCandidates.length === 0 && (
              <div className="text-center py-8">
                <div className="text-muted-foreground mb-4">
                  No candidates found matching your search criteria.
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedState("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}