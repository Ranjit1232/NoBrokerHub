import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../ownerpagestyle/MyProperties.css';


function MyProperties() {

  const navigate = useNavigate();

  const ownerId = localStorage.getItem('userId');

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {

    if (!ownerId) {
      setErrorMessage('Owner login required.');
      setLoading(false);
      return;
    }

    try {

const token = localStorage.getItem('token');

if (!token) {
  setErrorMessage('Login token not found. Please login again.');
  return;
}

const response = await fetch(
  'http://localhost:8080/api/properties',
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  }
);

      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();

      // Show only properties belonging to logged-in owner
      const ownerProperties = data.filter(
        (property) =>
          property.owner &&
          Number(property.owner.userId) === Number(ownerId)
      );

      setProperties(ownerProperties);

    } catch (error) {

      console.error('Fetch Properties Error:', error);

      setErrorMessage(
        'Unable to load your properties.'
      );

    } finally {
      setLoading(false);
    }
  };


  // Delete Property
  const handleDelete = async (propertyId) => {

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this property?'
    );

    if (!confirmDelete) {
      return;
    }

    try {

const token = localStorage.getItem('token');

if (!token) {
  alert('Login token not found. Please login again.');
  return;
}

const response = await fetch(
  `http://localhost:8080/api/properties/${propertyId}`,
  {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

      if (!response.ok) {
        throw new Error('Failed to delete property');
      }

      alert('Property deleted successfully!');

      // Remove deleted property from UI
      setProperties((currentProperties) =>
        currentProperties.filter(
          (property) =>
            property.propertyId !== propertyId
        )
      );

    } catch (error) {

      console.error('Delete Property Error:', error);

      alert('Unable to delete property.');

    }
  };


  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('roleName');

    navigate('/');
  };


  return (
    <div className="my-properties-page">

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

          <button className="active">
            My Properties
          </button>

          <button
            onClick={() =>
              navigate('/owner/interested-users')
            }
          >
            Interested Users
          </button>

          <button
            onClick={() =>
              navigate('/owner/profile')
            }
          >
            Profile
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </nav>


      {/* Main Content */}

      <div className="my-properties-container">

        <h1>My Properties</h1>

        <p className="my-properties-subtitle">
          Manage properties added by you
        </p>


        {/* Loading */}

        {loading && (
          <div className="loading-message">
            Loading your properties...
          </div>
        )}


        {/* Error */}

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}


        {/* No Properties */}

        {!loading &&
          !errorMessage &&
          properties.length === 0 && (

            <div className="no-properties">

              <h2>No Properties Found</h2>

              <p>
                You have not added any property yet.
              </p>

              <button
                onClick={() =>
                  navigate('/owner/add-property')
                }
              >
                Add Your First Property
              </button>

            </div>

          )}


        {/* Properties */}

        <div className="properties-grid">

          {properties.map((property) => (

            <div
              className="property-card"
              key={property.propertyId}
            >

              {/* Property Header */}

              <div className="property-card-header">

                <h2>
                  {property.title}
                </h2>

                <span
                  className={`property-status ${
                    property.status?.toLowerCase()
                  }`}
                >
                  {property.status}
                </span>

              </div>


              {/* Location */}

              <p className="property-location">
                📍 {property.location}, {property.city}
              </p>


              {/* Description */}

              <p className="property-description">
                {property.description}
              </p>


              {/* Property Details */}

              <div className="property-details">

                <div>
                  <span>
                    Property Type
                  </span>

                  <strong>
                    {property.propertyType}
                  </strong>
                </div>


                <div>
                  <span>
                    BHK
                  </span>

                  <strong>
                    {property.bhk || 'N/A'}
                  </strong>
                </div>


                <div>
                  <span>
                    Rent
                  </span>

                  <strong>
                    ₹{property.rent}
                  </strong>
                </div>


                <div>
                  <span>
                    Deposit
                  </span>

                  <strong>
                    ₹{property.deposit}
                  </strong>
                </div>


                <div>
                  <span>
                    Furnishing
                  </span>

                  <strong>
                    {property.furnishing}
                  </strong>
                </div>


                <div>
                  <span>
                    Available From
                  </span>

                  <strong>
                    {property.availableFrom}
                  </strong>
                </div>

              </div>


              {/* Actions */}

              <div className="property-actions">

                {/* View */}

                <button
                  className="view-button"
                  onClick={() =>
                    navigate(
                      `/property/${property.propertyId}`
                    )
                  }
                >
                  View
                </button>


                {/* Update */}

                <button
                  className="update-button"
                 onClick={() => navigate(`/owner/update-property/${property.propertyId}`)}
                >
                  Update
                </button>


                {/* Delete */}

                <button
                  className="delete-button"
                  onClick={() =>
                    handleDelete(
                      property.propertyId
                    )
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default MyProperties;

