import React, { useState, createContext , useEffect } from "react";

const SuperAdminAuthContext = createContext();

const host = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", host);

const SuperAdminAuthState = (props) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [superAdmin, setSuperAdmin] = useState(null);


// ... inside SuperAdminAuthState
useEffect(() => {
  fetchSuperAdmin(); // tries to restore session if cookies are valid
}, []);


  // ✅ Authentication is now based on context state
  const isAuthenticated = () => {
    return !!superAdmin;
  };

  // Register Super Admin
  const register_Super_admin = async (super_admin_id, username, email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${host}/api/super_admin/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          super_admin_id,
          username,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.detail || "Failed to Register");
      }

      setMessage(data.message || data.detail || "Registration successful!");
      return true;
    } catch (err) {
      setMessage(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Send OTP
  const Super_Admin_Login_Request = async (super_admin_id, email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${host}/api/super_admin/login-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ super_admin_id, email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.Success) {
        throw new Error(data.message || data.detail || "Failed to Send OTP");
      }
      setMessage(data.message || data.detail || "OTP sent successfully");
      return true;
    } catch (err) {
      setMessage(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP and login
  const Super_Admin_Login_verifyOtp = async (email, otp) => {
    setLoading(true);
    try {
      const res = await fetch(`${host}/api/super_admin/verify-login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
        credentials: "include", // cookies stay in browser
      });

      const data = await res.json();

      if (!res.ok || !data.Success) {
        throw new Error(data.message || data.detail || "Expired or Invalid OTP");
      }

      setMessage(data.message || data.detail || "Login successful!");
      await fetchSuperAdmin(); // ✅ populate state after login
      return true;

    } catch (err) {
      setMessage(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch logged-in Super Admin (checks auth from server)
  const fetchSuperAdmin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${host}/api/super_admin/get-details`, {
        method: "GET",
        credentials: "include", // cookies automatically sent
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.detail || "Failed to fetch super admin");
      }
      setSuperAdmin(data.data);
      setMessage(data.message || data.detail || "Super admin details fetched successfully");
      return true;
    } catch (err) {
      setMessage(err.message);
      setSuperAdmin(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout clears state
  const logout = () => {
    setSuperAdmin(null);
    setMessage("Logged out successfully");
  };

  return (
    <SuperAdminAuthContext.Provider
      value={{
        superAdmin,
        register_Super_admin,
        setSuperAdmin,
        Super_Admin_Login_Request,
        Super_Admin_Login_verifyOtp,
        fetchSuperAdmin,
        isAuthenticated, // ✅ based on state
        logout,
        loading,
        message,
      }}
    >
      {props.children}
    </SuperAdminAuthContext.Provider>
  );
};

export { SuperAdminAuthContext };
export default SuperAdminAuthState;
