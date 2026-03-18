import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import "../styles/Explore.css";

function Explore() {

  const [journals, setJournals] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [currentUser, setCurrentUser] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchCurrentUser();
    fetchJournals();
  }, []);

  useEffect(() => {

    if (searchTerm.trim() === "") {
      setFilteredUsers([]);
      return;
    }

    const uniqueUsers = [
      ...new Map(journals.map((j) => [j.username, j])).values(),
    ];

    const filtered = uniqueUsers.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredUsers(filtered);

  }, [searchTerm, journals]);

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

  const getImage = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${BASE_URL}${path}`;
  };

  const handleAuthError = (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const fetchCurrentUser = async () => {

    try {
      const res = await axiosInstance.get("api/profile/");
      setCurrentUser(res.data.username);
    } catch (err) {
      handleAuthError(err);
    }

  };

  const fetchJournals = async () => {

    try {
      const res = await axiosInstance.get("api/journals/");
      setJournals(res.data);
    } catch (err) {
      handleAuthError(err);
    }

  };

  const handleFollow = async (username) => {

    try {
      await axiosInstance.post(`api/follow/${username}/`);
      fetchJournals();
    } catch (err) {
      console.error(err);
    }

  };

  const handleLike = async (id) => {

    try {
      await axiosInstance.post(`api/like/${id}/`);
      fetchJournals();
    } catch (err) {
      console.error(err);
    }

  };

  const handleComment = async (id) => {

    if (!commentText[id]) return;

    try {

      await axiosInstance.post(`api/comment/${id}/`, {
        text: commentText[id],
      });

      setCommentText({ ...commentText, [id]: "" });
      fetchJournals();

    } catch (err) {
      console.error(err);
    }

  };

  const handleDeleteComment = async (journalId, commentId) => {

    try {
      await axiosInstance.delete(`api/comment/delete/${commentId}/`);
      fetchJournals();
    } catch (err) {
      console.error(err);
    }

  };

  return (

    <div className="explore-wrapper">

      <div className="feed-column">

        {/* SEARCH */}
        <div className="search-container">

          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {filteredUsers.length > 0 && (

            <div className="search-results">

              {filteredUsers.map((user) => (

                <div
                  key={user.username}
                  className="search-item"
                  onClick={() => {
                    navigate(`/user/${user.username}/journals`);
                    setSearchTerm("");
                  }}
                >

                  {/* FIXED USER IMAGE */}
                  {user.user_image ? (

                    <img
                      src={getImage(user.user_image)}
                      alt="profile"
                      className="search-avatar-img"
                    />

                  ) : (

                    <div className="search-avatar">
                      {user.username.charAt(0).toUpperCase()}
                    </div>

                  )}

                  <span>{user.username}</span>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* JOURNAL FEED */}

        {journals.map((journal) => (

          <div className="post-card" key={journal.id}>

            <div
              className="post-header"
              onClick={() =>
                navigate(`/user/${journal.username}/journals`)
              }
              style={{ cursor: "pointer" }}
            >

              <div className="left-header">

                {/* FIXED JOURNAL USER IMAGE */}
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
                    📍 {journal.location || "Unknown location"} •{" "}
                    {journal.created_at
                      ? new Date(journal.created_at).toLocaleDateString()
                      : ""}
                  </p>

                </div>

              </div>

              {journal.username !== currentUser && (

                <button
                  className={
                    journal.is_following
                      ? "following-btn"
                      : "follow-btn"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollow(journal.username);
                  }}
                >

                  {journal.is_following ? "Following" : "Follow"}

                </button>

              )}

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

              <span onClick={() => handleLike(journal.id)}>
                ❤️ {journal.likes}
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

            {openComments[journal.id] && (

              <div className="comment-section">

                {journal.comments?.map((c) => (

                  <div key={c.id} className="comment-item">

                    <span>
                      <b>{c.username}</b>: {c.text}
                    </span>

                    {c.username === currentUser && (

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDeleteComment(journal.id, c.id)
                        }
                      >
                        ✖
                      </button>

                    )}

                  </div>

                ))}

                <div className="comment-input">

                  <input
                    type="text"
                    placeholder="Add comment..."
                    value={commentText[journal.id] || ""}
                    onChange={(e) =>
                      setCommentText({
                        ...commentText,
                        [journal.id]: e.target.value,
                      })
                    }
                  />

                  <button onClick={() => handleComment(journal.id)}>
                    Post
                  </button>

                </div>

              </div>

            )}

          </div>

        ))}

      </div>

    </div>

  );

}

export default Explore;