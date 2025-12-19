const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Vendor = require('../models/Vendor');
const { optionalAuth, authenticate } = require('../middleware/auth');

const router = express.Router();

// Get nearby vendors (only approved)
router.get('/nearby', [
  query('lat').isFloat({ min: -90, max: 90 }),
  query('lng').isFloat({ min: -180, max: 180 }),
  query('radius').optional().isInt({ min: 1, max: 10000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { lat, lng, radius = 3000 } = req.query; // Default 3km radius
    const { category, search } = req.query;

    // Build query - only approved vendors
    let query = {
      status: 'approved',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    const vendors = await Vendor.find(query)
      .limit(50)
      .select('-moderatedBy -rejectionReason')
      .lean();

    // Calculate distance for each vendor
    const vendorsWithDistance = vendors.map(vendor => {
      const distance = calculateDistance(
        parseFloat(lat),
        parseFloat(lng),
        vendor.location.coordinates[1],
        vendor.location.coordinates[0]
      );
      return {
        ...vendor,
        distance: Math.round(distance)
      };
    });

    // Sort by distance
    vendorsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json({ vendors: vendorsWithDistance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vendor by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Only show approved vendors to non-owners, or if user owns it
    if (vendor.status !== 'approved') {
      if (!req.user || vendor.createdByUserId?.toString() !== req.user._id.toString()) {
        return res.status(404).json({ error: 'Vendor not found' });
      }
    }

    // Increment view count
    vendor.viewCount += 1;
    await vendor.save();

    res.json({ vendor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User submits a new vendor
router.post('/user-submissions', [
  authenticate,
  body('name').trim().notEmpty().withMessage('Vendor name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('location.lat').isFloat({ min: -90, max: 90 }),
  body('location.lng').isFloat({ min: -180, max: 180 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user;

    // Rate limiting: max 5 vendors per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (user.lastSubmissionDate && user.lastSubmissionDate >= today) {
      if (user.submissionCount >= 5) {
        return res.status(429).json({ 
          error: 'Daily submission limit reached. Please try again tomorrow.' 
        });
      }
    } else {
      user.submissionCount = 0;
      user.lastSubmissionDate = today;
    }

    const { name, category, description, tags, location, address, phone, openingHours, photo } = req.body;

    // Check for duplicates (within 50 meters with similar name)
    const duplicateCheck = await Vendor.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [location.lng, location.lat]
          },
          $maxDistance: 50
        }
      },
      name: { $regex: new RegExp(name, 'i') }
    });

    if (duplicateCheck.length > 0) {
      return res.status(400).json({ 
        error: 'A vendor with a similar name already exists nearby',
        duplicate: true,
        existingVendor: duplicateCheck[0]
      });
    }

    // Create vendor
    const vendor = new Vendor({
      name,
      category,
      description: description || '',
      tags: tags || [],
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat]
      },
      address: address || '',
      phone: phone || '',
      openingHours: openingHours || {},
      photo: photo || '',
      source: 'user',
      status: 'pending',
      createdByUserId: user._id
    });

    await vendor.save();

    // Update user submission count
    user.submissionCount += 1;
    await user.save();

    res.status(201).json({
      vendor,
      message: 'Vendor submitted successfully. It will go live after review.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's own submissions
router.get('/my-submissions', authenticate, async (req, res) => {
  try {
    const vendors = await Vendor.find({ createdByUserId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ vendors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Vendor.distinct('category', { status: 'approved' });
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Increment click count (for analytics)
router.post('/:id/click', optionalAuth, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (vendor) {
      vendor.clickCount += 1;
      await vendor.save();
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

module.exports = router;



