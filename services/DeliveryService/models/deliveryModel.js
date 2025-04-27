const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Order', // Reference to the order
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Reference to the customer
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the driver
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in-transit', 'delivered', 'cancelled'],
    default: 'pending',
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  deliveryLocation: {
    type: String,
    required: true,
  },
  currentLocation: {
    latitude: Number,
    longitude: Number,
  },
  estimatedDeliveryTime: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Delivery', deliverySchema);