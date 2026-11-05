import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../ownerpagestyle/OwnerProfile.css';
import '../style/CommonNavbar.css';

function OwnerProfile() {
  const navigate = useNavigate();

  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!userId || !token) {
      setError('Owner is not logged in.');
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/users/profile/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch owner profile');
        }

        return response.json();
      })
      .then((data) => {
        setOwner(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError('Unable to load profile.');
        setLoading(false);
      });
  }, [userId, token]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('roleName');
    localStorage.removeItem('token');

    navigate('/');
  };

  // Loading
  if (loading) {
    return (
      <div className="owner-profile-page">
        <nav className="dashboard-navbar">
          <div className="dashboard-logo">
            ZERO BROKER
          </div>
        </nav>

        <div className="owner-profile-message">
          Loading profile...
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="owner-profile-page">
        <nav className="dashboard-navbar">
          <div className="dashboard-logo">
            ZERO BROKER
          </div>
        </nav>

        <div className="owner-profile-message owner-profile-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="owner-profile-page">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="dashboard-logo">
          ZERO BROKER
        </div>

        <div className="dashboard-menu">
          <button
            onClick={() => navigate('/owner-dashboard')}
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate('/owner/add-property')}
          >
            Add Property
          </button>

          <button
            onClick={() => navigate('/owner/my-properties')}
          >
            My Properties
          </button>

          <button
            onClick={() => navigate('/owner/interested-users')}
          >
            Interested Users
          </button>

          <button className="active">
            Profile
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Profile Section */}
      <section className="owner-profile-section">
        <div className="owner-profile-card">
          {/* Profile Header */}
          <div className="owner-profile-header">
            <div className="owner-profile-avatar">
              👤
            </div>

            <div>
              <h1>{owner.fullName}</h1>
              <p>Property Owner</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="owner-profile-info">
            <div className="owner-profile-item">
              <span className="owner-profile-icon">
                👤
              </span>

              <div>
                <strong>Full Name</strong>
                <p>{owner.fullName}</p>
              </div>
            </div>

            <div className="owner-profile-item">
              <span className="owner-profile-icon">
                📧
              </span>

              <div>
                <strong>Email</strong>
                <p>{owner.email}</p>
              </div>
            </div>

            <div className="owner-profile-item">
              <span className="owner-profile-icon">
                📱
              </span>

              <div>
                <strong>Phone</strong>
                <p>{owner.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="owner-profile-item">
              <span className="owner-profile-icon">
                📍
              </span>

              <div>
                <strong>City</strong>
                <p>{owner.city || 'Not provided'}</p>
              </div>
            </div>

            <div className="owner-profile-item">
              <span className="owner-profile-icon">
                🏷️
              </span>

              <div>
                <strong>Role</strong>
                <p>OWNER</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="owner-profile-actions">
            <button
              className="owner-profile-back-button"
              onClick={() => navigate('/owner-dashboard')}
            >
              ← Back to Dashboard
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

export default OwnerProfile;
