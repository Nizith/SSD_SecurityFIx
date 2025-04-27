const axios = require("axios");
const { AUTH_SERVICE_URL } = require("../config/config");

const verifyToken = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Received Token:", token); // Debugging: Log the token

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization header with Bearer token is required" });
  }

  try {
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/api/auth/verify-token`,
      { token }
    );
    if (!response.data || !response.data.valid) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = response.data.user;
    next();
  } catch (error) {
    console.error(
      "Error in verifying token:",
      error.response?.data || error.message
    );
    return res.status(401).json({ message: "Token verification failed" });
  }
};

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "User role is not defined" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }

    next();
  };

module.exports = {
  verifyToken,
  authorize,
};
