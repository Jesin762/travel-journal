import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Explore from "./pages/Explore";
import WriteJournal from "./pages/WriteJournal";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import UserJournals from "./pages/UserJournal";
import FollowersPage from "./pages/FollowersPage";
import AboutPage from "./pages/AboutPage";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import DeleteAccount from "./pages/DeleteAccount";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ NEW
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Restore user on refresh
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        setUser(null);
        setLoading(false); // ✅ IMPORTANT
        return;
      }

      try {
        const res = await fetch("https://travel-journal-rkzk.onrender.com/api/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem("access");
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setUser(null);
      }

      setLoading(false); // ✅ IMPORTANT
    };

    fetchProfile();
  }, []);

  // ✅ Prevent route rendering until auth checked
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <BrowserRouter>
        <Navbar
          user={user}
          setUser={setUser}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />

          {/* Protected Routes */}
          <Route
            path="/explore"
            element={
              <ProtectedRoute user={user}>
                <Explore />
              </ProtectedRoute>
            }
          />
          <Route
            path="/write"
            element={
              <ProtectedRoute user={user}>
                <WriteJournal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/write/:id"
            element={
              <ProtectedRoute user={user}>
                <WriteJournal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <Profile darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/:username/journals"
            element={
              <ProtectedRoute user={user}>
                <UserJournals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/connections"
            element={
              <ProtectedRoute user={user}>
                <FollowersPage darkMode={darkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute user={user}>
                <AboutPage darkMode={darkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute user={user}>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute user={user}>
                <ChangePassword darkMode={darkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delete-account"
            element={
              <ProtectedRoute user={user}>
                <DeleteAccount darkMode={darkMode} setUser={setUser} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;