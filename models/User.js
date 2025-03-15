const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user permissions
userSchema.methods.getPermissions = async function() {
  await this.populate({
    path: 'role',
    populate: {
      path: 'permissions',
      model: 'Permission'
    }
  });
  
  if (!this.role) return [];
  return this.role.permissions.map(p => p.code);
};

// Method to check if user has specific permission
userSchema.methods.hasPermission = async function(permissionCode) {
  const permissions = await this.getPermissions();
  return permissions.includes(permissionCode);
};

// Method to check if user has any of the specified permissions
userSchema.methods.hasAnyPermission = async function(permissionCodes) {
  const permissions = await this.getPermissions();
  return permissionCodes.some(code => permissions.includes(code));
};

module.exports = mongoose.model('User', userSchema);
