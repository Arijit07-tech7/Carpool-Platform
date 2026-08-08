// backend/src/validators/organization.validator.js

const Joi = require("joi");

// ============================================================
// CREATE ORGANIZATION
// ============================================================

const createOrganizationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(150)
    .required()
    .messages({
      "string.empty": "Organization name is required",
      "string.min": "Organization name must be at least 2 characters",
      "string.max": "Organization name cannot exceed 150 characters",
      "any.required": "Organization name is required",
    }),

  code: Joi.string()
    .trim()
    .uppercase()
    .min(2)
    .max(50)
    .pattern(/^[A-Z0-9_-]+$/)
    .required()
    .messages({
      "string.empty": "Organization code is required",
      "string.min": "Organization code must be at least 2 characters",
      "string.max": "Organization code cannot exceed 50 characters",
      "string.pattern.base":
        "Organization code can contain only letters, numbers, underscores, and hyphens",
      "any.required": "Organization code is required",
    }),

  description: Joi.string()
    .trim()
    .max(1000)
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Description cannot exceed 1000 characters",
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .max(255)
    .allow(null, "")
    .optional()
    .messages({
      "string.email": "Please provide a valid organization email",
      "string.max": "Email cannot exceed 255 characters",
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .allow(null, "")
    .optional()
    .messages({
      "string.pattern.base":
        "Phone number must contain exactly 10 digits",
    }),

  address: Joi.string()
    .trim()
    .max(500)
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Address cannot exceed 500 characters",
    }),

  isActive: Joi.boolean()
    .optional()
    .default(true),
});

// ============================================================
// UPDATE ORGANIZATION
// ============================================================

const updateOrganizationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(150)
    .optional()
    .messages({
      "string.min": "Organization name must be at least 2 characters",
      "string.max": "Organization name cannot exceed 150 characters",
    }),

  description: Joi.string()
    .trim()
    .max(1000)
    .allow(null, "")
    .optional(),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .max(255)
    .allow(null, "")
    .optional()
    .messages({
      "string.email": "Please provide a valid organization email",
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .allow(null, "")
    .optional()
    .messages({
      "string.pattern.base":
        "Phone number must contain exactly 10 digits",
    }),

  address: Joi.string()
    .trim()
    .max(500)
    .allow(null, "")
    .optional(),

  isActive: Joi.boolean()
    .optional(),
}).min(1);

// ============================================================
// ORGANIZATION ID PARAMETER
// ============================================================

const organizationIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid organization ID",
      "any.required": "Organization ID is required",
    }),
});

// ============================================================
// ADD MEMBER
// ============================================================

const addMemberSchema = Joi.object({
  userId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid user ID",
      "any.required": "User ID is required",
    }),
});

// ============================================================
// UPDATE MEMBER STATUS
// ============================================================

const updateMemberStatusSchema = Joi.object({
  status: Joi.string()
    .valid("ACTIVE", "INACTIVE", "SUSPENDED")
    .required()
    .messages({
      "any.only": "Invalid organization member status",
      "any.required": "Member status is required",
    }),
});

// ============================================================
// ORGANIZATION MEMBER PARAMETER
// ============================================================

const organizationMemberParamSchema = Joi.object({
 organizationId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid organization ID",
      "any.required": "Organization ID is required",
    }),

  userId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid user ID",
      "any.required": "User ID is required",
    }),
});

// ============================================================
// LIST ORGANIZATION MEMBERS
// ============================================================

const listMembersSchema = Joi.object({
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
});

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createOrganizationSchema,
  updateOrganizationSchema,
  organizationIdParamSchema,
  addMemberSchema,
  updateMemberStatusSchema,
  organizationMemberParamSchema,
  listMembersSchema,
};