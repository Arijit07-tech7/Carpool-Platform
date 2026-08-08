// backend/src/routes/booking.routes.js

const express = require("express");

const bookingController =
  require("../controllers/booking.controller.js");

const authMiddleware =
  require("../middleware/auth.middleware.js");

const organizationMiddleware =
  require("../middleware/organization.middleware.js");

const validationMiddleware =
  require("../middleware/validation.middleware.js");

const bookingValidator =
  require("../validators/booking.validator.js");


const router = express.Router();


// ============================================================
// AUTHENTICATION
// ============================================================

router.use(
  authMiddleware.authenticate
);


// ============================================================
// MY BOOKINGS
// ============================================================

/**
 * GET /api/bookings
 *
 * Get bookings made by the
 * currently logged-in employee.
 */
router.get(
  "/",
  organizationMiddleware.verifyCurrentUserMembership,
  bookingController.getMyBookings
);


// ============================================================
// ACTIVE BOOKINGS
// ============================================================

/**
 * GET /api/bookings/active
 *
 * Get current/upcoming bookings.
 */
router.get(
  "/active",
  organizationMiddleware.verifyCurrentUserMembership,
  bookingController.getActiveBookings
);


// ============================================================
// PENDING BOOKINGS
// ============================================================

/**
 * GET /api/bookings/pending
 *
 * Get pending booking requests.
 *
 * Useful for a driver to see
 * requests for their rides.
 */
router.get(
  "/pending",
  organizationMiddleware.verifyCurrentUserMembership,
  bookingController.getPendingBookings
);


// ============================================================
// BOOK A RIDE
// ============================================================

/**
 * POST /api/bookings
 *
 * Passenger books a ride.
 *
 * Example body:
 *
 * {
 *   "rideId": "...",
 *   "seats": 1
 * }
 */
router.post(
  "/",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    bookingValidator.createBooking
  ),
  bookingController.createBooking
);


// ============================================================
// BOOKING DETAILS
// ============================================================

/**
 * GET /api/bookings/:bookingId
 *
 * Get complete booking details.
 */
router.get(
  "/:bookingId",
  organizationMiddleware.verifyCurrentUserMembership,
  bookingController.getBookingById
);


// ============================================================
// CONFIRM BOOKING
// ============================================================

/**
 * PATCH /api/bookings/:bookingId/confirm
 *
 * Driver/admin confirms a booking.
 */
router.patch(
  "/:bookingId/confirm",
  organizationMiddleware.verifyCurrentUserMembership,
  bookingController.confirmBooking
);


// ============================================================
// REJECT BOOKING
// ============================================================

/**
 * PATCH /api/bookings/:bookingId/reject
 *
 * Reject a booking request.
 */
router.patch(
  "/:bookingId/reject",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    bookingValidator.rejectBooking
  ),
  bookingController.rejectBooking
);


// ============================================================
// CANCEL BOOKING
// ============================================================

/**
 * PATCH /api/bookings/:bookingId/cancel
 *
 * Passenger cancels a booking.
 */
router.patch(
  "/:bookingId/cancel",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    bookingValidator.cancelBooking
  ),
  bookingController.cancelBooking
);


// ============================================================
// UPDATE SEATS
// ============================================================

/**
 * PATCH /api/bookings/:bookingId/seats
 *
 * Change the number of seats
 * requested by the passenger.
 */
router.patch(
  "/:bookingId/seats",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    bookingValidator.updateSeats
  ),
  bookingController.updateSeats
);


// ============================================================
// BOOKING STATUS
// ============================================================

/**
 * GET /api/bookings/:bookingId/status
 *
 * Get current booking status.
 */
router.get(
  "/:bookingId/status",
  organizationMiddleware.verifyCurrentUserMembership,
  bookingController.getBookingStatus
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;