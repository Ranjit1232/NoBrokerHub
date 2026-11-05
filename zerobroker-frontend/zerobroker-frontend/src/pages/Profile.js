
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Profile.css';

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    // Check login details
    if (!userId || !token) {
      setError('Please log in to view your profile.');
      setLoading(false);
      navigate('/login');
      return;
    }

    const controller = new AbortController();

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/users/profile/${encodeURIComponent(userId)}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
            signal: controller.signal,
          }
        );

        // Handle authentication errors
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('roleName');

          navigate('/login');
          throw new Error(
            'Your session has expired or access was denied. Please log in again.'
          );
        }

        if (!response.ok) {
          throw new Error(
            `Failed to fetch profile. Status: ${response.status}`
          );
        }

        const data = await response.json();

        if (!data || typeof data !== 'object') {
          throw new Error('Invalid profile data received from server.');
        }

        setProfile(data);
        setError('');
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }

        console.error('Profile fetch error:', err);
        setError(err.message || 'Unable to load profile');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      controller.abort();
    };
  }, [navigate]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('roleName');
    navigate('/');
  };

  return (
    <div className="profile-page">

      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="dashboard-logo">
          ZERO BROKER
        </div>

        <div className="dashboard-menu">
          <button onClick={() => navigate('/user-dashboard')}>
            Dashboard
          </button>

          <button onClick={() => navigate('/search-flats')}>
            Search Flats
          </button>

          <button onClick={() => navigate('/favorites')}>
            Favorites
          </button>

          <button onClick={() => navigate('/rental-requests')}>
            My Requests
          </button>

          <button className="active">
            Profile
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Profile Section */}
      <section className="profile-section">

        <h1>My Profile</h1>

        <p className="profile-subtitle">
          View your account information
        </p>

        {loading && (
          <p className="profile-message">
            Loading profile...
          </p>
        )}

        {error && (
          <p className="profile-error">
            {error}
          </p>
        )}

        {profile && !loading && (
          <div className="profile-card">

            <div className="profile-avatar">
              👤
            </div>

            <h2>{profile.fullName || 'N/A'}</h2>

            <div className="profile-details">

              <div className="profile-row">
                <span className="profile-label">
                  Full Name
                </span>

                <span className="profile-value">
                  {profile.fullName || 'N/A'}
                </span>
              </div>

              <div className="profile-row">
                <span className="profile-label">
                  Email
                </span>

                <span className="profile-value">
                  {profile.email || 'N/A'}
                </span>
              </div>

              <div className="profile-row">
                <span className="profile-label">
                  Phone
                </span>

                <span className="profile-value">
                  {profile.phone || 'N/A'}
                </span>
              </div>

              <div className="profile-row">
                <span className="profile-label">
                  City
                </span>

                <span className="profile-value">
                  {profile.city || 'N/A'}
                </span>
              </div>

              <div className="profile-row">
                <span className="profile-label">
                  Role
                </span>

                <span className="profile-value">
                  {profile.roleName || 'N/A'}
                </span>
              </div>

              <div className="profile-row">
                <span className="profile-label">
                  Account Status
                </span>

                <span
                  className={`profile-status ${
                    profile.status?.toLowerCase() || ''
                  }`}
                >
                  {profile.status || 'Unknown'}
                </span>
              </div>

            </div>

          </div>
        )}

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

export default Profile;
