import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Customizer from "./components/Customizer"; // Import Customizer component
import SavedWeapons from "./components/SavedWeapons";
import PrintJobs from "./components/PrintJobs";
import Home from "./pages/Home";

const App: React.FC = () => {
  
  return (
    <Router>
      <Routes>
        {/* Redirect to /login by default */}
        <Route
          path="/"
          element={
            <Navigate to={"/login"} replace />
          }
        />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
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
        <Route
          path="/saved-weapons"
          element={
            <ProtectedRoute>
              <SavedWeapons />
            </ProtectedRoute>
          }
        />
        <Route
          path="/print-jobs"
          element={
            <ProtectedRoute>
              <PrintJobs />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
