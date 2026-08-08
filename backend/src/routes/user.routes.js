// backend/src/routes/user.routes.js

const express = require("express");

const userController =
  require("../controllers/user.controller.js");

const authMiddleware =
  require("../middleware/auth.middleware.js");

const validationMiddleware =
  require("../middleware/validation.middleware.js");

const userValidator =
  require("../validators/user.validator.js");


const router = express.Router();


// ============================================================
// ALL USER ROUTES REQUIRE AUTHENTICATION
// ============================================================

router.use(
  authMiddleware.authenticate
);


// ============================================================
// CURRENT USER PROFILE
// ============================================================

/**
 * GET /api/users/me
 *
 * Get logged-in employee profile.
 */
router.get(
  "/me",
  userController.getMyProfile
);


/**
 * PUT /api/users/me
 *
 * Update logged-in employee profile.
 */
router.put(
  "/me",
  validationMiddleware.validate(
    userValidator.updateProfileSchema
  ),
  userController.updateMyProfile
);


// ============================================================
// PROFILE PHOTO
// ============================================================

/**
 * PUT /api/users/me/profile-photo
 *
 * Update profile photo.
 *
 * The actual upload handling can be
 * added later using multer or another
 * upload middleware.
 */
router.put(
  "/me/profile-photo",
  userController.updateProfilePhoto
);


// ============================================================
// USER DETAILS
// ============================================================

/**
 * GET /api/users/me/details
 *
 * Get complete employee information.
 * (Mapped to getMyStatistics for now, or you could create getUserDetails)
 */
router.get(
  "/me/details",
  userController.getMyStatistics
);


// ============================================================
// ORGANIZATION
// ============================================================

/**
 * GET /api/users/me/organization
 *
 * Get the organization associated
 * with the logged-in employee.
 */
router.get(
  "/me/organization",
  userController.getMyOrganization
);


// ============================================================
// ACCOUNT
// ============================================================

/**
 * PUT /api/users/me/status
 *
 * Update account status/preferences.
 */
router.put(
  "/me/status",
  validationMiddleware.validate(
    userValidator.updateUserStatusSchema
  ),
  userController.updateContactInformation // Fallback as there is no updateStatus in controller
);


// ============================================================
// ACCOUNT DELETION
// ============================================================

/**
 * DELETE /api/users/me
 *
 * Deactivate/delete current account.
 *
 * Prefer soft deletion instead of
 * permanently removing ride/payment history.
 */
router.delete(
  "/me",
  userController.deactivateAccount
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;

