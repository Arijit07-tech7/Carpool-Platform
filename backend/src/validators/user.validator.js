// backend/src/validators/user.validator.js

const Joi = require("joi");

// ============================================================
// UPDATE PROFILE
// ============================================================

const updateProfileSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .messages({
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 100 characters",
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .max(255)
    .optional()
    .messages({
      "string.email": "Please provide a valid email address",
      "string.max": "Email cannot exceed 255 characters",
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .allow(null, "")
    .optional()
    .messages({
      "string.pattern.base": "Phone number must contain exactly 10 digits",
    }),

  profileImage: Joi.string()
    .trim()
    .max(500)
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Profile image path cannot exceed 500 characters",
    }),
}).min(1);

// ============================================================
// UPDATE USER STATUS
// ============================================================

const updateUserStatusSchema = Joi.object({
  status: Joi.string()
    .valid("ACTIVE", "INACTIVE", "SUSPENDED")
    .required()
    .messages({
      "any.only": "Invalid user status",
      "any.required": "User status is required",
    }),
});

// ============================================================
// UPDATE USER ROLE
// ============================================================

const updateUserRoleSchema = Joi.object({
  role: Joi.string()
    .valid("EMPLOYEE", "COMPANY_ADMIN", "SUPER_ADMIN")
    .required()
    .messages({
      "any.only": "Invalid user role",
      "any.required": "User role is required",
    }),
});

// ============================================================
// USER ID PARAMETER
// ============================================================

const userIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid user ID",
      "any.required": "User ID is required",
    }),
});

// ============================================================
// LIST USERS / SEARCH USERS
// ============================================================

const listUsersSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),

  search: Joi.string()
    .trim()
    .max(100)
    .optional(),

  status: Joi.string()
    .valid("ACTIVE", "INACTIVE", "SUSPENDED")
    .optional(),

  role: Joi.string()
    .valid("EMPLOYEE", "COMPANY_ADMIN", "SUPER_ADMIN")
    .optional(),
});

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  updateProfileSchema,
  updateUserStatusSchema,
  updateUserRoleSchema,
  userIdParamSchema,
  listUsersSchema,
};