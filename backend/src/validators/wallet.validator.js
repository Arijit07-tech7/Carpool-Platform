// backend/src/validators/wallet.validator.js

const Joi = require("joi");

// ============================================================
// RECHARGE WALLET
// ============================================================

const rechargeWalletSchema = Joi.object({
  amount: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": "Recharge amount must be a number",
      "number.positive": "Recharge amount must be greater than zero",
      "any.required": "Recharge amount is required",
    }),

  paymentMethod: Joi.string()
    .valid(
      "PAYPAL",
      "CARD"
    )
    .required()
    .messages({
      "any.only": "Invalid payment method. Use PAYPAL or CARD",
      "any.required": "Payment method is required",
    }),
});

// ============================================================
// WALLET PAYMENT
// ============================================================

const walletPaymentSchema = Joi.object({
  amount: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": "Payment amount must be a number",
      "number.positive": "Payment amount must be greater than zero",
      "any.required": "Payment amount is required",
    }),

  bookingId: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": "Invalid booking ID",
    }),

  description: Joi.string()
    .trim()
    .max(500)
    .optional()
    .messages({
      "string.max": "Description cannot exceed 500 characters",
    }),
});

// ============================================================
// ADD MONEY / CREDIT WALLET
// ============================================================

const creditWalletSchema = Joi.object({
  amount: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": "Amount must be a number",
      "number.positive": "Amount must be greater than zero",
      "any.required": "Amount is required",
    }),

  reference: Joi.string()
    .trim()
    .max(255)
    .optional()
    .messages({
      "string.max": "Reference cannot exceed 255 characters",
    }),

  description: Joi.string()
    .trim()
    .max(500)
    .optional()
    .messages({
      "string.max": "Description cannot exceed 500 characters",
    }),
});

// ============================================================
// DEBIT WALLET
// ============================================================

const debitWalletSchema = Joi.object({
  amount: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": "Amount must be a number",
      "number.positive": "Amount must be greater than zero",
      "any.required": "Amount is required",
    }),

  bookingId: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": "Invalid booking ID",
    }),

  description: Joi.string()
    .trim()
    .max(500)
    .optional()
    .messages({
      "string.max": "Description cannot exceed 500 characters",
    }),
});

// ============================================================
// WALLET ID PARAMETER
// ============================================================

const walletIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid wallet ID",
      "any.required": "Wallet ID is required",
    }),
});

// ============================================================
// USER ID PARAMETER
// ============================================================

const walletUserIdParamSchema = Joi.object({
  userId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid user ID",
      "any.required": "User ID is required",
    }),
});

// ============================================================
// TRANSACTION ID PARAMETER
// ============================================================

const transactionIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid transaction ID",
      "any.required": "Transaction ID is required",
    }),
});

// ============================================================
// WALLET TRANSACTION HISTORY
// ============================================================

const walletTransactionsSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20),

  type: Joi.string()
    .valid(
      "CREDIT",
      "DEBIT",
      "REFUND",
      "RECHARGE"
    )
    .optional(),

  status: Joi.string()
    .valid(
      "PENDING",
      "COMPLETED",
      "FAILED",
      "CANCELLED"
    )
    .optional(),

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
// UPDATE WALLET STATUS
// ============================================================

const updateWalletStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "ACTIVE",
      "INACTIVE",
      "BLOCKED"
    )
    .required()
    .messages({
      "any.only": "Invalid wallet status",
      "any.required": "Wallet status is required",
    }),
});

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  rechargeWalletSchema,
  walletPaymentSchema,
  creditWalletSchema,
  debitWalletSchema,
  walletIdParamSchema,
  walletUserIdParamSchema,
  transactionIdParamSchema,
  walletTransactionsSchema,
  updateWalletStatusSchema,
};