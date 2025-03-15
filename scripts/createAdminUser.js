const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Import User model
const User = require('../models/User');

// Admin user details - you can change these
const adminUser = {
  name: 'Admin User',
  email: 'admin@yopmail.com',
  password: 'admin123',  // You should use a stronger password
  role: 'admin'
};

// Create admin user
const createAdmin = async () => {
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email: adminUser.email });
    
    if (userExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminUser.password, salt);

    // Create user with hashed password
    const user = await User.create({
      name: adminUser.name,
      email: adminUser.email,
      password: hashedPassword,
      role: adminUser.role
    });

    console.log('Admin user created successfully:');
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log('\nYou can now log in to the admin panel with:');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${adminUser.password}`);

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
