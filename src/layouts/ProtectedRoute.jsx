import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('token'); // Retrieve token

  if (!token) {
    return <Navigate to="/login" replace />; // Redirect to login if no token
  }

  return children;
};

export default ProtectedRoute;
