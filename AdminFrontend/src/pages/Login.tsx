import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Vote, Mail, RefreshCw, ArrowRight, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AdminAuthContext } from "../contexts/AdminAuthContext"; // 👈 import your context
import heroImage from "@/assets/blockvote-hero.jpg";

export default function Login() {
  const [name, setName] = useState(""); // 👈 backend requires name too
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");

  const navigate = useNavigate();
  const auth = useContext(AdminAuthContext);

  if (!auth) {
    throw new Error("AdminAuthContext must be used within AdminAuthProvider");
  }

  const { loginRequest, verifyOtp, loading, error, isAuthenticated } = auth;

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginRequest(name, email, password);
    setStep("otp"); // move to OTP step if no error
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyOtp(email, otp);
    if (!error) {
      navigate("/dashboard"); // redirect after successful login
    }
  };

  const handleResendOTP = async () => {
    await loginRequest(name, email, password); // re-send OTP
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Hero Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6 p-4">
        {/* Logo and Branding */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
            <Vote className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient">BlockVote India</h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Flag className="w-4 h-4 text-primary" />
            Secure Election Management System
          </p>
        </div>

        {/* Login Card */}
        <Card className="card-elegant shadow-medium">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {step === "email" ? "Login to Dashboard" : "Verify OTP"}
            </CardTitle>
            <CardDescription>
              {step === "email"
                ? "Enter your credentials to receive a secure OTP"
                : `We've sent a 6-digit OTP to ${email}`}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === "email" ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="form-label">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Admin Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="form-label">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@blockvote.gov.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 form-input"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="form-label">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <Button type="submit" className="w-full btn-hero" disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="form-label">
                    6-Digit OTP
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="form-input text-center text-lg tracking-wider"
                    maxLength={6}
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      "Resend OTP"
                    )}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 btn-hero"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep("email")}
                  className="w-full text-sm"
                  disabled={loading}
                >
                  ← Change Email Address
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          © 2024 BlockVote India. Powered by secure blockchain technology.
        </p>
      </div>
    </div>
  );
}
