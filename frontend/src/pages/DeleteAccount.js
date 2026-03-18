import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/DeleteAccount.css";

function DeleteAccount({ darkMode }) {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!window.confirm("Are you sure you want to permanently delete your account?")) {
      return;
    }

    try {

      const res = await axiosInstance.post(
        "credentials/api/delete-account/",
        form
      );

      setMessage(res.data.message);

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
    <div className={`delete-wrapper ${darkMode ? "dark-mode" : ""}`}>

      <Navbar />

      <div className="delete-card">

        <button
          className="back-btn"
          onClick={() => navigate("/profile")}
        >
          ← Back to Profile
        </button>

        <h2>Delete Account</h2>

        <p className="warning">
          This action cannot be undone.
        </p>

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleDelete}>

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
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className="delete-btn">
            Confirm Delete
          </button>

        </form>

      </div>

    </div>
  );
}

export default DeleteAccount;