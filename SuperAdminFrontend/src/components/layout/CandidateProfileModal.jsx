import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Award, Calendar, Download, Mail, Phone, Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CandidateProfileModal = ({ candidate, isOpen, onClose }) => {
  if (!candidate) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPartyColor = (party) => {
    const colors = {
      "Bharatiya Janata Party": "bg-orange-100 text-orange-800",
      BJP: "bg-orange-100 text-orange-800",

      "Indian National Congress": "bg-blue-100 text-blue-800",
      INC: "bg-blue-100 text-blue-800",

      "Aam Aadmi Party": "bg-cyan-100 text-cyan-800",
      AAP: "bg-cyan-100 text-cyan-800",

      "Telangana Rashtra Samithi": "bg-pink-100 text-pink-800",
      "Bharat Rashtra Samithi": "bg-pink-100 text-pink-800",
      TRS: "bg-pink-100 text-pink-800",
      BRS: "bg-pink-100 text-pink-800",

      "Samajwadi Party": "bg-red-100 text-red-800",
      SP: "bg-red-100 text-red-800",

      "Bahujan Samaj Party": "bg-indigo-100 text-indigo-800",
      BSP: "bg-indigo-100 text-indigo-800",

      "Shiv Sena": "bg-yellow-100 text-yellow-800",
      SS: "bg-yellow-100 text-yellow-800",

      "Nationalist Congress Party": "bg-green-100 text-green-800",
      NCP: "bg-green-100 text-green-800",

      "Rashtriya Janata Dal": "bg-lime-100 text-lime-800",
      RJD: "bg-lime-100 text-lime-800",

      "Janata Dal (United)": "bg-emerald-100 text-emerald-800",
      JDU: "bg-emerald-100 text-emerald-800",
      "JD(U)": "bg-emerald-100 text-emerald-800",

      "All India Trinamool Congress": "bg-teal-100 text-teal-800",
      TMC: "bg-teal-100 text-teal-800",
      AITC: "bg-teal-100 text-teal-800",

      "Communist Party of India (Marxist)": "bg-red-200 text-red-900",
      "CPI(M)": "bg-red-200 text-red-900",

      "Communist Party of India": "bg-rose-100 text-rose-800",
      CPI: "bg-rose-100 text-rose-800",

      "Dravida Munnetra Kazhagam": "bg-gray-200 text-gray-900",
      DMK: "bg-gray-200 text-gray-900",

      "All India Anna Dravida Munnetra Kazhagam": "bg-gray-100 text-gray-800",
      AIADMK: "bg-gray-100 text-gray-800",

      "Janata Dal (Secular)": "bg-green-200 text-green-900",
      JDS: "bg-green-200 text-green-900",
      "JD(S)": "bg-green-200 text-green-900",
    };

    return colors[party] || "bg-gray-100 text-gray-800";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl">Candidate Profile</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Left Column - Photo and Basic Info */}
          <div className="md:col-span-1 flex flex-col items-center">
            <Avatar className="w-32 h-32 md:w-40 md:h-40 mb-4">
              <AvatarImage
                src={candidate.profile_picture}
                alt={candidate.name}
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {candidate.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            
            <h2 className="text-xl font-bold text-center mb-2">{candidate.name}</h2>
            
            <div className="flex items-center gap-2 mb-4">
              <Badge className={`${getStatusColor("Approved")} text-xs`}>
                {"Approved"}
              </Badge>
            </div>
            
            <div className="w-full space-y-3 mt-4">
              {candidate.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{candidate.email}</span>
                </div>
              )}
              
              {candidate.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{candidate.phone}</span>
                </div>
              )}
              
              {candidate.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a href={candidate.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Website
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-medium">{candidate.candidate_age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Qualification</p>
                    <p className="font-medium">{candidate.qualification}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-medium">{candidate.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Previous Wins</p>
                    <p className="font-medium">{candidate.previousWins}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {candidate.candidate_city}, {candidate.candidate_district}, {candidate.candidate_state}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Party & Election Info Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Political Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <Badge
                    variant="outline"
                    className={`${getPartyColor(candidate.party_name)} text-xs`}
                  >
                    {candidate.party_name}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {candidate.experience} experience • {candidate.previousWins} wins
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {candidate.electionType} Election
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Manifesto Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Manifesto</CardTitle>
              </CardHeader>
              <CardContent>
                {candidate.manifesto ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm">{candidate.manifestoDescription || "The candidate has provided a manifesto outlining their vision and plans."}</p>
                    <div>
                      <a
                        href={candidate.manifesto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 
                        bg-blue-600 text-white text-sm font-medium 
                        rounded-lg shadow hover:bg-blue-700 
                        transition-colors duration-200"
                      >
                        <Download className="w-4 h-4" />
                        Download Manifesto
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No manifesto available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Additional Information (if available) */}
            {(candidate.bio || candidate.agenda) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {candidate.bio && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Bio</p>
                      <p className="text-sm">{candidate.bio}</p>
                    </div>
                  )}
                  
                  {candidate.agenda && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Key Agenda</p>
                      <p className="text-sm">{candidate.agenda}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Close button at bottom */}
        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateProfileModal;
