import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminJourney from '../../pages/admin/AdminJourney';
import AdminProjects from '../../pages/admin/AdminProjects';
import AdminSkills from '../../pages/admin/AdminSkills';

// This is a temporary auth check. In a real app, you'd want to implement proper authentication
const isAuthenticated = () => {
  // Replace this with actual authentication logic
  return true;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    // Redirect to login page if not authenticated
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
};

const AdminRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminJourney />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/journey" 
          element={
            <ProtectedRoute>
              <AdminJourney />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/projects" 
          element={
            <ProtectedRoute>
              <AdminProjects />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/skills" 
          element={
            <ProtectedRoute>
              <AdminSkills />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default AdminRouter;
