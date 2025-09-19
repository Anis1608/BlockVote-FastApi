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

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000";

export function RegisterVoterForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    dateOfBirth: "",
    gender: "",
    contact_number: "",
    email: "",
    aadharNumber: "",
    address: "",
    state: "",
    city: "",
    district: "",
    pincode: "",
    profilePhotoUrl: "",
    signatureUrl: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // Add file handlers at top of component
  const [files, setFiles] = useState<{ profile?: File; signature?: File }>({});

  const handleFileUpload = (
    file: File,
    field: "profilePhotoUrl" | "signatureUrl"
  ) => {
    setFiles((prev) => ({
      ...prev,
      [field === "profilePhotoUrl" ? "profile" : "signature"]: file,
    }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, [field]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Send OTP API
  const sendOtp = async () => {
    if (!formData.email) return alert("Please enter email");
    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}/api/voter/send_otp`, {
        email: formData.email,
      });
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
      await axios.post(`${BACKEND_URL}/api/voter/verify_otp`, {
        email: formData.email,
        otp,
      });
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

      const form = new FormData();
      form.append("name", formData.fullName);
      form.append("father_name", formData.fatherName);
      form.append("email", formData.email);
      form.append("aadhaar", formData.aadharNumber);
      form.append("voter_dob", formData.dateOfBirth);
      form.append("voters_state", formData.state);
      form.append("voters_city", formData.city);
      form.append("voters_district", formData.district);
      form.append("contact_number", formData.contact_number);
      form.append("pincode", formData.pincode);
      form.append("gender", formData.gender);

      // Attach files if available
      if (files.profile) {
        form.append("profile_picture", files.profile);
      }
      if (files.signature) {
        form.append("signature", files.signature);
      }

      const res = await axios.post(`${BACKEND_URL}/api/voter/register`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(`Voter registered! ID: ${res.data.voter_id}`);

      // Reset form
      setFormData({
        fullName: "",
        fatherName: "",
        dateOfBirth: "",
        gender: "",
        contact_number: "",
        email: "",
        aadharNumber: "",
        address: "",
        state: "",
        district: "",
        city: "",
        pincode: "",
        profilePhotoUrl: "",
        signatureUrl: "",
      });
      setFiles({});
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
                <Label htmlFor="contact_number">Contact Number *</Label>
                <Input
                  id="contact_number"
                  value={formData.contact_number}
                  onChange={(e) =>
                    handleInputChange("contact_number", e.target.value)
                  }
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
                      <SelectItem value="Andhra Pradesh">
                        Andhra Pradesh
                      </SelectItem>
                      <SelectItem value="Arunachal Pradesh">
                        Arunachal Pradesh
                      </SelectItem>
                      <SelectItem value="Assam">Assam</SelectItem>
                      <SelectItem value="Bihar">Bihar</SelectItem>
                      <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                      <SelectItem value="Goa">Goa</SelectItem>
                      <SelectItem value="Gujarat">Gujarat</SelectItem>
                      <SelectItem value="Haryana">Haryana</SelectItem>
                      <SelectItem value="Himachal Pradesh">
                        Himachal Pradesh
                      </SelectItem>
                      <SelectItem value="Jharkhand">Jharkhand</SelectItem>
                      <SelectItem value="Karnataka">Karnataka</SelectItem>
                      <SelectItem value="Kerala">Kerala</SelectItem>
                      <SelectItem value="Madhya Pradesh">
                        Madhya Pradesh
                      </SelectItem>
                      <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="Manipur">Manipur</SelectItem>
                      <SelectItem value="Meghalaya">Meghalaya</SelectItem>
                      <SelectItem value="Mizoram">Mizoram</SelectItem>
                      <SelectItem value="Nagaland">Nagaland</SelectItem>
                      <SelectItem value="Odisha">Odisha</SelectItem>
                      <SelectItem value="Punjab">Punjab</SelectItem>
                      <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                      <SelectItem value="Sikkim">Sikkim</SelectItem>
                      <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="Telangana">Telangana</SelectItem>
                      <SelectItem value="Tripura">Tripura</SelectItem>
                      <SelectItem value="Uttar Pradesh">
                        Uttar Pradesh
                      </SelectItem>
                      <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
                      <SelectItem value="West Bengal">West Bengal</SelectItem>

                      {/* Union Territories */}
                      <SelectItem value="Andaman and Nicobar Islands">
                        Andaman and Nicobar Islands
                      </SelectItem>
                      <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                      <SelectItem value="Dadra and Nagar Haveli and Daman and Diu">
                        Dadra and Nagar Haveli and Daman and Diu
                      </SelectItem>
                      <SelectItem value="Delhi (NCT)">Delhi (NCT)</SelectItem>
                      <SelectItem value="Jammu and Kashmir">
                        Jammu and Kashmir
                      </SelectItem>
                      <SelectItem value="Ladakh">Ladakh</SelectItem>
                      <SelectItem value="Lakshadweep">Lakshadweep</SelectItem>
                      <SelectItem value="Puducherry">Puducherry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Enter city"
                    required
                  />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Profile Photo */}
            <div>
              <Label>Profile Photo *</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "profilePhotoUrl");
                }}
              />
              {formData.profilePhotoUrl && (
                <img
                  src={formData.profilePhotoUrl}
                  alt="Profile Preview"
                  className="mt-2 w-24 h-24 rounded-full border object-cover"
                />
              )}
            </div>

            {/* Signature */}
            <div>
              <Label>Signature *</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "signatureUrl");
                }}
              />
              {formData.signatureUrl && (
                <img
                  src={formData.signatureUrl}
                  alt="Signature Preview"
                  className="mt-2 w-40 h-16 border object-contain"
                />
              )}
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
