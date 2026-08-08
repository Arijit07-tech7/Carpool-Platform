// backend/src/config/env.js

const dotenv = require("dotenv");

dotenv.config();

/**
 * Required environment variables
 */
const requiredEnvVariables = [
  "DATABASE_URL",
  "JWT_SECRET",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
];

/**
 * Check required environment variables
 */
const missingEnvVariables = requiredEnvVariables.filter(
  (variable) => !process.env[variable]
);

if (missingEnvVariables.length > 0) {
  console.error(
    `❌ Missing required environment variables:\n${missingEnvVariables
      .map((variable) => `   - ${variable}`)
      .join("\n")}`
  );

  process.exit(1);
}

/**
 * Application environment configuration
 */
const env = {
  // --------------------------------------------------
  // Application
  // --------------------------------------------------

  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 5000,

  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",

  // --------------------------------------------------
  // Database
  // --------------------------------------------------

  databaseUrl: process.env.DATABASE_URL,

  // --------------------------------------------------
  // Authentication / JWT
  // --------------------------------------------------

  jwtSecret: process.env.JWT_SECRET,

  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  // --------------------------------------------------
  // Razorpay
  // --------------------------------------------------

  razorpayKeyId: process.env.RAZORPAY_KEY_ID,

  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,

  razorpayWebhookSecret:
    process.env.RAZORPAY_WEBHOOK_SECRET || "",

  // --------------------------------------------------
  // Maps
  // --------------------------------------------------

  mapsApiKey: process.env.MAPS_API_KEY || "",

  // --------------------------------------------------
  // Email / SMTP
  // --------------------------------------------------

  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || "",
    password: process.env.SMTP_PASSWORD || "",
  },

  // --------------------------------------------------
  // File Upload
  // --------------------------------------------------

  maxFileSize:
    Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024,

  // --------------------------------------------------
  // CORS
  // --------------------------------------------------

  corsOrigin:
    process.env.CLIENT_URL || "http://localhost:3000",

  // --------------------------------------------------
  // Logging
  // --------------------------------------------------

  logLevel:
    process.env.LOG_LEVEL ||
    (process.env.NODE_ENV === "production"
      ? "info"
      : "debug"),
};

/**
 * Freeze configuration so it cannot accidentally
 * be modified during application runtime.
 */
Object.freeze(env);

module.exports = env;