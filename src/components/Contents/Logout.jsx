import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase.jsx';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.alert("You have been logged out successfully."); // Display alert upon logout
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <div className="container-fluid min-vh-90 d-flex flex-column justify-content-center align-items-center">
      <div className="row">
        <div className="col text-center">
          <h1 className="text-white display-4">Logout</h1>
          <p className="text-white fs-5">Are you sure you want to logout?</p>
        </div>
      </div>
      <div className="row">
        <div className="col text-center">
          <button onClick={handleLogout} className="btn btn-danger btn-lg">Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Logout;
