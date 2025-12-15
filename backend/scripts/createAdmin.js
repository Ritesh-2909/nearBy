const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nearby', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = process.argv[2] || 'admin@example.com';
    const password = process.argv[3] || 'admin123';
    const name = process.argv[4] || 'Admin User';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('To update password, delete the user first or update manually in MongoDB.');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({
      email,
      password: hashedPassword,
      name,
      role: 'admin',
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('Please change the password after first login.');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();

