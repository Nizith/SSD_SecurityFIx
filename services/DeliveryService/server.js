require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const deliveryRoutes = require('./routes/deliveryRoutes');

// Import routes

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());

// Routes
app.use('/api/delivery', deliveryRoutes);

// Connect to MongoDB
connectDB();

// WebSocket setup
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('track-delivery', (deliveryId) => {
    console.log(`Tracking delivery: ${deliveryId}`);
    // Emit location updates (mocked for now)
    setInterval(() => {
      socket.emit('location-update', {
        deliveryId,
        location: { latitude: Math.random() * 90, longitude: Math.random() * 180 },
      });
    }, 5000);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'delivery-service' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Delivery service running on port ${PORT}`);
});