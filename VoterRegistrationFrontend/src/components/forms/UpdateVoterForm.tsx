import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Search, Phone, MapPin, Save } from "lucide-react";

export function UpdateVoterForm() {
  const [voterID, setVoterID] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    district: "",
    constituency: "",
    pincode: ""
  });

  const handleVoterIDSearch = () => {
    if (voterID.length >= 10) {
      // Simulate voter verification
      setIsVerified(true);
      setFormData({
        fullName: "Sample Voter Name",
        phone: "+91 98765 43210",
        email: "voter@example.com",
        address: "123 Main Street, Sample City",
        state: "maharashtra",
        district: "Mumbai",
        constituency: "Mumbai South",
        pincode: "400001"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Update form submitted:", formData);
    // Handle update logic here
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Edit className="h-6 w-6 text-primary" />
          Update Voter Information
        </CardTitle>
        <CardDescription>
          Update your existing voter information using your Voter ID
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Voter ID Search */}
        <div className="space-y-4 mb-6">
          <Label htmlFor="voterID">Enter your Voter ID *</Label>
          <div className="flex gap-2">
            <Input
              id="voterID"
              value={voterID}
              onChange={(e) => setVoterID(e.target.value)}
              placeholder="Enter 10-digit Voter ID"
              maxLength={10}
              className="flex-1"
            />
            <Button 
              type="button" 
              onClick={handleVoterIDSearch}
              disabled={voterID.length < 10}
            >
              <Search className="h-4 w-4 mr-2" />
              Verify
            </Button>
          </div>
        </div>

        {isVerified && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary" />
                Update Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Address Information
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Full Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="House No., Street, Area, City"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="gujarat">Gujarat</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="west-bengal">West Bengal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) => handleInputChange("district", e.target.value)}
                      placeholder="Enter district"
                    />
                  </div>
                  <div>
                    <Label htmlFor="constituency">Constituency</Label>
                    <Input
                      id="constituency"
                      value={formData.constituency}
                      onChange={(e) => handleInputChange("constituency", e.target.value)}
                      placeholder="Enter constituency"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">PIN Code</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                      placeholder="XXXXXX"
                      maxLength={6}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Update Information
              </Button>
            </div>
          </form>
        )}

        {!isVerified && voterID && (
          <div className="text-center py-8 text-muted-foreground">
            Enter a valid 10-digit Voter ID to proceed with updates
          </div>
        )}
      </CardContent>
    </Card>
  );
}