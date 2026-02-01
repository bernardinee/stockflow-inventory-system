import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiPackage,
  FiDollarSign,
  FiAlertTriangle,
  FiTrendingUp,
} from 'react-icons/fi';
import Navbar from '../components/Navbar';
import ItemCard from '../components/ItemCard';
import ItemModal from '../components/ItemModal';
import { itemsAPI, storage } from '../services/api';

/**
 * Dashboard Component
 * Main page showing inventory items list with filters and stats
 */
const Dashboard = ({ addNotification }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showLowStock, setShowLowStock] = useState(false);

  const user = storage.getUser();

  const categories = ['All', 'Electronics', 'Clothing', 'Food', 'Furniture', 'Books', 'Toys', 'Other'];

  // Fetch items and stats on mount
  useEffect(() => {
    fetchItems();
    fetchStats();
  }, []);

  // Filter items when search/filter changes
  useEffect(() => {
    filterItems();
  }, [items, searchTerm, categoryFilter, showLowStock]);

  const fetchItems = async () => {
    try {
      const response = await itemsAPI.getAll();
      setItems(response.data.data);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to fetch items',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await itemsAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const filterItems = () => {
    let filtered = items;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    // Low stock filter
    if (showLowStock) {
      filtered = filtered.filter(
        (item) => item.quantity <= (item.lowStockThreshold || 10)
      );
    }

    setFilteredItems(filtered);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    try {
      await itemsAPI.delete(item._id);
      addNotification({
        type: 'success',
        message: 'Item deleted successfully',
      });
      fetchItems();
      fetchStats();
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to delete item',
      });
    }
  };

  const handleEdit = (item) => {
    navigate('/add-item', { state: { item } });
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <FiPackage size={48} />
        </motion.div>
        <p>Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar user={user} />

      <div className="dashboard-container">
        {/* Stats Section */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="stats-grid"
          >
            <div className="stat-card">
              <div className="stat-icon blue">
                <FiPackage size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Items</p>
                <h3 className="stat-value">{stats.totalItems}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <FiDollarSign size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Value</p>
                <h3 className="stat-value">${stats.totalValue.toFixed(2)}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">
                <FiAlertTriangle size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Low Stock</p>
                <h3 className="stat-value">{stats.lowStockItems}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon red">
                <FiTrendingUp size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Out of Stock</p>
                <h3 className="stat-value">{stats.outOfStockItems}</h3>
              </div>
            </div>
          </motion.div>
        )}

        {/* Controls Section */}
        <div className="controls-section">
          <div className="search-bar">
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <div className="category-filter">
              <FiFilter size={18} />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showLowStock}
                onChange={(e) => setShowLowStock(e.target.checked)}
              />
              Low Stock Only
            </label>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="add-btn"
              onClick={() => navigate('/add-item')}
            >
              <FiPlus size={20} />
              Add Item
            </motion.button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="items-section">
          <h2>
            Inventory Items
            <span className="item-count">({filteredItems.length})</span>
          </h2>

          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="empty-state"
            >
              <FiPackage size={64} />
              <h3>No items found</h3>
              <p>
                {items.length === 0
                  ? 'Start by adding your first inventory item'
                  : 'Try adjusting your filters'}
              </p>
              {items.length === 0 && (
                <button onClick={() => navigate('/add-item')} className="add-btn">
                  <FiPlus size={20} />
                  Add First Item
                </button>
              )}
            </motion.div>
          ) : (
            <div className="items-grid">
              {filteredItems.map((item, index) => (
                <ItemCard
                  key={item._id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

export default Dashboard;
