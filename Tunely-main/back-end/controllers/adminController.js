const admin = require('../config/firebase-config');
const UserModel = require('../models/userModel');

const adminController = {

    checkAdmin: async (req, res) => {
        try {
          const userId = req.user.uid;
          const isAdmin = await UserModel.isAdmin(userId);
          res.json({ isAdmin });
        } catch (error) {
          console.error('Error checking admin status:', error);
          res.status(500).json({ error: error.message });
        }
      },

    getAllUsers: async (req, res) => {
        try {
        const users = await UserModel.getAllUsers();
        res.json(users);
        } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: error.message });
        }
    },
    
    updateUserRole: async (req, res) => {
        try {
        const { userId, role } = req.body;
        
        if (!userId || !role) {
            return res.status(400).json({ error: 'User ID and role are required' });
        }
        
        // Validate role
        if (!['user', 'admin', 'superadmin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }
        
        // Check if target user exists
        const targetUser = await UserModel.getById(userId);
        if (!targetUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Special check: Only superadmins can create other superadmins
        if (role === 'superadmin') {
            const requestingUserIsSuperAdmin = await UserModel.isSuperAdmin(req.user.uid);
            if (!requestingUserIsSuperAdmin) {
            return res.status(403).json({ 
                error: 'Only super admins can create other admins' 
            });
            }
        }
        
        await UserModel.updateUserRole(userId, role);
        res.json({ 
            message: `User role updated successfully to ${role}`,
            userId,
            role
        });
        } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ error: error.message });
        }
    },
    
    deleteUser: async (req, res) => {
        try {
        const { userId } = req.params;
        
        // Check if user exists
        const user = await UserModel.getById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Prevent deletion of superadmins by admins
        if (user.role === 'superadmin') {
            const requestingUserIsSuperAdmin = await UserModel.isSuperAdmin(req.user.uid);
            if (!requestingUserIsSuperAdmin) {
            return res.status(403).json({ 
                error: 'Regular admins cannot delete super admins' 
            });
            }
        }
        
        // Delete from Firebase auth
        await admin.auth().deleteUser(userId);
        
        // Delete from database
        await UserModel.deleteUser(userId);
        
        res.json({ 
            message: 'User deleted successfully',
            userId 
        });
        } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: error.message });
        }
    }
    };

module.exports = adminController;