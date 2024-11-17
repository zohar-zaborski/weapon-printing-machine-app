import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authAtom } from '../atoms/authAtoms';

interface ProtectedRouteProps {
  children: React.ReactElement; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated] = useAtom(authAtom);

  // If not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the children if authenticated
  return children;
};

export default ProtectedRoute;
