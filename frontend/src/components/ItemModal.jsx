import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPackage, FiDollarSign, FiHash, FiTag } from 'react-icons/fi';

/**
 * ItemModal Component
 * Modal for displaying detailed item information
 */
const ItemModal = ({ item, onClose }) => {
  if (!item) return null;

  const isLowStock = item.quantity <= (item.lowStockThreshold || 10);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>{item.name}</h2>
            <button onClick={onClose} className="modal-close">
              <FiX size={24} />
            </button>
          </div>

          <div className="modal-body">
            <div className="modal-section">
              <div className="modal-label">
                <FiTag size={16} />
                Category
              </div>
              <div className="modal-value category-badge">{item.category}</div>
            </div>

            <div className="modal-section">
              <div className="modal-label">Description</div>
              <div className="modal-value">{item.description}</div>
            </div>

            <div className="modal-grid">
              <div className="modal-section">
                <div className="modal-label">
                  <FiPackage size={16} />
                  Quantity
                </div>
                <div className={`modal-value large ${isLowStock ? 'warning' : ''}`}>
                  {item.quantity}
                  {isLowStock && <span className="warning-text"> (Low Stock)</span>}
                </div>
              </div>

              <div className="modal-section">
                <div className="modal-label">
                  <FiDollarSign size={16} />
                  Price
                </div>
                <div className="modal-value large">${item.price.toFixed(2)}</div>
              </div>
            </div>

            <div className="modal-section">
              <div className="modal-label">Total Value</div>
              <div className="modal-value highlight">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>

            {item.sku && (
              <div className="modal-section">
                <div className="modal-label">
                  <FiHash size={16} />
                  SKU
                </div>
                <div className="modal-value mono">{item.sku}</div>
              </div>
            )}

            <div className="modal-section">
              <div className="modal-label">Low Stock Threshold</div>
              <div className="modal-value">{item.lowStockThreshold || 10}</div>
            </div>

            <div className="modal-footer">
              <div className="timestamp">
                <small>Created: {new Date(item.createdAt).toLocaleDateString()}</small>
              </div>
              <div className="timestamp">
                <small>Updated: {new Date(item.updatedAt).toLocaleDateString()}</small>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ItemModal;
