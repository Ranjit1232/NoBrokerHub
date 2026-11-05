import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import ChooseRole from './ChooseRole';
import UserAuth from './UserAuth';
import UserDashboard from './pages/UserDashboard';
import PropertyDetails from './pages/PropertyDetails';
import Favorites from './pages/Favorites';
import RentalRequests from './pages/RentalRequests';
import Profile from './pages/Profile';
import SearchFlats from './pages/SearchFlats';
import OwnerDashboard from './ownerpages/OwnerDashboard';
import AddProperty from './ownerpages/AddProperty';
import OwnerProfile from './ownerpages/OwnerProfile';
import MyProperties from './ownerpages/MyProperties';
import UpdateProperty from './ownerpages/UpdateProperty';
import InterestedUsers from './ownerpages/InterestedUsers';
import AdminDashboard from "./adminpages/AdminDashboard";
import AdminLogin from "./adminpages/AdminLogin";
import ManageUsers from "./adminpages/ManageUsers";
import ManageOwners from "./adminpages/ManageOwners";
import ManageProperties from "./adminpages/ManageProperties";



function LandingPage() {

  const [showRolePopup, setShowRolePopup] = useState(false);

  return (
    <div className="app">

      <nav className="navbar">
        <h2>ZERO BROKER</h2>

        <div className="nav-links">
          <span>Home</span>
          <span>About</span>
          <span>Contact</span>
          <button>Login</button>
        </div>
      </nav>

      <section className="hero">

        <div className="hero-content">

          <div className="welcome-text">
            🏠 Welcome to ZeroBroker
          </div>

          <h1>
            Find Your
            <span> Perfect Home</span>
          </h1>

          <p>
            Rent your dream home directly from property owners.
            No broker. No extra commission.
          </p>

          <div className="rgb-button-wrapper">

            <button
              className="get-started"
              onClick={() => setShowRolePopup(true)}
            >
              ✨ Get Started
            </button>

          </div>

        </div>

        <div className="hero-image">
          <div className="house-circle">
            🏠
          </div>
        </div>

      </section>

      <section className="features">

        <h2>Why ZeroBroker?</h2>

        <p className="section-subtitle">
          A simple way to find your home without paying brokerage.
        </p>

        <div className="feature-container">

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Easy Search</h3>
            <p>
              Search flats and homes according to your location,
              budget and requirements.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>No Brokerage</h3>
            <p>
              Connect directly with property owners and avoid
              unnecessary brokerage charges.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏠</div>
            <h3>Verified Properties</h3>
            <p>
              Explore available properties with important details.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Direct Contact</h3>
            <p>
              Contact property owners directly when you find
              the right property.
            </p>
          </div>

        </div>

      </section>

      {showRolePopup && (

        <div
          className="popup-overlay"
          onClick={() => setShowRolePopup(false)}
        >

          <div
            className="role-popup"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="close-button"
              onClick={() => setShowRolePopup(false)}
            >
              ✕
            </button>

            <h2>Choose Your Role</h2>

            <p>
              How do you want to use ZeroBroker?
            </p>

            <div className="popup-role-container">

              <div className="popup-role-card">
                <div>👤</div>
                <h3>USER</h3>
                <p>Find and rent your home</p>

                <button
                  onClick={() => window.location.href = '/user-auth'}
                >
                  Continue
                </button>
              </div>

              <div className="popup-role-card">
                <div>🏠</div>
                <h3>OWNER</h3>
                <p>List your property</p>

              <button
                 onClick={() => window.location.href = '/owner-auth'}
              >
                 Continue
              </button>
              </div>

        <div className="popup-role-card">
          <div>🛡️</div>
            <h3>ADMIN</h3>
            <p>Manage the platform</p>

                <button
                  onClick={() => window.location.href = "/admin-login"}
                >
                  Continue
                </button>
        </div>

            </div>

          </div>

        </div>

      )}

      <footer className="footer">
        <p>
          © 2026 ZeroBroker. All Rights Reserved.
        </p>
      </footer>

    </div>
  );
}


function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/user-auth" element={<UserAuth />} />
        <Route path="/owner-auth" element={<UserAuth />}/>
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/property/:propertyId" element={<PropertyDetails />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/rental-requests" element={<RentalRequests />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search-flats" element={<SearchFlats />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/add-property" element={<AddProperty />} />
        <Route path="/owner/profile" element={<OwnerProfile />} />
        <Route path="/owner/my-properties" element={<MyProperties />}/>
        <Route path="/owner/update-property/:propertyId" element={<UpdateProperty />} />
        <Route path="/owner/interested-users" element={<InterestedUsers />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/owners" element={<ManageOwners />} />
        <Route path="/admin/properties" element={<ManageProperties />}/>


      </Routes>

    </BrowserRouter>
  );
}

export default App;