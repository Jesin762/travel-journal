import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/FollowersPage.css";

function FollowersPage({ darkMode }) {
  const { username } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("followers");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://127.0.0.1:8000";

  const getImage = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${BASE_URL}${path}`;
  };

  useEffect(() => {
    fetchConnections();
  }, [username]);

  const fetchConnections = async () => {
    setLoading(true);

    try {
      let res;

      if (username) {
        // View other user connections
        res = await axiosInstance.get(`api/profile/${username}/connections/`);
      } else {
        // Logged-in user connections
        const profile = await axiosInstance.get("api/profile/");
        res = await axiosInstance.get(
          `api/profile/${profile.data.username}/connections/`
        );
      }

      setFollowers(res.data.followers || []);
      setFollowing(res.data.following || []);
    } catch (err) {
      console.error("Error loading connections:", err);
    } finally {
      setLoading(false);
    }
  };

  const usersToShow =
    activeTab === "followers" ? followers : following;

  if (loading) {
    return (
      <div className="followers-wrapper">
        Loading...
      </div>
    );
  }

  return (
    <div className={`followers-wrapper ${darkMode ? "dark" : ""}`}>
      <div className="followers-container">

        {/* Back Button */}
        <div className="followers-top">
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>

        {/* Tabs */}
        <div className="followers-header">

          <button
            className={activeTab === "followers" ? "active" : ""}
            onClick={() => setActiveTab("followers")}
          >
            Followers ({followers.length})
          </button>

          <button
            className={activeTab === "following" ? "active" : ""}
            onClick={() => setActiveTab("following")}
          >
            Following ({following.length})
          </button>

        </div>

        {/* List */}
        <div className="followers-list">

          {usersToShow.length === 0 && (
            <p className="empty-text">
              No {activeTab} yet.
            </p>
          )}

          {usersToShow.map((user, index) => {

            const usernameValue = user?.username || "Unknown";

            const bioValue =
              user?.bio && user.bio.trim() !== ""
                ? user.bio
                : "Travel Blogger 🌍";

            const imageValue = user?.image;

            return (
              <div
                key={index}
                className="follower-item"
                onClick={() =>
                  navigate(`/user/${usernameValue}/journals`)
                }
              >

                {/* Profile Image */}
                {imageValue ? (
                  <img
                    src={getImage(imageValue)}
                    alt="profile"
                    className="avatar-img"
                  />
                ) : (
                  <div className="avatar">
                    {usernameValue.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="user-info">
                  <h4>{usernameValue}</h4>
                  <p>{bioValue}</p>
                </div>

              </div>
            );
          })}

        </div>

      </div>
    </div>
  );
}

export default FollowersPage;