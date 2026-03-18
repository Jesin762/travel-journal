import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AboutPage.css";

function AboutPage({ darkMode }) {
  const navigate = useNavigate();

  return (
    <div className="about-wrapper">
      <div className="about-container">

        <h1 className="fade-in">🌍 Travel Journal</h1>

        <p className="slide-up">
          Travel Journal is a social travel blogging platform where users can
          share their journeys, explore destinations, follow other travelers,
          and document unforgettable memories.
        </p>

        <div className="features-grid fade-in">
          <div className="feature-card">
            ✍️ Create & Edit Travel Journals
          </div>
          <div className="feature-card">
            ❤️ Like & Comment on Posts
          </div>
          <div className="feature-card">
            👥 Follow & Connect with Travelers
          </div>
          <div className="feature-card">
            🌙 Dark & Light Mode Support
          </div>
        </div>

        <div className="about-buttons">
          <button onClick={() => navigate("/contact")}>
            Contact Us
          </button>

          <button onClick={() => navigate("/privacy")}>
            Privacy Policy
          </button>

          <button onClick={() => navigate("/terms")}>
            Terms & Conditions
          </button>
        </div>

      </div>
    </div>
  );
}

export default AboutPage;