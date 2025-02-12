import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/Images/Logo_Smartspend.svg';
import "../../styles/Header.css";

const Header = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const username = sessionStorage.getItem('username');

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('username');
    setIsLoggedIn(false); // Update login state
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-light bg-light`}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src={Logo}
            alt="Smart Spend Logo"
            style={{ height: '40px' }}
          />
        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            {username && (
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
          {username && (
            <div className="d-flex">
              <span className="navbar-text me-3">Welcome, {username}!</span>
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                LOGOUT
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;