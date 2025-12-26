const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');
const User = require('../models/User');
require('dotenv').config();

// Dummy vendors data for Bangalore area
const dummyVendors = [
  // MG Road area
  {
    name: "Fresh Fruits Corner",
    category: "Grocery",
    description: "Fresh seasonal fruits and vegetables",
    tags: ["fruits", "vegetables", "organic"],
    location: {
      type: "Point",
      coordinates: [77.5946, 12.9716] // MG Road
    },
    address: "MG Road, Bangalore",
    phone: "+91-9876543210",
    source: "admin",
    status: "approved"
  },
  {
    name: "Sharma Hardware Store",
    category: "Hardware",
    description: "All types of hardware tools and materials",
    tags: ["tools", "hardware", "construction"],
    location: {
      type: "Point",
      coordinates: [77.5950, 12.9720]
    },
    address: "Brigade Road, Bangalore",
    phone: "+91-9876543211",
    source: "admin",
    status: "approved"
  },
  {
    name: "Bangalore Street Food",
    category: "Food",
    description: "Authentic South Indian street food - dosa, vada, idli",
    tags: ["street food", "south indian", "snacks"],
    location: {
      type: "Point",
      coordinates: [77.5940, 12.9710]
    },
    address: "Commercial Street, Bangalore",
    phone: "+91-9876543212",
    source: "admin",
    status: "approved"
  },
  {
    name: "Quick Repair Services",
    category: "Service",
    description: "Mobile and laptop repair services",
    tags: ["repair", "mobile", "laptop"],
    location: {
      type: "Point",
      coordinates: [77.5955, 12.9725]
    },
    address: "Residency Road, Bangalore",
    phone: "+91-9876543213",
    source: "admin",
    status: "approved"
  },
  
  // Koramangala area
  {
    name: "Koramangala Grocery",
    category: "Grocery",
    description: "Daily essentials and groceries",
    tags: ["grocery", "daily needs", "vegetables"],
    location: {
      type: "Point",
      coordinates: [77.6245, 12.9352]
    },
    address: "Koramangala, Bangalore",
    phone: "+91-9876543214",
    source: "admin",
    status: "approved"
  },
  {
    name: "Patel Electronics",
    category: "Hardware",
    description: "Electronics and electrical items",
    tags: ["electronics", "electrical", "appliances"],
    location: {
      type: "Point",
      coordinates: [77.6250, 12.9355]
    },
    address: "5th Block, Koramangala",
    phone: "+91-9876543215",
    source: "admin",
    status: "approved"
  },
  {
    name: "Coastal Dhaba",
    category: "Food",
    description: "Authentic Coastal Karnataka food and thalis",
    tags: ["coastal", "dhaba", "thali"],
    location: {
      type: "Point",
      coordinates: [77.6240, 12.9350]
    },
    address: "6th Block, Koramangala",
    phone: "+91-9876543216",
    source: "admin",
    status: "approved"
  },
  
  // Indiranagar area
  {
    name: "Indiranagar Market Vegetables",
    category: "Grocery",
    description: "Fresh vegetables and fruits market",
    tags: ["vegetables", "fruits", "market"],
    location: {
      type: "Point",
      coordinates: [77.6408, 12.9784]
    },
    address: "Indiranagar, Bangalore",
    phone: "+91-9876543217",
    source: "admin",
    status: "approved"
  },
  {
    name: "Modern Hardware",
    category: "Hardware",
    description: "Modern hardware and tools",
    tags: ["hardware", "tools", "modern"],
    location: {
      type: "Point",
      coordinates: [77.6415, 12.9790]
    },
    address: "100 Feet Road, Indiranagar",
    phone: "+91-9876543218",
    source: "admin",
    status: "approved"
  },
  {
    name: "South Indian Cafe",
    category: "Food",
    description: "Delicious South Indian breakfast and snacks",
    tags: ["south indian", "dosa", "idli"],
    location: {
      type: "Point",
      coordinates: [77.6400, 12.9780]
    },
    address: "CMH Road, Indiranagar",
    phone: "+91-9876543219",
    source: "admin",
    status: "approved"
  },
  
  // Whitefield area
  {
    name: "Tech Repair Hub",
    category: "Service",
    description: "Computer and mobile repair services",
    tags: ["repair", "computer", "mobile", "tech"],
    location: {
      type: "Point",
      coordinates: [77.7499, 12.9698]
    },
    address: "Whitefield, Bangalore",
    phone: "+91-9876543220",
    source: "admin",
    status: "approved"
  },
  {
    name: "Office Supplies Store",
    category: "Hardware",
    description: "Stationery and office supplies",
    tags: ["stationery", "office", "supplies"],
    location: {
      type: "Point",
      coordinates: [77.7505, 12.9700]
    },
    address: "ITPL Road, Whitefield",
    phone: "+91-9876543221",
    source: "admin",
    status: "approved"
  },
  
  // Pending submissions (user-contributed)
  {
    name: "Local Bakery",
    category: "Food",
    description: "Fresh bread and pastries",
    tags: ["bakery", "bread", "pastries"],
    location: {
      type: "Point",
      coordinates: [77.5950, 12.9715]
    },
    address: "Near MG Road, Bangalore",
    phone: "+91-9876543222",
    source: "user",
    status: "pending"
  },
  {
    name: "Flower Shop",
    category: "Service",
    description: "Fresh flowers and bouquets",
    tags: ["flowers", "bouquet", "gifts"],
    location: {
      type: "Point",
      coordinates: [77.5945, 12.9712]
    },
    address: "MG Road, Bangalore",
    phone: "+91-9876543223",
    source: "user",
    status: "pending"
  },
  {
    name: "Tailor Services",
    category: "Service",
    description: "Professional tailoring and alterations",
    tags: ["tailor", "stitching", "alterations"],
    location: {
      type: "Point",
      coordinates: [77.6255, 12.9358]
    },
    address: "Koramangala, Bangalore",
    phone: "+91-9876543224",
    source: "user",
    status: "pending"
  }
];

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nearby';
    console.log('📡 MongoDB URI:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected to database:', mongoose.connection.db.databaseName);

    // Clear existing vendors
    console.log('🗑️  Clearing existing vendors...');
    await Vendor.deleteMany({});
    console.log('✅ Vendors cleared');

    // Create admin user if doesn't exist
    console.log('👤 Creating admin user...');
    let adminUser = await User.findOne({ email: 'admin@nearby.com' });
    if (!adminUser) {
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@nearby.com',
        password: 'admin123', // Will be hashed by pre-save hook
        role: 'admin'
      });
      await adminUser.save();
      console.log('✅ Admin user created (email: admin@nearby.com, password: admin123)');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Create test user if doesn't exist
    console.log('👤 Creating test user...');
    let testUser = await User.findOne({ email: 'user@test.com' });
    if (!testUser) {
      testUser = new User({
        name: 'Test User',
        email: 'user@test.com',
        password: 'test123', // Will be hashed by pre-save hook
        role: 'user'
      });
      await testUser.save();
      console.log('✅ Test user created (email: user@test.com, password: test123)');
    } else {
      console.log('✅ Test user already exists');
    }

    // Add createdByUserId to vendors
    const vendorsWithUser = dummyVendors.map(vendor => ({
      ...vendor,
      createdByUserId: vendor.source === 'admin' ? adminUser._id : testUser._id
    }));

    // Insert vendors
    console.log('📍 Inserting dummy vendors...');
    const result = await Vendor.insertMany(vendorsWithUser);
    console.log(`✅ Inserted ${result.length} vendors`);

    // Summary
    const approvedCount = await Vendor.countDocuments({ status: 'approved' });
    const pendingCount = await Vendor.countDocuments({ status: 'pending' });
    
    console.log('\n📊 Database Summary:');
    console.log(`   Total vendors: ${result.length}`);
    console.log(`   Approved: ${approvedCount}`);
    console.log(`   Pending: ${pendingCount}`);
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('   Admin: admin@nearby.com / admin123');
    console.log('   User: user@test.com / test123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
