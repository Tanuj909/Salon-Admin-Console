import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { getToken, setToken, removeToken } from "@/utils/token";
import storage from "@/utils/storage";
import { STORAGE_KEYS } from "@/utils/constants";
import { getMeApi } from "@/services/authService";
import { PushSubscriptionService } from "@/features/notifications/services/pushSubscriptionService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setAuthToken] = useState(() => getToken());
  const [user, setUser] = useState(() => storage.get(STORAGE_KEYS.USER));
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async (authToken) => {
    if (!authToken) {
      setIsLoading(false);
      return;
    }
    
    try {
      const userData = await getMeApi();
      setUser(userData);
      storage.set(STORAGE_KEYS.USER, userData);
    } catch (error) {
      console.error("Error fetching user session", error);
      // If 401, the interceptor will handle logout
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Restore session on mount
  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setIsLoading(false);
    }
  }, [token, fetchUser]);

  const login = async (data) => {
    const { accessToken, userId, role } = data;

    // 1. Store token
    setToken(accessToken);
    setAuthToken(accessToken);

    // 2. Set temporary user data
    const tempUserData = { userId, role };
    setUser(tempUserData);
    storage.set(STORAGE_KEYS.USER, tempUserData);

    // 3. Fetch full profile and update
    try {
      const fullInfo = await getMeApi();
      const updatedUser = { ...tempUserData, ...fullInfo };
      setUser(updatedUser);
      storage.set(STORAGE_KEYS.USER, updatedUser);
    } catch (error) {
      console.error("Error fetching full user info after login", error);
    }

    // 4. Trigger push subscription (non-blocking)
    PushSubscriptionService.subscribe().catch((err) =>
      console.warn("[Push] Auto-subscribe failed:", err.message)
    );
  };

  const logout = useCallback(() => {
    removeToken();
    storage.remove(STORAGE_KEYS.USER);
    setAuthToken(null);
    setUser(null);
    window.location.href = "/login";
  }, []);

  const value = useMemo(() => ({
    token,
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!token,
    role: user?.role
  }), [token, user, isLoading, logout]);

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};