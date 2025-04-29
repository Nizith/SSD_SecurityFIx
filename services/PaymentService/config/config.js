require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    MONDODB_URL: process.env.MONDODB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE,
    ADMIN_REGISTRATION_KEY: process.env.ADMIN_REGISTRATION_KEY,
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
};