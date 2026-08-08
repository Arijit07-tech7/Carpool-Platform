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

router.use(authMiddleware.authenticate);


// ============================================================
// PAYMENT METHODS
// ============================================================

/**
 * GET /api/payments/methods
 *
 * Get supported payment methods.
 *
 * CASH | CARD | PAYPAL | WALLET
 */
router.get(
  "/methods",
  paymentController.getPaymentMethods
);


// ============================================================
// CREATE PAYMENT
// ============================================================

/**
 * POST /api/payments
 *
 * Initiate a payment for a completed trip.
 *
 * Body: { tripId, paymentMethod }
 *
 * - CASH → recorded immediately as COMPLETED.
 * - WALLET → deducted from wallet immediately.
 * - PAYPAL / CARD → creates a PayPal order and returns
 *   an approvalUrl. Frontend must redirect the user there,
 *   then call /paypal/capture once approved.
 */
router.post(
  "/",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    paymentValidator.createPaymentSchema
  ),
  paymentController.createPayment
);


// ============================================================
// PAYPAL – CREATE ORDER
// ============================================================

/**
 * POST /api/payments/paypal/order
 *
 * Create a standalone PayPal order.
 *
 * Body: { tripId, amount, currency? }
 */
router.post(
  "/paypal/order",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    paymentValidator.createPaypalOrderSchema
  ),
  paymentController.createPaypalOrder
);


// ============================================================
// PAYPAL – CAPTURE PAYMENT
// ============================================================

/**
 * POST /api/payments/paypal/capture
 *
 * Capture (finalize) a PayPal payment after user approval.
 *
 * Body: { paymentId, paypalOrderId }
 */
router.post(
  "/paypal/capture",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    paymentValidator.capturePaypalPaymentSchema
  ),
  paymentController.capturePaypalPayment
);


// ============================================================
// PAYPAL WEBHOOK
// ============================================================

/**
 * POST /api/payments/paypal/webhook
 *
 * PayPal IPN/Webhook endpoint.
 * No JWT auth — PayPal calls this directly.
 * Verification happens inside the controller.
 */
router.post(
  "/paypal/webhook",
  paymentController.handlePaypalWebhook
);


// ============================================================
// WALLET PAYMENT
// ============================================================

/**
 * POST /api/payments/wallet
 *
 * Pay using the user's wallet balance.
 */
router.post(
  "/wallet",
  organizationMiddleware.verifyCurrentUserMembership,
  paymentController.processWalletPayment
);


// ============================================================
// REFUND
// ============================================================

/**
 * POST /api/payments/:paymentId/refund
 *
 * Refund a completed payment.
 */
router.post(
  "/:paymentId/refund",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    paymentValidator.refundPaymentSchema
  ),
  paymentController.refundPayment
);


// ============================================================
// PAYMENT STATUS
// ============================================================

/**
 * GET /api/payments/:paymentId/status
 */
router.get(
  "/:paymentId/status",
  organizationMiddleware.verifyCurrentUserMembership,
  paymentController.getPaymentStatus
);


// ============================================================
// PAYMENT DETAILS
// ============================================================

/**
 * GET /api/payments/:paymentId
 */
router.get(
  "/:paymentId",
  organizationMiddleware.verifyCurrentUserMembership,
  paymentController.getPaymentById
);


// ============================================================
// PAYMENT HISTORY
// ============================================================

/**
 * GET /api/payments
 */
router.get(
  "/",
  organizationMiddleware.verifyCurrentUserMembership,
  paymentController.getMyPayments
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;