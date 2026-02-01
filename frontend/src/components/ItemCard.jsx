import React from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiAlertCircle } from 'react-icons/fi';

/**
 * ItemCard Component
 * Displays a single inventory item in a card format
 */
const ItemCard = ({ item, onEdit, onDelete, onClick }) => {
  const isLowStock = item.quantity <= (item.lowStockThreshold || 10);
  const isOutOfStock = item.quantity === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className={`item-card ${isOutOfStock ? 'out-of-stock' : ''}`}
      onClick={onClick}
    >
      <div className="item-card-header">
        <div className="item-category">{item.category}</div>
        {isLowStock && !isOutOfStock && (
          <div className="low-stock-badge">
            <FiAlertCircle size={14} />
            Low Stock
          </div>
        )}
        {isOutOfStock && (
          <div className="out-of-stock-badge">
            Out of Stock
          </div>
        )}
      </div>

      <h3 className="item-name">{item.name}</h3>
      <p className="item-description">{item.description}</p>

      <div className="item-details">
        <div className="detail-item">
          <span className="detail-label">Quantity</span>
          <span className={`detail-value ${isLowStock ? 'warning' : ''}`}>
            {item.quantity}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Price</span>
          <span className="detail-value">${item.price.toFixed(2)}</span>
        </div>
      </div>

      <div className="item-footer">
        <div className="item-value">
          Total: <strong>${(item.price * item.quantity).toFixed(2)}</strong>
        </div>
        <div className="item-actions">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="action-btn edit-btn"
            title="Edit"
          >
            <FiEdit2 size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
            className="action-btn delete-btn"
            title="Delete"
          >
            <FiTrash2 size={16} />
          </motion.button>
        </div>
      </div>

      {item.sku && <div className="item-sku">SKU: {item.sku}</div>}
    </motion.div>
  );
};

export default ItemCard;
