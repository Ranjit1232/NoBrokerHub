import React from "react";
import { useNavigate } from "react-router-dom";
import "./../adminpagestyle/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="admin-dashboard">

      {/* Navbar */}
      <nav className="admin-navbar">

        <div className="admin-logo">
          ZERO BROKER
        </div>

        <div className="admin-nav-links">
          <button onClick={() => navigate("/admin-dashboard")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/admin/users")}>
            Users
          </button>

          <button onClick={() => navigate("/admin/owners")}>
            Owners
          </button>

          <button onClick={() => navigate("/admin/properties")}>
            Properties
          </button>

          <button onClick={() => navigate("/admin/complaints")}>
            Complaints
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>

      </nav>

      {/* Dashboard Content */}
      <div className="admin-content">

        <h1>Admin Dashboard</h1>

        <p className="admin-subtitle">
          Manage users, owners, properties and complaints
        </p>

        <div className="admin-cards">

          <div
            className="admin-card"
            onClick={() => navigate("/admin/users")}
          >
            <h2>👤</h2>
            <h3>Manage Users</h3>
            <p>View and manage registered users.</p>
            <button>View Users</button>
          </div>

          <div
            className="admin-card"
            onClick={() => navigate("/admin/owners")}
          >
            <h2>🏠</h2>
            <h3>Manage Owners</h3>
            <p>View and manage property owners.</p>
            <button>View Owners</button>
          </div>

          <div
            className="admin-card"
            onClick={() => navigate("/admin/properties")}
          >
            <h2>🏢</h2>
            <h3>Manage Properties</h3>
            <p>View all properties listed on ZeroBroker.</p>
            <button>View Properties</button>
          </div>

          <div
            className="admin-card"
            onClick={() => navigate("/admin/complaints")}
          >
            <h2>📢</h2>
            <h3>Manage Complaints</h3>
            <p>View and resolve user complaints.</p>
            <button>View Complaints</button>
          </div>

        </div>

      </div>

      {/* Footer */}
      <footer className="admin-footer">
        <p>© 2026 ZeroBroker. All Rights Reserved.</p>
      </footer>

    </div>
  );
}

export default AdminDashboard;

