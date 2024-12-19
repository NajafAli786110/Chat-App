import { create } from "zustand";
import { axiosInstance } from "../lib/Axios";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

const useAuthStore = create((set, get) => ({
  user: null,
  isCheckingAuth: true,
  isSignningUp: false,
  isLoggingUp: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ user: res.data.user });
      get().connectSocket();
    } catch (error) {
      // toast.error(error.response.data.message);
      console.log("Error while checking auth", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSignningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ user: res.data });
      get().connectSocket();
      toast.success("Account create successfully");
    } catch (error) {
      toast.error("Error while creating User", error.response.data.message);
    } finally {
      set({ isSignningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingUp: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ user: res.data.user });
      get().connectSocket();
      toast.success("User Login successfully");
      set({ isLoggingUp: false });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingUp: false });
    }
  },

  logout: async () => {
    try {
      set({ user: null });
      await axiosInstance.post("/auth/logout");
      get().disconnectSocket();
      toast.success("User Logout successfully");
    } catch (error) {
      toast.error("Error while Logging out!..");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.post("/auth/update-profile", data, {
        withCredentials: true,
      });
      set({ user: res.data.user });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Error while updating profile", error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { user } = get();
    if (!user || get().socket?.connected) {
      return;
    }
    try {
      const socket = io(BASE_URL, {
        query: {
          userId: user._id,
        },
      });
      socket.connect();
      set({ socket });
      socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
      });
    } catch (error) {
      console.log("Error while connecting socket", error);
    }
  },
  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
}));

export default useAuthStore;
