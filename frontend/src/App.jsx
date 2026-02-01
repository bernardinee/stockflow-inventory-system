import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddEditItem from './pages/AddEditItem';
import { NotificationContainer } from './components/Notification';
import { storage } from './services/api';
import './App.css';

/**
 * Main App Component
 * Handles routing, authentication, and global notifications
 */
function App() {
  const [notifications, setNotifications] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const token = storage.getToken();
    setIsAuthenticated(!!token);
  }, []);

  /**
   * Add a new notification
   * @param {Object} notification - { type: 'success' | 'error', message: string }
   */
  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { ...notification, id }]);
  };

  /**
   * Remove a notification by ID
   */
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  /**
   * Protected Route Component
   * Redirects to login if not authenticated
   */
  const ProtectedRoute = ({ children }) => {
    const token = storage.getToken();
    return token ? children : <Navigate to="/login" replace />;
  };

  /**
   * Public Route Component
   * Redirects to dashboard if already authenticated
   */
  const PublicRoute = ({ children }) => {
    const token = storage.getToken();
    return !token ? children : <Navigate to="/dashboard" replace />;
  };

  return (
    <Router>
      <div className="app">
        {/* Global Notification Container */}
        <NotificationContainer
          notifications={notifications}
          removeNotification={removeNotification}
        />

        {/* Routes */}
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login addNotification={addNotification} />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard addNotification={addNotification} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-item"
            element={
              <ProtectedRoute>
                <AddEditItem addNotification={addNotification} />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
