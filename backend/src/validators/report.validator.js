// backend/src/validators/report.validator.js

const Joi = require("joi");

// ============================================================
// CREATE REPORT
// ============================================================

const createReportSchema = Joi.object({
  reportedUserId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid reported user ID",
      "any.required": "Reported user ID is required",
    }),

  rideId: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.guid": "Invalid ride ID",
    }),

  bookingId: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.guid": "Invalid booking ID",
    }),

  tripId: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.guid": "Invalid trip ID",
    }),

  category: Joi.string()
    .valid(
      "SAFETY",
      "HARASSMENT",
      "FRAUD",
      "RIDE_ISSUE",
      "PAYMENT_ISSUE",
      "VEHICLE_ISSUE",
      "DRIVER_BEHAVIOUR",
      "PASSENGER_BEHAVIOUR",
      "OTHER"
    )
    .required()
    .messages({
      "any.only": "Invalid report category",
      "any.required": "Report category is required",
    }),

  description: Joi.string()
    .trim()
    .min(10)
    .max(2000)
    .required()
    .messages({
      "string.empty": "Report description is required",
      "string.min": "Report description must be at least 10 characters",
      "string.max": "Report description cannot exceed 2000 characters",
      "any.required": "Report description is required",
    }),
});

// ============================================================
// UPDATE REPORT
// ============================================================

const updateReportSchema = Joi.object({
  category: Joi.string()
    .valid(
      "SAFETY",
      "HARASSMENT",
      "FRAUD",
      "RIDE_ISSUE",
      "PAYMENT_ISSUE",
      "VEHICLE_ISSUE",
      "DRIVER_BEHAVIOUR",
      "PASSENGER_BEHAVIOUR",
      "OTHER"
    )
    .optional(),

  description: Joi.string()
    .trim()
    .min(10)
    .max(2000)
    .optional(),

  status: Joi.string()
    .valid(
      "PENDING",
      "UNDER_REVIEW",
      "RESOLVED",
      "REJECTED"
    )
    .optional(),
}).min(1);

// ============================================================
// UPDATE REPORT STATUS
// ============================================================

const updateReportStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "PENDING",
      "UNDER_REVIEW",
      "RESOLVED",
      "REJECTED"
    )
    .required()
    .messages({
      "any.only": "Invalid report status",
      "any.required": "Report status is required",
    }),

  resolution: Joi.string()
    .trim()
    .max(2000)
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Resolution cannot exceed 2000 characters",
    }),
});

// ============================================================
// REPORT ID PARAMETER
// ============================================================

const reportIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid report ID",
      "any.required": "Report ID is required",
    }),
});

// ============================================================
// USER ID PARAMETER
// ============================================================

const reportUserIdParamSchema = Joi.object({
  userId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid user ID",
      "any.required": "User ID is required",
    }),
});

// ============================================================
// LIST REPORTS
// ============================================================

const listReportsSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20),

  status: Joi.string()
    .valid(
      "PENDING",
      "UNDER_REVIEW",
      "RESOLVED",
      "REJECTED"
    )
    .optional(),

  category: Joi.string()
    .valid(
      "SAFETY",
      "HARASSMENT",
      "FRAUD",
      "RIDE_ISSUE",
      "PAYMENT_ISSUE",
      "VEHICLE_ISSUE",
      "DRIVER_BEHAVIOUR",
      "PASSENGER_BEHAVIOUR",
      "OTHER"
    )
    .optional(),

  reportedUserId: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": "Invalid reported user ID",
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
});

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createReportSchema,
  updateReportSchema,
  updateReportStatusSchema,
  reportIdParamSchema,
  reportUserIdParamSchema,
  listReportsSchema,
};