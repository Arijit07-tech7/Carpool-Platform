// backend/src/routes/wallet.routes.js

const express = require("express");

const walletController =
  require("../controllers/wallet.controller.js");

const authMiddleware =
  require("../middleware/auth.middleware.js");

const organizationMiddleware =
  require("../middleware/organization.middleware.js");

const validationMiddleware =
  require("../middleware/validation.middleware.js");

const walletValidator =
  require("../validators/wallet.validator.js");


const router = express.Router();


// ============================================================
// AUTHENTICATION
// ============================================================

router.use(
  authMiddleware.authenticate
);


// ============================================================
// WALLET DETAILS
// ============================================================

/**
 * GET /api/wallet
 *
 * Get the logged-in user's wallet.
 */
router.get(
  "/",
  organizationMiddleware.verifyCurrentUserMembership,
  walletController.getWallet
);


// ============================================================
// WALLET BALANCE
// ============================================================

/**
 * GET /api/wallet/balance
 *
 * Get current wallet balance.
 */
router.get(
  "/balance",
  organizationMiddleware.verifyCurrentUserMembership,
  walletController.getBalance
);


// ============================================================
// CHECK BALANCE
// ============================================================

/**
 * GET /api/wallet/check-balance?amount=100
 *
 * Check whether the wallet has
 * enough balance for a payment.
 */
router.get(
  "/check-balance",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validateQuery(
    walletValidator.checkBalance
  ),
  walletController.checkBalance
);


// ============================================================
// RECHARGE WALLET
// ============================================================

/**
 * POST /api/wallet/recharge
 *
 * Add money to wallet.
 *
 * Example:
 *
 * {
 *   "amount": 500
 * }
 */
router.post(
  "/recharge",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    walletValidator.recharge
  ),
  walletController.recharge
);


// ============================================================
// CREATE RECHARGE ORDER
// ============================================================

/**
 * POST /api/wallet/recharge/order
 *
 * Create Razorpay order for
 * wallet recharge.
 */
router.post(
  "/recharge/order",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    walletValidator.recharge
  ),
  walletController.createRechargeOrder
);


// ============================================================
// VERIFY RECHARGE
// ============================================================

/**
 * POST /api/wallet/recharge/verify
 *
 * Verify Razorpay wallet recharge.
 */
router.post(
  "/recharge/verify",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    walletValidator.verifyRecharge
  ),
  walletController.verifyRecharge
);


// ============================================================
// WALLET PAYMENT
// ============================================================

/**
 * POST /api/wallet/pay
 *
 * Pay for a trip using wallet.
 *
 * Example:
 *
 * {
 *   "tripId": "...",
 *   "amount": 150
 * }
 */
router.post(
  "/pay",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    walletValidator.walletPayment
  ),
  walletController.payWithWallet
);


// ============================================================
// WALLET TRANSACTIONS
// ============================================================

/**
 * GET /api/wallet/transactions
 *
 * Get wallet transaction history.
 */
router.get(
  "/transactions",
  organizationMiddleware.verifyCurrentUserMembership,
  walletController.getTransactions
);


// ============================================================
// SINGLE TRANSACTION
// ============================================================

/**
 * GET /api/wallet/transactions/:transactionId
 *
 * Get wallet transaction details.
 */
router.get(
  "/transactions/:transactionId",
  organizationMiddleware.verifyCurrentUserMembership,
  walletController.getTransactionById
);


// ============================================================
// WALLET PAYMENT STATUS
// ============================================================

/**
 * GET /api/wallet/payment/:paymentId/status
 *
 * Get wallet payment status.
 */
router.get(
  "/payment/:paymentId/status",
  organizationMiddleware.verifyCurrentUserMembership,
  walletController.getPaymentStatus
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;