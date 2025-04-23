const MenuItem = require('../models/menuItemModel');
const Restaurant = require('../models/restaurantModel');

// Get all menu items for a restaurant
const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurantId: req.params.restaurantId });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get menu item by ID
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new menu item
const createMenuItem = async (req, res) => {
  try {
    // Check if restaurant exists and user is the owner
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    if (restaurant.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to add menu items to this restaurant' });
    }
    
    const menuItem = new MenuItem({
      ...req.body,
      restaurantId: req.params.restaurantId
    });
    
    const savedMenuItem = await menuItem.save();
    res.status(201).json(savedMenuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update menu item
const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Check if user is the restaurant owner
    const restaurant = await Restaurant.findById(menuItem.restaurantId);
    if (restaurant.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this menu item' });
    }
    
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    res.json(updatedMenuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete menu item
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Check if user is the restaurant owner
    const restaurant = await Restaurant.findById(menuItem.restaurantId);
    if (restaurant.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this menu item' });
    }
    
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle menu item availability
const toggleMenuItemAvailability = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Check if user is the restaurant owner
    const restaurant = await Restaurant.findById(menuItem.restaurantId);
    if (restaurant.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this menu item' });
    }
    
    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();
    
    res.json({ isAvailable: menuItem.isAvailable });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get menu items by category
const getMenuItemsByCategory = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ 
      restaurantId: req.params.restaurantId,
      category: req.params.category
    });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
  getMenuItemsByCategory
};