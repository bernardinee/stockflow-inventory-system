import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';

/**
 * Notification Component
 * Displays toast-style notifications
 * @param {string} type - 'success' or 'error'
 * @param {string} message - Message to display
 * @param {function} onClose - Callback when notification closes
 * @param {number} duration - Auto-close duration in ms (default: 4000)
 */
const Notification = ({ type = 'success', message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <FiCheckCircle size={20} />,
    error: <FiAlertCircle size={20} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`notification notification-${type}`}
    >
      <div className="notification-icon">{icons[type]}</div>
      <p className="notification-message">{message}</p>
      <button onClick={onClose} className="notification-close">
        <FiX size={18} />
      </button>
    </motion.div>
  );
};

/**
 * NotificationContainer Component
 * Container for managing multiple notifications
 */
export const NotificationContainer = ({ notifications, removeNotification }) => {
  return (
    <div className="notification-container">
      <AnimatePresence>
        {notifications.map((notif) => (
          <Notification
            key={notif.id}
            type={notif.type}
            message={notif.message}
            onClose={() => removeNotification(notif.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Notification;
