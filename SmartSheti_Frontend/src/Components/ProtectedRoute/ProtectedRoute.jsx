import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

/**
 * ProtectedRoute
 * - Checks for an auth token (via AuthContext or localStorage).
 * - If authenticated, renders children, otherwise redirects to /signin.
 */
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  // Fallback to token check in localStorage for first-load cases
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (isLoggedIn || token) {
    return children;
  }

  return <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
