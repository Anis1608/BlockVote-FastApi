// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext(null);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true); // 👈 add loading state

//   useEffect(() => {
//     const savedUser = localStorage.getItem('blockvote-user');
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//       setIsAuthenticated(true);
//     }
//     setLoading(false); // 👈 auth check complete
//   }, []);

//   const login = async (email, password) => {
//     if (email === 'admin@blockvote.in' && password === 'BlockVote@2024') {
//       const userData = { email, role: 'super_admin' };
//       setUser(userData);
//       setIsAuthenticated(true);
//       localStorage.setItem('blockvote-user', JSON.stringify(userData));
//       return true;
//     }
//     return false;
//   };

//   const logout = () => {
//     setUser(null);
//     setIsAuthenticated(false);
//     localStorage.removeItem('blockvote-user');
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
