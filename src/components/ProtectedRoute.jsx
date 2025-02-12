import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = sessionStorage.getItem('token'); // Get the token from sessionStorage
  const role = sessionStorage.getItem('role'); // Get the user's role from sessionStorage

  // If the user is not logged in, redirect to the login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If a specific role is required and the user doesn't have it, redirect to the dashboard
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  // Otherwise, allow access to the requested route
  return children;
};

export default ProtectedRoute;