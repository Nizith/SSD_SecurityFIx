const express = require('express');
const {
  createDelivery,
  assignDriver,
  updateDeliveryStatus,
  getDeliveryDetails,
  getAllDeliveries,
  getDriverDeliveries,
  cancelDelivery,
  registerDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
} = require('../controllers/deliveryController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new delivery
router.post('/create', verifyToken, authorize('customer'), createDelivery);

// Assign a driver to a delivery
router.patch('/:deliveryId/assign-driver', verifyToken, authorize('admin'), assignDriver);

// Update delivery status
router.patch('/:deliveryId/status', verifyToken, authorize('delivery', 'admin'), updateDeliveryStatus);

// Get delivery details
router.get('/:deliveryId', verifyToken, getDeliveryDetails);

// Get all deliveries
router.get('/', verifyToken, authorize('admin'), getAllDeliveries);

// Get deliveries for a specific driver
router.get('/driver/:driverId', verifyToken, authorize('delivery'), getDriverDeliveries);

// Cancel a delivery
router.patch('/:deliveryId/cancel', verifyToken, authorize('admin'), cancelDelivery);

// Driver registration
router.post('/drivers/register', verifyToken, authorize('customer'), registerDriver);

// Get all drivers
router.get('/drivers', verifyToken, authorize('admin'), getDrivers);

// Get a specific driver by ID
router.get('/drivers/:driverId', verifyToken, authorize('admin', 'delivery'), getDriverById);

// Update a driver
router.put('/drivers/:driverId', verifyToken, authorize('admin'), updateDriver);

// Delete a driver
router.delete('/drivers/:driverId', verifyToken, authorize('admin'), deleteDriver);

module.exports = router;