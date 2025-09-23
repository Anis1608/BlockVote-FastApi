import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Users,
  ArrowLeft,
  Calendar,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import indianFlag from "@/assets/indian-flag.jpg";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const backend_url = import.meta.env.VITE_BACKEND_URL;

console.log("Backend URL:", backend_url);

export default function CandidatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("West Bengal");
  const [selectedParty, setSelectedParty] = useState("all");
  const [candidates, setCandidates] = useState<any[]>([]);

  useEffect(() => {
    fetchCandidates();
  }, [selectedState]);

  const fetchCandidates = async () => {
    try {
      const response = await fetch(
        `${backend_url}/api/candidates/details/${selectedState}`
      );
      const data = await response.json();
      setCandidates(data.candidates);
      console.log(data);
    } catch (error) {
      console.log("Error fetching candidates:", error);
    }
  };

  const states = [
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
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  const parties = [
    ...new Set(candidates?.map((c) => c.party_name) || []),
  ].sort();

  const filteredCandidates = (candidates || []).filter((candidate) => {
    const matchesSearch =
      candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      candidate.party_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      candidate.constituency
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      false;

    const matchesState =
      selectedState === "all" || candidate.candidate_state === selectedState;

    const matchesParty =
      selectedParty === "all" || candidate.party_name === selectedParty;

    return matchesSearch && matchesState && matchesParty;
  });

  console.log("Filtered Candidates:", filteredCandidates);

  return (
    <>
      <Header />
      <div
        className="min-h-screen bg-gradient-to-br 
                      from-gray-50 to-gray-100 
                      dark:from-neutral-950 dark:to-neutral-900 
                      pt-14"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/">
              <Button
                variant="ghost"
                className="group dark:hover:bg-neutral-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center px-6 py-3 rounded-full 
                            bg-primary/10 dark:bg-primary/20 
                            border border-primary/30 mb-6"
            >
              <img
                src={indianFlag}
                alt="Indian Flag"
                className="h-5 w-7 mr-3 rounded-sm"
              />
              <Users className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-semibold text-primary">
                उम्मीदवार सूची | Candidate Directory
              </span>
            </div>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold 
                     bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4"
            >
              Election Candidates
            </h1>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              From Every State of India
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Browse and research candidates running in upcoming elections
              across all Indian states. Make informed decisions with detailed
              candidate information and manifestos.
            </p>
          </div>

          {/* Search and Filter */}
          <Card className="mb-8 bg-white dark:bg-neutral-950 border border-border">
            <CardHeader>
              <CardTitle
                className="flex items-center text-xl 
                                     bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
              >
                <Search className="h-5 w-5 mr-2 text-primary" />
                खोजें और फ़िल्टर करें | Search & Filter Candidates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                     h-4 w-4 text-gray-500 dark:text-gray-400"
                  />
                  <Input
                    placeholder="Search by name, party, or constituency..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 dark:bg-neutral-900 dark:text-gray-200"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Select
                    value={selectedState}
                    onValueChange={setSelectedState}
                  >
                    <SelectTrigger className="dark:bg-neutral-900 dark:text-gray-200">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-neutral-900 dark:text-gray-200">
                      <SelectItem value="all">All States</SelectItem>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Select
                    value={selectedParty}
                    onValueChange={setSelectedParty}
                  >
                    <SelectTrigger className="dark:bg-neutral-900 dark:text-gray-200">
                      <SelectValue placeholder="Select Party" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-neutral-900 dark:text-gray-200">
                      <SelectItem value="all">All Parties</SelectItem>
                      {parties.map((party) => (
                        <SelectItem key={party} value={party}>
                          {party}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(searchTerm ||
                selectedState !== "all" ||
                selectedParty !== "all") && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredCandidates.length > 0 ? (
                      <>
                        Showing {filteredCandidates.length} of{" "}
                        {candidates.length} candidates
                      </>
                    ) : (
                      <>No candidates found for the selected filters</>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="dark:border-gray-600 dark:hover:bg-neutral-800"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedState("all");
                      setSelectedParty("all");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Candidates Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <User className="h-6 w-6 mr-2 text-primary" />
                उम्मीदवार (
                {filteredCandidates.length > 0
                  ? filteredCandidates.length
                  : "No candidates found"}
                ) | Candidates (
                {filteredCandidates.length > 0
                  ? filteredCandidates.length
                  : "No candidates found"}
                )
              </h2>
              <Badge
                variant="outline"
                className="text-lg py-1 px-3 shadow-sm dark:border-gray-600"
              >
                {candidates && candidates.length > 0
                  ? `${candidates.length} Total Candidates`
                  : "No candidates available"}
              </Badge>
            </div>

            {filteredCandidates.length === 0 ? (
              <div className="text-center py-12 border rounded-lg border-border dark:border-gray-700">
                <div className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
                  No candidates found matching your search criteria.
                </div>
                <Button
                  variant="outline"
                  className="dark:border-gray-600 dark:hover:bg-neutral-800"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedState("all");
                    setSelectedParty("all");
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCandidates.map((candidate, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300 
                                   bg-white dark:bg-neutral-900 border border-border dark:border-gray-700"
                  >
                    <div className={`h-2 ${candidate.party_color}`}></div>
                    <CardHeader className="pb-3">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <a href={candidate.profile_picture} target="_blank">
                            <img
                              src={candidate.profile_picture}
                              alt={candidate.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                            />
                          </a>
                          <div
                            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${candidate.party_color} border-2 border-white dark:border-neutral-900`}
                          ></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">
                            {candidate.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {candidate.candidate_city},{" "}
                            {candidate.candidate_state}
                          </p>
                          <div className="flex items-center mt-1">
                            <div
                              className={`w-3 h-3 rounded-full mr-2 ${candidate.party_color}`}
                            ></div>
                            <span className="text-sm font-medium">
                              {candidate.party_name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center text-sm">
                          <Award className="h-4 w-4 mr-1 text-accent" />
                          <span>{candidate.experience}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                          <span>{candidate.candidate_age} years</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-1 flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          Education
                        </h4>
                        <p className="text-sm">{candidate.qualification}</p>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-1">
                          Previous Position
                        </h4>
                        <p className="text-sm">
                          {candidate.previous_positions}
                        </p>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-1">
                          Key Achievements
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {candidate.achievements.map((achievement, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs dark:bg-neutral-800 dark:text-gray-300"
                            >
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-center items-center align-middle mt-4 pt-4 border-t border-border dark:border-gray-700">
                        <Button
                          variant="outline"
                          size="sm"
                          className="tricolor-border hover:bg-primary/10 dark:border-gray-600 dark:hover:bg-neutral-800"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          <a href={candidate.manifesto} target="_blank">
                            View Manifesto
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
