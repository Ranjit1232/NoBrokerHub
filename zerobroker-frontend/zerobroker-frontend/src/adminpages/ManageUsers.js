
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../adminpagestyle/ManageUsers.css";

function ManageUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Get JWT token saved during login
  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("jwtToken") ||
      localStorage.getItem("jwt") ||
      localStorage.getItem("accessToken")
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error(
          "Login token not found. Please logout and login again."
        );
      }

      const response = await fetch(
        "http://localhost:8080/api/admin/users",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Session expired or token invalid. Please login again."
          );
        }

        if (response.status === 403) {
          throw new Error(
            "Access denied. Please login with an ADMIN account."
          );
        }

        throw new Error(
          `Unable to load users. Server returned ${response.status}.`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected response received from server.");
      }

      setUsers(data);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(err.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user? All related data of this user will also be deleted."
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Login token not found. Please login again."
        );
      }

      const response = await fetch(
        `http://localhost:8080/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.text();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }

        if (response.status === 403) {
          throw new Error("Access denied. ADMIN permission required.");
        }

        throw new Error(
          result || `Failed to delete user (${response.status}).`
        );
      }

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user.userId !== userId
        )
      );

      setMessage(result || "User deleted successfully.");
    } catch (err) {
      console.error("Delete user error:", err);
      setError(err.message || "Unable to delete user.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="manage-users-page">
      {/* Navbar */}
      <nav className="admin-navbar">
        <div className="admin-logo">ZERO BROKER</div>

        <div className="admin-nav-links">
          <button onClick={() => navigate("/admin-dashboard")}>
            Dashboard
          </button>

          <button
            className="active-admin-link"
            onClick={() => navigate("/admin/users")}
          >
            Users
          </button>

          <button onClick={() => navigate("/admin/owners")}>
            Owners
          </button>

          <button onClick={() => navigate("/admin/properties")}>
            Properties
          </button>

          <button onClick={() => navigate("/admin/complaints")}>
            Complaints
          </button>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Content */}
      <div className="manage-users-content">
        <h1>Manage Users</h1>

        <p className="manage-users-subtitle">
          View all registered users on ZeroBroker
        </p>

        {loading && (
          <p className="users-message">Loading users...</p>
        )}

        {error && (
          <p className="users-error" role="alert">
            {error}
          </p>
        )}

        {message && (
          <p className="users-success" role="status">
            {message}
          </p>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="no-users">
            <h2>No Users Found</h2>
            <p>There are no registered users yet.</p>
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="users-table-container">
            <table className="users-table">
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
                {users.map((user) => (
                  <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.city}</td>
                    <td>
                      <span className="user-status">
                        {user.status}
                      </span>
                    </td>

                    <td>
                      {user.roleName === "ADMIN" ? (
                        <span className="admin-protected">
                          Protected
                        </span>
                      ) : (
                        <button
                          className="delete-user-button"
                          onClick={() =>
                            handleDeleteUser(user.userId)
                          }
                        >
                          Delete
                        </button>
                      )}
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

export default ManageUsers;
