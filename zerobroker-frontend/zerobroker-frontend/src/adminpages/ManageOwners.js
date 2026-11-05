import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../adminpagestyle/ManageOwners.css";

function ManageOwners() {

  const navigate = useNavigate();

  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
     const token = localStorage.getItem("token");

const response = await fetch(
  "http://localhost:8080/api/admin/owners",
  {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  }
);

      if (!response.ok) {
        throw new Error("Failed to fetch owners");
      }

      const data = await response.json();
      setOwners(data);

    } catch (error) {
      console.error(error);
      setMessage("Unable to load owners.");

    } finally {
      setLoading(false);
    }
  };

  // Delete Owner
  const handleDeleteOwner = async (userId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this owner? All properties and related data of this owner will also be deleted."
    );

    if (!confirmDelete) {
      return;
    }

    try {

      setMessage("");
      const token = localStorage.getItem("token");
const response = await fetch(
  `http://localhost:8080/api/admin/owners/${userId}`,
  {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      const result = await response.text();

      if (!response.ok) {
        throw new Error(result || "Failed to delete owner");
      }

      // Remove deleted owner from table
      setOwners((previousOwners) =>
        previousOwners.filter(
          (owner) => owner.userId !== userId
        )
      );

      setMessage("Owner deleted successfully.");

    } catch (error) {

      console.error(error);

      setMessage(
        error.message || "Unable to delete owner."
      );
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="manage-owners-page">

      {/* Navbar */}
      <nav className="admin-navbar">

        <div className="admin-logo">
          ZERO BROKER
        </div>

        <div className="admin-nav-links">

          <button onClick={() => navigate("/admin-dashboard")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/admin/users")}>
            Users
          </button>

          <button
            className="active-admin-link"
            onClick={() => navigate("/admin/owners")}
          >
            Owners
          </button>

          <button onClick={() => navigate("/admin/properties")}>
            Properties
          </button>

          <button onClick={() => navigate("/admin/complaints")}>
            Complaints
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </nav>

      {/* Content */}
      <div className="manage-owners-content">

        <h1>Manage Owners</h1>

        <p className="manage-owners-subtitle">
          View all registered property owners on ZeroBroker
        </p>

        {loading && (
          <p className="owners-message">
            Loading owners...
          </p>
        )}

        {message && (
          <p className="owners-success">
            {message}
          </p>
        )}

        {!loading && owners.length === 0 && (
          <div className="no-owners">

            <h2>No Owners Found</h2>

            <p>
              There are no registered owners yet.
            </p>

          </div>
        )}

        {!loading && owners.length > 0 && (

          <div className="owners-table-container">

            <table className="owners-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {owners.map((owner) => (

                  <tr key={owner.userId}>

                    <td>{owner.userId}</td>

                    <td>{owner.fullName}</td>

                    <td>{owner.email}</td>

                    <td>{owner.phone}</td>

                    <td>{owner.city}</td>

                    <td>
                      <span className="owner-status">
                        {owner.status}
                      </span>
                    </td>

                    <td>

                      <button
                        className="delete-owner-button"
                        onClick={() =>
                          handleDeleteOwner(owner.userId)
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

export default ManageOwners;