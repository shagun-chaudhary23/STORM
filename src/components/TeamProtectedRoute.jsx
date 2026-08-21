import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function TeamProtectedRoute() {
  const location = useLocation();
  const token = localStorage.getItem('storm_team_token');

  if (!token) {
    return <Navigate to="/team-login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
