import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Search,
  User,
  Calendar,
  Download,
  Share,
  ArrowLeft,
  Users,
} from "lucide-react";
import { calculateAge } from "@/utiils/dateHelpers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import indianFlag from "@/assets/indian-flag.jpg";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function ViewVoterForm() {
  const [voterID, setVoterID] = useState("");
  const [voterDetails, setVoterDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (voterID.length >= 10) {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BACKEND_URL}/api/voter/details/${voterID}`);
        // replace with your FastAPI server URL / EC2 public IP
        if (!res.ok) {
          throw new Error("Voter not found");
        }
        const data = await res.json();
        const fullName = data.voter.name || "";
        // Split into parts
        const nameParts = fullName.trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName =
          nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
        setVoterDetails({ ...data.voter, firstName, lastName });
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
        setVoterDetails(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDownload = () => {
    console.log("Downloading voter card...");
    // Example: call backend API to download PDF
    // window.open(`http://localhost:8000/voter/download/${voterID}`, "_blank");
  };

  const handleShare = () => {
    console.log("Sharing voter details...");
    if (navigator.share && voterDetails) {
      navigator.share({
        title: "Voter Details",
        text: `Voter ID: ${voterDetails.voter_id}\nName: ${voterDetails.first_name} ${voterDetails.last_name}`,
      });
    }
  };

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
                मतदाता सूची | Voter Directory
              </span>
            </div>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold 
                     bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4"
            >
              View Registered Voters
            </h1>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              From Every State of India
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Browse and verify details of registered voters across all Indian
              states. Ensure transparency in electoral rolls with complete voter
              information.
            </p>
          </div>

          <Card className="w-full max-w-auto mx-auto mt-10">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Eye className="h-6 w-6 text-primary" />
                View Voter Details
              </CardTitle>
              <CardDescription>
                Enter your Voter ID to view your complete voter information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search Section */}
              <div className="space-y-4 mb-6">
                <Label htmlFor="voterIDSearch">Enter Voter ID *</Label>
                <div className="flex gap-2">
                  <Input
                    id="voterIDSearch"
                    value={voterID}
                    onChange={(e) => setVoterID(e.target.value)}
                    placeholder="Enter 10-digit Voter ID"
                    maxLength={10}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleSearch}
                    disabled={voterID.length < 10 || isLoading}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {isLoading ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="text-center text-red-500 pb-4">{error}</div>
              )}

              {/* Voter Details Display */}
              {/* Voter Details Display */}
              {voterDetails && (
                <div className="space-y-6">
                  {/* Header with Status */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Voter Information</h3>
                    <Badge
                      variant={
                        voterDetails.status === "Active"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {voterDetails.status}
                    </Badge>
                  </div>

                  {/* Voter Info Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-5 w-5 text-primary" />
                        Personal & Polling Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            label: "Voter ID",
                            value: voterDetails.voter_id,
                            highlight: true,
                          },
                          {
                            label: "First Name",
                            value: voterDetails.firstName,
                          },
                          { label: "Last Name", value: voterDetails.lastName },
                          {
                            label: "Father's Name",
                            value: voterDetails.father_name,
                          },
                          {
                            label: "Age",
                            value: calculateAge(voterDetails.voter_dob),
                          },
                          { label: "Gender", value: voterDetails.gender },
                          { label: "State", value: voterDetails.voters_state },
                          { label: "City", value: voterDetails.voters_city },
                          {
                            label: "District",
                            value: voterDetails.voters_district,
                          },
                          {
                            label: "Polling Station",
                            value: voterDetails.polling_station,
                            colSpan: true,
                          },
                          {
                            label: "Part Serial Number",
                            value: voterDetails.part_serial_number,
                          },
                          {
                            label: "Polling Date",
                            value: (
                              <span className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {voterDetails.polling_date}
                              </span>
                            ),
                          },
                          {
                            label: "Part Number",
                            value: voterDetails.part_number,
                          },
                          { label: "Part Name", value: voterDetails.part_name },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg border bg-muted/30 ${
                              item.colSpan ? "md:col-span-2" : ""
                            }`}
                          >
                            <Label className="text-sm text-muted-foreground">
                              {item.label}
                            </Label>
                            <p
                              className={`${
                                item.highlight
                                  ? "font-bold text-lg text-primary"
                                  : "font-medium"
                              }`}
                            >
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleDownload} className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Download Voter Card
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="flex-1"
                    >
                      <Share className="mr-2 h-4 w-4" />
                      Share Details
                    </Button>
                  </div>
                </div>
              )}

              {/* No results message */}
              {!voterDetails && voterID && !isLoading && !error && (
                <div className="text-center py-8 text-muted-foreground">
                  Enter a valid 10-digit Voter ID to view details
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
