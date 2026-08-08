// backend/src/validators/payment.validator.js

const Joi = require("joi");

// ============================================================
// CREATE PAYMENT
// ============================================================

const createPaymentSchema = Joi.object({
  tripId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid trip ID",
      "any.required": "Trip ID is required",
    }),

  paymentMethod: Joi.string()
    .valid("CASH", "CARD", "PAYPAL", "WALLET")
    .required()
    .messages({
      "any.only": "Payment method must be one of: CASH, CARD, PAYPAL, WALLET",
      "any.required": "Payment method is required",
    }),
});

// ============================================================
// CREATE PAYPAL ORDER
// ============================================================

const createPaypalOrderSchema = Joi.object({
  tripId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid trip ID",
      "any.required": "Trip ID is required",
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
    .default("USD")
    .messages({
      "string.length": "Currency must be a 3-letter ISO currency code (e.g. USD)",
    }),
});

// ============================================================
// CAPTURE PAYPAL PAYMENT
// ============================================================

const capturePaypalPaymentSchema = Joi.object({
  paymentId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid payment ID",
      "any.required": "Payment ID is required",
    }),

  paypalOrderId: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "PayPal order ID is required",
      "any.required": "PayPal order ID is required",
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
      "PROCESSING",
      "COMPLETED",
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
      "PROCESSING",
      "COMPLETED",
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
// PAYPAL WEBHOOK
// ============================================================

const paypalWebhookSchema = Joi.object({
  event_type: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Webhook event type is required",
      "any.required": "Webhook event type is required",
    }),

  resource: Joi.object()
    .required()
    .messages({
      "any.required": "Webhook resource is required",
    }),

  resource_type: Joi.string()
    .optional(),

  summary: Joi.string()
    .optional(),
}).unknown(true); // Allow additional PayPal webhook fields

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createPaymentSchema,
  createPaypalOrderSchema,
  capturePaypalPaymentSchema,
  refundPaymentSchema,
  updatePaymentStatusSchema,
  paymentIdParamSchema,
  bookingPaymentParamSchema,
  listPaymentsSchema,
  paypalWebhookSchema,
};