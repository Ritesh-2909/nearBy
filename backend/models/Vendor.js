const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  address: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  openingHours: {
    type: Map,
    of: String,
    default: {}
  },
  photo: {
    type: String,
    default: ''
  },
  // Moderation fields
  source: {
    type: String,
    enum: ['admin', 'user'],
    default: 'admin'
  },
  status: {
    type: String,
    enum: ['approved', 'pending', 'rejected'],
    default: 'pending'
  },
  createdByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  moderatedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  // Analytics
  viewCount: {
    type: Number,
    default: 0
  },
  clickCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Geospatial index for location queries
vendorSchema.index({ location: '2dsphere' });

// Text index for search
vendorSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Vendor', vendorSchema);



