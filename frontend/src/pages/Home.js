import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axiosInstance from "../axiosInstance";
import "../styles/Home.css";

function Home({ user }) {
  const [journals, setJournals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const res = await axiosInstance.get("api/journals/");
      setJournals(res.data);
    } catch (err) {
      console.log("Error fetching journals:", err);
    }
  };

  // ✅ Always limit to 6 latest journals
  const displayedJournals = journals.slice(0, 6);

  // ✅ Handle journal click
  const handleJournalClick = () => {
    if (user) {
      navigate("/explore");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container text-center hero-content">
          <h1>Turn Your Journeys Into Stories</h1>
          <p>Write • Capture • Share your travel experiences</p>

          {user ? (
            <Link to="/explore" className="btn btn-warning btn-lg mt-3">
              Start Your Journal
            </Link>
          ) : (
            <Link to="/login" className="btn btn-warning btn-lg mt-3">
              Get Started
            </Link>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-5 about-section">
        <div className="container text-center">
          <h2 className="mb-3">Why Travel Journal?</h2>
          <p>
            Travel Journal helps you document your adventures, preserve
            memories, and inspire others through your travel stories.
          </p>
        </div>
      </section>

      {/* LATEST JOURNALS */}
      <section className="py-5 journals-section">
        <div className="container">
          <h2 className="text-center mb-4">Latest Travel Journals</h2>

          <div className="row g-4">
            {displayedJournals.length > 0 ? (
              displayedJournals.map((journal) => (
                <div className="col-md-4" key={journal.id}>
                  <div
                    className="card shadow h-100 journal-card-clickable"
                    onClick={handleJournalClick}
                    style={{ cursor: "pointer" }}
                  >
                    {journal.image && (
                      <img
                        src={journal.image}
                        className="card-img-top"
                        alt={journal.title}
                      />
                    )}

                    <div className="card-body">
                      <h5 className="card-title">{journal.title}</h5>
                      <p className="journal-location">{journal.location}</p>
                      <p className="card-text">
                        {journal.blog.slice(0, 120)}...
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No journals added yet.</p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;