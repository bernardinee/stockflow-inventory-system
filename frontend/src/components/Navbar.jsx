import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogOut, FiPackage, FiUser } from 'react-icons/fi';
import { storage } from '../services/api';

/**
 * Navbar Component
 * Top navigation bar with user info and logout
 */
const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    storage.clear();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="navbar"
    >
      <div className="navbar-container">
        <div className="navbar-brand">
          <FiPackage size={28} />
          <h1>StockFlow</h1>
        </div>

        <div className="navbar-actions">
          <div className="user-info">
            <FiUser size={18} />
            <span>{user?.name || 'User'}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="logout-btn"
          >
            <FiLogOut size={18} />
            Logout
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
