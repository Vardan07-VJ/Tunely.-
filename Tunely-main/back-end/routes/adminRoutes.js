const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { isAdmin, isSuperAdmin } = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');

// Admin routes - accessible by both admins and superadmins
router.get('/users', verifyToken, isAdmin, adminController.getAllUsers);
router.delete('/users/:userId', verifyToken, isAdmin, adminController.deleteUser);
router.get('/check', verifyToken, adminController.checkAdmin);

// Superadmin routes - only accessible by superadmins
router.put('/users/role', verifyToken, isSuperAdmin, adminController.updateUserRole);

module.exports = router;