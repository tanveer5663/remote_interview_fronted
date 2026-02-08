import axiosInstance from "../lib/axios";

export const authApi = {
  signUp: async (data) => {
    const response = await axiosInstance.post("/auth/signup", data);

    return response.data;
  },

  signIn: async () => {
    const response = await axiosInstance.get("/auth/signin");
    return response.data;
  },
  checkAuth: async () => {
    const response = await axiosInstance.get("/auth/check-auth");
    return response.data;
  },

  logout: async (id) => {
    const response = await axiosInstance.get(`/auth/logout/${id}`);
    return response.data;
  },
};
