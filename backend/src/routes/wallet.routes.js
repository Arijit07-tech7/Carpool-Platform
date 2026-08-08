// backend/src/routes/wallet.routes.js

const express = require("express");
const walletController = require("../controllers/wallet.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");
const organizationMiddleware = require("../middleware/organization.middleware.js");
const validationMiddleware = require("../middleware/validation.middleware.js");
const walletValidator = require("../validators/wallet.validator.js");

const router = express.Router();

router.use(authMiddleware.authenticate);

// GET /api/wallet
router.get("/", organizationMiddleware.requireOrganization, walletController.getWallet);

// GET /api/wallet/balance
router.get("/balance", organizationMiddleware.requireOrganization, walletController.getBalance);

// GET /api/wallet/check-balance
router.get("/check-balance", organizationMiddleware.requireOrganization, walletController.getBalance);

// POST /api/wallet/recharge
router.post("/recharge", organizationMiddleware.requireOrganization,
  validationMiddleware.validate(walletValidator.recharge), walletController.rechargeWallet);

// POST /api/wallet/recharge/order
router.post("/recharge/order", organizationMiddleware.requireOrganization,
  validationMiddleware.validate(walletValidator.recharge), walletController.rechargeWallet);

// POST /api/wallet/recharge/verify
router.post("/recharge/verify", organizationMiddleware.requireOrganization,
  validationMiddleware.validate(walletValidator.verifyRecharge), walletController.verifyRecharge);

// POST /api/wallet/pay
router.post("/pay", organizationMiddleware.requireOrganization,
  validationMiddleware.validate(walletValidator.walletPayment), walletController.payUsingWallet);

// GET /api/wallet/transactions
router.get("/transactions", organizationMiddleware.requireOrganization, walletController.getTransactions);

// GET /api/wallet/transactions/:transactionId
router.get("/transactions/:transactionId", organizationMiddleware.requireOrganization, walletController.getTransactionById);

// GET /api/wallet/payment/:paymentId/status
router.get("/payment/:paymentId/status", organizationMiddleware.requireOrganization, walletController.getBalance);

module.exports = router;

