import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/PropertyDetails.css';

function PropertyDetails() {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [owner, setOwner] = useState(null);

  const [loading, setLoading] = useState(true);
  const [ownerLoading, setOwnerLoading] = useState(false);

  const [error, setError] = useState('');
  const [ownerError, setOwnerError] = useState('');

  const [showOwner, setShowOwner] = useState(false);

  // PROPERTY MEDIA
  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyVideos, setPropertyVideos] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // RENTAL REQUEST
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [rentalMessage, setRentalMessage] = useState('');
  const [rentalLoading, setRentalLoading] = useState(false);
  const [rentalSuccess, setRentalSuccess] = useState('');
  const [rentalError, setRentalError] = useState('');

  // FAVORITES
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteError, setFavoriteError] = useState('');

  // LOGGED-IN USER / ROLE
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const roleName = localStorage.getItem('roleName');

  // CHECK WHETHER OWNER IS VIEWING OWN PROPERTY
  const isOwnerViewingOwnProperty =
    roleName === 'OWNER' &&
    property &&
    property.owner &&
    Number(property.owner.userId) === Number(userId);

  // FETCH PROPERTY DETAILS
  useEffect(() => {
    fetch(`http://localhost:8080/api/properties/${propertyId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Property not found');
        }

        return response.json();
      })
      .then((data) => {
        console.log('Property Details:', data);
        setProperty(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Property Error:', error);
        setError('Unable to load property details');
        setLoading(false);
      });
  }, [propertyId, token]);

  // FETCH PROPERTY IMAGES + VIDEOS
  useEffect(() => {
    if (!propertyId) {
      return;
    }

    setMediaLoading(true);

    Promise.all([
      fetch(
        `http://localhost:8080/api/property-images/property/${propertyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      ),
      fetch(
        `http://localhost:8080/api/property-videos/property/${propertyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
    ])
      .then(async ([imageResponse, videoResponse]) => {
        if (!imageResponse.ok) {
          throw new Error('Failed to fetch property images');
        }

        if (!videoResponse.ok) {
          throw new Error('Failed to fetch property videos');
        }

        const images = await imageResponse.json();
        const videos = await videoResponse.json();

        return { images, videos };
      })
      .then(({ images, videos }) => {
        console.log('Property Images:', images);
        console.log('Property Videos:', videos);

        setPropertyImages(images);
        setPropertyVideos(videos);
        setActiveImageIndex(0);
        setMediaLoading(false);
      })
      .catch((error) => {
        console.error('Property Media Error:', error);

        setPropertyImages([]);
        setPropertyVideos([]);
        setMediaLoading(false);
      });
  }, [propertyId, token]);

  // IMAGE GALLERY KEYBOARD NAVIGATION
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedImageIndex === null) {
        return;
      }

      if (event.key === 'Escape') {
        setSelectedImageIndex(null);
      }

      if (
        event.key === 'ArrowRight' &&
        propertyImages.length > 1
      ) {
        setSelectedImageIndex((currentIndex) => {
          if (currentIndex === null) {
            return null;
          }

          const nextIndex =
            (currentIndex + 1) % propertyImages.length;

          setActiveImageIndex(nextIndex);
          return nextIndex;
        });
      }

      if (
        event.key === 'ArrowLeft' &&
        propertyImages.length > 1
      ) {
        setSelectedImageIndex((currentIndex) => {
          if (currentIndex === null) {
            return null;
          }

          const previousIndex =
            (currentIndex - 1 + propertyImages.length) %
            propertyImages.length;

          setActiveImageIndex(previousIndex);
          return previousIndex;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImageIndex, propertyImages]);

  // CHECK FAVORITE
  useEffect(() => {
    // Owner should not check favorite for own property
    if (!userId || roleName === 'OWNER') {
      return;
    }

    fetch(
      `http://localhost:8080/api/favorites/check?userId=${userId}&propertyId=${propertyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to check favorite');
        }

        return response.json();
      })
      .then((data) => {
        console.log('Favorite Check:', data);
        setIsFavorite(data);
      })
      .catch((error) => {
        console.error('Favorite Check Error:', error);
      });
  }, [propertyId, userId, roleName, token]);

  // ADD TO FAVORITES
  const handleAddFavorite = () => {
    if (isFavorite) {
      return;
    }

    if (!userId) {
      setFavoriteError('Please login to add favorites');
      return;
    }

    if (!token) {
      setFavoriteError('Your session has expired. Please login again.');
      return;
    }

    setFavoriteLoading(true);
    setFavoriteError('');

    const favoriteData = {
      user: {
        userId: Number(userId)
      },
      property: {
        propertyId: Number(propertyId)
      }
    };

    console.log('Favorite Request:', favoriteData);

    fetch('http://localhost:8080/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(favoriteData)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add favorite');
        }

        return response.json();
      })
      .then((data) => {
        console.log('Favorite Response:', data);

        setIsFavorite(true);
        setFavoriteLoading(false);
      })
      .catch((error) => {
        console.error('Favorite Error:', error);

        setFavoriteError(
          'Unable to add property to favorites'
        );

        setFavoriteLoading(false);
      });
  };

  // CONTACT OWNER
  const handleContactOwner = () => {
    if (owner) {
      setShowOwner(true);
      return;
    }

    if (!token) {
      setOwnerError('Please login again to view owner details.');
      return;
    }

    setOwnerLoading(true);
    setOwnerError('');

    fetch(
      `http://localhost:8080/api/properties/${propertyId}/owner`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Owner details not found');
        }

        return response.json();
      })
      .then((data) => {
        console.log('Owner Details:', data);

        setOwner(data);
        setShowOwner(true);
        setOwnerLoading(false);
      })
      .catch((error) => {
        console.error('Owner Error:', error);

        setOwnerError('Unable to load owner details');
        setOwnerLoading(false);
      });
  };

  // OPEN RENTAL REQUEST FORM
  const handleRentalRequest = () => {
    setShowRentalForm(true);
    setRentalSuccess('');
    setRentalError('');
  };

  // SEND RENTAL REQUEST
  const handleSendRentalRequest = () => {
    const loggedInUserId = localStorage.getItem('userId');
    const currentToken = localStorage.getItem('token');

    if (!loggedInUserId) {
      setRentalError('Please login first');
      return;
    }

    if (!currentToken) {
      setRentalError('Your session has expired. Please login again.');
      return;
    }

    if (!rentalMessage.trim()) {
      setRentalError('Please enter a message');
      return;
    }

    setRentalLoading(true);
    setRentalError('');
    setRentalSuccess('');

    const requestData = {
      property: {
        propertyId: Number(propertyId)
      },
      user: {
        userId: Number(loggedInUserId)
      },
      message: rentalMessage,
      requestStatus: 'PENDING'
    };

    console.log('Rental Request:', requestData);

    fetch('http://localhost:8080/api/rental-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentToken}`
      },
      body: JSON.stringify(requestData)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to send rental request');
        }

        return response.json();
      })
      .then((data) => {
        console.log('Rental Request Response:', data);

        setRentalSuccess('Rental request sent successfully!');
        setRentalMessage('');
        setRentalLoading(false);
      })
      .catch((error) => {
        console.error('Rental Request Error:', error);

        setRentalError('Unable to send rental request');
        setRentalLoading(false);
      });
  };

  // NAVIGATION HELPERS
  const handleDashboardNavigation = () => {
    if (roleName === 'OWNER') {
      navigate('/owner-dashboard');
    } else {
      navigate('/user-dashboard');
    }
  };

  const handleBackNavigation = () => {
    if (roleName === 'OWNER') {
      navigate('/owner/my-properties');
    } else {
      navigate('/user-dashboard');
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="dashboard-page">
        <div
          style={{
            textAlign: 'center',
            padding: '80px'
          }}
        >
          <h2>Loading property details...</h2>
        </div>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="dashboard-page">
        <div
          style={{
            textAlign: 'center',
            padding: '80px'
          }}
        >
          <h2>{error}</h2>

          <button
            className="property-button"
            onClick={handleDashboardNavigation}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // MAIN UI
  return (
    <div className="dashboard-page">
      {/* NAVBAR */}
      <nav className="dashboard-navbar">
        <div className="dashboard-logo">
          🏠 ZERO BROKER
        </div>

        <div className="dashboard-menu">
          <button onClick={handleDashboardNavigation}>
            Dashboard
          </button>

          {/* USER NAVIGATION ONLY */}
          {roleName !== 'OWNER' && (
            <>
              <button
                onClick={() => navigate('/search-flats')}
              >
                🔍 Search Flats
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
                👤 Profile
              </button>
            </>
          )}

          {/* OWNER NAVIGATION ONLY */}
          {roleName === 'OWNER' && (
            <>
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

              <button
                onClick={() => navigate('/owner/profile')}
              >
                Profile
              </button>
            </>
          )}
        </div>
      </nav>

      {/* PROPERTY DETAILS */}
      <section className="dashboard-section">
        {/* BACK BUTTON */}
        <button
          className="view-all-button"
          onClick={handleBackNavigation}
        >
          ← Back
        </button>

        <div className="property-details-container">
          {/* PROPERTY MEDIA */}
          <div className="property-details-image">
            {mediaLoading && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '30px'
                }}
              >
                <p>Loading property media...</p>
              </div>
            )}

            {/* PROPERTY IMAGE GALLERY */}
            {!mediaLoading && propertyImages.length > 0 && (
              <div>
                {/* MAIN IMAGE */}
                <div className="property-image-main">
                  <img
                    src={`http://localhost:8080${propertyImages[activeImageIndex].imageUrl}`}
                    alt={`Property ${activeImageIndex + 1}`}
                    onClick={() =>
                      setSelectedImageIndex(activeImageIndex)
                    }
                  />

                  {/* PREVIOUS */}
                  {propertyImages.length > 1 && (
                    <button
                      className="property-image-arrow property-image-arrow-left"
                      onClick={() =>
                        setActiveImageIndex(
                          (activeImageIndex - 1 + propertyImages.length) %
                            propertyImages.length
                        )
                      }
                    >
                      ‹
                    </button>
                  )}

                  {/* NEXT */}
                  {propertyImages.length > 1 && (
                    <button
                      className="property-image-arrow property-image-arrow-right"
                      onClick={() =>
                        setActiveImageIndex(
                          (activeImageIndex + 1) % propertyImages.length
                        )
                      }
                    >
                      ›
                    </button>
                  )}

                  {/* IMAGE COUNT */}
                  {propertyImages.length > 1 && (
                    <div className="property-image-count">
                      {activeImageIndex + 1}
                      {' / '}
                      {propertyImages.length}
                    </div>
                  )}
                </div>

                {/* THUMBNAILS */}
                {propertyImages.length > 1 && (
                  <div className="property-image-thumbnails">
                    {propertyImages.map((image, index) => (
                      <img
                        key={image.imageId || index}
                        src={`http://localhost:8080${image.imageUrl}`}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => setActiveImageIndex(index)}
                        className={
                          activeImageIndex === index
                            ? 'property-image-thumbnail active'
                            : 'property-image-thumbnail'
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* IMAGE GALLERY POPUP */}
            {selectedImageIndex !== null &&
              propertyImages.length > 0 && (
                <div
                  className="property-image-overlay"
                  onClick={() => setSelectedImageIndex(null)}
                >
                  {/* CLOSE */}
                  <button
                    className="property-image-close"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedImageIndex(null);
                    }}
                  >
                    ✕
                  </button>

                  {/* PREVIOUS */}
                  {propertyImages.length > 1 && (
                    <button
                      className="property-image-overlay-arrow property-image-overlay-arrow-left"
                      onClick={(event) => {
                        event.stopPropagation();

                        const previousIndex =
                          (selectedImageIndex - 1 + propertyImages.length) %
                          propertyImages.length;

                        setSelectedImageIndex(previousIndex);
                        setActiveImageIndex(previousIndex);
                      }}
                    >
                      ‹
                    </button>
                  )}

                  {/* FULLSCREEN IMAGE */}
                  <img
                    className="property-image-fullscreen"
                    src={`http://localhost:8080${propertyImages[selectedImageIndex].imageUrl}`}
                    alt={`Property ${selectedImageIndex + 1}`}
                    onClick={(event) => event.stopPropagation()}
                  />

                  {/* NEXT */}
                  {propertyImages.length > 1 && (
                    <button
                      className="property-image-overlay-arrow property-image-overlay-arrow-right"
                      onClick={(event) => {
                        event.stopPropagation();

                        const nextIndex =
                          (selectedImageIndex + 1) %
                          propertyImages.length;

                        setSelectedImageIndex(nextIndex);
                        setActiveImageIndex(nextIndex);
                      }}
                    >
                      ›
                    </button>
                  )}

                  {/* COUNT */}
                  <div className="property-image-overlay-count">
                    {selectedImageIndex + 1}
                    {' / '}
                    {propertyImages.length}
                  </div>
                </div>
              )}

            {/* NO IMAGE */}
            {!mediaLoading && propertyImages.length === 0 && (
              <div
                style={{
                  fontSize: '80px',
                  textAlign: 'center',
                  padding: '40px'
                }}
              >
                🏠
              </div>
            )}
          </div>

          {/* PROPERTY CONTENT */}
          <div className="property-details-content">
            {/* STATUS */}
            <span className="property-status">
              {property.status}
            </span>

            {/* TITLE */}
            <h1>{property.title}</h1>

            {/* LOCATION */}
            <p className="property-location">
              📍 {property.location}, {property.city}
            </p>

            {/* RENT */}
            <div className="property-price">
              ₹
              {Number(property.rent || 0).toLocaleString('en-IN')}
              <span> / month</span>
            </div>

            <hr />

            {/* PROPERTY INFORMATION */}
            <h2>Property Information</h2>

            <div className="property-info-grid">
              <div>
                <strong>Property Type</strong>
                <p>{property.propertyType}</p>
              </div>

              <div>
                <strong>BHK</strong>
                <p>
                  {property.bhk === null || property.bhk === undefined
                    ? 'Not Specified'
                    : property.bhk}
                </p>
              </div>

              <div>
                <strong>Furnishing</strong>
                <p>{property.furnishing}</p>
              </div>

              <div>
                <strong>Deposit</strong>
                <p>
                  ₹
                  {Number(property.deposit || 0).toLocaleString('en-IN')}
                </p>
              </div>

              <div>
                <strong>Available From</strong>
                <p>{property.availableFrom}</p>
              </div>

              <div>
                <strong>Tenant Preference</strong>
                <p>{property.tenantPreference}</p>
              </div>
            </div>

            <hr />

            {/* DESCRIPTION */}
            <h2>Description</h2>

            <p className="property-full-description">
              {property.description}
            </p>

            <hr />

            {/* ADDRESS */}
            <h2>Address</h2>

            <p className="property-full-description">
              📍 {property.address}
            </p>

            <hr />

            {/* PROPERTY VIDEO */}
            {propertyVideos.length > 0 && (
              <>
                <h2>Property Video</h2>

                <div
                  style={{
                    marginTop: '15px',
                    marginBottom: '25px'
                  }}
                >
                  {propertyVideos.map((video, index) => (
                    <video
                      key={video.videoId || index}
                      controls
                      style={{
                        width: '100%',
                        maxWidth: '700px',
                        borderRadius: '12px',
                        marginBottom: '15px'
                      }}
                    >
                      <source
                        src={`http://localhost:8080${video.videoUrl}`}
                        type="video/mp4"
                      />

                      Your browser does not support the video tag.
                    </video>
                  ))}
                </div>

                <hr />
              </>
            )}

            {/* OWNER */}
            <h2>Owner</h2>

            {ownerError && (
              <p
                style={{
                  color: 'red',
                  marginTop: '15px'
                }}
              >
                {ownerError}
              </p>
            )}

            {showOwner && owner && (
              <div className="owner-contact-card">
                <div className="owner-contact-header">
                  <div className="owner-avatar">
                    👤
                  </div>

                  <div>
                    <h3>{owner.fullName}</h3>
                    <p>Property Owner</p>
                  </div>
                </div>

                <div className="owner-contact-info">
                  <div className="owner-contact-item">
                    <span>📧</span>

                    <div>
                      <strong>Email</strong>
                      <p>{owner.email}</p>
                    </div>
                  </div>

                  <div className="owner-contact-item">
                    <span>📱</span>

                    <div>
                      <strong>Phone</strong>
                      <p>{owner.phone}</p>
                    </div>
                  </div>

                  <div className="owner-contact-item">
                    <span>📍</span>

                    <div>
                      <strong>City</strong>
                      <p>{owner.city}</p>
                    </div>
                  </div>
                </div>

                <button
                  className="close-owner-button"
                  onClick={() => setShowOwner(false)}
                >
                  Close
                </button>
              </div>
            )}

            {/* ACTIONS - USER ONLY */}
            {!isOwnerViewingOwnProperty && (
              <div className="property-detail-actions">
                {/* FAVORITE */}
                <button
                  className="dashboard-primary-button"
                  onClick={handleAddFavorite}
                  disabled={favoriteLoading || isFavorite}
                >
                  {favoriteLoading
                    ? 'Adding...'
                    : isFavorite
                      ? '❤️ Added to Favorites'
                      : '❤️ Add to Favorites'}
                </button>

                {/* FAVORITE ERROR */}
                {favoriteError && (
                  <p
                    style={{
                      color: 'red',
                      width: '100%',
                      margin: '0'
                    }}
                  >
                    {favoriteError}
                  </p>
                )}

                {/* CONTACT OWNER */}
                <button
                  className="property-button"
                  onClick={handleContactOwner}
                  disabled={ownerLoading}
                >
                  {ownerLoading
                    ? 'Loading Owner...'
                    : '📞 Contact Owner'}
                </button>

                {/* RENTAL REQUEST */}
                <button
                  className="property-button"
                  onClick={handleRentalRequest}
                >
                  📋 Send Rental Request
                </button>
              </div>
            )}

            {/* RENTAL REQUEST FORM */}
            {!isOwnerViewingOwnProperty && showRentalForm && (
              <div className="rental-request-card">
                <h2>📋 Send Rental Request</h2>

                <p>
                  Send a request to the owner for this property.
                </p>

                <textarea
                  value={rentalMessage}
                  onChange={(e) => setRentalMessage(e.target.value)}
                  placeholder="Write your message to the owner..."
                  rows="5"
                />

                {rentalError && (
                  <p
                    style={{
                      color: 'red',
                      marginTop: '10px'
                    }}
                  >
                    {rentalError}
                  </p>
                )}

                {rentalSuccess && (
                  <p
                    style={{
                      color: 'green',
                      marginTop: '10px',
                      fontWeight: '600'
                    }}
                  >
                    {rentalSuccess}
                  </p>
                )}

                <div className="rental-request-actions">
                  <button
                    className="dashboard-primary-button"
                    onClick={handleSendRentalRequest}
                    disabled={rentalLoading}
                  >
                    {rentalLoading ? 'Sending...' : 'Send Request'}
                  </button>

                  <button
                    className="property-button"
                    onClick={() => setShowRentalForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="dashboard-footer">
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

export default PropertyDetails;