import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../adminpagestyle/AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      // Safely parse the response
      const responseText = await response.text();

      let result = {};

      try {
        result = responseText
          ? JSON.parse(responseText)
          : {};
      } catch {
        result = { message: responseText };
      }

      // Handle login errors
      if (!response.ok) {
        if (
          response.status === 401 ||
          response.status === 403
        ) {
          setMessage("Invalid email or password.");
        } else {
          setMessage(
            result.message ||
              `Login failed. Status: ${response.status}`
          );
        }
        return;
      }

      // Only ADMIN is allowed
      if (result.roleName !== "ADMIN") {
        setMessage(
          "Access denied. Only Admin can login here."
        );
        return;
      }

      // Read JWT token
      const token =
        result.token ||
        result.jwtToken ||
        result.accessToken;

      if (!token) {
        console.error(
          "JWT token is missing from login response."
        );
        setMessage(
          "Login token missing. Please try again."
        );
        return;
      }

      // Store admin information and JWT
      localStorage.setItem("token", token);
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("roleName", result.roleName);

      console.log(
        "Admin login token saved:",
        Boolean(localStorage.getItem("token"))
      );

      // Navigate to Admin Dashboard
      navigate("/admin-dashboard");

    } catch (error) {
      console.error("Admin Login Error:", error);
      setMessage(
        "Unable to connect to server. Please try again."
      );
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <h1>ZERO BROKER</h1>

        <h2>Admin Login</h2>

        <p className="admin-login-subtitle">
          Login to manage the ZeroBroker platform
        </p>

        <form onSubmit={handleLogin}>
          <div className="admin-input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="admin-input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="admin-login-button"
          >
            LOGIN
          </button>
        </form>

        {message && (
          <p className="admin-login-message">
            {message}
          </p>
        )}

        <button
          type="button"
          className="admin-back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;