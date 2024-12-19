import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import useAuthStore from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, user, isCheckingAuth } = useAuthStore();  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !user)
    return (
      <div className="flex flex-col justify-center items-center h-screen z-50">
        <Loader className="size-10 animate-spin text-white" />
      </div>
    );

  return (
    <>
      <Toaster />
      <AppRoutes />
    </>
  );
}

export default App;
