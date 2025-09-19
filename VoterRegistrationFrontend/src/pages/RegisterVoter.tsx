import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Phone, MapPin, Calendar, IdCard } from "lucide-react";

export function RegisterVoterForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    aadharNumber: "",
    address: "",
    state: "",
    district: "",
    constituency: "",
    pincode: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Send OTP API
  const sendOtp = async () => {
    if (!formData.email) return alert("Please enter email");
    try {
      setLoading(true);
      await axios.post("/voter/send_otp", { email: formData.email });
      setOtpSent(true);
      alert("OTP sent to your email");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP API
  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    try {
      setLoading(true);
      await axios.post("/voter/verify_otp", { email: formData.email, otp });
      setOtpVerified(true);
      alert("OTP verified! You can now register.");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  // Register voter API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpVerified) return alert("Please verify OTP first");

    try {
      setLoading(true);
      const payload = {
        name: formData.fullName,
        father_name: formData.fatherName,
        mother_name: formData.motherName,
        email: formData.email,
        aadhaar: formData.aadharNumber,
        voter_dob: formData.dateOfBirth,
        voters_state: formData.state,
        voters_city: formData.constituency,
        voters_district: formData.district,
        phone: formData.phone,
        address: formData.address,
        pincode: formData.pincode,
        gender: formData.gender,
      };

      const res = await axios.post("/voter/register", payload);
      alert(`Voter registered! ID: ${res.data.voter_id}`);

      // Reset form
      setFormData({
        fullName: "",
        fatherName: "",
        motherName: "",
        dateOfBirth: "",
        gender: "",
        phone: "",
        email: "",
        aadharNumber: "",
        address: "",
        state: "",
        district: "",
        constituency: "",
        pincode: "",
      });
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to register voter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <IdCard className="h-6 w-6 text-primary" />
          Register for Voter ID
        </CardTitle>
        <CardDescription>
          Register yourself to get your Digital Voter ID for Indian Elections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email & OTP Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your@email.com"
                required
                disabled={otpSent}
              />
            </div>
            <div className="flex gap-2 items-end">
              {!otpSent ? (
                <Button
                  type="button"
                  onClick={sendOtp}
                  disabled={loading || !formData.email}
                >
                  Send OTP
                </Button>
              ) : (
                <>
                  <Input
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={verifyOtp}
                    disabled={loading || otpVerified}
                  >
                    Verify OTP
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="fatherName">Father's Name *</Label>
                <Input
                  id="fatherName"
                  value={formData.fatherName}
                  onChange={(e) =>
                    handleInputChange("fatherName", e.target.value)
                  }
                  placeholder="Enter father's name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="motherName">Mother's Name *</Label>
                <Input
                  id="motherName"
                  value={formData.motherName}
                  onChange={(e) =>
                    handleInputChange("motherName", e.target.value)
                  }
                  placeholder="Enter mother's name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="aadharNumber">Aadhar Number *</Label>
                <Input
                  id="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={(e) =>
                    handleInputChange("aadharNumber", e.target.value)
                  }
                  placeholder="XXXX-XXXX-XXXX"
                  maxLength={12}
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  required
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
                <Label htmlFor="address">Full Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="House No., Street, Area, City"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => handleInputChange("state", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="andhra-pradesh">
                        Andhra Pradesh
                      </SelectItem>
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
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) =>
                      handleInputChange("district", e.target.value)
                    }
                    placeholder="Enter district"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="constituency">Constituency *</Label>
                  <Input
                    id="constituency"
                    value={formData.constituency}
                    onChange={(e) =>
                      handleInputChange("constituency", e.target.value)
                    }
                    placeholder="Enter constituency"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">PIN Code *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) =>
                      handleInputChange("pincode", e.target.value)
                    }
                    placeholder="XXXXXX"
                    maxLength={6}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Register Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={!otpVerified || loading}
            >
              <IdCard className="mr-2 h-4 w-4" />
              Register Voter ID
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
