import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const RoleRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user || !allowedRoles.includes(user.role)) {
    if (user) {
      // Redirect to their respective dashboard
      return <Navigate to={`/${user.role}/dashboard`} replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};
