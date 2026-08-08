// backend/src/routes/settings.routes.js

const express = require("express");
const settingsController = require("../controllers/settings.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");
const organizationMiddleware = require("../middleware/organization.middleware.js");
const validationMiddleware = require("../middleware/validation.middleware.js");
const settingsValidator = require("../validators/settings.validator.js");

const router = express.Router();

router.use(authMiddleware.authenticate);

// GET /api/settings
router.get("/", organizationMiddleware.requireOrganization, settingsController.getMySettings);

// PUT /api/settings
router.put("/", organizationMiddleware.requireOrganization,
  validationMiddleware.validate(settingsValidator.updateSettings), settingsController.updateMySettings);

// GET /api/settings/notifications
router.get("/notifications", settingsController.getNotificationSettings);

// PUT /api/settings/notifications
router.put("/notifications",
  validationMiddleware.validate(settingsValidator.updateNotificationSettings),
  settingsController.updateNotificationSettings);

// GET /api/settings/privacy
router.get("/privacy", settingsController.getPrivacySettings);

// PUT /api/settings/privacy
router.put("/privacy",
  validationMiddleware.validate(settingsValidator.updatePrivacySettings),
  settingsController.updatePrivacySettings);

// GET /api/settings/location
router.get("/location", settingsController.getApplicationSettings);

// PUT /api/settings/location
router.put("/location",
  validationMiddleware.validate(settingsValidator.updateLocationSettings),
  settingsController.updateMySettings);

// PATCH /api/settings/language
router.patch("/language",
  validationMiddleware.validate(settingsValidator.updateLanguage),
  settingsController.updateMySettings);

// PATCH /api/settings/timezone
router.patch("/timezone",
  validationMiddleware.validate(settingsValidator.updateTimezone),
  settingsController.updateMySettings);

// POST /api/settings/reset
router.post("/reset", settingsController.resetSettings);

module.exports = router;

