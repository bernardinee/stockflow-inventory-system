import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import { itemsAPI, storage } from '../services/api';

/**
 * AddEditItem Component
 * Form for adding new items or editing existing ones
 */
const AddEditItem = ({ addNotification }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = storage.getUser();

  // Check if editing (item passed via navigation state)
  const editItem = location.state?.item;
  const isEditing = !!editItem;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Electronics',
    quantity: 0,
    price: 0,
    sku: '',
    lowStockThreshold: 10,
  });

  const categories = ['Electronics', 'Clothing', 'Food', 'Furniture', 'Books', 'Toys', 'Other'];

  // Load item data if editing
  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name || '',
        description: editItem.description || '',
        category: editItem.category || 'Electronics',
        quantity: editItem.quantity || 0,
        price: editItem.price || 0,
        sku: editItem.sku || '',
        lowStockThreshold: editItem.lowStockThreshold || 10,
      });
    }
  }, [editItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate
    if (formData.quantity < 0 || formData.price < 0) {
      addNotification({
        type: 'error',
        message: 'Quantity and price cannot be negative',
      });
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        // Update existing item
        await itemsAPI.update(editItem._id, formData);
        addNotification({
          type: 'success',
          message: 'Item updated successfully',
        });
      } else {
        // Create new item
        await itemsAPI.create(formData);
        addNotification({
          type: 'success',
          message: 'Item created successfully',
        });
      }

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
    <div className="add-edit-page">
      <Navbar user={user} />

      <div className="form-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="form-wrapper"
        >
          <div className="form-header">
            <button onClick={() => navigate('/dashboard')} className="back-btn">
              <FiArrowLeft size={20} />
              Back
            </button>
            <h1>{isEditing ? 'Edit Item' : 'Add New Item'}</h1>
          </div>

          <form onSubmit={handleSubmit} className="item-form">
            <div className="form-row">
              <div className="form-group">
                <label>
                  Product Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Category <span className="required">*</span>
                </label>
                <select name="category" value={formData.category} onChange={handleChange} required>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>
                Description <span className="required">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Quantity <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Price ($) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>SKU (Optional)</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Stock Keeping Unit"
                />
              </div>

              <div className="form-group">
                <label>Low Stock Threshold</label>
                <input
                  type="number"
                  name="lowStockThreshold"
                  value={formData.lowStockThreshold}
                  onChange={handleChange}
                  placeholder="10"
                  min="0"
                />
              </div>
            </div>

            <div className="form-actions">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate('/dashboard')}
                className="cancel-btn"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="save-btn"
                disabled={loading}
              >
                <FiSave size={18} />
                {loading ? 'Saving...' : isEditing ? 'Update Item' : 'Create Item'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddEditItem;
