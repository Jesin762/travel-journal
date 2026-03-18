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

  useEffect(() => {
    fetchData();
  }, [username]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`profile/${username}/`);
      setFollowers(res.data.followers || []);
      setFollowing(res.data.following || []);
    } catch (err) {
      console.error(err);
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
    <div className="followers-wrapper">
      <div className="followers-container">

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

        <div className="followers-list">
          {usersToShow.length === 0 && (
            <p className="empty-text">
              No {activeTab} yet.
            </p>
          )}

          {usersToShow.map((user) => (
            <div
              key={user.id}
              className="follower-item"
              onClick={() =>
                navigate(`/user/${user.username}/journals`)
              }
            >
              <div className="avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>

              <div className="user-info">
                <h4>{user.username}</h4>
                <p>{user.bio || "Travel Explorer 🌍"}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default FollowersPage;