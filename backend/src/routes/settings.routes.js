// backend/src/routes/settings.routes.js

const express = require("express");

const settingsController =
  require("../controllers/settings.controller.js");

const authMiddleware =
  require("../middleware/auth.middleware.js");

const organizationMiddleware =
  require("../middleware/organization.middleware.js");

const validationMiddleware =
  require("../middleware/validation.middleware.js");

const settingsValidator =
  require("../validators/settings.validator.js");


const router = express.Router();


// ============================================================
// AUTHENTICATION
// ============================================================

router.use(
  authMiddleware.authenticate
);


// ============================================================
// USER SETTINGS
// ============================================================

/**
 * GET /api/settings
 *
 * Get settings of the currently
 * authenticated employee.
 */
router.get(
  "/",
  organizationMiddleware.verifyCurrentUserMembership,
  settingsController.getSettings
);


// ============================================================
// UPDATE USER SETTINGS
// ============================================================

/**
 * PUT /api/settings
 *
 * Update personal settings.
 *
 * Example:
 *
 * {
 *   "language": "en",
 *   "timezone": "Asia/Kolkata",
 *   "notificationsEnabled": true
 * }
 */
router.put(
  "/",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    settingsValidator.updateSettings
  ),
  settingsController.updateSettings
);


// ============================================================
// NOTIFICATION SETTINGS
// ============================================================

/**
 * GET /api/settings/notifications
 *
 * Get notification preferences.
 */
router.get(
  "/notifications",
  settingsController.getNotificationSettings
);


// ============================================================
// UPDATE NOTIFICATION SETTINGS
// ============================================================

/**
 * PUT /api/settings/notifications
 *
 * Update notification preferences.
 */
router.put(
  "/notifications",
  validationMiddleware.validate(
    settingsValidator.updateNotificationSettings
  ),
  settingsController.updateNotificationSettings
);


// ============================================================
// PRIVACY SETTINGS
// ============================================================

/**
 * GET /api/settings/privacy
 *
 * Get privacy preferences.
 */
router.get(
  "/privacy",
  settingsController.getPrivacySettings
);


// ============================================================
// UPDATE PRIVACY SETTINGS
// ============================================================

/**
 * PUT /api/settings/privacy
 *
 * Update privacy preferences.
 */
router.put(
  "/privacy",
  validationMiddleware.validate(
    settingsValidator.updatePrivacySettings
  ),
  settingsController.updatePrivacySettings
);


// ============================================================
// LOCATION SETTINGS
// ============================================================

/**
 * GET /api/settings/location
 *
 * Get location-sharing preferences.
 */
router.get(
  "/location",
  settingsController.getLocationSettings
);


// ============================================================
// UPDATE LOCATION SETTINGS
// ============================================================

/**
 * PUT /api/settings/location
 *
 * Update location-sharing preferences.
 */
router.put(
  "/location",
  validationMiddleware.validate(
    settingsValidator.updateLocationSettings
  ),
  settingsController.updateLocationSettings
);


// ============================================================
// LANGUAGE
// ============================================================

/**
 * PATCH /api/settings/language
 *
 * Change application language.
 */
router.patch(
  "/language",
  validationMiddleware.validate(
    settingsValidator.updateLanguage
  ),
  settingsController.updateLanguage
);


// ============================================================
// TIMEZONE
// ============================================================

/**
 * PATCH /api/settings/timezone
 *
 * Change application timezone.
 */
router.patch(
  "/timezone",
  validationMiddleware.validate(
    settingsValidator.updateTimezone
  ),
  settingsController.updateTimezone
);


// ============================================================
// RESET SETTINGS
// ============================================================

/**
 * POST /api/settings/reset
 *
 * Reset personal settings to
 * application defaults.
 */
router.post(
  "/reset",
  settingsController.resetSettings
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;