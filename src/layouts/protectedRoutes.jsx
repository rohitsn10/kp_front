import { Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// ProtectedRoute Component
const ProtectedRoute = ({ element: Component, ...rest }) => {
  const token = sessionStorage.getItem('authToken'); // Get token from sessionStorage

  if (!token) {
    // If there's no token, redirect to login page
    return <Navigate to="/login" />;
  }

  return <Route {...rest} element={<Component />} />;
};
