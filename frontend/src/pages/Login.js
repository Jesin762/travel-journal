import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";
import bgImage from "../assets/login.jpg";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ CORRECT JWT LOGIN ENDPOINT
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Save tokens
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        // ✅ Fetch profile
        const profileRes = await fetch("http://127.0.0.1:8000/api/profile/", {
          headers: {
            Authorization: `Bearer ${data.access}`,
          },
        });

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setUser(profileData);
          navigate("/");
        } else {
          setError("Failed to fetch profile.");
        }

        setUsername("");
        setPassword("");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const backgroundStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
  };

  return (
    <div style={backgroundStyle} className="page-overlay">
      <nav className="simple-navbar">
        <div className="nav-container">
          <Link to="/" className="brand">
            Travel Journal
          </Link>
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="login-container">
        <div className="card">
          <h2>Login</h2>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="links">
            Don’t have an account? <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
