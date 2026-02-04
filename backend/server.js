require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, testConnection } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { authenticate } = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/stores');
const productRoutes = require('./routes/products');
const inventoryRoutes = require('./routes/inventory');
const transferRoutes = require('./routes/transfers');
const invoiceRoutes = require('./routes/invoices');
const debtRoutes = require('./routes/debts');
const reportRoutes = require('./routes/reports');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/debts', debtRoutes);
app.use('/api/reports', reportRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Database sync and server start
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database (create tables if they don't exist)
    // Use { force: true } to drop and recreate tables (CAUTION: deletes all data)
    // Use { alter: true } to update tables to match models (safer for development)
    await sequelize.sync({ alter: false });
    console.log('✅ Database synchronized');

    // Start server
    app.listen(port, () => {
      console.log(`🚀 Backend server running on port ${port}`);
      console.log(`📍 API endpoint: http://localhost:${port}/api`);
      console.log(`🏥 Health check: http://localhost:${port}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
