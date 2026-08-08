// backend/src/validators/auth.validator.js

const Joi = require("joi");

// ============================================================
// REGISTER
// ============================================================

const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 100 characters",
      "any.required": "Name is required",
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .max(255)
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
      "string.max": "Email cannot exceed 255 characters",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password cannot exceed 128 characters",
      "any.required": "Password is required",
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      "string.pattern.base": "Phone number must contain exactly 10 digits",
    }),

  organizationId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid organization ID",
      "any.required": "Organization ID is required",
    }),
});

// ============================================================
// LOGIN
// ============================================================

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .required()
    .messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
});

// ============================================================
// REFRESH TOKEN
// ============================================================

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Refresh token is required",
      "any.required": "Refresh token is required",
    }),
});

// ============================================================
// CHANGE PASSWORD
// ============================================================

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      "string.empty": "Current password is required",
      "any.required": "Current password is required",
    }),

  newPassword: Joi.string()
    .min(8)
    .max(128)
    .required()
    .messages({
      "string.empty": "New password is required",
      "string.min": "New password must be at least 8 characters",
      "string.max": "New password cannot exceed 128 characters",
      "any.required": "New password is required",
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Confirm password is required",
    }),
});

// ============================================================
// FORGOT PASSWORD
// ============================================================

const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
});

// ============================================================
// RESET PASSWORD
// ============================================================

const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Reset token is required",
      "any.required": "Reset token is required",
    }),

  newPassword: Joi.string()
    .min(8)
    .max(128)
    .required()
    .messages({
      "string.empty": "New password is required",
      "string.min": "New password must be at least 8 characters",
      "string.max": "New password cannot exceed 128 characters",
      "any.required": "New password is required",
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Confirm password is required",
    }),
});

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};