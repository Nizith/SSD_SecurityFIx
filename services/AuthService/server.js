// services/auth-service/src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// Initialize express app
const app = express();

app.disable('x-powered-by');
app.set('etag', false);
if (process.env.REMOVE_DATE_HEADER === 'true') {
  app.use((req, res, next) => {
    res.removeHeader('Date');
    next();
  });
}

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
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "auth-service" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
