import './App.css';
import { useNavigate } from "react-router-dom";


function ChooseRole() {
  const navigate = useNavigate();
  return (
    <div className="choose-role">

      <h1>Choose Your Role</h1>

      <p>Select how you want to use ZeroBroker</p>

      <div className="role-container">

        <div className="role-card">
          <div className="role-icon">👤</div>
          <h2>USER</h2>
          <p>Search and rent properties</p>
          <button>Select User</button>
        </div>

        <div className="role-card">
          <div className="role-icon">🏠</div>
          <h2>OWNER</h2>
          <p>List and manage your properties</p>
          <button>Select Owner</button>
        </div>

        <div className="role-card">
           <div className="role-icon">🛡️</div>

                <h2>ADMIN</h2>

                  <p>Manage the ZeroBroker platform</p>

                    <button onClick={() => navigate("/admin-login")}>
                      Continue
                    </button>
         </div>

      </div>

    </div>
  );
}

export default ChooseRole;