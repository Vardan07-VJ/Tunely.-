const UserModel = require('../models/userModel');

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const isUserAdmin = await UserModel.isAdmin(userId);
    
    if (isUserAdmin) {
      next();
    } else {
      return res.status(403).json({ 
        error: 'Unauthorized: Requires admin privileges' 
      });
    }
  } catch (error) {
    console.error('Admin authorization error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const isSuperAdmin = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const isUserSuperAdmin = await UserModel.isSuperAdmin(userId);
    
    if (isUserSuperAdmin) {
      next();
    } else {
      return res.status(403).json({ 
        error: 'Unauthorized: Requires super admin privileges' 
      });
    }
  } catch (error) {
    console.error('Super admin authorization error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { isAdmin, isSuperAdmin };