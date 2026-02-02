import axiosInstance from "../lib/axios";

export const authApi = {
  signUp: async (data) => {
    const response = await axiosInstance.post("/api/auth/signup", data);

    return response.data;
  },

  signIn: async () => {
    const response = await axiosInstance.get("/sessions/active");
    return response.data;
  },
  checkAuth: async () => {
    const response = await axiosInstance.get("/api/auth/check-auth");
    return response.data;
  },

  logout: async (id) => {
    const response = await axiosInstance.get(`/sessions/${id}`);
    return response.data;
  },
};
