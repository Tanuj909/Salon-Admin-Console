// const TOKEN_KEY = "admin_token";

// export const getToken = () => {
//   return localStorage.getItem(TOKEN_KEY);
// };

// export const setToken = (token) => {
//   localStorage.setItem(TOKEN_KEY, token);
// };

// export const removeToken = () => {
//   localStorage.removeItem(TOKEN_KEY);
// };

const TOKEN_KEY = "admin_token";

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    removeToken();
  }
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Optional: Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiry;
  } catch (e) {
    return true;
  }
};