import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import "../styles/EditProfile.css";

function EditProfile() {
  const [formData, setFormData] = useState({ username: "", bio: "" });
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("api/profile/"); // ✅ Matches /api/profile/
      setFormData({
        username: res.data.username || "",
        bio: res.data.bio || "",
      });
      if (res.data.image) {
        setPreviewImage(`http://127.0.0.1:8000${res.data.image}`);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setMessage("Failed to load profile");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const data = new FormData();
    data.append("username", formData.username);
    data.append("bio", formData.bio);
    if (image) data.append("image", image);

    try {
      // ✅ PATCH request (backend accepts PUT/PATCH)
      await axiosInstance.patch("credentials/api/profile/edit/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div className="edit-profile-wrapper">
      <div className="edit-profile-card">
        <h2>Edit Profile</h2>

        {message && (
          <div
            className={`message ${
              message.includes("successfully") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="profile-preview">
            {previewImage ? (
              <img src={previewImage} alt="preview" />
            ) : (
              <div className="profile-placeholder">No Image</div>
            )}
          </div>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <textarea
            name="bio"
            placeholder="Your bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;