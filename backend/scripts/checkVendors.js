const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');
require('dotenv').config();

async function checkVendors() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nearby';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const dbName = mongoose.connection.db.databaseName;
    console.log(`✅ Connected to database: ${dbName}`);
    console.log(`📡 Connection string: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}\n`);
    
    const totalCount = await Vendor.countDocuments();
    const approvedCount = await Vendor.countDocuments({ status: 'approved' });
    const pendingCount = await Vendor.countDocuments({ status: 'pending' });
    
    console.log('📊 Vendor Statistics:');
    console.log(`   Total vendors: ${totalCount}`);
    console.log(`   Approved: ${approvedCount}`);
    console.log(`   Pending: ${pendingCount}\n`);
    
    if (totalCount === 0) {
      console.log('⚠️  No vendors found!');
      console.log('💡 Run "npm run seed" to add dummy vendors.\n');
      process.exit(1);
    }
    
    // Show sample vendors
    const vendors = await Vendor.find({ status: 'approved' }).limit(5).lean();
    console.log('📍 Sample Approved Vendors:');
    vendors.forEach((v, i) => {
      console.log(`   ${i + 1}. ${v.name} (${v.category})`);
      console.log(`      Location: [${v.location.coordinates[0]}, ${v.location.coordinates[1]}]`);
    });
    
    console.log(`\n✅ Database check complete!`);
    console.log(`\n💡 To view in MongoDB Compass:`);
    console.log(`   1. Connect to: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`);
    console.log(`   2. Select database: ${dbName}`);
    console.log(`   3. Open collection: vendors`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkVendors();

