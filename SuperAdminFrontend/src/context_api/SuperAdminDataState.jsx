import React, { useState, createContext } from "react";

export const SuperAdminDataContext = createContext();

const host = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", host);

const SuperAdminDataState = (props) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

//   superAdmin creates admin 
  const createSuperAdmin = async (formdata) => {
    try {
      setLoading(true);
      const response = await fetch(`${host}/api/superadmin/create-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok || !data.Success) {
        throw new Error(data.message || data.detail || "Failed to create super admin");
      }
      setMessage(data.message || data.detail || " Admin created successfully");
      return true;
    } catch (err) {
      setMessage(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };






  return (
    <SuperAdminDataContext.Provider
      value={{
        createSuperAdmin,
        loading,
        message,
      }}
    >
      {props.children}
    </SuperAdminDataContext.Provider>
    
  );
};

export default SuperAdminDataState;


