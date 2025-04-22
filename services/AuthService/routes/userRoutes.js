const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, getUserById, updateUser, deleteUser, updateUserRole } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
//only admins can access these routes

//Create a new user (Signup)
router.post('/create',[
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('role').optional().isIn(['admin', 'user'])
  ],createUser) 

//Get all users
router.get('/all-users', protect, authorize('admin'), getAllUsers);

//Get a user by ID
//this route can be accessed by both users and admins
router.get('/get-user/:id', protect, getUserById);

//Update a user's details
router.put('/update-user/:id',protect, updateUser);

//Delete a user
router.delete('/delete-user/:id',protect, deleteUser);

//update the user's role when creates a restaurant
router.patch('/update-role/:id',protect, authorize('admin', 'customer'), updateUserRole);



module.exports = router;