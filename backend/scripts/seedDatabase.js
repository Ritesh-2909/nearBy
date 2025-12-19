const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');
const User = require('../models/User');
require('dotenv').config();

// Dummy vendors data for Delhi area
const dummyVendors = [
  // Connaught Place area
  {
    name: "Fresh Fruits Corner",
    category: "Grocery",
    description: "Fresh seasonal fruits and vegetables",
    tags: ["fruits", "vegetables", "organic"],
    location: {
      type: "Point",
      coordinates: [77.2167, 28.6315] // CP
    },
    address: "Connaught Place, New Delhi",
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
      coordinates: [77.2180, 28.6320]
    },
    address: "Janpath, New Delhi",
    phone: "+91-9876543211",
    source: "admin",
    status: "approved"
  },
  {
    name: "Delhi Street Food",
    category: "Food",
    description: "Authentic Delhi street food - chaat, golgappa, tikki",
    tags: ["street food", "chaat", "snacks"],
    location: {
      type: "Point",
      coordinates: [77.2150, 28.6310]
    },
    address: "Palika Bazaar, New Delhi",
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
      coordinates: [77.2190, 28.6325]
    },
    address: "Barakhamba Road, New Delhi",
    phone: "+91-9876543213",
    source: "admin",
    status: "approved"
  },
  
  // Karol Bagh area
  {
    name: "Karol Bagh Grocery",
    category: "Grocery",
    description: "Daily essentials and groceries",
    tags: ["grocery", "daily needs", "vegetables"],
    location: {
      type: "Point",
      coordinates: [77.1900, 28.6519]
    },
    address: "Karol Bagh, New Delhi",
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
      coordinates: [77.1910, 28.6525]
    },
    address: "Ajmal Khan Road, Karol Bagh",
    phone: "+91-9876543215",
    source: "admin",
    status: "approved"
  },
  {
    name: "Punjabi Dhaba",
    category: "Food",
    description: "Authentic Punjabi food and thalis",
    tags: ["punjabi", "dhaba", "thali"],
    location: {
      type: "Point",
      coordinates: [77.1920, 28.6515]
    },
    address: "Pusa Road, Karol Bagh",
    phone: "+91-9876543216",
    source: "admin",
    status: "approved"
  },
  
  // Lajpat Nagar area
  {
    name: "Lajpat Market Vegetables",
    category: "Grocery",
    description: "Fresh vegetables and fruits market",
    tags: ["vegetables", "fruits", "market"],
    location: {
      type: "Point",
      coordinates: [77.2430, 28.5677]
    },
    address: "Lajpat Nagar, New Delhi",
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
      coordinates: [77.2440, 28.5685]
    },
    address: "Lajpat Nagar 2, New Delhi",
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
      coordinates: [77.2420, 28.5670]
    },
    address: "Lajpat Nagar 4, New Delhi",
    phone: "+91-9876543219",
    source: "admin",
    status: "approved"
  },
  
  // Nehru Place area
  {
    name: "Tech Repair Hub",
    category: "Service",
    description: "Computer and mobile repair services",
    tags: ["repair", "computer", "mobile", "tech"],
    location: {
      type: "Point",
      coordinates: [77.2500, 28.5494]
    },
    address: "Nehru Place, New Delhi",
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
      coordinates: [77.2510, 28.5500]
    },
    address: "Nehru Place Market, New Delhi",
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
      coordinates: [77.2200, 28.6300]
    },
    address: "Near CP, New Delhi",
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
      coordinates: [77.2160, 28.6305]
    },
    address: "Connaught Place, New Delhi",
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
      coordinates: [77.1930, 28.6520]
    },
    address: "Karol Bagh, New Delhi",
    phone: "+91-9876543224",
    source: "user",
    status: "pending"
  }
];

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nearby', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

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
