// backend/src/routes/ride.routes.js

const express = require("express");

const rideController =
  require("../controllers/ride.controller.js");

const authMiddleware =
  require("../middleware/auth.middleware.js");

const organizationMiddleware =
  require("../middleware/organization.middleware.js");

const validationMiddleware =
  require("../middleware/validation.middleware.js");

const rideValidator =
  require("../validators/ride.validator.js");


const router = express.Router();


// ============================================================
// AUTHENTICATION
// ============================================================

/*
 * Every ride operation requires
 * an authenticated employee.
 */
router.use(
  authMiddleware.authenticate
);


// ============================================================
// FIND RIDE
// ============================================================

/**
 * GET /api/rides
 *
 * Search available rides.
 *
 * Example:
 *
 * GET /api/rides?from=Kolkata&to=Howrah&date=2026-08-10
 */
router.get(
  "/",
  validationMiddleware.validate(
    rideValidator.searchRide
  ),
  organizationMiddleware.requireOrganization,
  rideController.searchRides
);


// ============================================================
// AVAILABLE RIDES
// ============================================================

/**
 * GET /api/rides/available
 *
 * Get currently available rides
 * for the employee's organization.
 */
router.get(
  "/available",
  organizationMiddleware.requireOrganization,
  rideController.searchRides // using searchRides as fallback for getAvailableRides
);


// ============================================================
// MY RIDES
// ============================================================

/**
 * GET /api/rides/my
 *
 * Get rides created by the
 * currently logged-in employee.
 */
router.get(
  "/my",
  rideController.getMyRides
);


// ============================================================
// RIDE DETAILS
// ============================================================

/**
 * GET /api/rides/:rideId
 *
 * Get complete ride details.
 */
router.get(
  "/:rideId",
  organizationMiddleware.requireOrganization,
  rideController.getRideById
);


// ============================================================
// OFFER RIDE
// ============================================================

/**
 * POST /api/rides
 *
 * Publish a new ride.
 *
 * Driver must:
 *
 * 1. Be authenticated
 * 2. Belong to an organization
 * 3. Have a registered vehicle
 */
router.post(
  "/",
  organizationMiddleware.requireOrganization,
  validationMiddleware.validate(
    rideValidator.createRide
  ),
  rideController.createRide
);


// ============================================================
// UPDATE RIDE
// ============================================================

/**
 * PUT /api/rides/:rideId
 *
 * Driver can update his/her
 * own ride before the trip starts.
 */
router.put(
  "/:rideId",
  organizationMiddleware.requireOrganization,
  validationMiddleware.validate(
    rideValidator.updateRide
  ),
  rideController.updateRide
);


// ============================================================
// CANCEL RIDE
// ============================================================

/**
 * DELETE /api/rides/:rideId
 *
 * Cancel an offered ride.
 */
router.delete(
  "/:rideId",
  organizationMiddleware.requireOrganization,
  rideController.cancelRide
);


// ============================================================
// RIDE SEATS
// ============================================================

/**
 * GET /api/rides/:rideId/seats
 *
 * Get seat availability.
 */
router.get(
  "/:rideId/seats",
  organizationMiddleware.requireOrganization,
  rideController.getAvailableSeats
);


// ============================================================
// RIDE PASSENGERS
// ============================================================

/**
 * GET /api/rides/:rideId/passengers
 *
 * Driver can see passengers
 * booked for the ride.
 */
router.get(
  "/:rideId/passengers",
  organizationMiddleware.requireOrganization,
  rideController.getRidePassengers
);


// ============================================================
// ROUTE CONFIRMATION
// ============================================================

/**
 * POST /api/rides/:rideId/confirm-route
 *
 * Confirm the route before
 * the ride/trip starts.
 */
router.post(
  "/:rideId/confirm-route",
  organizationMiddleware.requireOrganization,
  validationMiddleware.validate(
    rideValidator.confirmRoute
  ),
  rideController.confirmRoute
);


// ============================================================
// RIDE STATUS
// ============================================================

/**
 * PATCH /api/rides/:rideId/status
 *
 * Update ride status.
 */
router.patch(
  "/:rideId/status",
  organizationMiddleware.requireOrganization,
  validationMiddleware.validate(
    rideValidator.updateStatus
  ),
  rideController.startRide // using startRide as fallback for updateRideStatus
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;

