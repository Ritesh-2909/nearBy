const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Vendor = require('../models/Vendor');

async function initDatabase() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nearby', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB connected successfully');

    // Create database indexes
    console.log('Creating database indexes...');
    
    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ anonymousId: 1 }, { unique: true, sparse: true });
    console.log('✓ User indexes created');

    // Vendor indexes
    await Vendor.collection.createIndex({ location: '2dsphere' });
    await Vendor.collection.createIndex({ name: 'text', description: 'text', tags: 'text' });
    await Vendor.collection.createIndex({ status: 1 });
    await Vendor.collection.createIndex({ createdByUserId: 1 });
    console.log('✓ Vendor indexes created');

    // Check if admin user exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      console.log('\n⚠ No admin user found. Run "npm run create-admin" to create one.');
    } else {
      console.log('\n✓ Admin user exists');
    }

    // Display database stats
    const userCount = await User.countDocuments();
    const vendorCount = await Vendor.countDocuments();
    const approvedVendors = await Vendor.countDocuments({ status: 'approved' });
    const pendingVendors = await Vendor.countDocuments({ status: 'pending' });

    console.log('\n📊 Database Statistics:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Vendors: ${vendorCount}`);
    console.log(`   - Approved: ${approvedVendors}`);
    console.log(`   - Pending: ${pendingVendors}`);

    console.log('\n✅ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
