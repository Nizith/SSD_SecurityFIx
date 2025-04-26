const express = require('express');
const { verifyToken, authorize } = require('../middleware/authMiddleware'); 
const menuController = require('../controllers/menuController');

const router = express.Router();

// Public routes
router.get('/:restaurantId/menu', menuController.getMenuItems);
router.get('/:restaurantId/menu/:id', menuController.getMenuItemById);
// test route
router.get('/:id', menuController.getMenuItemById);
router.get('/', menuController.getAllMenuItems);

router.get('/:restaurantId/menu/category/:category', menuController.getMenuItemsByCategory);

// Restaurant owner routes
router.post('/:restaurantId/menu', verifyToken, authorize('restaurant'), menuController.createMenuItem);
router.put('/:restaurantId/menu/:id', verifyToken, authorize('restaurant'), menuController.updateMenuItem);
router.delete('/:restaurantId/menu/:id', verifyToken, authorize('restaurant'), menuController.deleteMenuItem);
router.patch('/:restaurantId/menu/:id/toggle-availability', verifyToken, authorize('restaurant'), menuController.toggleMenuItemAvailability);

module.exports = router;