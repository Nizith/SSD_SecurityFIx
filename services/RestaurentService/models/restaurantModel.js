const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Reference to User model in Auth service
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contactNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cuisine: {
    type: [String],
    default: []
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  images: {
    logo: String,
    cover: String,
    gallery: [String]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);