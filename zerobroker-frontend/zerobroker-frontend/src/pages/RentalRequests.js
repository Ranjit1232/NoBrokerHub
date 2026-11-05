
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/RentalRequests.css';

function RentalRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Check login
    if (!userId || !token) {
      setError('Please login to view your rental requests.');
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchRentalRequests = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          `http://localhost:8080/api/rental-requests/user/${userId}`,
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
            'Your session may have expired, or you do not have permission to view these requests. Please login again.'
          );
        }

        if (!response.ok) {
          throw new Error('Failed to load rental requests.');
        }

        const data = await response.json();

        console.log('Rental Requests:', data);

        if (!Array.isArray(data)) {
          throw new Error('Invalid rental requests response from server.');
        }

        setRequests(data);
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }

        console.error('Rental Requests Error:', err);
        setError(err.message || 'Unable to load rental requests.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchRentalRequests();

    return () => controller.abort();
  }, [userId, token]);

  const handleViewProperty = (propertyId) => {
    if (!propertyId) {
      return;
    }

    navigate(`/property/${propertyId}`);
  };

  const formatRent = (rent) => {
    if (rent === null || rent === undefined || rent === '') {
      return 'Not specified';
    }

    const amount = Number(rent);

    return Number.isFinite(amount)
      ? `₹${amount.toLocaleString('en-IN')}`
      : 'Not specified';
  };

  return (
    <div className="rental-requests-page">

      {/* Navbar */}
      <nav className="rental-requests-navbar">

        <div
          className="rental-requests-logo"
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

        <div className="rental-requests-menu">

          <button onClick={() => navigate('/user-dashboard')}>
            Dashboard
          </button>

          <button onClick={() => navigate('/search-flats')}>
            🔍 Search Flats
          </button>

          <button onClick={() => navigate('/favorites')}>
            ❤️ Favorites
          </button>

          <button className="active">
            📋 My Requests
          </button>

          <button onClick={() => navigate('/profile')}>
            👤 Profile
          </button>

        </div>
      </nav>

      {/* Main Section */}
      <section className="rental-requests-section">

        <div className="rental-requests-header">
          <h1>📋 My Rental Requests</h1>

          <p>
            View the rental requests you have sent to property owners.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rental-requests-message">
            <h2>Loading requests...</h2>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rental-requests-message error">
            <h2>{error}</h2>

            <button
              onClick={() => {
                if (
                  !localStorage.getItem('token') ||
                  !localStorage.getItem('userId')
                ) {
                  navigate('/login');
                } else {
                  window.location.reload();
                }
              }}
            >
              {token && userId ? 'Try Again' : 'Login'}
            </button>
          </div>
        )}

        {/* No Requests */}
        {!loading && !error && requests.length === 0 && (
          <div className="rental-requests-empty">

            <div className="empty-request-icon">
              📋
            </div>

            <h2>No Rental Requests</h2>

            <p>
              You haven't sent any rental requests yet.
            </p>

            <button
              className="rental-primary-button"
              onClick={() => navigate('/search-flats')}
            >
              🔍 Search Flats
            </button>

          </div>
        )}

        {/* Requests */}
        {!loading && !error && requests.length > 0 && (
          <div className="rental-requests-list">

            {requests.map((request) => {
              const property = request.property;

              const status = (
                request.requestStatus || 'PENDING'
              ).toLowerCase();

              return (
                <div
                  className="rental-request-item"
                  key={request.requestId}
                >

                  <div className="request-property-icon">
                    🏠
                  </div>

                  <div className="request-property-info">

                    <h2>
                      {property?.title || 'Property'}
                    </h2>

                    <p className="request-location">
                      📍 {property?.location || property?.address || 'Location not specified'}
                      {property?.city ? `, ${property.city}` : ''}
                    </p>

                    <p className="request-rent">
                      {formatRent(property?.rent)}
                      {property?.rent !== null &&
                       property?.rent !== undefined &&
                       property?.rent !== '' && (
                        <span> / month</span>
                      )}
                    </p>

                    <div className="request-message">
                      <strong>Your Message:</strong>

                      <p>
                        {request.message || 'No message provided.'}
                      </p>
                    </div>

                  </div>

                  <div className="request-right-section">

                    <span className={`request-status ${status}`}>
                      {request.requestStatus || 'PENDING'}
                    </span>

                    <button
                      className="request-view-button"
                      onClick={() =>
                        handleViewProperty(property?.propertyId)
                      }
                      disabled={!property?.propertyId}
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
      <footer className="rental-requests-footer">

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

export default RentalRequests;
