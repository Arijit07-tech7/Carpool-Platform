// backend/src/validators/tracking.validator.js

const Joi = require("joi");

// ============================================================
// UPDATE / SEND LIVE LOCATION
// ============================================================

const updateTrackingSchema = Joi.object({
  tripId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid trip ID",
      "any.required": "Trip ID is required",
    }),

  latitude: Joi.number()
    .min(-90)
    .max(90)
    .required()
    .messages({
      "number.base": "Latitude must be a number",
      "number.min": "Latitude must be between -90 and 90",
      "number.max": "Latitude must be between -90 and 90",
      "any.required": "Latitude is required",
    }),

  longitude: Joi.number()
    .min(-180)
    .max(180)
    .required()
    .messages({
      "number.base": "Longitude must be a number",
      "number.min": "Longitude must be between -180 and 180",
      "number.max": "Longitude must be between -180 and 180",
      "any.required": "Longitude is required",
    }),

  accuracy: Joi.number()
    .min(0)
    .max(10000)
    .optional()
    .messages({
      "number.min": "Accuracy cannot be negative",
      "number.max": "Accuracy value is too large",
    }),

  speed: Joi.number()
    .min(0)
    .max(500)
    .optional()
    .messages({
      "number.min": "Speed cannot be negative",
      "number.max": "Speed value is invalid",
    }),

  heading: Joi.number()
    .min(0)
    .max(360)
    .optional()
    .messages({
      "number.min": "Heading must be between 0 and 360 degrees",
      "number.max": "Heading must be between 0 and 360 degrees",
    }),

  timestamp: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.format": "Timestamp must be a valid ISO date",
    }),
});

// ============================================================
// LOCATION UPDATE FROM SOCKET
// ============================================================

const socketTrackingSchema = Joi.object({
  tripId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid trip ID",
      "any.required": "Trip ID is required",
    }),

  latitude: Joi.number()
    .min(-90)
    .max(90)
    .required()
    .messages({
      "number.min": "Latitude must be between -90 and 90",
      "number.max": "Latitude must be between -90 and 90",
      "any.required": "Latitude is required",
    }),

  longitude: Joi.number()
    .min(-180)
    .max(180)
    .required()
    .messages({
      "number.min": "Longitude must be between -180 and 180",
      "number.max": "Longitude must be between -180 and 180",
      "any.required": "Longitude is required",
    }),

  accuracy: Joi.number()
    .min(0)
    .optional(),

  speed: Joi.number()
    .min(0)
    .optional(),

  heading: Joi.number()
    .min(0)
    .max(360)
    .optional(),
});

// ============================================================
// TRIP ID PARAMETER
// ============================================================

const trackingTripIdParamSchema = Joi.object({
  tripId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid trip ID",
      "any.required": "Trip ID is required",
    }),
});

// ============================================================
// TRACKING ID PARAMETER
// ============================================================

const trackingIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid tracking ID",
      "any.required": "Tracking ID is required",
    }),
});

// ============================================================
// TRACKING HISTORY
// ============================================================

const trackingHistorySchema = Joi.object({
  tripId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid trip ID",
      "any.required": "Trip ID is required",
    }),

  from: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.format": "From date must be a valid ISO date",
    }),

  to: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.format": "To date must be a valid ISO date",
    }),

  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(500)
    .default(100),
});

// ============================================================
// GET CURRENT LOCATION
// ============================================================

const currentLocationSchema = Joi.object({
  tripId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid trip ID",
      "any.required": "Trip ID is required",
    }),
});

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  updateTrackingSchema,
  socketTrackingSchema,
  trackingTripIdParamSchema,
  trackingIdParamSchema,
  trackingHistorySchema,
  currentLocationSchema,
};