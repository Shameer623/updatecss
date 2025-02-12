import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const HomePage = () => {
  return (
    <div className="container home-page-background">
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="text-center">
          <h1>Welcome to SmartSpend!</h1>
          <p>Manage your expenses efficiently.</p>
          <Link to="/login" className="btn btn-success">
            Login <i className="fa-solid fa-right-to-bracket"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;