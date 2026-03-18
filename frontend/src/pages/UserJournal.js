import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/UserJournal.css";

function UserJournal() {

  const { username } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const [commentText, setCommentText] = useState({});
  const [openComments, setOpenComments] = useState({});

  const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchCurrentUser();
    fetchUserProfile();
  }, [username]);

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

    if (path.startsWith("http")) {
      return path;
    }

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

  const fetchUserProfile = async () => {

    try {

      const res = await axiosInstance.get(`api/profile/${username}/`);
      setProfile(res.data);

    } catch (err) {

      console.error(err);

    }

  };

  const handleFollow = async () => {

    try {

      await axiosInstance.post(`api/follow/${username}/`);
      fetchUserProfile();

    } catch (err) {

      console.error(err);

    }

  };

  const handleLike = async (id) => {

    try {

      await axiosInstance.post(`api/like/${id}/`);
      fetchUserProfile();

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

      fetchUserProfile();

    } catch (err) {

      console.error(err);

    }

  };

  if (!profile) return null;

  return (

    <div className="explore-wrapper">

      <div className="feed-column">

        {/* PROFILE CARD */}

        <div className="profile-card">

          <div className="profile-top">

            <div className="profile-avatar">
              {profile.image ? (
                <img
                  src={getImage(profile.image)}
                  alt="profile"
                  className="profile-img"
                />
              ) : (
                profile.username?.charAt(0).toUpperCase()
              )}
            </div>

            <div className="profile-info">

              <h2>{profile.username}</h2>

              <p className="profile-bio">
                {profile.bio || "Travel Blogger 🌍"}
              </p>

              <div className="profile-stats">

                <div>
                  <strong>{profile.journals?.length || 0}</strong>
                  <span>Posts</span>
                </div>

                <div>
                  <strong>{profile.followers_count || 0}</strong>
                  <span>Followers</span>
                </div>

                <div>
                  <strong>{profile.following_count || 0}</strong>
                  <span>Following</span>
                </div>

              </div>

              {profile.username !== currentUser && (

                <button
                  className={
                    profile.is_following
                      ? "following-btn"
                      : "follow-btn"
                  }
                  onClick={handleFollow}
                >

                  {profile.is_following ? "Following" : "Follow"}

                </button>

              )}

            </div>

          </div>

        </div>

        {/* USER JOURNALS */}

        {profile.journals?.map((journal) => (

          <div className="post-card" key={journal.id}>

            <div
              className="post-header"
              onClick={() =>
                navigate(`/user/${journal.username}/journals`)
              }
              style={{ cursor: "pointer" }}
            >

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
                    {journal.created_at
                      ? new Date(journal.created_at).toLocaleDateString()
                      : ""}

                  </p>

                </div>

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
                    <b>{c.username}</b>: {c.text}
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

export default UserJournal;