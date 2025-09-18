import api from "./api";

export const authAPI = {
  login: (email, password) => {
    return api.post("/auth/login", { email, password });
  },
  register: (email, password) => {
    return api.post("/auth/register", { email, password });
  },
  verifyToken: (token) => {
    return api.get("/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
