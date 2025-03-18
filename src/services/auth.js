const { JWT } = require('../../config/constants/authConstant');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const util = require('../helpers/utils/messages');


  const generateToken = async (user, email, secret, expires = "1s") => {
    let token = jwt.sign(
      {
        id: user.id,
        email: email,
      },
      secret,
      {
        expiresIn: expires,
      }
    );
    return token;
  };
  const generateTokenManually = async (params) => {
    try {
      const user = params.user;
      const email = params.email;
      const authToken = await generateToken(
        { id: user._id },
        email,
        JWT.JWT_SECRET,
        JWT.EXPIRES_IN
      );
      const date = new Date();
      date.setDate(date.getDate() + 30);
      const pushData = {
        token: authToken,
        validateTill: date,
      };
      await User.findOneAndUpdate(
        { _id: user._id },
        // { $addToSet: { tokens: pushData } }
      );
      return authToken;
    } catch (error) {
      logger.error("Error - generateTokenManually", error);
      throw new Error(error.message);
    }
  };
  
const login = async (req) => {
    const user = await User.findOne({ email: req.body.email }).select('+password');
 
    if (!user) {
      util.failureResponse('User not found', res);
    }
  
    // Check if user is active
    if (!user.isActive) {
      util.failureResponse('Your account has been deactivated', res);
    }
  
    // Check password 
    const isMatch = await user.isMatchPassword(req.body.password);
    if (!isMatch) {
      util.failureResponse('Invalid credentials', res);
    }
  
    // Update last login
    user.lastLogin = new Date();
    await user.save();
  
    // const token =  generateToken(user);
    const token = await generateTokenManually({ user, email: user.email });
    // const rolePermissions = await userPermission(user.roles?.[0]?.roleId?._id, models);
    const userToReturn = {
      ...user._doc,
      ...{ token },
    //   isTourDone: user.isTourDone,
    };
    return userToReturn;
}

module.exports = {
    login   
}