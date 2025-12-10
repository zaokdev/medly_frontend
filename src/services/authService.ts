import api from "../api/axiosInstance";

export const authService = {
  login: async (email: string, password: string) => {
    return await api.post("/auth/login", { email, password });
  },

  logout: async () => {
    // Es importante avisar al backend para que borre la entrada en Redis
    return await api.post("/auth/logout");
  },
  checkSession: async () => {
    return await api.get("/auth/verify");
  },
  register: async (userData: any) => {
    return await api.post("/auth/register", userData);
  },
};
