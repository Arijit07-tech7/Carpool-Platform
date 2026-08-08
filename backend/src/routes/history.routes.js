// backend/src/routes/history.routes.js

const express = require("express");

const historyController =
  require("../controllers/history.controller.js");

const authMiddleware =
  require("../middleware/auth.middleware.js");

const organizationMiddleware =
  require("../middleware/organization.middleware.js");


const router = express.Router();


// ============================================================
// AUTHENTICATION
// ============================================================

router.use(
  authMiddleware.authenticate
);


// ============================================================
// MY RIDE HISTORY
// ============================================================

/**
 * GET /api/history
 *
 * Get the logged-in employee's
 * complete ride history.
 */
router.get(
  "/",
  organizationMiddleware.verifyCurrentUserMembership,
  historyController.getMyHistory
);


// ============================================================
// COMPLETED RIDES
// ============================================================

/**
 * GET /api/history/completed
 *
 * Get completed rides only.
 */
router.get(
  "/completed",
  organizationMiddleware.verifyCurrentUserMembership,
  historyController.getCompletedRides
);


// ============================================================
// CANCELLED RIDES
// ============================================================

/**
 * GET /api/history/cancelled
 *
 * Get cancelled rides/bookings.
 */
router.get(
  "/cancelled",
  organizationMiddleware.verifyCurrentUserMembership,
  historyController.getCancelledRides
);


// ============================================================
// OFFERED RIDES
// ============================================================

/**
 * GET /api/history/offered
 *
 * Get rides where the employee
 * was the driver.
 */
router.get(
  "/offered",
  organizationMiddleware.verifyCurrentUserMembership,
  historyController.getOfferedRideHistory
);


// ============================================================
// BOOKED RIDES
// ============================================================

/**
 * GET /api/history/booked
 *
 * Get rides where the employee
 * was a passenger.
 */
router.get(
  "/booked",
  organizationMiddleware.verifyCurrentUserMembership,
  historyController.getBookedRideHistory
);


// ============================================================
// HISTORY DETAILS
// ============================================================

/**
 * GET /api/history/:historyId
 *
 * Get complete history record.
 */
router.get(
  "/:historyId",
  organizationMiddleware.verifyCurrentUserMembership,
  historyController.getHistoryById
);


// ============================================================
// TRIP HISTORY
// ============================================================

/**
 * GET /api/history/trip/:tripId
 *
 * Get history information
 * associated with a specific trip.
 */
router.get(
  "/trip/:tripId",
  organizationMiddleware.verifyCurrentUserMembership,
  historyController.getTripHistory
);


// ============================================================
// PAYMENT HISTORY
// ============================================================

/**
 * GET /api/history/:historyId/payment
 *
 * Get payment information
 * associated with a history record.
 */
router.get(
  "/:historyId/payment",
  organizationMiddleware.verifyCurrentUserMembership,
  historyController.getHistoryPayment
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;