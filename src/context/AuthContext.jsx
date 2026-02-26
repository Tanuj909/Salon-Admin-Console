import { createContext, useState } from "react";
import { getToken, setToken, removeToken } from "@/utils/token";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setAuthToken] = useState(getToken());
  const [user, setUser] = useState(null);

  const login = (data) => {
    const { accessToken, userId, role } = data;

    setToken(accessToken);
    setAuthToken(accessToken);

    setUser({
      userId,
      role,
    });
  };

  const logout = () => {
    removeToken();
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};