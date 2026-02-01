
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Electronics', 'Clothing', 'Food', 'Furniture', 'Books', 'Toys', 'Other'],
        message: '{VALUE} is not a valid category',
      },
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    sku: {
      type: String,
      unique: true,
      trim: true,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [0, 'Low stock threshold cannot be negative'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

/**
 * Index for faster queries
 */
itemSchema.index({ name: 'text', description: 'text' }); // Text search index
itemSchema.index({ category: 1 }); // Category index for filtering
itemSchema.index({ user: 1 }); // User index for user-specific queries

/**
 * Virtual field to check if item is low in stock
 */
itemSchema.virtual('isLowStock').get(function () {
  return this.quantity <= this.lowStockThreshold;
});

/**
 * Auto-generate SKU before saving if not provided
 */
itemSchema.pre('save', function (next) {
  if (!this.sku) {
    const categoryCode = this.category
      ? this.category.substring(0, 3).toUpperCase()
      : 'GEN';
    this.sku = `${categoryCode}-${Date.now()}`;
  }
  next();
});

/**
 * Ensure virtuals are included in JSON output
 */
itemSchema.set('toJSON', { virtuals: true });
itemSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Item', itemSchema);