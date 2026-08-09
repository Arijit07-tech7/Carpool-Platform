// backend/src/validators/trip.validator.js

const Joi = require("joi");

// ============================================================
// CREATE TRIP
// ============================================================

const createTripSchema = Joi.object({
  rideId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid ride ID",
      "any.required": "Ride ID is required",
    }),

  bookingId: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": "Invalid booking ID",
    }),
});

// ============================================================
// START TRIP
// ============================================================

const startTripSchema = Joi.object({
  startLatitude: Joi.number()
    .min(-90)
    .max(90)
    .optional()
    .messages({
      "number.min": "Start latitude must be between -90 and 90",
      "number.max": "Start latitude must be between -90 and 90",
    }),

  startLongitude: Joi.number()
    .min(-180)
    .max(180)
    .optional()
    .messages({
      "number.min": "Start longitude must be between -180 and 180",
      "number.max": "Start longitude must be between -180 and 180",
    }),
});

// ============================================================
// UPDATE TRIP STATUS
// ============================================================

const updateTripStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "CONFIRMED",
      "DRIVER_STARTED",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED"
    )
    .required()
    .messages({
      "any.only": "Invalid trip status",
      "any.required": "Trip status is required",
    }),
});

// ============================================================
// COMPLETE TRIP
// ============================================================

const completeTripSchema = Joi.object({
  endLatitude: Joi.number()
    .min(-90)
    .max(90)
    .optional()
    .messages({
      "number.min": "End latitude must be between -90 and 90",
      "number.max": "End latitude must be between -90 and 90",
    }),

  endLongitude: Joi.number()
    .min(-180)
    .max(180)
    .optional()
    .messages({
      "number.min": "End longitude must be between -180 and 180",
      "number.max": "End longitude must be between -180 and 180",
    }),

  notes: Joi.string()
    .trim()
    .max(1000)
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Trip notes cannot exceed 1000 characters",
    }),
});

// ============================================================
// CANCEL TRIP
// ============================================================

const cancelTripSchema = Joi.object({
  reason: Joi.string()
    .trim()
    .min(2)
    .max(500)
    .required()
    .messages({
      "string.empty": "Cancellation reason is required",
      "string.min": "Cancellation reason must be at least 2 characters",
      "string.max": "Cancellation reason cannot exceed 500 characters",
      "any.required": "Cancellation reason is required",
    }),
});

// ============================================================
// TRIP ID PARAMETER
// ============================================================

const tripIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid trip ID",
      "any.required": "Trip ID is required",
    }),
});

// ============================================================
// RIDE ID PARAMETER
// ============================================================

const tripRideIdParamSchema = Joi.object({
  rideId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid ride ID",
      "any.required": "Ride ID is required",
    }),
});

// ============================================================
// LIST TRIPS
// ============================================================

const listTripsSchema = Joi.object({
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
      "CONFIRMED",
      "DRIVER_STARTED",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED"
    )
    .optional(),

  rideId: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": "Invalid ride ID",
    }),

  driverId: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": "Invalid driver ID",
    }),
});

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createTripSchema,
  startTripSchema,
  updateTripStatusSchema,
  completeTripSchema,
  cancelTripSchema,
  tripIdParamSchema,
  tripRideIdParamSchema,
  listTripsSchema,
};