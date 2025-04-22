const express = require('express');
const { verifyToken, authorize } = require('../middleware/authMiddleware');
const restaurantController = require('../controllers/restaurantController');
const router = express.Router();

// Public routes
router.get('/all', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);

// Restaurant owner routes
router.get('/owner/my-restaurant', verifyToken, restaurantController.getRestaurantByOwner);
router.post('/create', verifyToken, restaurantController.createRestaurant);
router.put('/:id', verifyToken, authorize('restaurant'), restaurantController.updateRestaurant);
router.delete('/:id', verifyToken, authorize('restaurant'), restaurantController.deleteRestaurant);
router.patch('/:id/toggle-availability', verifyToken, authorize('restaurant'), restaurantController.toggleAvailability);

// Admin routes
router.get('/admin/pending', verifyToken, authorize('admin'), restaurantController.getPendingRestaurants);
router.patch('/:id/verify', verifyToken, authorize('admin'), restaurantController.verifyRestaurant);

module.exports = router;