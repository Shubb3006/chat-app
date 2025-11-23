import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthstore } from "./store/useAuthstore";

import { Toaster } from "react-hot-toast";

import { Loader } from "lucide-react";
import SettingPage from "./pages/SettingPage";
import { useThemestore } from "./store/useThemestore";

function App() {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthstore();
  const { theme } = useThemestore();

  console.log(onlineUsers);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-base-100 flex flex-col" data-theme={theme}>
      <Toaster />
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route path="/settings" element={<SettingPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
