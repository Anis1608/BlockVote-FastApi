import React, { useState, createContext } from "react";

export const SuperAdminLogContext = createContext();

const host = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", host);

const SuperAdminLogState = (props) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  // get all admins
const getlogs = async () => {
  try {
    setLoading(true);
    const response = await fetch(`${host}/api/super_admin/logs`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Logs");
    }

    const data = await response.json(); 
    console.log("Fetched logs context:", data);

    // ✅ data is already an array
    return Array.isArray(data) ? data : [];
  } catch (err) {
    setMessage(err.message);
    return [];
  } finally {
    setLoading(false);
  }
};

  return (
    <SuperAdminLogContext.Provider
      value={{
        getlogs,
        loading,
        message,    
      }}
    >
      {props.children}
    </SuperAdminLogContext.Provider>

  );
};

export default SuperAdminLogState;
