// backend/src/config/jwt.js

const env = require("./env.js");

module.exports = {
  JWT_SECRET: env.jwtSecret || process.env.JWT_SECRET || "your-default-jwt-secret-key-change-it-in-env",
  JWT_EXPIRES_IN: env.jwtExpiresIn || process.env.JWT_EXPIRES_IN || "7d",
};
