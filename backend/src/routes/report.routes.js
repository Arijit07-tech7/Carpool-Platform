// backend/src/routes/report.routes.js

const express = require("express");
const reportController = require("../controllers/report.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");
const organizationMiddleware = require("../middleware/organization.middleware.js");
const roleMiddleware = require("../middleware/role.middleware.js");

const router = express.Router();

router.use(authMiddleware.authenticate);

// GET /api/reports/summary
router.get("/summary", organizationMiddleware.requireOrganization, reportController.getReportSummary);

// GET /api/reports/rides
router.get("/rides", organizationMiddleware.requireOrganization, reportController.getRideReport);

// GET /api/reports/payments
router.get("/payments", organizationMiddleware.requireOrganization, reportController.getPaymentReport);

// GET /api/reports/wallet
router.get("/wallet", organizationMiddleware.requireOrganization, reportController.getWalletReport);

// GET /api/reports/monthly
router.get("/monthly", organizationMiddleware.requireOrganization, reportController.getOverviewReport);

// GET /api/reports/organization
router.get("/organization", organizationMiddleware.requireOrganization,
  roleMiddleware.isCompanyAdmin, reportController.getOrganizationReport);

// GET /api/reports/organization/rides
router.get("/organization/rides", organizationMiddleware.requireOrganization,
  roleMiddleware.isCompanyAdmin, reportController.getRideReport);

// GET /api/reports/organization/payments
router.get("/organization/payments", organizationMiddleware.requireOrganization,
  roleMiddleware.isCompanyAdmin, reportController.getPaymentReport);

// GET /api/reports/organization/participation
router.get("/organization/participation", organizationMiddleware.requireOrganization,
  roleMiddleware.isCompanyAdmin, reportController.getPassengerReport);

// GET /api/reports/export
router.get("/export", organizationMiddleware.requireOrganization, reportController.exportReport);

// GET /api/reports/organization/export
router.get("/organization/export", organizationMiddleware.requireOrganization,
  roleMiddleware.isCompanyAdmin, reportController.exportReport);

// GET /api/reports/dashboard
router.get("/dashboard", organizationMiddleware.requireOrganization, reportController.getOverviewReport);

// GET /api/reports/organization/dashboard
router.get("/organization/dashboard", organizationMiddleware.requireOrganization,
  roleMiddleware.isCompanyAdmin, reportController.getOrganizationReport);

module.exports = router;

