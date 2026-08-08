// backend/src/validators/payment.validator.js

const Joi = require("joi");

// ============================================================
// CREATE PAYMENT
// ============================================================

const createPaymentSchema = Joi.object({
  bookingId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid booking ID",
      "any.required": "Booking ID is required",
    }),

  amount: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": "Payment amount must be a number",
      "number.positive": "Payment amount must be greater than zero",
      "any.required": "Payment amount is required",
    }),

  currency: Joi.string()
    .trim()
    .uppercase()
    .length(3)
    .default("INR")
    .messages({
      "string.length": "Currency must be a 3-letter currency code",
    }),
});

// ============================================================
// CREATE RAZORPAY ORDER
// ============================================================

const createPaymentOrderSchema = Joi.object({
  bookingId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid booking ID",
      "any.required": "Booking ID is required",
    }),

  amount: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": "Payment amount must be a number",
      "number.positive": "Payment amount must be greater than zero",
      "any.required": "Payment amount is required",
    }),

  currency: Joi.string()
    .trim()
    .uppercase()
    .length(3)
    .default("INR"),
});

// ============================================================
// VERIFY PAYMENT
// ============================================================

const verifyPaymentSchema = Joi.object({
  razorpayOrderId: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Razorpay order ID is required",
      "any.required": "Razorpay order ID is required",
    }),

  razorpayPaymentId: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Razorpay payment ID is required",
      "any.required": "Razorpay payment ID is required",
    }),

  razorpaySignature: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Razorpay signature is required",
      "any.required": "Razorpay signature is required",
    }),
});

// ============================================================
// REFUND PAYMENT
// ============================================================

const refundPaymentSchema = Joi.object({
  paymentId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid payment ID",
      "any.required": "Payment ID is required",
    }),

  amount: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      "number.positive": "Refund amount must be greater than zero",
    }),

  reason: Joi.string()
    .trim()
    .max(500)
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Refund reason cannot exceed 500 characters",
    }),
});

// ============================================================
// UPDATE PAYMENT STATUS
// ============================================================

const updatePaymentStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "PENDING",
      "SUCCESS",
      "FAILED",
      "REFUNDED",
      "CANCELLED"
    )
    .required()
    .messages({
      "any.only": "Invalid payment status",
      "any.required": "Payment status is required",
    }),
});

// ============================================================
// PAYMENT ID PARAMETER
// ============================================================

const paymentIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid payment ID",
      "any.required": "Payment ID is required",
    }),
});

// ============================================================
// BOOKING PAYMENT PARAMETER
// ============================================================

const bookingPaymentParamSchema = Joi.object({
  bookingId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid booking ID",
      "any.required": "Booking ID is required",
    }),
});

// ============================================================
// LIST PAYMENTS
// ============================================================

const listPaymentsSchema = Joi.object({
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
      "PENDING",
      "SUCCESS",
      "FAILED",
      "REFUNDED",
      "CANCELLED"
    )
    .optional(),

  bookingId: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": "Invalid booking ID",
    }),

  userId: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": "Invalid user ID",
    }),
});

// ============================================================
// RAZORPAY WEBHOOK
// ============================================================

const razorpayWebhookSchema = Joi.object({
  event: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Webhook event is required",
      "any.required": "Webhook event is required",
    }),

  payload: Joi.object()
    .required()
    .messages({
      "any.required": "Webhook payload is required",
    }),
});

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createPaymentSchema,
  createPaymentOrderSchema,
  verifyPaymentSchema,
  refundPaymentSchema,
  updatePaymentStatusSchema,
  paymentIdParamSchema,
  bookingPaymentParamSchema,
  listPaymentsSchema,
  razorpayWebhookSchema,
};