const mongoose = require('mongoose');
require('dotenv').config();
const Permission = require('../models/Permission');
const Role = require('../models/Role');
const User = require('../models/User');

/**
 * Script to set up default roles and permissions for the application
 */

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

// Define application modules
const modules = [
  'users',
  'articles',
  'categories',
  'sections',
  'roles',
  'permissions'
];

// Define default permissions for each module
const generatePermissions = () => {
  const permissions = [];
  
  modules.forEach(module => {
    permissions.push(
      {
        name: `Create ${module}`,
        description: `Ability to create new ${module}`,
        code: `${module}:create`,
        module: module
      },
      {
        name: `View ${module}`,
        description: `Ability to view ${module}`,
        code: `${module}:view`,
        module: module
      },
      {
        name: `List ${module}`,
        description: `Ability to list all ${module}`,
        code: `${module}:list`,
        module: module
      },
      {
        name: `Update ${module}`,
        description: `Ability to update ${module}`,
        code: `${module}:update`,
        module: module
      },
      {
        name: `Delete ${module}`,
        description: `Ability to delete ${module}`,
        code: `${module}:delete`,
        module: module
      }
    );
  });
  
  // Add special permissions
  permissions.push(
    {
      name: 'Manage role permissions',
      description: 'Ability to assign or remove permissions from roles',
      code: 'role:manage-permissions',
      module: 'roles'
    },
    {
      name: 'Access admin panel',
      description: 'Ability to access the admin panel',
      code: 'admin:access',
      module: 'admin'
    }
  );
  
  return permissions;
};

// Define default roles
const roles = [
  {
    name: 'Super Admin',
    description: 'Complete access to all system features',
    isDefault: false,
    isActive: true
  },
  {
    name: 'Admin',
    description: 'Administrative access with some restrictions',
    isDefault: false,
    isActive: true
  },
  {
    name: 'Editor',
    description: 'Can manage content but not users or system settings',
    isDefault: false,
    isActive: true
  },
  {
    name: 'User',
    description: 'Basic user with limited permissions',
    isDefault: true,
    isActive: true
  }
];

// Setup function
const setup = async () => {
  try {
    // Create permissions
    const permissionsToCreate = generatePermissions();
    console.log(`Setting up ${permissionsToCreate.length} permissions...`);
    
    // Check if permissions already exist
    const existingPermsCount = await Permission.countDocuments();
    
    let permissions = [];
    if (existingPermsCount > 0) {
      console.log('Permissions already exist, skipping permission creation.');
      permissions = await Permission.find();
    } else {
      permissions = await Permission.insertMany(permissionsToCreate);
      console.log('Permissions created successfully.');
    }
    
    // Create roles
    console.log(`Setting up ${roles.length} roles...`);
    
    // Check if roles already exist
    const existingRolesCount = await Role.countDocuments();
    
    if (existingRolesCount > 0) {
      console.log('Roles already exist, skipping role creation.');
    } else {
      for (const role of roles) {
        const newRole = new Role(role);
        
        // Assign permissions based on role
        switch (role.name) {
          case 'Super Admin':
            // Super Admin gets all permissions
            newRole.permissions = permissions.map(p => p._id);
            break;
          case 'Admin':
            // Admin gets most permissions except some high-level ones
            newRole.permissions = permissions
              .filter(p => !p.code.includes('roles:delete') && !p.code.includes('permissions:delete'))
              .map(p => p._id);
            break;
          case 'Editor':
            // Editor gets content-related permissions
            newRole.permissions = permissions
              .filter(p => 
                p.module === 'articles' || 
                p.module === 'categories' || 
                p.module === 'sections' ||
                p.code === 'admin:access'
              )
              .map(p => p._id);
            break;
          case 'User':
            // User gets very limited permissions
            newRole.permissions = permissions
              .filter(p => p.code.includes(':view') || p.code.includes(':list'))
              .map(p => p._id);
            break;
        }
        
        await newRole.save();
      }
      console.log('Roles created successfully.');
    }
    
    // Create a default admin user if none exists
    const adminEmail = 'admin@example.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      // Get the Super Admin role
      const superAdminRole = await Role.findOne({ name: 'Super Admin' });
      
      if (!superAdminRole) {
        throw new Error('Super Admin role not found');
      }
      
      // Create the admin user
      const adminUser = new User({
        name: 'Admin User',
        email: adminEmail,
        password: 'admin123',  // You should change this in production
        role: superAdminRole._id,
        isActive: true
      });
      
      await adminUser.save();
      console.log('Default admin user created successfully');
      console.log(`Email: ${adminEmail}`);
      console.log('Password: admin123');
      console.log('IMPORTANT: Please change this password after first login!');
    } else {
      console.log('Admin user already exists, skipping creation');
    }
    
    console.log('Setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
};

// Run the setup
setup();
