const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Vendor = require('../models/Vendor');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply admin middleware to all routes
router.use(authenticate);
router.use(isAdmin);

// Get all submissions for moderation
router.get('/submissions', [
  query('status').optional().isIn(['pending', 'approved', 'rejected'])
], async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    
    const query = status === 'all' ? {} : { status };
    
    const vendors = await Vendor.find(query)
      .populate('createdByUserId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ vendors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve a vendor submission
router.post('/submissions/:id/approve', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    vendor.status = 'approved';
    vendor.moderatedBy = req.user._id;
    vendor.moderatedAt = new Date();
    vendor.rejectionReason = '';

    await vendor.save();

    res.json({ 
      vendor,
      message: 'Vendor approved successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject a vendor submission
router.post('/submissions/:id/reject', [
  body('reason').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    vendor.status = 'rejected';
    vendor.moderatedBy = req.user._id;
    vendor.moderatedAt = new Date();
    vendor.rejectionReason = req.body.reason || '';

    await vendor.save();

    res.json({ 
      vendor,
      message: 'Vendor rejected' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit and approve a vendor
router.put('/submissions/:id', [
  body('name').optional().trim().notEmpty(),
  body('category').optional().notEmpty(),
  body('description').optional(),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Update fields
    const { name, category, description, tags, address, phone, openingHours, photo } = req.body;
    
    if (name) vendor.name = name;
    if (category) vendor.category = category;
    if (description !== undefined) vendor.description = description;
    if (tags) vendor.tags = tags;
    if (address !== undefined) vendor.address = address;
    if (phone !== undefined) vendor.phone = phone;
    if (openingHours) vendor.openingHours = openingHours;
    if (photo !== undefined) vendor.photo = photo;

    vendor.status = 'approved';
    vendor.moderatedBy = req.user._id;
    vendor.moderatedAt = new Date();

    await vendor.save();

    res.json({ 
      vendor,
      message: 'Vendor updated and approved' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create vendor (admin)
router.post('/vendors', [
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

    const { name, category, description, tags, location, address, phone, openingHours, photo } = req.body;

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
      source: 'admin',
      status: 'approved',
      createdByUserId: req.user._id
    });

    await vendor.save();

    res.status(201).json({ vendor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics
router.get('/analytics', async (req, res) => {
  try {
    const totalVendors = await Vendor.countDocuments();
    const approvedVendors = await Vendor.countDocuments({ status: 'approved' });
    const pendingVendors = await Vendor.countDocuments({ status: 'pending' });
    const userSubmissions = await Vendor.countDocuments({ source: 'user', status: 'approved' });
    
    const totalViews = await Vendor.aggregate([
      { $group: { _id: null, total: { $sum: '$viewCount' } } }
    ]);
    
    const totalClicks = await Vendor.aggregate([
      { $group: { _id: null, total: { $sum: '$clickCount' } } }
    ]);

    res.json({
      totalVendors,
      approvedVendors,
      pendingVendors,
      userSubmissions,
      totalViews: totalViews[0]?.total || 0,
      totalClicks: totalClicks[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

