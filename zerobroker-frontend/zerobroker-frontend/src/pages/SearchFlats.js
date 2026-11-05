
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/SearchFlats.css';
import '../style/CommonNavbar.css';

function SearchFlats() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Search fields
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');

  // Filter fields
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [furnishing, setFurnishing] = useState('');
  const [tenantPreference, setTenantPreference] = useState('');

  // Get JWT token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      throw new Error('Your session has expired. Please log in again.');
    }

    return {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  };

  // Common API response handler
  const fetchProperties = async (url) => {
    const headers = getAuthHeaders();

    const response = await fetch(url, { headers });

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('roleName');

      navigate('/login');
      throw new Error('Session expired or access denied. Please log in again.');
    }

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid property data received from server.');
    }

    return data;
  };

  // Search by City
  const searchByCity = async () => {
    if (!city.trim()) {
      setError('Please enter city');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await fetchProperties(
        `http://localhost:8080/api/properties/search?city=${encodeURIComponent(
          city.trim()
        )}`
      );

      setProperties(data);
    } catch (error) {
      console.error('Search by city error:', error);
      setError(error.message || 'Unable to search properties');
    } finally {
      setLoading(false);
    }
  };

  // Search by Location
  const searchByLocation = async () => {
    if (!location.trim()) {
      setError('Please enter location');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await fetchProperties(
        `http://localhost:8080/api/properties/search-location?location=${encodeURIComponent(
          location.trim()
        )}`
      );

      setProperties(data);
    } catch (error) {
      console.error('Search by location error:', error);
      setError(error.message || 'Unable to search properties');
    } finally {
      setLoading(false);
    }
  };

  // Apply Filters
  const applyFilters = async () => {
    if (
      minRent !== '' &&
      maxRent !== '' &&
      Number(minRent) > Number(maxRent)
    ) {
      setError('Minimum rent cannot be greater than maximum rent.');
      return;
    }

    if (
      (minRent !== '' && Number(minRent) < 0) ||
      (maxRent !== '' && Number(maxRent) < 0)
    ) {
      setError('Rent cannot be negative.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Fetch all properties with JWT authentication
      let data = await fetchProperties(
        'http://localhost:8080/api/properties'
      );

      // City filter
      if (city.trim()) {
        data = data.filter(
          (property) =>
            property.city?.toLowerCase() === city.trim().toLowerCase()
        );
      }

      // Location filter
      if (location.trim()) {
        data = data.filter(
          (property) =>
            property.location
              ?.toLowerCase()
              .includes(location.trim().toLowerCase())
        );
      }

      // Minimum Rent
      if (minRent !== '') {
        data = data.filter(
          (property) => Number(property.rent) >= Number(minRent)
        );
      }

      // Maximum Rent
      if (maxRent !== '') {
        data = data.filter(
          (property) => Number(property.rent) <= Number(maxRent)
        );
      }

      // Property Type
      if (propertyType) {
        data = data.filter(
          (property) =>
            property.propertyType?.toLowerCase() ===
            propertyType.toLowerCase()
        );
      }

      // Furnishing
      if (furnishing) {
        data = data.filter(
          (property) =>
            property.furnishing?.toLowerCase() ===
            furnishing.toLowerCase()
        );
      }

      // Tenant Preference
      if (tenantPreference) {
        data = data.filter(
          (property) =>
            property.tenantPreference?.toLowerCase() ===
            tenantPreference.toLowerCase()
        );
      }

      setProperties(data);
    } catch (error) {
      console.error('Apply filters error:', error);
      setError(error.message || 'Unable to apply filters');
    } finally {
      setLoading(false);
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
    <div className="search-flats-page">

      {/* Navbar */}
      <nav className="dashboard-navbar">

        <div className="dashboard-logo">
          ZERO BROKER
        </div>

        <div className="dashboard-menu">

          <button onClick={() => navigate('/user-dashboard')}>
            Dashboard
          </button>

          <button className="active">
            Search Flats
          </button>

          <button onClick={() => navigate('/favorites')}>
            Favorites
          </button>

          <button onClick={() => navigate('/rental-requests')}>
            My Requests
          </button>

          <button onClick={() => navigate('/profile')}>
            Profile
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </nav>

      {/* Search Section */}
      <section className="search-flats-section">

        <h1>Search Flats</h1>

        <p className="search-subtitle">
          Find your perfect home without a broker
        </p>

        {/* Search City / Location */}
        <div className="search-box">

          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button
            className="search-button"
            onClick={searchByCity}
            disabled={loading}
          >
            Search City
          </button>

          <input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <button
            className="search-button"
            onClick={searchByLocation}
            disabled={loading}
          >
            Search Location
          </button>

        </div>

        {/* Filters */}
        <div className="filter-box">

          {/* Minimum Rent */}
          <div className="filter-group">

            <label>Minimum Rent</label>

            <input
              type="number"
              min="0"
              placeholder="Min rent"
              value={minRent}
              onChange={(e) => setMinRent(e.target.value)}
            />

          </div>

          {/* Maximum Rent */}
          <div className="filter-group">

            <label>Maximum Rent</label>

            <input
              type="number"
              min="0"
              placeholder="Max rent"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
            />

          </div>

          {/* Property Type */}
          <div className="filter-group">

            <label>Property Type</label>

            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="">Select property type</option>
              <option value="1 RK">1 RK</option>
              <option value="1 BHK">1 BHK</option>
              <option value="2 BHK">2 BHK</option>
              <option value="3 BHK">3 BHK</option>
              <option value="1 HALL">1 HALL</option>
              <option value="STUDIO">STUDIO</option>
            </select>

          </div>

          {/* Furnishing */}
          <div className="filter-group">

            <label>Furnishing</label>

            <select
              value={furnishing}
              onChange={(e) => setFurnishing(e.target.value)}
            >
              <option value="">Select furnishing</option>
              <option value="FULLY-FURNISHED">Fully Furnished</option>
              <option value="SEMI-FURNISHED">Semi Furnished</option>
              <option value="UNFURNISHED">Unfurnished</option>
            </select>

          </div>

          {/* Tenant Preference */}
          <div className="filter-group">

            <label>Tenant Preference</label>

            <select
              value={tenantPreference}
              onChange={(e) => setTenantPreference(e.target.value)}
            >
              <option value="">Select preference</option>
              <option value="FAMILY">Family</option>
              <option value="BACHELOR">Bachelor</option>
              <option value="GIRLS">Girls</option>
              <option value="BOYS">Boys</option>
            </select>

          </div>

          {/* Apply Filters */}
          <div className="filter-button-container">

            <button
              className="search-button"
              onClick={applyFilters}
              disabled={loading}
            >
              🔍 Apply Filters
            </button>

          </div>

        </div>

        {loading && (
          <p className="search-message">
            Searching...
          </p>
        )}

        {error && (
          <p className="search-error">
            {error}
          </p>
        )}

        {/* Properties */}
        <div className="search-property-grid">

          {properties.map((property) => (

            <div
              className="search-property-card"
              key={property.propertyId}
            >

              <div className="search-property-content">

                <h3>
                  {property.title}
                </h3>

                <p>
                  📍 {property.location}, {property.city}
                </p>

                <p className="search-property-rent">
                  💰 ₹{property.rent}
                </p>

                <p>
                  🏠 {property.propertyType}
                </p>

                <button
                  className="search-property-button"
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

        {!loading &&
          !error &&
          properties.length === 0 &&
          (city || location || minRent || maxRent || propertyType || furnishing || tenantPreference) && (
            <p className="no-properties">
              No properties found.
            </p>
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

export default SearchFlats;
