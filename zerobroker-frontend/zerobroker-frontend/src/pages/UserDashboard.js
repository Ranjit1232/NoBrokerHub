import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/UserDashboard.css';

function UserDashboard() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get logged-in user details and JWT token
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // ==================================================
  // FETCH AVAILABLE PROPERTIES
  // ==================================================

  useEffect(() => {
    if (!userId || !token) {
      navigate('/user-auth');
      return;
    }

    fetch('http://localhost:8080/api/properties', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        return response.json();
      })
      .then((data) => {
        console.log('Properties received from backend:', data);

        setProperties(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching properties:', error);

        setError('Unable to load properties');
        setLoading(false);
      });
  }, [userId, token, navigate]);

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('roleName');
    localStorage.removeItem('token');

    navigate('/user-auth');
  };

  // ==================================================
  // AVAILABLE PROPERTIES
  // ==================================================

  const availableProperties = properties.filter(
    (property) =>
      property.status &&
      property.status.trim().toUpperCase() === 'AVAILABLE'
  );

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="dashboard-page">

      {/* NAVBAR */}
      <nav className="dashboard-navbar">

        <div className="dashboard-logo">
          🏠 ZERO BROKER
        </div>

        <div className="dashboard-menu">

          <button
            onClick={() => navigate('/user-dashboard')}
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate('/search-flats')}
          >
            Search Flats
          </button>

          <button
            onClick={() => navigate('/favorites')}
          >
            ❤️ Favorites
          </button>

          <button
            onClick={() => navigate('/rental-requests')}
          >
            📋 My Requests
          </button>

          <button
            onClick={() => navigate('/profile')}
          >
            Profile
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>
      </nav>

      {/* WELCOME SECTION */}
      <section className="dashboard-welcome">

        <div>

          <h1>
            Welcome to ZeroBroker 👋
          </h1>

          <p>
            Find your perfect home without paying broker commission.
          </p>

          <button
            className="dashboard-primary-button"
            onClick={() => navigate('/search-flats')}
          >
            🔍 Search Your Home
          </button>

        </div>

        <div className="welcome-icon">
          🏡
        </div>

      </section>

      {/* QUICK ACTIONS */}
      <section className="dashboard-section">

        <h2>
          Quick Actions
        </h2>

        <div className="quick-actions">

          {/* SEARCH FLATS */}
          <div className="action-card">

            <div className="action-icon">
              🔍
            </div>

            <h3>
              Search Flats
            </h3>

            <p>
              Find properties according to your requirements.
            </p>

            <button
              onClick={() => navigate('/search-flats')}
            >
              Search Now
            </button>

          </div>

          {/* FAVORITES */}
          <div className="action-card">

            <div className="action-icon">
              ❤️
            </div>

            <h3>
              Favorites
            </h3>

            <p>
              View the properties you have saved.
            </p>

            <button
              onClick={() => navigate('/favorites')}
            >
              View Favorites
            </button>

          </div>

          {/* RENTAL REQUESTS */}
          <div className="action-card">

            <div className="action-icon">
              📋
            </div>

            <h3>
              Rental Requests
            </h3>

            <p>
              Track your property rental requests.
            </p>

            <button
              onClick={() => navigate('/rental-requests')}
            >
              View Requests
            </button>

          </div>

          {/* PROFILE */}
          <div className="action-card">

            <div className="action-icon">
              👤
            </div>

            <h3>
              My Profile
            </h3>

            <p>
              View and manage your profile information.
            </p>

            <button
              onClick={() => navigate('/profile')}
            >
              View Profile
            </button>

          </div>

        </div>

      </section>

      {/* AVAILABLE PROPERTIES */}
      <section className="dashboard-section">

        <div className="section-header">

          <div>

            <h2>
              Available Properties
            </h2>

            <p>
              Explore homes available for rent.
            </p>

          </div>

          <button
            className="view-all-button"
            onClick={() => navigate('/search-flats')}
          >
            View All
          </button>

        </div>

        {/* LOADING */}
        {loading && (
          <div
            style={{
              textAlign: 'center',
              padding: '30px',
            }}
          >
            <h3>
              Loading properties...
            </h3>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div
            style={{
              textAlign: 'center',
              padding: '30px',
            }}
          >
            <h3>
              {error}
            </h3>
          </div>
        )}

        {/* PROPERTIES */}
        {!loading && !error && (
          <div className="property-cards">

            {availableProperties.map((property) => (

              <div
                className="property-card"
                key={property.propertyId}
              >

                {/* PROPERTY IMAGE PLACEHOLDER */}
                <div className="property-image">
                  🏠
                </div>

                {/* PROPERTY CONTENT */}
                <div className="property-content">

                  {/* STATUS */}
                  <span className="property-status">
                    {property.status}
                  </span>

                  {/* TITLE */}
                  <h3>
                    {property.title}
                  </h3>

                  {/* LOCATION */}
                  <p className="property-location">
                    📍 {property.location}, {property.city}
                  </p>

                  {/* DESCRIPTION */}
                  <p className="property-description">
                    {property.description}
                  </p>

                  {/* RENT */}
                  <div className="property-price">
                    ₹
                    {Number(property.rent || 0).toLocaleString(
                      'en-IN'
                    )}

                    <span>
                      {' '}/ month
                    </span>
                  </div>

                  {/* PROPERTY TYPE */}
                  <p>
                    🏠 {property.propertyType}
                  </p>

                  {/* FURNISHING */}
                  <p>
                    🛋️ {property.furnishing}
                  </p>

                  {/* TENANT PREFERENCE */}
                  <p>
                    👨‍👩‍👧 Preference:{' '}
                    {property.tenantPreference}
                  </p>

                  {/* VIEW DETAILS */}
                  <button
                    className="property-button"
                    onClick={() =>
                      navigate(`/property/${property.propertyId}`)
                    }
                  >
                    View Details
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

        {/* NO PROPERTIES */}
        {!loading &&
          !error &&
          availableProperties.length === 0 && (

            <div
              style={{
                textAlign: 'center',
                padding: '30px',
              }}
            >
              <h3>
                No properties available.
              </h3>
            </div>

          )}

      </section>

      {/* FOOTER */}
      <footer className="dashboard-footer">

        <h3>
          ZERO BROKER
        </h3>

        <p>
          Find your home. No broker. No commission.
        </p>

        <p>
          © 2026 ZeroBroker. All Rights Reserved.
        </p>

      </footer>

    </div>
  );
}

export default UserDashboard;
