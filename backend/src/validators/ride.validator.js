// backend/src/validators/ride.validator.js

const Joi = require("joi");

// ============================================================
// CREATE / OFFER RIDE
// ============================================================

const createRideSchema = Joi.object({
  vehicleId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid vehicle ID",
      "any.required": "Vehicle ID is required",
    }),

  pickupLocation: Joi.string()
    .trim()
    .min(2)
    .max(255)
    .required()
    .messages({
      "string.empty": "Pickup location is required",
      "string.min": "Pickup location must be at least 2 characters",
      "string.max": "Pickup location cannot exceed 255 characters",
      "any.required": "Pickup location is required",
    }),

  destination: Joi.string()
    .trim()
    .min(2)
    .max(255)
    .required()
    .messages({
      "string.empty": "Destination is required",
      "string.min": "Destination must be at least 2 characters",
      "string.max": "Destination cannot exceed 255 characters",
      "any.required": "Destination is required",
    }),

  pickupLatitude: Joi.number()
    .min(-90)
    .max(90)
    .optional()
    .messages({
      "number.min": "Pickup latitude must be between -90 and 90",
      "number.max": "Pickup latitude must be between -90 and 90",
    }),

  pickupLongitude: Joi.number()
    .min(-180)
    .max(180)
    .optional()
    .messages({
      "number.min": "Pickup longitude must be between -180 and 180",
      "number.max": "Pickup longitude must be between -180 and 180",
    }),

  destinationLatitude: Joi.number()
    .min(-90)
    .max(90)
    .optional()
    .messages({
      "number.min": "Destination latitude must be between -90 and 90",
      "number.max": "Destination latitude must be between -90 and 90",
    }),

  destinationLongitude: Joi.number()
    .min(-180)
    .max(180)
    .optional()
    .messages({
      "number.min": "Destination longitude must be between -180 and 180",
      "number.max": "Destination longitude must be between -180 and 180",
    }),

  rideDate: Joi.date()
    .iso()
    .required()
    .messages({
      "date.format": "Ride date must be a valid ISO date",
      "any.required": "Ride date is required",
    }),

  rideTime: Joi.date()
    .iso()
    .required()
    .messages({
      "date.format": "Ride time must be a valid ISO date",
      "any.required": "Ride time is required",
    }),

  totalSeats: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .required()
    .messages({
      "number.base": "Total seats must be a number",
      "number.integer": "Total seats must be an integer",
      "number.min": "Total seats must be at least 1",
      "number.max": "Total seats cannot exceed 50",
      "any.required": "Total seats are required",
    }),

  availableSeats: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .optional()
    .messages({
      "number.integer": "Available seats must be an integer",
      "number.min": "Available seats must be at least 1",
      "number.max": "Available seats cannot exceed 50",
    }),

  farePerSeat: Joi.number()
    .min(0)
    .precision(2)
    .required()
    .messages({
      "number.base": "Fare per seat must be a number",
      "number.min": "Fare per seat cannot be negative",
      "any.required": "Fare per seat is required",
    }),

  distanceKm: Joi.number()
    .min(0)
    .precision(2)
    .optional()
    .messages({
      "number.min": "Distance cannot be negative",
    }),

  estimatedMinutes: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      "number.integer": "Estimated duration must be an integer",
      "number.min": "Estimated duration cannot be negative",
    }),

  routeData: Joi.object()
    .optional()
    .allow(null),
});

// ============================================================
// SEARCH / FIND RIDE
// ============================================================

const searchRideSchema = Joi.object({
  pickupLocation: Joi.string()
    .trim()
    .min(2)
    .max(255)
    .required()
    .messages({
      "string.empty": "Pickup location is required",
      "any.required": "Pickup location is required",
    }),

  destination: Joi.string()
    .trim()
    .min(2)
    .max(255)
    .required()
    .messages({
      "string.empty": "Destination is required",
      "any.required": "Destination is required",
    }),

  pickupLatitude: Joi.number()
    .min(-90)
    .max(90)
    .optional(),

  pickupLongitude: Joi.number()
    .min(-180)
    .max(180)
    .optional(),

  destinationLatitude: Joi.number()
    .min(-90)
    .max(90)
    .optional(),

  destinationLongitude: Joi.number()
    .min(-180)
    .max(180)
    .optional(),

  rideDate: Joi.date()
    .iso()
    .required()
    .messages({
      "date.format": "Ride date must be a valid ISO date",
      "any.required": "Ride date is required",
    }),

  rideTime: Joi.date()
    .iso()
    .optional(),

  seats: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .required()
    .messages({
      "number.integer": "Seats must be an integer",
      "number.min": "At least 1 seat is required",
      "number.max": "Seats cannot exceed 50",
      "any.required": "Number of seats is required",
    }),

  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),
});

// ============================================================
// ROUTE CONFIRMATION
// ============================================================

const confirmRouteSchema = Joi.object({
  pickupLocation: Joi.string()
    .trim()
    .min(2)
    .max(255)
    .required()
    .messages({
      "string.empty": "Pickup location is required",
      "any.required": "Pickup location is required",
    }),

  destination: Joi.string()
    .trim()
    .min(2)
    .max(255)
    .required()
    .messages({
      "string.empty": "Destination is required",
      "any.required": "Destination is required",
    }),

  pickupLatitude: Joi.number()
    .min(-90)
    .max(90)
    .required()
    .messages({
      "number.min": "Pickup latitude must be between -90 and 90",
      "number.max": "Pickup latitude must be between -90 and 90",
      "any.required": "Pickup latitude is required",
    }),

  pickupLongitude: Joi.number()
    .min(-180)
    .max(180)
    .required()
    .messages({
      "number.min": "Pickup longitude must be between -180 and 180",
      "number.max": "Pickup longitude must be between -180 and 180",
      "any.required": "Pickup longitude is required",
    }),

  destinationLatitude: Joi.number()
    .min(-90)
    .max(90)
    .required()
    .messages({
      "number.min": "Destination latitude must be between -90 and 90",
      "number.max": "Destination latitude must be between -90 and 90",
      "any.required": "Destination latitude is required",
    }),

  destinationLongitude: Joi.number()
    .min(-180)
    .max(180)
    .required()
    .messages({
      "number.min": "Destination longitude must be between -180 and 180",
      "number.max": "Destination longitude must be between -180 and 180",
      "any.required": "Destination longitude is required",
    }),
});

// ============================================================
// UPDATE RIDE
// ============================================================

const updateRideSchema = Joi.object({
  pickupLocation: Joi.string()
    .trim()
    .min(2)
    .max(255)
    .optional(),

  destination: Joi.string()
    .trim()
    .min(2)
    .max(255)
    .optional(),

  pickupLatitude: Joi.number()
    .min(-90)
    .max(90)
    .optional(),

  pickupLongitude: Joi.number()
    .min(-180)
    .max(180)
    .optional(),

  destinationLatitude: Joi.number()
    .min(-90)
    .max(90)
    .optional(),

  destinationLongitude: Joi.number()
    .min(-180)
    .max(180)
    .optional(),

  rideDate: Joi.date()
    .iso()
    .optional(),

  rideTime: Joi.date()
    .iso()
    .optional(),

  totalSeats: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .optional(),

  availableSeats: Joi.number()
    .integer()
    .min(0)
    .max(50)
    .optional(),

  farePerSeat: Joi.number()
    .min(0)
    .precision(2)
    .optional(),

  distanceKm: Joi.number()
    .min(0)
    .optional(),

  estimatedMinutes: Joi.number()
    .integer()
    .min(0)
    .optional(),

  routeData: Joi.object()
    .optional()
    .allow(null),
}).min(1);

// ============================================================
// UPDATE RIDE STATUS
// ============================================================

const updateRideStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "PUBLISHED",
      "FULL",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED"
    )
    .required()
    .messages({
      "any.only": "Invalid ride status",
      "any.required": "Ride status is required",
    }),
});

// ============================================================
// RIDE ID PARAMETER
// ============================================================

const rideIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid ride ID",
      "any.required": "Ride ID is required",
    }),
});

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createRideSchema,
  searchRideSchema,
  confirmRouteSchema,
  updateRideSchema,
  updateRideStatusSchema,
  rideIdParamSchema,
};