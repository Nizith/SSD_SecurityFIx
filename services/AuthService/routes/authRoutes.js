const express = require('express');
const { register, login, verifyToken } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post('/verify-token', verifyToken);

// Protected route - only authenticated users
router.get('/user-content',
    protect,
    (req, res) => {
        res.json({ message: 'Welcome to user profile' });
    });

// Admin-only route
router.get('/admin-dashboard',
    protect,           // First, verify authentication
    authorize('admin'), // Then, check if user is an admin
    (req, res) => {
        res.json({ message: 'Welcome to admin dashboard' });
    }
);

module.exports = router;