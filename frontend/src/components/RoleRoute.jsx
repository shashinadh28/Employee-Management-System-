import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, isTokenExpired, getToken, getUserRole } from '../utils/auth';

const RoleRoute = ({ allowed = [], children }) => {
  const location = useLocation();
  const token = getToken();

  // Require auth and a valid token
  if (!isAuthenticated() || isTokenExpired(token)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = getUserRole();
  if (allowed.length > 0 && !allowed.includes(role)) {
    // Redirect unauthorized roles to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;