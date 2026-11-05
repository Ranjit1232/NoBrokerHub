import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../adminpagestyle/ManageProperties.css";

function ManageProperties() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Login token not found. Please login again.");
        return;
      }

      const response = await fetch(
        "http://localhost:8080/api/admin/properties",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || `Failed to fetch properties (${response.status})`
        );
      }

      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Fetch Properties Error:", error);
      setMessage("Unable to load properties.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Property
  const handleDeleteProperty = async (propertyId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property? All related data will also be deleted."
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Login token not found. Please login again.");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/admin/properties/${propertyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.text();

      if (!response.ok) {
        throw new Error(
          result || `Failed to delete property (${response.status})`
        );
      }

      // Remove deleted property from UI
      setProperties((previousProperties) =>
        previousProperties.filter(
          (property) => property.propertyId !== propertyId
        )
      );

      setMessage("Property deleted successfully.");
    } catch (error) {
      console.error("Delete Property Error:", error);
      setMessage(error.message || "Unable to delete property.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="manage-properties-page">
      {/* Navbar */}
      <nav className="admin-navbar">
        <div className="admin-logo">ZERO BROKER</div>

        <div className="admin-nav-links">
          <button onClick={() => navigate("/admin-dashboard")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/admin/users")}>
            Users
          </button>

          <button onClick={() => navigate("/admin/owners")}>
            Owners
          </button>

          <button
            className="active-admin-link"
            onClick={() => navigate("/admin/properties")}
          >
            Properties
          </button>

          <button onClick={() => navigate("/admin/complaints")}>
            Complaints
          </button>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Content */}
      <div className="manage-properties-content">
        <h1>Manage Properties</h1>

        <p className="manage-properties-subtitle">
          View all properties listed on ZeroBroker
        </p>

        {loading && (
          <p className="properties-message">Loading properties...</p>
        )}

        {message && (
          <p className="properties-success">{message}</p>
        )}

        {!loading && !message && properties.length === 0 && (
          <div className="no-properties">
            <h2>No Properties Found</h2>
            <p>There are no properties listed yet.</p>
          </div>
        )}

        {!loading && !message && properties.length > 0 && (
          <div className="properties-table-container">
            <table className="properties-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>BHK</th>
                  <th>Rent</th>
                  <th>Deposit</th>
                  <th>City</th>
                  <th>Location</th>
                  <th>Furnishing</th>
                  <th>Tenant Preference</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {properties.map((property) => (
                  <tr key={property.propertyId}>
                    <td>{property.propertyId}</td>
                    <td>{property.title}</td>
                    <td>{property.propertyType}</td>
                    <td>{property.bhk ?? "-"}</td>
                    <td>₹{property.rent}</td>
                    <td>₹{property.deposit}</td>
                    <td>{property.city}</td>
                    <td>{property.location}</td>
                    <td>{property.furnishing}</td>
                    <td>{property.tenantPreference}</td>

                    <td>
                      <strong>{property.ownerName}</strong>
                      <br />
                      <small>{property.ownerEmail}</small>
                    </td>

                    <td>
                      <span className="property-status">
                        {property.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="delete-property-button"
                        onClick={() =>
                          handleDeleteProperty(property.propertyId)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="admin-footer">
        <p>© 2026 ZeroBroker. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default ManageProperties;
