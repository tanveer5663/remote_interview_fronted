import axiosInstance from "../lib/axios";

export const authApi = {
  signUp: async (data) => {
    const response = await axiosInstance.post("/auth/signup", data);

    return response.data;
  },

  signIn: async (data) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  },
  checkAuth: async () => {
    const response = await axiosInstance.get("/auth/check-auth");
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },
};
