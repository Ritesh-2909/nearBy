const express = require('express');
const router = express.Router();

// Test/Mock data endpoints for development and testing

// Health check with detailed info
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mock vendors data for testing
router.get('/mock-vendors', (req, res) => {
  const mockVendors = [
    {
      _id: '1',
      name: 'Test Grocery Store',
      category: 'Groceries',
      description: 'A test grocery store for development',
      tags: ['fresh', 'organic'],
      location: {
        type: 'Point',
        coordinates: [77.2090, 28.6139], // Delhi coordinates
      },
      address: '123 Test Street, Test City',
      phone: '+91-1234567890',
      status: 'approved',
      viewCount: 100,
      clickCount: 50,
    },
    {
      _id: '2',
      name: 'Test Electronics Shop',
      category: 'Electronics',
      description: 'A test electronics shop',
      tags: ['mobile', 'laptops'],
      location: {
        type: 'Point',
        coordinates: [77.2190, 28.6239],
      },
      address: '456 Test Avenue, Test City',
      phone: '+91-9876543210',
      status: 'approved',
      viewCount: 200,
      clickCount: 75,
    },
    {
      _id: '3',
      name: 'Test Food Stall',
      category: 'Food & Beverages',
      description: 'A test food stall',
      tags: ['street-food', 'cheap'],
      location: {
        type: 'Point',
        coordinates: [77.2290, 28.6339],
      },
      address: '789 Test Road, Test City',
      status: 'pending',
      viewCount: 50,
      clickCount: 25,
    },
  ];

  res.json({
    vendors: mockVendors,
    count: mockVendors.length,
  });
});

// Mock nearby vendors endpoint
router.get('/mock-nearby', (req, res) => {
  const { lat = 28.6139, lng = 77.2090, radius = 5000 } = req.query;

  const mockVendors = [
    {
      _id: '1',
      name: 'Nearby Grocery Store',
      category: 'Groceries',
      description: 'A nearby grocery store',
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng) + 0.001, parseFloat(lat) + 0.001],
      },
      distance: 150,
      status: 'approved',
    },
    {
      _id: '2',
      name: 'Nearby Electronics Shop',
      category: 'Electronics',
      description: 'A nearby electronics shop',
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng) + 0.002, parseFloat(lat) + 0.002],
      },
      distance: 300,
      status: 'approved',
    },
  ];

  res.json({
    vendors: mockVendors,
    count: mockVendors.length,
    query: { lat, lng, radius },
  });
});

// Mock auth response
router.post('/mock-login', (req, res) => {
  res.json({
    token: 'mock-jwt-token-12345',
    user: {
      _id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    },
  });
});

// Mock categories
router.get('/mock-categories', (req, res) => {
  res.json({
    categories: [
      'Food & Beverages',
      'Groceries',
      'Electronics',
      'Clothing',
      'Hardware',
      'Stationery',
      'Pharmacy',
      'Other',
    ],
  });
});

// Mock analytics (for admin)
router.get('/mock-analytics', (req, res) => {
  res.json({
    totalVendors: 150,
    approvedVendors: 120,
    pendingVendors: 25,
    rejectedVendors: 5,
    userSubmissions: 30,
    totalViews: 5000,
    totalClicks: 1200,
  });
});

// Delay endpoint to test timeout
router.get('/delay', (req, res) => {
  const delay = parseInt(req.query.ms) || 1000;
  setTimeout(() => {
    res.json({
      message: `Response delayed by ${delay}ms`,
      timestamp: new Date().toISOString(),
    });
  }, delay);
});

module.exports = router;

