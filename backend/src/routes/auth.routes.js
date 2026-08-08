// backend/src/routes/auth.routes.js

const express = require("express");

const authController =
  require("../controllers/auth.controller.js");

const authMiddleware =
  require("../middleware/auth.middleware.js");

const validationMiddleware =
  require("../middleware/validation.middleware.js");

const authValidator =
  require("../validators/auth.validator.js");


const router = express.Router();


// ============================================================
// PUBLIC AUTH ROUTES
// ============================================================

/**
 * Register a new employee.
 *
 * POST /api/auth/register
 */
router.post(
  "/register",
  validationMiddleware.validate(
    authValidator.register
  ),
  authController.register
);


/**
 * Login employee.
 *
 * POST /api/auth/login
 */
router.post(
  "/login",
  validationMiddleware.validate(
    authValidator.login
  ),
  authController.login
);


// ============================================================
// PROTECTED AUTH ROUTES
// ============================================================

/**
 * Get currently authenticated user.
 *
 * GET /api/auth/me
 */
router.get(
  "/me",
  authMiddleware.authenticate,
  authController.getCurrentUser
);


/**
 * Logout current user.
 *
 * POST /api/auth/logout
 */
router.post(
  "/logout",
  authMiddleware.authenticate,
  authController.logout
);


// ============================================================
// TOKEN / SESSION
// ============================================================

/**
 * Refresh authentication token.
 *
 * POST /api/auth/refresh
 */
router.post(
  "/refresh",
  authController.refreshToken
);


// ============================================================
// PASSWORD
// ============================================================

/**
 * Change password.
 *
 * PUT /api/auth/change-password
 */
router.put(
  "/change-password",
  authMiddleware.authenticate,
  validationMiddleware.validate(
    authValidator.changePassword
  ),
  authController.changePassword
);


/**
 * Forgot password.
 *
 * POST /api/auth/forgot-password
 */
router.post(
  "/forgot-password",
  validationMiddleware.validate(
    authValidator.forgotPassword
  ),
  authController.forgotPassword
);


/**
 * Reset password.
 *
 * POST /api/auth/reset-password
 */
router.post(
  "/reset-password",
  validationMiddleware.validate(
    authValidator.resetPassword
  ),
  authController.resetPassword
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;