import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../ownerpagestyle/OwnerDashboard.css';
import '../style/CommonNavbar.css';

function OwnerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="owner-dashboard-page">

      {/* Navbar */}
      <nav className="dashboard-navbar">

        <div className="dashboard-logo">
          ZERO BROKER
        </div>

        <div className="dashboard-menu">

          <button className="active">
            Dashboard
          </button>

          <button onClick={() => navigate('/owner/add-property')}>
            Add Property
          </button>

          <button onClick={() => navigate('/owner/my-properties')}>
            My Properties
          </button>

          <button onClick={() => navigate('/owner/interested-users')}>
            Interested Users
          </button>

          {/* Profile */}
          <button onClick={() => navigate('/owner/profile')}>
            Profile
          </button>

          <button onClick={() => navigate('/')}>
            Logout
          </button>

        </div>

      </nav>

      {/* Welcome Section */}
      <section className="owner-welcome">

        <div>
          <h1>Welcome, Owner 👋</h1>

          <p>
            Manage your properties easily without a broker.
          </p>
        </div>

        <div className="owner-welcome-icon">
          🏠
        </div>

      </section>

      {/* Quick Actions */}
      <section className="owner-section">

        <h2>Quick Actions</h2>

        <div className="owner-quick-actions">

          {/* Add Property */}
          <div
            className="owner-action-card"
            onClick={() => navigate('/owner/add-property')}
          >
            <div className="owner-action-icon">
              ➕
            </div>

            <h3>Add Property</h3>

            <p>
              Add a new property for users to view.
            </p>

            <button>
              Add Property
            </button>
          </div>

          {/* My Properties */}
          <div
            className="owner-action-card"
            onClick={() => navigate('/owner/my-properties')}
          >
            <div className="owner-action-icon">
              🏠
            </div>

            <h3>My Properties</h3>

            <p>
              View and manage your listed properties.
            </p>

            <button>
              View Properties
            </button>
          </div>

          {/* Update Property */}
          <div
            className="owner-action-card"
            onClick={() => navigate('/owner/my-properties')}
          >
            <div className="owner-action-icon">
              ✏️
            </div>

            <h3>Update Property</h3>

            <p>
              Update your property information.
            </p>

            <button>
              Update Property
            </button>
          </div>

          {/* Delete Property */}
          <div
            className="owner-action-card"
            onClick={() => navigate('/owner/my-properties')}
          >
            <div className="owner-action-icon">
              🗑️
            </div>

            <h3>Delete Property</h3>

            <p>
              Remove your property from the platform.
            </p>

            <button>
              Delete Property
            </button>
          </div>

          {/* Interested Users */}
          <div
            className="owner-action-card"
            onClick={() => navigate('/owner/interested-users')}
          >
            <div className="owner-action-icon">
              👥
            </div>

            <h3>Interested Users</h3>

            <p>
              View users interested in your properties.
            </p>

            <button>
              View Users
            </button>
          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="dashboard-footer">

        <p>
          © 2026 ZeroBroker. Find your home without a broker.
        </p>

      </footer>

    </div>
  );
}

export default OwnerDashboard;

