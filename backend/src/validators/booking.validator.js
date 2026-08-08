// backend/src/validators/booking.validator.js

const Joi = require("joi");

// ============================================================
// CREATE BOOKING
// ============================================================

const createBookingSchema = Joi.object({
  rideId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid ride ID",
      "any.required": "Ride ID is required",
    }),

  seats: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .required()
    .messages({
      "number.base": "Seats must be a number",
      "number.integer": "Seats must be an integer",
      "number.min": "At least 1 seat is required",
      "number.max": "Seats cannot exceed 50",
      "any.required": "Number of seats is required",
    }),
});

// ============================================================
// UPDATE BOOKING
// ============================================================

const updateBookingSchema = Joi.object({
  seats: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .optional()
    .messages({
      "number.integer": "Seats must be an integer",
      "number.min": "At least 1 seat is required",
      "number.max": "Seats cannot exceed 50",
    }),
}).min(1);

// ============================================================
// UPDATE BOOKING STATUS
// ============================================================

const updateBookingStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "PENDING",
      "CONFIRMED",
      "CANCELLED",
      "COMPLETED",
      "REJECTED"
    )
    .required()
    .messages({
      "any.only": "Invalid booking status",
      "any.required": "Booking status is required",
    }),
});

// ============================================================
// CANCEL BOOKING
// ============================================================

const cancelBookingSchema = Joi.object({
  reason: Joi.string()
    .trim()
    .max(500)
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Cancellation reason cannot exceed 500 characters",
    }),
});

// ============================================================
// BOOKING ID PARAMETER
// ============================================================

const bookingIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid booking ID",
      "any.required": "Booking ID is required",
    }),
});

// ============================================================
// RIDE ID PARAMETER
// ============================================================

const bookingRideIdParamSchema = Joi.object({
  rideId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid ride ID",
      "any.required": "Ride ID is required",
    }),
});

// ============================================================
// LIST BOOKINGS
// ============================================================

const listBookingsSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),

  status: Joi.string()
    .valid(
      "PENDING",
      "CONFIRMED",
      "CANCELLED",
      "COMPLETED",
      "REJECTED"
    )
    .optional(),

  rideId: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": "Invalid ride ID",
    }),

  passengerId: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": "Invalid passenger ID",
    }),
});

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createBookingSchema,
  updateBookingSchema,
  updateBookingStatusSchema,
  cancelBookingSchema,
  bookingIdParamSchema,
  bookingRideIdParamSchema,
  listBookingsSchema,
};