import { create } from "zustand";
import { axiosInstance } from "../lib/Axios";
import { toast } from "react-hot-toast";

const useAuthStore = create((set) => ({
  user: null,
  isCheckingAuth: true,
  isSignningUp: false,
  isLoggingUp: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ user: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.response.data.message);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSignningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ user: res.data });
      toast.success("Account create successfully");
    } catch (error) {
      toast.error("Error while creating User", error.response.data.message);
    } finally {
      set({ isSignningUp: false });
    }
  },

  logout: async () => {
    try {
      set({ user: null });
      await axiosInstance.post("/auth/logout");
      toast.success("User Logout successfully");
    } catch (error) {
      toast.error("Error while Logging out!..");
    }
  },
}));

export default useAuthStore;
