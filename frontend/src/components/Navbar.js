import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  // ✅ JWT Logout → Navigate to Home
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);

    // Redirect to Home page
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Travel Journal
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menu">
          <ul className="navbar-nav ms-auto align-items-lg-center">

            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/explore">Explore</Link>
            </li>

            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/write">Write</Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>

                <li className="nav-item">
                  <span className="nav-link text-warning fw-semibold">
                    Hi, {user.username}
                  </span>
                </li>

                <li className="nav-item">
                  <button
                    className="btn btn-outline-warning btn-sm ms-lg-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="btn btn-warning btn-sm ms-lg-2"
                    to="/register"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;