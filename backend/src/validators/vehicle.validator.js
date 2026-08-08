// backend/src/validators/vehicle.validator.js

const Joi = require("joi");

// ============================================================
// CREATE / REGISTER VEHICLE
// ============================================================

const createVehicleSchema = Joi.object({
  registrationNumber: Joi.string()
    .trim()
    .uppercase()
    .min(4)
    .max(20)
    .required()
    .messages({
      "string.empty": "Registration number is required",
      "string.min": "Registration number must be at least 4 characters",
      "string.max": "Registration number cannot exceed 20 characters",
      "any.required": "Registration number is required",
    }),

  make: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "Vehicle make is required",
      "string.min": "Vehicle make must be at least 2 characters",
      "string.max": "Vehicle make cannot exceed 100 characters",
      "any.required": "Vehicle make is required",
    }),

  model: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      "string.empty": "Vehicle model is required",
      "string.max": "Vehicle model cannot exceed 100 characters",
      "any.required": "Vehicle model is required",
    }),

  color: Joi.string()
    .trim()
    .max(50)
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Vehicle color cannot exceed 50 characters",
    }),

  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .optional()
    .messages({
      "number.integer": "Vehicle year must be an integer",
      "number.min": "Vehicle year is invalid",
      "number.max": "Vehicle year cannot be in the distant future",
    }),

  seats: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .required()
    .messages({
      "number.integer": "Seat count must be an integer",
      "number.min": "Vehicle must have at least 1 seat",
      "number.max": "Vehicle cannot have more than 50 seats",
      "any.required": "Seat count is required",
    }),

  vehicleType: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      "string.max": "Vehicle type cannot exceed 50 characters",
    }),

  fuelType: Joi.string()
    .valid(
      "PETROL",
      "DIESEL",
      "CNG",
      "ELECTRIC",
      "HYBRID",
      "OTHER"
    )
    .optional()
    .messages({
      "any.only": "Invalid fuel type",
    }),

  fuelEfficiency: Joi.number()
    .min(0)
    .precision(2)
    .optional()
    .messages({
      "number.min": "Fuel efficiency cannot be negative",
    }),

  fuelCostPerKm: Joi.number()
    .min(0)
    .precision(2)
    .optional()
    .messages({
      "number.min": "Fuel cost per kilometer cannot be negative",
    }),
});

// ============================================================
// UPDATE VEHICLE
// ============================================================

const updateVehicleSchema = Joi.object({
  registrationNumber: Joi.string()
    .trim()
    .uppercase()
    .min(4)
    .max(20)
    .optional(),

  make: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  model: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .optional(),

  color: Joi.string()
    .trim()
    .max(50)
    .allow(null, "")
    .optional(),

  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .optional(),

  seats: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .optional(),

  vehicleType: Joi.string()
    .trim()
    .max(50)
    .optional(),

  fuelType: Joi.string()
    .valid(
      "PETROL",
      "DIESEL",
      "CNG",
      "ELECTRIC",
      "HYBRID",
      "OTHER"
    )
    .optional(),

  fuelEfficiency: Joi.number()
    .min(0)
    .precision(2)
    .optional(),

  fuelCostPerKm: Joi.number()
    .min(0)
    .precision(2)
    .optional(),
}).min(1);

// ============================================================
// VEHICLE STATUS
// ============================================================

const updateVehicleStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "ACTIVE",
      "INACTIVE",
      "MAINTENANCE",
      "SUSPENDED"
    )
    .required()
    .messages({
      "any.only": "Invalid vehicle status",
      "any.required": "Vehicle status is required",
    }),
});

// ============================================================
// VEHICLE ID PARAMETER
// ============================================================

const vehicleIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid vehicle ID",
      "any.required": "Vehicle ID is required",
    }),
});

// ============================================================
// LIST VEHICLES
// ============================================================

const listVehiclesSchema = Joi.object({
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
      "ACTIVE",
      "INACTIVE",
      "MAINTENANCE",
      "SUSPENDED"
    )
    .optional(),

  fuelType: Joi.string()
    .valid(
      "PETROL",
      "DIESEL",
      "CNG",
      "ELECTRIC",
      "HYBRID",
      "OTHER"
    )
    .optional(),

  search: Joi.string()
    .trim()
    .max(100)
    .optional(),
});

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createVehicleSchema,
  updateVehicleSchema,
  updateVehicleStatusSchema,
  vehicleIdParamSchema,
  listVehiclesSchema,
};