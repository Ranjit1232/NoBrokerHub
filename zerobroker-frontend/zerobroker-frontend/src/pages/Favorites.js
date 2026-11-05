
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Favorites.css';

function Favorites() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!userId || !token) {
      setError('Please login to view your favorite properties.');
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchFavorites = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(
          `http://localhost:8080/api/favorites/user/${userId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            },
            signal: controller.signal
          }
        );

        if (response.status === 401 || response.status === 403) {
          throw new Error(
            'Your session may have expired, or you do not have permission to view favorites. Please login again.'
          );
        }

        if (!response.ok) {
          throw new Error('Failed to load favorites.');
        }

        const data = await response.json();

        console.log('Favorites:', data);

        if (!Array.isArray(data)) {
          throw new Error('Invalid favorites response from server.');
        }

        setFavorites(data);
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }

        console.error('Favorites Error:', err);
        setError(err.message || 'Unable to load favorite properties.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchFavorites();

    return () => controller.abort();
  }, [userId, token, retryCount]);

  const handleViewProperty = (propertyId) => {
    if (!propertyId) {
      return;
    }

    navigate(`/property/${propertyId}`);
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined || amount === '') {
      return 'Not specified';
    }

    const value = Number(amount);

    return Number.isFinite(value)
      ? `₹${value.toLocaleString('en-IN')}`
      : 'Not specified';
  };

  return (
    <div className="favorites-page">

      {/* Navbar */}
      <nav className="favorites-navbar">

        <div
          className="favorites-logo"
          onClick={() => navigate('/user-dashboard')}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              navigate('/user-dashboard');
            }
          }}
        >
          🏠 ZERO BROKER
        </div>

        <div className="favorites-menu">

          <button onClick={() => navigate('/user-dashboard')}>
            Dashboard
          </button>

          <button onClick={() => navigate('/search-flats')}>
            🔍 Search Flats
          </button>

          <button className="active">
            ❤️ Favorites
          </button>

          <button onClick={() => navigate('/rental-requests')}>
            📋 My Requests
          </button>

          <button onClick={() => navigate('/profile')}>
            👤 Profile
          </button>

        </div>
      </nav>

      {/* Main Section */}
      <section className="favorites-section">

        <div className="favorites-header">
          <h1>❤️ My Favorite Properties</h1>

          <p>
            Properties you have saved for later.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="favorites-message">
            <h2>Loading favorites...</h2>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="favorites-message error">
            <h2>{error}</h2>

            <button
              onClick={() => {
                if (
                  !localStorage.getItem('token') ||
                  !localStorage.getItem('userId')
                ) {
                  navigate('/login');
                } else {
                  setRetryCount((count) => count + 1);
                }
              }}
            >
              {token && userId ? 'Try Again' : 'Login'}
            </button>
          </div>
        )}

        {/* No Favorites */}
        {!loading && !error && favorites.length === 0 && (
          <div className="favorites-empty">

            <div className="empty-icon">
              ❤️
            </div>

            <h2>No Favorite Properties</h2>

            <p>
              You haven't added any properties to your favorites yet.
            </p>

            <button
              className="favorites-primary-button"
              onClick={() => navigate('/search-flats')}
            >
              🔍 Search Flats
            </button>

          </div>
        )}

        {/* Favorite Properties */}
        {!loading && !error && favorites.length > 0 && (
          <div className="favorites-grid">

            {favorites.map((favorite) => {
              const property = favorite.property;

              if (!property) {
                return null;
              }

              return (
                <div
                  className="favorite-card"
                  key={favorite.favoriteId}
                >

                  <div className="favorite-property-image">
                    🏠
                  </div>

                  <div className="favorite-property-content">

                    <span className="favorite-status">
                      {property.status || 'Status unavailable'}
                    </span>

                    <h2>
                      {property.title || 'Property'}
                    </h2>

                    <p className="favorite-location">
                      📍 {property.location || property.address || 'Location not specified'}
                      {property.city ? `, ${property.city}` : ''}
                    </p>

                    <p className="favorite-description">
                      {property.description || 'No description available.'}
                    </p>

                    <div className="favorite-price">
                      {formatAmount(property.rent)}
                      {property.rent !== null &&
                       property.rent !== undefined &&
                       property.rent !== '' && (
                        <span> / month</span>
                      )}
                    </div>

                    <div className="favorite-details">

                      <span>
                        🏠 {property.propertyType || 'Not specified'}
                      </span>

                      <span>
                        🛋️ {property.furnishing || 'Not specified'}
                      </span>

                      <span>
                        💰 {formatAmount(property.deposit)}
                      </span>

                    </div>

                    <button
                      className="favorite-view-button"
                      onClick={() =>
                        handleViewProperty(property.propertyId)
                      }
                      disabled={!property.propertyId}
                    >
                      View Property
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </section>

      {/* Footer */}
      <footer className="favorites-footer">

        <h3>ZERO BROKER</h3>

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

export default Favorites;
