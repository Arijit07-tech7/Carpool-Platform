// backend/src/routes/trip.routes.js

const express = require("express");

const tripController =
  require("../controllers/trip.controller.js");

const authMiddleware =
  require("../middleware/auth.middleware.js");

const organizationMiddleware =
  require("../middleware/organization.middleware.js");

const validationMiddleware =
  require("../middleware/validation.middleware.js");

const tripValidator =
  require("../validators/trip.validator.js");


const router = express.Router();


// ============================================================
// AUTHENTICATION
// ============================================================

router.use(
  authMiddleware.authenticate
);


// ============================================================
// MY TRIPS
// ============================================================

/**
 * GET /api/trips
 *
 * Get trips related to the
 * currently logged-in employee.
 */
router.get(
  "/",
  organizationMiddleware.verifyCurrentUserMembership,
  tripController.getMyTrips
);


// ============================================================
// UPCOMING TRIPS
// ============================================================

/**
 * GET /api/trips/upcoming
 *
 * Get upcoming trips.
 */
router.get(
  "/upcoming",
  organizationMiddleware.verifyCurrentUserMembership,
  tripController.getUpcomingTrips
);


// ============================================================
// ACTIVE TRIPS
// ============================================================

/**
 * GET /api/trips/active
 *
 * Get currently active trips.
 */
router.get(
  "/active",
  organizationMiddleware.verifyCurrentUserMembership,
  tripController.getActiveTrips
);


// ============================================================
// TRIP DETAILS
// ============================================================

/**
 * GET /api/trips/:tripId
 *
 * Get complete trip information.
 */
router.get(
  "/:tripId",
  organizationMiddleware.verifyCurrentUserMembership,
  tripController.getTripById
);


// ============================================================
// CREATE TRIP
// ============================================================

/**
 * POST /api/trips
 *
 * Create a trip from a confirmed
 * ride/booking.
 */
router.post(
  "/",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    tripValidator.createTrip
  ),
  tripController.createTrip
);


// ============================================================
// CONFIRM TRIP
// ============================================================

/**
 * PATCH /api/trips/:tripId/confirm
 *
 * Confirm the trip before starting.
 */
router.patch(
  "/:tripId/confirm",
  organizationMiddleware.verifyCurrentUserMembership,
  tripController.confirmTrip
);


// ============================================================
// START TRIP
// ============================================================

/**
 * PATCH /api/trips/:tripId/start
 *
 * Driver starts the trip.
 *
 * This should also activate
 * live location tracking.
 */
router.patch(
  "/:tripId/start",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    tripValidator.startTrip
  ),
  tripController.startTrip
);


// ============================================================
// PAUSE TRIP
// ============================================================

/**
 * PATCH /api/trips/:tripId/pause
 *
 * Temporarily pause the trip.
 */
router.patch(
  "/:tripId/pause",
  organizationMiddleware.verifyCurrentUserMembership,
  tripController.pauseTrip
);


// ============================================================
// RESUME TRIP
// ============================================================

/**
 * PATCH /api/trips/:tripId/resume
 *
 * Resume a paused trip.
 */
router.patch(
  "/:tripId/resume",
  organizationMiddleware.verifyCurrentUserMembership,
  tripController.resumeTrip
);


// ============================================================
// COMPLETE TRIP
// ============================================================

/**
 * PATCH /api/trips/:tripId/complete
 *
 * Complete the trip.
 *
 * After completion:
 *
 * Trip → Payment → History → Reports
 */
router.patch(
  "/:tripId/complete",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    tripValidator.completeTrip
  ),
  tripController.completeTrip
);


// ============================================================
// CANCEL TRIP
// ============================================================

/**
 * PATCH /api/trips/:tripId/cancel
 *
 * Cancel an active/upcoming trip.
 */
router.patch(
  "/:tripId/cancel",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    tripValidator.cancelTrip
  ),
  tripController.cancelTrip
);


// ============================================================
// TRIP STATUS
// ============================================================

/**
 * GET /api/trips/:tripId/status
 *
 * Get current trip status.
 */
router.get(
  "/:tripId/status",
  organizationMiddleware.verifyCurrentUserMembership,
  tripController.getTripStatus
);


// ============================================================
// TRIP PASSENGERS
// ============================================================

/**
 * GET /api/trips/:tripId/passengers
 *
 * Get passengers participating
 * in the trip.
 */
router.get(
  "/:tripId/passengers",
  organizationMiddleware.verifyCurrentUserMembership,
  tripController.getPassengers
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;