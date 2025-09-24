require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");

// Import routes
const restaurantRoutes = require("./routes/restaurantRoutes");
const menuRoutes = require("./routes/menuRoutes");

// Initialize express app
const app = express();

// Header hardening
app.disable('x-powered-by');
app.set('etag', false);
if (process.env.REMOVE_DATE_HEADER === 'true') {
  app.use((req, res, next) => {
    res.removeHeader('Date');
    next();
  });
}

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  helmet({
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true, // Apply to all subdomains
      preload: true, // Allow preloading
    },
  })
);
app.use(cors());
app.use(express.json());
// Security headers anti clickjacking
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Add the X-Content-Type-Options header to prevent MIME type sniffing
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// Routes
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menu", menuRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "restaurant-service" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Restaurant service running on port ${PORT}`);
});
