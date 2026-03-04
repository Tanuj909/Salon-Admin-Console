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
