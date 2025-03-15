/**
 * This script sets up the default permissions and roles for the application
 * Run with: node scripts/setupPermissions.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const colors = require('colors');

// Import models
const Permission = require('../src/models/Permission');
const Role = require('../src/models/Role');
const User = require('../src/models/User');

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define permission structure by module
const permissionsByModule = {
  users: [
    { name: 'View Users', code: 'users:list', description: 'Can view list of all users' },
    { name: 'View User Details', code: 'users:view', description: 'Can view detailed user information' },
    { name: 'Create Users', code: 'users:create', description: 'Can create new users' },
    { name: 'Update Users', code: 'users:update', description: 'Can update existing users' },
    { name: 'Delete Users', code: 'users:delete', description: 'Can delete users' },
    { name: 'Manage User Roles', code: 'users:manage-roles', description: 'Can assign or change user roles' }
  ],
  roles: [
    { name: 'View Roles', code: 'roles:list', description: 'Can view list of all roles' },
    { name: 'View Role Details', code: 'roles:view', description: 'Can view detailed role information' },
    { name: 'Create Roles', code: 'roles:create', description: 'Can create new roles' },
    { name: 'Update Roles', code: 'roles:update', description: 'Can update existing roles' },
    { name: 'Delete Roles', code: 'roles:delete', description: 'Can delete roles' },
    { name: 'Manage Role Permissions', code: 'role:manage-permissions', description: 'Can assign or remove permissions from roles' }
  ],
  articles: [
    { name: 'View Articles', code: 'articles:list', description: 'Can view list of all articles' },
    { name: 'View Article Details', code: 'articles:view', description: 'Can view detailed article information' },
    { name: 'Create Articles', code: 'articles:create', description: 'Can create new articles' },
    { name: 'Update Articles', code: 'articles:update', description: 'Can update existing articles' },
    { name: 'Delete Articles', code: 'articles:delete', description: 'Can delete articles' },
    { name: 'Publish Articles', code: 'articles:publish', description: 'Can publish or unpublish articles' }
  ],
  categories: [
    { name: 'View Categories', code: 'categories:list', description: 'Can view list of all categories' },
    { name: 'View Category Details', code: 'categories:view', description: 'Can view detailed category information' },
    { name: 'Create Categories', code: 'categories:create', description: 'Can create new categories' },
    { name: 'Update Categories', code: 'categories:update', description: 'Can update existing categories' },
    { name: 'Delete Categories', code: 'categories:delete', description: 'Can delete categories' }
  ],
  sections: [
    { name: 'View Sections', code: 'sections:list', description: 'Can view list of all sections' },
    { name: 'View Section Details', code: 'sections:view', description: 'Can view detailed section information' },
    { name: 'Create Sections', code: 'sections:create', description: 'Can create new sections' },
    { name: 'Update Sections', code: 'sections:update', description: 'Can update existing sections' },
    { name: 'Delete Sections', code: 'sections:delete', description: 'Can delete sections' }
  ],
  reviews: [
    { name: 'View Reviews', code: 'reviews:list', description: 'Can view list of all reviews' },
    { name: 'View Review Details', code: 'reviews:view', description: 'Can view detailed review information' },
    { name: 'Create Reviews', code: 'reviews:create', description: 'Can create new reviews' },
    { name: 'Update Reviews', code: 'reviews:update', description: 'Can update existing reviews' },
    { name: 'Delete Reviews', code: 'reviews:delete', description: 'Can delete reviews' },
    { name: 'Approve Reviews', code: 'reviews:approve', description: 'Can approve or reject user reviews' }
  ],
  comments: [
    { name: 'View Comments', code: 'comments:list', description: 'Can view list of all comments' },
    { name: 'View Comment Details', code: 'comments:view', description: 'Can view detailed comment information' },
    { name: 'Create Comments', code: 'comments:create', description: 'Can create new comments' },
    { name: 'Update Comments', code: 'comments:update', description: 'Can update existing comments' },
    { name: 'Delete Comments', code: 'comments:delete', description: 'Can delete comments' },
    { name: 'Moderate Comments', code: 'comments:moderate', description: 'Can approve or reject user comments' }
  ],
  settings: [
    { name: 'View Settings', code: 'settings:view', description: 'Can view system settings' },
    { name: 'Update Settings', code: 'settings:update', description: 'Can update system settings' }
  ]
};

// Define role structure
const roles = [
  {
    name: 'Super Admin',
    description: 'Full access to all system features and functions',
    isDefault: false,
    isActive: true
  },
  {
    name: 'Admin',
    description: 'Administrative access to manage content and users',
    isDefault: false,
    isActive: true
  },
  {
    name: 'Editor',
    description: 'Can create and edit content but not manage users or system settings',
    isDefault: false,
    isActive: true
  },
  {
    name: 'Author',
    description: 'Can create and edit their own content',
    isDefault: false,
    isActive: true
  },
  {
    name: 'User',
    description: 'Standard user with basic access',
    isDefault: true,
    isActive: true
  }
];

/**
 * Set up default permissions
 */
const setupPermissions = async () => {
  try {
    // Clear existing permissions
    await Permission.deleteMany({});
    console.log('Existing permissions deleted'.yellow);

    // Create permissions by module
    const createdPermissions = {};
    
    for (const [module, permissions] of Object.entries(permissionsByModule)) {
      createdPermissions[module] = [];
      
      for (const permission of permissions) {
        const newPermission = await Permission.create({
          ...permission,
          module
        });
        
        createdPermissions[module].push(newPermission);
        console.log(`Created permission: ${newPermission.name}`.green);
      }
    }
    
    console.log('All permissions created successfully'.green.bold);
    return createdPermissions;
  } catch (error) {
    console.error('Error setting up permissions:'.red, error);
    process.exit(1);
  }
};

/**
 * Set up default roles with appropriate permissions
 */
const setupRoles = async (permissions) => {
  try {
    // Clear existing roles
    await Role.deleteMany({});
    console.log('Existing roles deleted'.yellow);

    // Flatten all permissions for Super Admin
    const allPermissions = Object.values(permissions).flat().map(p => p._id);

    // Create Super Admin role with all permissions
    const superAdminRole = await Role.create({
      ...roles[0],
      permissions: allPermissions
    });
    console.log(`Created role: ${superAdminRole.name} with all permissions`.green);

    // Create Admin role with most permissions (exclude some critical ones)
    const adminPermissions = Object.entries(permissions)
      .flatMap(([module, perms]) => {
        // Exclude some sensitive permissions for Admin
        if (module === 'roles') {
          return perms.filter(p => !['roles:delete'].includes(p.code)).map(p => p._id);
        }
        return perms.map(p => p._id);
      });

    const adminRole = await Role.create({
      ...roles[1],
      permissions: adminPermissions
    });
    console.log(`Created role: ${adminRole.name}`.green);

    // Create Editor role with content management permissions
    const editorModules = ['articles', 'categories', 'sections', 'reviews', 'comments'];
    const editorPermissions = Object.entries(permissions)
      .filter(([module]) => editorModules.includes(module))
      .flatMap(([_, perms]) => perms.map(p => p._id));

    const editorRole = await Role.create({
      ...roles[2],
      permissions: editorPermissions
    });
    console.log(`Created role: ${editorRole.name}`.green);

    // Create Author role with limited content permissions
    const authorModules = ['articles', 'reviews', 'comments'];
    const authorPermissions = Object.entries(permissions)
      .filter(([module]) => authorModules.includes(module))
      .flatMap(([module, perms]) => {
        // Authors can only create and edit, not delete or approve
        return perms
          .filter(p => ['list', 'view', 'create', 'update'].some(action => p.code.includes(action)))
          .map(p => p._id);
      });

    const authorRole = await Role.create({
      ...roles[3],
      permissions: authorPermissions
    });
    console.log(`Created role: ${authorRole.name}`.green);

    // Create User role with minimal permissions
    const userPermissions = [
      ...permissions.comments.filter(p => ['comments:list', 'comments:view', 'comments:create'].includes(p.code)).map(p => p._id),
      ...permissions.reviews.filter(p => ['reviews:list', 'reviews:view'].includes(p.code)).map(p => p._id)
    ];

    const userRole = await Role.create({
      ...roles[4],
      permissions: userPermissions
    });
    console.log(`Created role: ${userRole.name}`.green);

    console.log('All roles created successfully'.green.bold);
    
    return {
      superAdmin: superAdminRole,
      admin: adminRole,
      editor: editorRole,
      author: authorRole,
      user: userRole
    };
  } catch (error) {
    console.error('Error setting up roles:'.red, error);
    process.exit(1);
  }
};

/**
 * Make sure existing users have valid roles
 */
const updateExistingUsers = async (roles) => {
  try {
    // Get users without a valid role
    const usersToUpdate = await User.find({
      $or: [
        { role: { $exists: false } },
        { role: null }
      ]
    });
    
    if (usersToUpdate.length === 0) {
      console.log('No users need role updates'.cyan);
      return;
    }
    
    console.log(`Updating ${usersToUpdate.length} users with default role`.yellow);
    
    // Update users with default role
    await User.updateMany(
      {
        $or: [
          { role: { $exists: false } },
          { role: null }
        ]
      },
      { role: roles.user._id }
    );
    
    console.log('Users updated with default role'.green);
  } catch (error) {
    console.error('Error updating existing users:'.red, error);
  }
};

/**
 * Main execution function
 */
const setupRolesAndPermissions = async () => {
  try {
    console.log('Starting permission and role setup...'.blue.bold);
    
    // Setup permissions first
    const permissions = await setupPermissions();
    
    // Setup roles with permissions
    const roles = await setupRoles(permissions);
    
    // Update existing users
    await updateExistingUsers(roles);
    
    console.log('Setup completed successfully!'.green.bold);
    process.exit(0);
  } catch (error) {
    console.error('Setup failed:'.red.bold, error);
    process.exit(1);
  }
};

// Run the setup
setupRolesAndPermissions();
