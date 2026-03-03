// import { createContext, useState } from "react";
// import { getToken, setToken, removeToken } from "@/utils/token";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setAuthToken] = useState(getToken());

//   // Initialize user from localStorage if available
//   const getInitialUser = () => {
//     try {
//       const storedUser = localStorage.getItem("admin_user");
//       return storedUser ? JSON.parse(storedUser) : null;
//     } catch (e) {
//       return null;
//     }
//   };
//   const [user, setUser] = useState(getInitialUser());

//   const login = (data) => {
//     const { accessToken, userId, role } = data;

//     setToken(accessToken);
//     setAuthToken(accessToken);

//     const userData = {
//       userId,
//       role,
//     };

//     setUser(userData);
//     localStorage.setItem("admin_user", JSON.stringify(userData));
//   };

//   const logout = () => {
//     removeToken();
//     localStorage.removeItem("admin_user");
//     setAuthToken(null);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ token, user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useState, useEffect } from "react";
import { getToken, setToken, removeToken } from "@/utils/token";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from localStorage if available
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = getToken();
      const storedUser = localStorage.getItem("admin_user");
      
      if (storedToken && storedUser) {
        try {
          setAuthToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (e) {
          // If user data is corrupted, clear everything
          removeToken();
          localStorage.removeItem("admin_user");
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (data) => {
    const { accessToken, userId, role } = data;

    setToken(accessToken);
    setAuthToken(accessToken);

    const userData = {
      userId,
      role,
    };

    setUser(userData);
    localStorage.setItem("admin_user", JSON.stringify(userData));
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem("admin_user");
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};