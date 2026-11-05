import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../ownerpagestyle/InterestedUsers.css';

function InterestedUsers() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const ownerId = localStorage.getItem('userId');

  // Get JWT token from localStorage
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('jwtToken') ||
    localStorage.getItem('jwt');

  // Common headers for authenticated API requests
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

  useEffect(() => {
    if (!ownerId || !token) {
      navigate('/owner-auth');
      return;
    }

    const fetchInterestedUsers = async () => {
      try {
        setLoading(true);

        // Fetch all properties
        const response = await fetch(
          'http://localhost:8080/api/properties',
          {
            method: 'GET',
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch properties: ${response.status}`
          );
        }

        const data = await response.json();

        // Filter properties belonging to the logged-in owner
        const ownerProperties = data.filter(
          (property) =>
            property.owner &&
            Number(property.owner.userId) === Number(ownerId)
        );

        setProperties(ownerProperties);

        // Fetch rental requests for each owner's property
        const allRequests = [];

        for (const property of ownerProperties) {
          try {
            const requestResponse = await fetch(
              `http://localhost:8080/api/rental-requests/property/${property.propertyId}`,
              {
                method: 'GET',
                headers: getAuthHeaders(),
              }
            );

            if (requestResponse.status === 401 ||
                requestResponse.status === 403) {
              throw new Error(
                `Not authorized to fetch requests: ${requestResponse.status}`
              );
            }

            if (requestResponse.ok) {
              const propertyRequests =
                await requestResponse.json();

              propertyRequests.forEach((request) => {
                allRequests.push({
                  ...request,
                  property: property,
                });
              });
            } else {
              console.error(
                `Failed to fetch requests for property ${property.propertyId}:`,
                requestResponse.status
              );
            }
          } catch (error) {
            console.error(
              `Error fetching requests for property ${property.propertyId}:`,
              error
            );
          }
        }

        setRequests(allRequests);
      } catch (error) {
        console.error('Error loading interested users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterestedUsers();
  }, [ownerId, token, navigate]);

  // Accept rental request
  const handleAccept = async (requestId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/rental-requests/${requestId}/accept`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to accept request: ${response.status}`
        );
      }

      const updatedRequest = await response.json();

      setRequests((previousRequests) =>
        previousRequests.map((request) =>
          request.requestId === requestId
            ? {
                ...request,
                requestStatus: updatedRequest.requestStatus,
              }
            : request
        )
      );

      alert('Rental request accepted successfully!');
    } catch (error) {
      console.error('Error accepting rental request:', error);
      alert('Unable to accept rental request.');
    }
  };

  // Reject rental request
  const handleReject = async (requestId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/rental-requests/${requestId}/reject`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to reject request: ${response.status}`
        );
      }

      const updatedRequest = await response.json();

      setRequests((previousRequests) =>
        previousRequests.map((request) =>
          request.requestId === requestId
            ? {
                ...request,
                requestStatus: updatedRequest.requestStatus,
              }
            : request
        )
      );

      alert('Rental request rejected.');
    } catch (error) {
      console.error('Error rejecting rental request:', error);
      alert('Unable to reject rental request.');
    }
  };

  // Status CSS class
  const getStatusClass = (status) => {
    if (status === 'ACCEPTED') {
      return 'status-accepted';
    }

    if (status === 'REJECTED') {
      return 'status-rejected';
    }

    return 'status-pending';
  };

  // Loading state
  if (loading) {
    return (
      <div className="interested-users-page">
        <div className="interested-users-container">
          <h2>Loading Interested Users...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="interested-users-page">
      {/* Navbar */}
      <nav className="owner-navbar">
        <div
          className="owner-logo"
          onClick={() => navigate('/owner-dashboard')}
        >
          ZERO BROKER
        </div>

        <div className="owner-nav-links">
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

          <button className="active-nav">
            Interested Users
          </button>

          <button
            onClick={() => navigate('/owner/profile')}
          >
            Profile
          </button>

          <button
            className="logout-nav"
            onClick={() => {
              localStorage.removeItem('userId');
              localStorage.removeItem('roleName');
              localStorage.removeItem('token');
              localStorage.removeItem('jwtToken');
              localStorage.removeItem('jwt');

              navigate('/');
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="interested-users-container">
        <h1>Interested Users</h1>

        <p className="interested-subtitle">
          Users who have sent rental requests for your properties
        </p>

        {properties.length === 0 ? (
          <div className="empty-box">
            <h2>No Properties Found</h2>
            <p>
              You have not added any properties yet.
            </p>

            <button
              onClick={() =>
                navigate('/owner/add-property')
              }
            >
              Add Property
            </button>
          </div>
        ) : requests.length === 0 ? (
          <div className="empty-box">
            <h2>No Interested Users</h2>
            <p>
              No rental requests have been received for your
              properties yet.
            </p>
          </div>
        ) : (
          <div className="requests-list">
            {requests.map((request) => (
              <div
                className="request-card"
                key={request.requestId}
              >
                {/* Property Information */}
                <div className="property-section">
                  <h2>{request.property.title}</h2>

                  <p>
                    📍 {request.property.location},{' '}
                    {request.property.city}
                  </p>

                  <p>
                    🏠 {request.property.propertyType}
                  </p>

                  <p>
                    💰 ₹
                    {Number(
                      request.property.rent
                    ).toLocaleString('en-IN')}
                    / month
                  </p>
                </div>

                {/* User Information */}
                <div className="user-section">
                  <h3>Interested User</h3>

                  <p>
                    <strong>Name:</strong>{' '}
                    {request.user?.fullName || 'N/A'}
                  </p>

                  <p>
                    <strong>Email:</strong>{' '}
                    {request.user?.email || 'N/A'}
                  </p>

                  <p>
                    <strong>Phone:</strong>{' '}
                    {request.user?.phone || 'N/A'}
                  </p>

                  <p>
                    <strong>City:</strong>{' '}
                    {request.user?.city || 'N/A'}
                  </p>

                  <p>
                    <strong>Message:</strong>{' '}
                    {request.message || 'No message'}
                  </p>
                </div>

                {/* Request Information */}
                <div className="request-section">
                  <p>
                    <strong>Request Date:</strong>{' '}
                    {request.requestedAt
                      ? new Date(
                          request.requestedAt
                        ).toLocaleString('en-IN')
                      : 'N/A'}
                  </p>

                  <div className="request-status">
                    <span
                      className={getStatusClass(
                        request.requestStatus
                      )}
                    >
                      {request.requestStatus}
                    </span>
                  </div>

                  {/* Accept / Reject Actions */}
                  {request.requestStatus === 'PENDING' && (
                    <div className="request-actions">
                      <button
                        className="accept-button"
                        onClick={() =>
                          handleAccept(request.requestId)
                        }
                      >
                        ✓ Accept
                      </button>

                      <button
                        className="reject-button"
                        onClick={() =>
                          handleReject(request.requestId)
                        }
                      >
                        ✕ Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default InterestedUsers;
