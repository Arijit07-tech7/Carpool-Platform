const rateLimit = require("express-rate-limit");


// ============================================================
// GENERAL API LIMIT
// ============================================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 300,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});


// ============================================================
// AUTH LIMIT
// ============================================================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 10,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many authentication attempts. Please try again later."
  }
});


// ============================================================
// PAYMENT LIMIT
// ============================================================

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 30,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many payment requests. Please try again later."
  }
});


// ============================================================
// WALLET LIMIT
// ============================================================

const walletLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 30,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many wallet requests. Please try again later."
  }
});


module.exports = {
  apiLimiter,
  authLimiter,
  paymentLimiter,
  walletLimiter
};