import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, isTokenExpired, getToken } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = getToken();

  // Check if user is authenticated and token is not expired
  if (!isAuthenticated() || isTokenExpired(token)) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;