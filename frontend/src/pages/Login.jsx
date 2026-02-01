import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiPackage } from 'react-icons/fi';
import { authAPI, storage } from '../services/api';

/**
 * Login Page Component
 * Handles user authentication (login and register)
 */
const Login = ({ addNotification }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;

      if (isLogin) {
        // Login
        response = await authAPI.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        // Register
        response = await authAPI.register(formData);
      }

      const { token, ...user } = response.data.data;

      // Save to localStorage
      storage.setToken(token);
      storage.setUser(user);

      addNotification({
        type: 'success',
        message: isLogin ? 'Login successful!' : 'Account created successfully!',
      });

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        'An error occurred';

      addNotification({
        type: 'error',
        message: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-container"
      >
        <div className="login-header">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="login-icon"
          >
            <FiPackage size={48} />
          </motion.div>
          <h1>StockFlow</h1>
          <p>Inventory Management System</p>
        </div>

        <div className="login-tabs">
          <button
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="form-group"
            >
              <label>
                <FiUser size={18} />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required={!isLogin}
              />
            </motion.div>
          )}

          <div className="form-group">
            <label>
              <FiMail size={18} />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FiLock size={18} />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              minLength="6"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
          </motion.button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
