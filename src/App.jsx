import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import AppRoutes from './routes';
import "./styles/global.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  // State to track login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on initial render and when sessionStorage changes
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    setIsLoggedIn(token !== null);
  }, []);

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        {/* Conditionally render the Header based on login status */}
        {isLoggedIn && <Header setIsLoggedIn={setIsLoggedIn} />}
        <div className="flex-grow-1">
          <AppRoutes setIsLoggedIn={setIsLoggedIn} />
          <ToastContainer />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;