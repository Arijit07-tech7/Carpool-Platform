// backend/src/routes/payment.routes.js

const express = require("express");

const paymentController =
  require("../controllers/payment.controller.js");

const authMiddleware =
  require("../middleware/auth.middleware.js");

const organizationMiddleware =
  require("../middleware/organization.middleware.js");

const validationMiddleware =
  require("../middleware/validation.middleware.js");

const paymentValidator =
  require("../validators/payment.validator.js");


const router = express.Router();


// ============================================================
// AUTHENTICATION
// ============================================================

router.use(
  authMiddleware.authenticate
);


// ============================================================
// PAYMENT METHODS
// ============================================================

/**
 * GET /api/payments/methods
 *
 * Get supported payment methods.
 *
 * CASH
 * CARD
 * UPI
 * WALLET
 */
router.get(
  "/methods",
  paymentController.getPaymentMethods
);


// ============================================================
// PAYMENT CALCULATION
// ============================================================

/**
 * GET /api/payments/trip/:tripId/fare
 *
 * Get the final fare for a trip.
 */
router.get(
  "/trip/:tripId/fare",
  organizationMiddleware.verifyCurrentUserMembership,
  paymentController.getTripFare
);


// ============================================================
// CREATE PAYMENT
// ============================================================

/**
 * POST /api/payments
 *
 * Create a payment for a completed trip.
 *
 * Example:
 *
 * {
 *   "tripId": "trip-id",
 *   "method": "UPI"
 * }
 */
router.post(
  "/",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    paymentValidator.createPayment
  ),
  paymentController.createPayment
);


// ============================================================
// CASH PAYMENT
// ============================================================

/**
 * POST /api/payments/:paymentId/cash
 *
 * Confirm cash payment.
 */
router.post(
  "/:paymentId/cash",
  organizationMiddleware.verifyCurrentUserMembership,
  paymentController.processCashPayment
);


// ============================================================
// RAZORPAY PAYMENT
// ============================================================

/**
 * POST /api/payments/:paymentId/razorpay/order
 *
 * Create Razorpay order.
 */
router.post(
  "/:paymentId/razorpay/order",
  organizationMiddleware.verifyCurrentUserMembership,
  paymentController.createRazorpayOrder
);


// ============================================================
// RAZORPAY VERIFICATION
// ============================================================

/**
 * POST /api/payments/:paymentId/razorpay/verify
 *
 * Verify Razorpay payment.
 */
router.post(
  "/:paymentId/razorpay/verify",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    paymentValidator.verifyRazorpayPayment
  ),
  paymentController.verifyRazorpayPayment
);


// ============================================================
// UPI PAYMENT
// ============================================================

/**
 * POST /api/payments/:paymentId/upi
 *
 * Process UPI payment.
 *
 * Razorpay sandbox/test mode can be
 * used for the actual gateway flow.
 */
router.post(
  "/:paymentId/upi",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    paymentValidator.upiPayment
  ),
  paymentController.processUpiPayment
);


// ============================================================
// CARD PAYMENT
// ============================================================

/**
 * POST /api/payments/:paymentId/card
 *
 * Process card payment through
 * the configured payment gateway.
 */
router.post(
  "/:paymentId/card",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    paymentValidator.cardPayment
  ),
  paymentController.processCardPayment
);


// ============================================================
// WALLET PAYMENT
// ============================================================

/**
 * POST /api/payments/:paymentId/wallet
 *
 * Pay using the user's wallet.
 *
 * The service must check wallet
 * balance before deducting money.
 */
router.post(
  "/:paymentId/wallet",
  organizationMiddleware.verifyCurrentUserMembership,
  paymentController.processWalletPayment
);


// ============================================================
// PAYMENT DETAILS
// ============================================================

/**
 * GET /api/payments/:paymentId
 *
 * Get payment details.
 */
router.get(
  "/:paymentId",
  organizationMiddleware.verifyCurrentUserMembership,
  paymentController.getPaymentById
);


// ============================================================
// PAYMENT STATUS
// ============================================================

/**
 * GET /api/payments/:paymentId/status
 *
 * Get current payment status.
 */
router.get(
  "/:paymentId/status",
  organizationMiddleware.verifyCurrentUserMembership,
  paymentController.getPaymentStatus
);


// ============================================================
// PAYMENT HISTORY
// ============================================================

/**
 * GET /api/payments
 *
 * Get current user's payments.
 */
router.get(
  "/",
  organizationMiddleware.verifyCurrentUserMembership,
  paymentController.getMyPayments
);


// ============================================================
// PAYMENT WEBHOOK
// ============================================================

/**
 * POST /api/payments/webhook
 *
 * Razorpay webhook endpoint.
 *
 * IMPORTANT:
 * This endpoint normally should NOT use
 * normal JWT authentication because
 * Razorpay calls it directly.
 *
 * Signature verification must happen
 * inside the controller/service.
 */
router.post(
  "/webhook",
  paymentController.handleWebhook
);


// ============================================================
// REFUND
// ============================================================

/**
 * POST /api/payments/:paymentId/refund
 *
 * Process refund when applicable.
 */
router.post(
  "/:paymentId/refund",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    paymentValidator.refundPayment
  ),
  paymentController.refundPayment
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;