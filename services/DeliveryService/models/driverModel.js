const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Reference to the user
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  currentLocation: {
    latitude: Number,
    longitude: Number,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  vehicleDetails: {
    vehicleNumber: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model('Driver', driverSchema);