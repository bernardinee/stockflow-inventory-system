require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error("❌ MONGODB_URI is not set in environment variables!");
  process.exit(1); // Stop the app if no URI is provided
}

console.log("Connecting to MongoDB with URI:", mongoURI);

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Inventory Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      items: '/api/items',
      health: '/api/health',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`\n📋 Available routes:`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/auth/me`);
  console.log(`   GET    /api/items`);
  console.log(`   POST   /api/items`);
  console.log(`   GET    /api/items/:id`);
  console.log(`   PUT    /api/items/:id`);
  console.log(`   DELETE /api/items/:id`);
  console.log(`   GET    /api/items/stats/summary\n`);
});

module.exports = app;
