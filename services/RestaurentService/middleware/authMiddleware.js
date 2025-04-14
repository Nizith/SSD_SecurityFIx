const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { JWT_SECRET } = require('../config/config');

// Middleware to protect routes (authentication)
exports.protect = async (req, res, next) => {
    let token;

    // Check if token exists in Authorization header
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        // Extract token from header
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if no token
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized to access this route'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Find user by ID from decoded token
        req.user = await User.findById(decoded.id).select('-password');

        // If user found, proceed to next middleware
        next();
    } catch (err) {
        console.error('JWT Error:', err);
        return res.status(401).json({
            success: false,
            error: 'Not authorized to access this route'
        });
    }
};

// Middleware to check user roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // Check if user's role is in the allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `User role ${req.user.role} is not authorized to access this route`
            });
        }

        // If role is authorized, proceed to next middleware
        next();
    };
};