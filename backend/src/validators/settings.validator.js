// backend/src/validators/settings.validator.js

const Joi = require("joi");

// ============================================================
// UPDATE ACCOUNT SETTINGS
// ============================================================

const updateSettingsSchema = Joi.object({
  language: Joi.string()
    .trim()
    .max(10)
    .optional()
    .messages({
      "string.max": "Language code cannot exceed 10 characters",
    }),

  timezone: Joi.string()
    .trim()
    .max(100)
    .optional()
    .messages({
      "string.max": "Timezone cannot exceed 100 characters",
    }),

  currency: Joi.string()
    .trim()
    .uppercase()
    .length(3)
    .optional()
    .messages({
      "string.length": "Currency must be a 3-letter currency code",
    }),

  notificationsEnabled: Joi.boolean()
    .optional()
    .messages({
      "boolean.base": "Notifications enabled must be true or false",
    }),

  emailNotifications: Joi.boolean()
    .optional()
    .messages({
      "boolean.base": "Email notifications must be true or false",
    }),

  pushNotifications: Joi.boolean()
    .optional()
    .messages({
      "boolean.base": "Push notifications must be true or false",
    }),

  rideNotifications: Joi.boolean()
    .optional()
    .messages({
      "boolean.base": "Ride notifications must be true or false",
    }),

  chatNotifications: Joi.boolean()
    .optional()
    .messages({
      "boolean.base": "Chat notifications must be true or false",
    }),

  paymentNotifications: Joi.boolean()
    .optional()
    .messages({
      "boolean.base": "Payment notifications must be true or false",
    }),
}).min(1);

// ============================================================
// UPDATE NOTIFICATION SETTINGS
// ============================================================

const notificationSettingsSchema = Joi.object({
  notificationsEnabled: Joi.boolean()
    .optional(),

  emailNotifications: Joi.boolean()
    .optional(),

  pushNotifications: Joi.boolean()
    .optional(),

  rideNotifications: Joi.boolean()
    .optional(),

  chatNotifications: Joi.boolean()
    .optional(),

  paymentNotifications: Joi.boolean()
    .optional(),
}).min(1);

// ============================================================
// UPDATE PRIVACY SETTINGS
// ============================================================

const privacySettingsSchema = Joi.object({
  profileVisibility: Joi.string()
    .valid(
      "PUBLIC",
      "ORGANIZATION",
      "PRIVATE"
    )
    .optional(),

  showPhoneNumber: Joi.boolean()
    .optional(),

  showEmail: Joi.boolean()
    .optional(),

  showRideHistory: Joi.boolean()
    .optional(),

  allowDirectMessages: Joi.boolean()
    .optional(),
}).min(1);

// ============================================================
// UPDATE LOCATION SETTINGS
// ============================================================

const locationSettingsSchema = Joi.object({
  locationSharingEnabled: Joi.boolean()
    .optional(),

  liveTrackingEnabled: Joi.boolean()
    .optional(),

  backgroundLocationEnabled: Joi.boolean()
    .optional(),
}).min(1);

// ============================================================
// UPDATE SECURITY SETTINGS
// ============================================================

const securitySettingsSchema = Joi.object({
  twoFactorEnabled: Joi.boolean()
    .optional(),

  loginNotifications: Joi.boolean()
    .optional(),

  sessionTimeout: Joi.number()
    .integer()
    .min(5)
    .max(43200)
    .optional()
    .messages({
      "number.min": "Session timeout must be at least 5 minutes",
      "number.max": "Session timeout cannot exceed 43200 minutes",
    }),
}).min(1);

// ============================================================
// CHANGE PASSWORD
// ============================================================

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .min(8)
    .max(128)
    .required()
    .messages({
      "string.min": "Current password must be at least 8 characters",
      "string.max": "Current password cannot exceed 128 characters",
      "any.required": "Current password is required",
    }),

  newPassword: Joi.string()
    .min(8)
    .max(128)
    .required()
    .messages({
      "string.min": "New password must be at least 8 characters",
      "string.max": "New password cannot exceed 128 characters",
      "any.required": "New password is required",
    }),

  confirmPassword: Joi.any()
    .equal(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Password confirmation is required",
    }),
});

// ============================================================
// SETTINGS ID PARAMETER
// ============================================================

const settingsIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid settings ID",
      "any.required": "Settings ID is required",
    }),
});

// ============================================================
// USER ID PARAMETER
// ============================================================

const settingsUserIdParamSchema = Joi.object({
  userId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid user ID",
      "any.required": "User ID is required",
    }),
});

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  updateSettingsSchema,
  notificationSettingsSchema,
  privacySettingsSchema,
  locationSettingsSchema,
  securitySettingsSchema,
  changePasswordSchema,
  settingsIdParamSchema,
  settingsUserIdParamSchema,
};