const User = require('../models/userModel');
const mongoose = require('mongoose');

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
const createUser = async (req, res) => {
    console.log('Request body:', req.body);
    const { name, email, password, role = "user" } = req.body;
 
    // Check for missing required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
 
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
 
    // Prevent non-admins from creating admin accounts
    if (role === "admin" && req.user?.role !== "admin") {
      return res.status(403).json({ error: "Admin privileges required" });
    }
 
    try {
      console.log('Checking if user exists...');
      // Check if the user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }
 
      console.log('Creating new user...');
      // Create new user object
      const newUser = new User({
        name,
        email,
        password,
        role,
      });
 
      console.log('Saving user...');
      // Save the new user to the database
      await newUser.save();
 
      // Send a proper JSON response
      res.status(201).json({
        message: `User ${newUser.name}( ${id} ) deleted successfully`,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        }
      });
    } catch (error) {
      console.error('Error during user creation:', error);
      res.status(500).json({ message: 'Error creating user' });
    }
  };

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            message: `All user data`,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get a single user
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "User not found" });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        res.status(200).json({
            message: `User data for ${user.name}( ${id} ) fetched`,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Public
const updateUser = async (req, res) => {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "User not found" });
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        res.status(200).json({
            message: `User ${user.name}( ${id} ) updated successfully`,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Public
const deleteUser = async (req, res) => {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "User not found" });
    }

    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        res.status(200).json({
            message: `User ${user.name}( ${id} ) deleted successfully`,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};