import storage from "./storage";

const TOKEN_KEY = "admin_access_token";

export const getToken = () => {
  return storage.get(TOKEN_KEY);
};

export const setToken = (token) => {
  storage.set(TOKEN_KEY, token);
};

export const removeToken = () => {
  storage.remove(TOKEN_KEY);
};
