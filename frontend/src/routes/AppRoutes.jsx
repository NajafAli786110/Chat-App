import React from "react";
import Navbar from "../components/Navbar";
import { Homepage, Signup, Login, Setting, Profile } from "../pages";
import { Navigate, Route, Routes } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const AppRoutes = () => {
  const { user } = useAuthStore();
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={user ? <Homepage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route path="/setting" element={<Setting />} />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
