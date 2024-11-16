import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authAtom } from './atoms/authAtoms';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Customizer from './components/Customizer'; // Import Customizer component

const App: React.FC = () => {
  const [isAuthenticated] = useAtom(authAtom);

  return (
    <Router>
      <Routes>
        {/* Redirect to /login by default */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customize"
          element={
            <ProtectedRoute>
              <Customizer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
