import React, { createContext, useState, ReactNode } from "react";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  loginRequest: (name: string, email: string, password: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => void;
}

export const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Send login request (triggers OTP email)
  const loginRequest = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:9000/api/admin/admin-login-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 👈 allow cookies
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Login request failed");

      alert("OTP sent to your email!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP (sets cookies in backend)
  const verifyOtp = async (email: string, otp: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:9000/api/admin/verify-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 👈 backend sets cookies
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "OTP verification failed");

      setIsAuthenticated(true);
      alert("Login successful ✅");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Logout (clear cookies client-side)
  const logout = () => {
    document.cookie = "access_token=; Max-Age=0; path=/;"; 
    document.cookie = "device_id=; Max-Age=0; path=/;";
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{ isAuthenticated, loading, error, loginRequest, verifyOtp, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
