const Restaurant = require('../models/restaurantModel');
const { AUTH_SERVICE_URL } = require('../config/config');
const axios = require('axios');

// Create new restaurant
const createRestaurant = async (req, res) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ ownerId: req.user.id });
    if (existingRestaurant) {
      return res.status(400).json({ message: 'User already owns a restaurant' });
    }

    const restaurant = new Restaurant({
      ...req.body,
      ownerId: req.user.id,
    });

    const savedRestaurant = await restaurant.save();

    // Update user role to 'restaurant' in AuthService
    await axios.patch(
      `${AUTH_SERVICE_URL}/api/users/update-role/${req.user.id}`,
      { role: 'restaurant' },
      { headers: { Authorization: req.headers.authorization } }
    );

    res.status(201).json(savedRestaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isVerified: true });
    
    res.json({
      message: 'Restaurants fetched successfully',
      total: restaurants.length,
      data: restaurants
    });

  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get restaurant by ID
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update restaurant
const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Check ownership unless admin
    if (req.user.role !== 'admin' && restaurant.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this restaurant' });
    }
    
    // Update fields
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    res.json(updatedRestaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete restaurant
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Check ownership unless admin
    if (req.user.role !== 'admin' && restaurant.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this restaurant' });
    }
    
    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle restaurant availability
const toggleAvailability = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Check ownership
    if (restaurant.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this restaurant' });
    }
    
    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();
    
    res.json({ isOpen: restaurant.isOpen });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Verify restaurant (admin only)
const verifyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    restaurant.isVerified = true;
    await restaurant.save();
    
    res.json({ message: 'Restaurant verified successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get restaurants pending verification (admin only)
const getPendingRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isVerified: false });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get restaurant by owner ID
const getRestaurantByOwner = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ message: 'No restaurant found for this user' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  toggleAvailability,
  verifyRestaurant,
  getPendingRestaurants,
  getRestaurantByOwner
};