import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/ChangePassword.css";

function ChangePassword({ darkMode }) {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (form.new_password !== form.confirm_password) {
      setError("New passwords do not match");
      return;
    }

    try {
      const res = await axiosInstance.post(
        "credentials/api/change-password/",
        form
      );

      setMessage(res.data.message || "Password changed successfully");

      // LOGOUT AFTER PASSWORD CHANGE
      localStorage.clear();

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong"
      );
    }
  };

  return (
    <div className={`change-wrapper ${darkMode ? "dark-mode" : ""}`}>

      <Navbar />

      <div className="change-card">

        {/* BACK BUTTON */}
        <button
          className="back-btn"
          onClick={() => navigate("/profile")}
        >
          ← Back to Profile
        </button>

        <h2>Change Password</h2>

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="current_password"
            placeholder="Current Password"
            value={form.current_password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="new_password"
            placeholder="New Password"
            value={form.new_password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            value={form.confirm_password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Change Password
          </button>

        </form>

      </div>

    </div>
  );
}

export default ChangePassword;