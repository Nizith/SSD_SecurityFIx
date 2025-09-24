require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");

// Import routes
const paymentRoutes = require("./routes/paymentRoutes");

// Initialize express app
const app = express();

// Header hardening
app.disable('x-powered-by');
app.set('etag', false);

// Remove Server header to prevent version leakage
app.use((req, res, next) => {
  res.removeHeader('Server');
  next();
});

if (process.env.REMOVE_DATE_HEADER === 'true') {
  app.use((req, res, next) => {
    res.removeHeader('Date');
    next();
  });
}

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
connectDB();

// Middleware
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
// Add payment routes
app.use("/api/payment", require("./routes/paymentRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = 5100;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
