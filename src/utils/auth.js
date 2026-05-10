import { jwtDecode } from "jwt-decode";
import { getToken, removeToken } from "./token";
import storage from "./storage";
import { STORAGE_KEYS } from "./constants";

/**
 * Safely decode a JWT token.
 * Returns the decoded payload, or null if token is invalid/malformed.
 */
export const decodeToken = (token) => {
  try {
    if (!token || typeof token !== "string") return null;
    return jwtDecode(token);
  } catch {
    return null;
  }
};

/**
 * Check whether a decoded JWT payload is expired.
 * Returns true if expired or if `exp` claim is missing.
 */
export const isTokenExpired = (decoded) => {
  if (!decoded || !decoded.exp) return true;
  // exp is in seconds, Date.now() is in milliseconds
  return decoded.exp * 1000 < Date.now();
};

/**
 * Validate the stored JWT token.
 * Returns { valid: true, decoded } or { valid: false, reason }.
 */
export const validateToken = () => {
  const token = getToken();
  if (!token) return { valid: false, reason: "missing" };

  const decoded = decodeToken(token);
  if (!decoded) return { valid: false, reason: "malformed" };

  if (isTokenExpired(decoded)) return { valid: false, reason: "expired" };

  return { valid: true, decoded };
};

/**
 * Clear all auth-related data from storage.
 * Use this as the single source of truth for session teardown.
 */
export const clearAuthStorage = () => {
  removeToken();
  storage.remove(STORAGE_KEYS.USER);
};
