require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const deliveryRoutes = require("./routes/deliveryRoutes");

// Import routes

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Header hardening
app.disable('x-powered-by');
app.set('etag', false);
if (process.env.REMOVE_DATE_HEADER === 'true') {
  app.use((req, res, next) => {
    res.removeHeader('Date');
    next();
  });
}

// Middleware
app.use(express.json());

app.use(helmet({
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true, // Apply to all subdomains
    preload: true, // Allow preloading
  },
contentSecurityPolicy: {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "https://js.stripe.com",
      "https://cdn.jsdelivr.net", 
      "https://kit.fontawesome.com",
      "https://cdnjs.cloudflare.com"
    ],
    styleSrc: [
      "'self'",
      "https://cdn.jsdelivr.net",
      "https://kit.fontawesome.com",
      "https://ka-f.fontawesome.com", 
      "https://cdnjs.cloudflare.com"
    ],
    fontSrc: [
      "'self'",
      "https://kit.fontawesome.com",
      "https://ka-f.fontawesome.com",
      "https://cdnjs.cloudflare.com"
    ],
    connectSrc: ["'self'", "ws:", "wss:"],
    imgSrc: ["'self'", "data:"], // Removed https: wildcard
    mediaSrc: ["'self'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    frameAncestors: ["'none'"],
    formAction: ["'self'"],
    upgradeInsecureRequests: []
  }
}
}));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Security headers anti clickjacking
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Add the X-Content-Type-Options header to prevent MIME type sniffing
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// Routes
app.use("/api/delivery", deliveryRoutes);

// Connect to MongoDB
connectDB();

// WebSocket setup
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("track-delivery", (deliveryId) => {
    console.log(`Tracking delivery: ${deliveryId}`);
    // Emit location updates (mocked for now)
    setInterval(() => {
      socket.emit("location-update", {
        deliveryId,
        location: {
          latitude: Math.random() * 90,
          longitude: Math.random() * 180,
        },
      });
    }, 5000);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Routes

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "delivery-service" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Delivery service running on port ${PORT}`);
});
