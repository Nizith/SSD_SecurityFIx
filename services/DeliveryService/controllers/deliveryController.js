const Delivery = require('../models/deliveryModel');
const Driver = require('../models/driverModel');
const axios = require('axios'); // To interact with the Order Service
const { AUTH_SERVICE_URL } = require("../config/config");

const ORDER_SERVICE_URL = 'http://localhost:5000/api/order'; // Base URL for Order Service

//register a driver
const registerDriver = async (req, res) => {
  try {
    const { userId, currentLocation, vehicleDetails } = req.body;

    console.log('Request body:', req.body);

    // Validate input
    if (!userId || !currentLocation) {
      return res.status(400).json({ message: 'userId and currentLocation are required' });
    }

    // Check if vehicleDetails exists and has the required properties
    if (!vehicleDetails || !vehicleDetails.vehicleNumber || !vehicleDetails.vehicleType) {
      return res.status(400).json({ message: 'Vehicle number and type are required' });
    }

    try {
      // Check if AUTH_SERVICE_URL is configured
      if (!AUTH_SERVICE_URL) {
        console.warn('AUTH_SERVICE_URL environment variable is not set');
      }
      
      console.log(`Calling Auth Service at: ${AUTH_SERVICE_URL}/api/users/update-role/${userId}`);
      
      // Call Auth Service to update the user's role to 'delivery'
      const authResponse = await axios.patch(
        `${AUTH_SERVICE_URL}/api/users/update-role/${userId}`,
        { role: 'delivery' },
        { 
          headers: { 
            Authorization: req.headers.authorization,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Auth Service response:', authResponse.status, authResponse.data);

      if (!authResponse.data || authResponse.status !== 200) {
        return res.status(400).json({ 
          message: 'Failed to update user role in Auth Service',
          authServiceStatus: authResponse.status,
          authServiceResponse: authResponse.data
        });
      }
    } catch (authError) {
      console.error('Auth Service error:', authError.message);
      
      // For development/testing purposes, allow driver registration without auth service
      console.warn('Proceeding with driver registration despite Auth Service error');
      // In production, you might want to return an error instead
      // return res.status(500).json({ message: 'Auth Service error', error: authError.message });
    }

    // Create a new driver record in the Delivery Service
    const driver = new Driver({
      userId,
      currentLocation,
      isAvailable: true,
      vehicleDetails: {
        vehicleNumber: vehicleDetails.vehicleNumber,
        vehicleType: vehicleDetails.vehicleType,
      },
    });

    const savedDriver = await driver.save();
    res.status(201).json({ message: 'Driver registered successfully', driver: savedDriver });
  } catch (error) {
    console.error('Error registering driver:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
      res.status(500).json({ 
        message: 'Error registering driver', 
        error: error.message,
        details: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
      res.status(500).json({ 
        message: 'Error registering driver - no response from Auth Service', 
        error: error.message 
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
      res.status(500).json({ message: 'Error registering driver', error: error.message });
    }
  }
};

const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (error) {
    console.error('Error fetching drivers:', error.message);
    res.status(500).json({ message: 'Error fetching drivers', error: error.message });
  }
};

const getDriverById = async (req, res) => {
  try {
    const { driverId } = req.params;
    const driver = await Driver.findById(driverId);

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json(driver);
  } catch (error) {
    console.error('Error fetching driver:', error.message);
    res.status(500).json({ message: 'Error fetching driver', error: error.message });
  }
};

const updateDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { currentLocation, isAvailable } = req.body;

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    if (currentLocation) driver.currentLocation = currentLocation;
    if (typeof isAvailable === 'boolean') driver.isAvailable = isAvailable;

    const updatedDriver = await driver.save();
    res.status(200).json({ message: 'Driver updated successfully', driver: updatedDriver });
  } catch (error) {
    console.error('Error updating driver:', error.message);
    res.status(500).json({ message: 'Error updating driver', error: error.message });
  }
};

const deleteDriver = async (req, res) => {
  try {
    const { driverId } = req.params;

    const driver = await Driver.findByIdAndDelete(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Error deleting driver:', error.message);
    res.status(500).json({ message: 'Error deleting driver', error: error.message });
  }
};

// Create a new delivery
const createDelivery = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Fetch order details from the Order Service
    const orderResponse = await axios.get(`${ORDER_SERVICE_URL}/${orderId}`);
    const order = orderResponse.data;

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create a new delivery
    const delivery = new Delivery({
      orderId,
      customerId: order.userId,
      pickupLocation: order.restaurantId, // Assuming restaurantId is the pickup location
      deliveryLocation: `${order.address.no}, ${order.address.street}`,
    });

    const savedDelivery = await delivery.save();
    res.status(201).json({ message: 'Delivery created successfully', delivery: savedDelivery });
  } catch (error) {
    console.error('Error creating delivery:', error.message);
    res.status(500).json({ message: 'Error creating delivery', error: error.message });
  }
};

// Assign a driver to a delivery
const assignDriver = async (req, res) => {
  try {
    const { deliveryId } = req.params;

    // Find the delivery
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    // Find the nearest available driver
    const driver = await Driver.findOne({ isAvailable: true }).sort({ lastUpdated: -1 });
    if (!driver) {
      return res.status(400).json({ message: 'No available drivers' });
    }

    // Assign the driver
    delivery.driverId = driver.userId;
    delivery.status = 'assigned';
    await delivery.save();

    // Update driver availability
    driver.isAvailable = false;
    await driver.save();

    res.status(200).json({ message: 'Driver assigned successfully', delivery });
  } catch (error) {
    console.error('Error assigning driver:', error.message);
    res.status(500).json({ message: 'Error assigning driver', error: error.message });
  }
};

// Update delivery status
const updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { status, currentLocation } = req.body;

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    delivery.status = status;
    if (currentLocation) {
      delivery.currentLocation = currentLocation;
    }
    delivery.updatedAt = Date.now();
    await delivery.save();

    // If the delivery is completed, update the order status in the Order Service
    if (status === 'delivered') {
      await axios.put(`${ORDER_SERVICE_URL}/${delivery.orderId}/status`, { status: 'Delivered' });
    }

    res.status(200).json({ message: 'Delivery status updated successfully', delivery });
  } catch (error) {
    console.error('Error updating delivery status:', error.message);
    res.status(500).json({ message: 'Error updating delivery status', error: error.message });
  }
};

// Get delivery details
const getDeliveryDetails = async (req, res) => {
  try {
    const { deliveryId } = req.params;

    const delivery = await Delivery.findById(deliveryId).populate('driverId');
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.status(200).json(delivery);
  } catch (error) {
    console.error('Error fetching delivery details:', error.message);
    res.status(500).json({ message: 'Error fetching delivery details', error: error.message });
  }
};

const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.status(200).json(deliveries);
  } catch (error) {
    console.error('Error fetching all deliveries:', error.message);
    res.status(500).json({ message: 'Error fetching all deliveries', error: error.message });
  }
};

const getDriverDeliveries = async (req, res) => {
  try {
    const { driverId } = req.params;

    const deliveries = await Delivery.find({ driverId });
    if (!deliveries || deliveries.length === 0) {
      return res.status(404).json({ message: 'No deliveries found for this driver' });
    }

    res.status(200).json(deliveries);
  } catch (error) {
    console.error('Error fetching driver deliveries:', error.message);
    res.status(500).json({ message: 'Error fetching driver deliveries', error: error.message });
  }
};

const cancelDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.params;

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    delivery.status = 'cancelled';
    await delivery.save();

    res.status(200).json({ message: 'Delivery cancelled successfully', delivery });
  } catch (error) {
    console.error('Error cancelling delivery:', error.message);
    res.status(500).json({ message: 'Error cancelling delivery', error: error.message });
  }
};


module.exports = {
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
  deleteDriver
};