import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/WriteJournal.css";

function WriteJournal() {
  const navigate = useNavigate();
  const { id } = useParams(); // 🔥 detect edit mode

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    blog: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  // ================= FETCH JOURNAL IF EDIT MODE =================
  useEffect(() => {
    if (id) {
      fetchJournal();
    }
  }, [id]);

  const fetchJournal = async () => {
    try {
      const res = await axiosInstance.get(`api/journals/`);
      const journal = res.data.find((j) => j.id === parseInt(id));

      if (journal) {
        setFormData({
          title: journal.title,
          location: journal.location,
          blog: journal.blog,
          image: null, // keep null unless user changes
        });
      }
    } catch (error) {
      console.error("Error fetching journal:", error);
    }
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ================= SUBMIT (CREATE OR UPDATE) =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("location", formData.location);
    data.append("blog", formData.blog);

    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (id) {
        // 🔥 UPDATE MODE
        await axiosInstance.put(`api/journals/${id}/update/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // 🔥 CREATE MODE
        await axiosInstance.post("api/journals/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/profile");
    } catch (error) {
      console.error("Error submitting journal:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="write-wrapper">
      <div className="write-card">
        <h3>
          {id ? "Edit Your Journal ✏️" : "Start Your Travel Journal ✍️"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Your Story</label>
            <textarea
              name="blog"
              rows="5"
              value={formData.blog}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Upload Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
            />
          </div>

          <button type="submit" className="publish-btn" disabled={loading}>
            {loading
              ? "Saving..."
              : id
              ? "Update Journal"
              : "Publish Journal"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default WriteJournal;