import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedUser = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Check for token expiration
    if (decodedUser.exp && decodedUser.exp < currentTime) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    // Check if user role is allowed
    if (allowedRoles && !allowedRoles.includes(decodedUser.role)) {
      if (decodedUser.role === 'admin' || decodedUser.role === 'superadmin') {
        return <Navigate to="/admin-dashboard" replace />;
      } else if (decodedUser.role === 'user') {
        return <Navigate to="/user-dashboard" replace />;
      } else {
        return <Navigate to="/login" replace />;
      }
    }

    return children;
  } catch (error) {
    console.error("ProtectedRoute: invalid token", error);
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
