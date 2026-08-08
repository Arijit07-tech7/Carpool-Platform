// backend/src/routes/tracking.routes.js

const express = require("express");

const trackingController =
  require("../controllers/tracking.controller.js");

const authMiddleware =
  require("../middleware/auth.middleware.js");

const organizationMiddleware =
  require("../middleware/organization.middleware.js");

const validationMiddleware =
  require("../middleware/validation.middleware.js");

const trackingValidator =
  require("../validators/tracking.validator.js");


const router = express.Router();


// ============================================================
// AUTHENTICATION
// ============================================================

router.use(
  authMiddleware.authenticate
);


// ============================================================
// START / ENABLE TRACKING
// ============================================================

/**
 * POST /api/tracking/:tripId/start
 *
 * Enable live location tracking
 * for an active trip.
 */
router.post(
  "/:tripId/start",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    trackingValidator.startTracking
  ),
  trackingController.startTracking
);


// ============================================================
// UPDATE DRIVER LOCATION
// ============================================================

/**
 * POST /api/tracking/:tripId/location
 *
 * Send the driver's current location.
 *
 * Example body:
 *
 * {
 *   "latitude": 22.5726,
 *   "longitude": 88.3639,
 *   "accuracy": 10,
 *   "heading": 90,
 *   "speed": 35
 * }
 *
 * For high-frequency updates, the
 * WebSocket layer should be preferred.
 */
router.post(
  "/:tripId/location",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    trackingValidator.updateLocation
  ),
  trackingController.updateLocation
);


// ============================================================
// CURRENT LOCATION
// ============================================================

/**
 * GET /api/tracking/:tripId/location
 *
 * Get the latest available driver
 * location for a trip.
 */
router.get(
  "/:tripId/location",
  organizationMiddleware.verifyCurrentUserMembership,
  trackingController.getCurrentLocation
);


// ============================================================
// TRACKING STATUS
// ============================================================

/**
 * GET /api/tracking/:tripId/status
 *
 * Check whether live tracking is
 * active for the trip.
 */
router.get(
  "/:tripId/status",
  organizationMiddleware.verifyCurrentUserMembership,
  trackingController.getTrackingStatus
);


// ============================================================
// LOCATION HISTORY
// ============================================================

/**
 * GET /api/tracking/:tripId/history
 *
 * Get location history for an
 * authorized trip participant.
 */
router.get(
  "/:tripId/history",
  organizationMiddleware.verifyCurrentUserMembership,
  trackingController.getLocationHistory
);


// ============================================================
// STOP TRACKING
// ============================================================

/**
 * POST /api/tracking/:tripId/stop
 *
 * Stop live tracking.
 *
 * Normally this happens automatically
 * when the trip is completed/cancelled.
 */
router.post(
  "/:tripId/stop",
  organizationMiddleware.verifyCurrentUserMembership,
  trackingController.stopTracking
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;