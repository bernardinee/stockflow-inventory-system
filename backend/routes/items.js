const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Item = require('../models/Item');
const { protect } = require('../middleware/auth');

// All routes are protected - require authentication
router.use(protect);

/**
 * @route   GET /api/items
 * @desc    Get all inventory items for logged-in user
 * @access  Private
 * @query   search - Search in name/description
 * @query   category - Filter by category
 * @query   lowStock - Show only low stock items (true/false)
 * @query   sort - Sort field (e.g., 'name', '-price', 'quantity')
 */
router.get('/', async (req, res) => {
  try {
    const { search, category, lowStock, sort } = req.query;

    // Build query
    let query = { user: req.user._id };

    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Execute query
    let itemsQuery = Item.find(query);

    // Sort
    if (sort) {
      itemsQuery = itemsQuery.sort(sort);
    } else {
      itemsQuery = itemsQuery.sort('-createdAt'); // Default: newest first
    }

    let items = await itemsQuery;

    // Filter low stock items (done after query for virtual field)
    if (lowStock === 'true') {
      items = items.filter((item) => item.isLowStock);
    }

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching items',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/items/:id
 * @desc    Get single inventory item by ID
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Make sure user owns this item
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this item',
      });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching item',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/items
 * @desc    Create new inventory item
 * @access  Private
 */
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('quantity')
      .isNumeric()
      .withMessage('Quantity must be a number')
      .custom((value) => value >= 0)
      .withMessage('Quantity cannot be negative'),
    body('price')
      .isNumeric()
      .withMessage('Price must be a number')
      .custom((value) => value >= 0)
      .withMessage('Price cannot be negative'),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const { name, description, category, quantity, price, sku, lowStockThreshold } =
        req.body;

      // Create item
      const item = await Item.create({
        name,
        description,
        category,
        quantity,
        price,
        sku,
        lowStockThreshold,
        user: req.user._id,
      });

      res.status(201).json({
        success: true,
        message: 'Item created successfully',
        data: item,
      });
    } catch (error) {
      console.error('Create item error:', error);

      // Handle duplicate SKU error
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'SKU already exists',
        });
      }

      res.status(500).json({
        success: false,
        message: 'Server error creating item',
        error: error.message,
      });
    }
  }
);

/**
 * @route   PUT /api/items/:id
 * @desc    Update inventory item
 * @access  Private
 */
router.put('/:id', async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Make sure user owns this item
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item',
      });
    }

    // Update item
    item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return updated document
      runValidators: true, // Run schema validators
    });

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: item,
    });
  } catch (error) {
    console.error('Update item error:', error);

    // Handle duplicate SKU error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'SKU already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating item',
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/items/:id
 * @desc    Delete inventory item
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Make sure user owns this item
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item',
      });
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: 'Item deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting item',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/items/stats/summary
 * @desc    Get inventory statistics
 * @access  Private
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const items = await Item.find({ user: req.user._id });

    const stats = {
      totalItems: items.length,
      totalValue: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      lowStockItems: items.filter((item) => item.isLowStock).length,
      outOfStockItems: items.filter((item) => item.quantity === 0).length,
      categoryCounts: {},
    };

    // Count items per category
    items.forEach((item) => {
      stats.categoryCounts[item.category] =
        (stats.categoryCounts[item.category] || 0) + 1;
    });

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics',
      error: error.message,
    });
  }
});

module.exports = router;
