import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import { FaCog, FaMoon, FaSun, FaEllipsisV } from "react-icons/fa";
import "../styles/Profile.css";

function Profile({ darkMode, setDarkMode }) {

  const [profile, setProfile] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [currentUser, setCurrentUser] = useState("");

  const navigate = useNavigate();

  const BASE_URL = "http://127.0.0.1:8000";

  const getImage = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${BASE_URL}${path}`;
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAuthError = (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("api/profile/");
      setProfile(res.data);
      setCurrentUser(res.data.username);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (journalId) => {
    try {
      const res = await axiosInstance.post(`api/like/${journalId}/`);

      setProfile((prev) => ({
        ...prev,
        journals: prev.journals.map((j) =>
          j.id === journalId
            ? { ...j, likes: res.data.likes, liked: res.data.liked }
            : j
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (journalId) => {
    navigate(`/write/${journalId}`);
  };

  const handleDelete = async (journalId) => {
    if (!window.confirm("Delete this journal permanently?")) return;

    try {
      await axiosInstance.delete(`api/journals/${journalId}/delete/`);

      setProfile((prev) => ({
        ...prev,
        journals: prev.journals.filter((j) => j.id !== journalId),
      }));

      setOpenMenuId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (journalId) => {
    const text = commentText[journalId];
    if (!text) return;

    try {
      const res = await axiosInstance.post(`api/comment/${journalId}/`, {
        text,
      });

      setProfile((prev) => ({
        ...prev,
        journals: prev.journals.map((j) =>
          j.id === journalId
            ? { ...j, comments: [...j.comments, res.data] }
            : j
        ),
      }));

      setCommentText({ ...commentText, [journalId]: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (journalId, commentId) => {
    try {
      await axiosInstance.delete(`api/comment/delete/${commentId}/`);

      setProfile((prev) => ({
        ...prev,
        journals: prev.journals.map((j) =>
          j.id === journalId
            ? {
                ...j,
                comments: j.comments.filter((c) => c.id !== commentId),
              }
            : j
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const splitBlog = (text) => {
    if (!text) return [];

    const words = text.split(" ");
    const slides = [];
    let current = "";

    words.forEach((word) => {
      if ((current + word).length > 900) {
        slides.push(current);
        current = word + " ";
      } else {
        current += word + " ";
      }
    });

    if (current) slides.push(current);
    return slides;
  };

  if (loading) return <div className="explore-wrapper">Loading...</div>;
  if (!profile) return <div className="explore-wrapper">No profile found.</div>;

  return (
    <div className={`explore-wrapper ${darkMode ? "dark-theme" : ""}`}>
      <div className="feed-column">

        {/* PROFILE CARD */}
        <div className="profile-card small-profile">

          <div className="settings-container">
            <FaCog
              className="settings-icon"
              onClick={() => setShowSettings(!showSettings)}
            />

            {showSettings && (
              <div className="settings-card">

                <div
                  className="settings-item"
                  onClick={() => navigate("/edit-profile")}
                >
                  Edit Profile
                </div>

                <div
                  className="settings-item"
                  onClick={() => navigate("/change-password")}
                >
                  Change Password
                </div>

                <div
                  className="settings-item"
                  onClick={() => navigate("/delete-account")}
                >
                  Delete Account
                </div>

                {/* ABOUT US LINK */}
                <div
                  className="settings-item"
                  onClick={() => navigate("/about")}
                >
                  About Us
                </div>

                <div
                  className="settings-item toggle"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? <FaSun /> : <FaMoon />}
                  {darkMode ? " Light Mode" : " Dark Mode"}
                </div>

              </div>
            )}
          </div>

          <div className="profile-top">

            <div className="profile-avatar">
              {profile.image ? (
                <img
                  src={getImage(profile.image)}
                  alt="profile"
                  className="profile-img"
                />
              ) : (
                <div className="avatar-letter">
                  {profile.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="profile-info">
              <h2>{profile.username}</h2>

              <p className="profile-bio">
                {profile.bio || "Travel Blogger 🌍"}
              </p>

              <div className="profile-stats">

                <div>
                  <strong>{profile.journal_count}</strong>
                  <span>Posts</span>
                </div>

                <div
                  className="clickable"
                  onClick={() => navigate("/connections")}
                >
                  <strong>{profile.followers_count}</strong>
                  <span>Followers</span>
                </div>

                <div
                  className="clickable"
                  onClick={() => navigate("/connections")}
                >
                  <strong>{profile.following_count}</strong>
                  <span>Following</span>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* JOURNALS */}
        {profile.journals.map((journal) => (

          <div className="post-card" key={journal.id}>

            <div className="post-header">

              <div className="left-header">

                {journal.user_image ? (
                  <img
                    src={getImage(journal.user_image)}
                    alt="profile"
                    className="avatar-img"
                  />
                ) : (
                  <div className="avatar">
                    {journal.username?.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="user-info">

                  <h4>{journal.username}</h4>

                  <p className="meta-info">
                    📍 {journal.location || "Unknown"} •{" "}
                    {new Date(journal.created_at).toLocaleDateString()}
                  </p>

                </div>

              </div>

              <div className="menu-wrapper">

                <FaEllipsisV
                  className="menu-icon"
                  onClick={() =>
                    setOpenMenuId(
                      openMenuId === journal.id ? null : journal.id
                    )
                  }
                />

                {openMenuId === journal.id && (
                  <div className="menu-dropdown">
                    <div onClick={() => handleEdit(journal.id)}>Edit</div>
                    <div onClick={() => handleDelete(journal.id)}>Delete</div>
                  </div>
                )}

              </div>

            </div>

            <div className="swipe-container">

              {journal.image && (
                <div className="swipe-slide image-slide">
                  <img
                    src={getImage(journal.image)}
                    alt="journal"
                    className="responsive-image"
                  />
                </div>
              )}

              {journal.blog &&
                splitBlog(journal.blog).map((part, index) => (

                  <div className="swipe-slide blog-slide" key={index}>

                    {index === 0 && <h3>{journal.title}</h3>}

                    <p>{part}</p>

                  </div>

                ))}

            </div>

            <div className="post-footer">

              <span
                onClick={() => handleLike(journal.id)}
                style={{ cursor: "pointer" }}
              >
                {journal.liked ? "💔" : "❤️"} {journal.likes}
              </span>

              <span
                onClick={() =>
                  setOpenComments((prev) => ({
                    ...prev,
                    [journal.id]: !prev[journal.id],
                  }))
                }
              >
                💬 {journal.comments?.length || 0}
              </span>

            </div>

          </div>

        ))}

      </div>
    </div>
  );
}

export default Profile;