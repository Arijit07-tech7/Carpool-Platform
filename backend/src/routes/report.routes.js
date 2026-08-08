// backend/src/routes/report.routes.js

const express = require("express");

const reportController =
  require("../controllers/report.controller.js");

const authMiddleware =
  require("../middleware/auth.middleware.js");

const organizationMiddleware =
  require("../middleware/organization.middleware.js");

const roleMiddleware =
  require("../middleware/role.middleware.js");


const router = express.Router();


// ============================================================
// AUTHENTICATION
// ============================================================

router.use(
  authMiddleware.authenticate
);


// ============================================================
// PERSONAL SUMMARY
// ============================================================

/**
 * GET /api/reports/summary
 *
 * Get the logged-in employee's
 * personal ride/payment summary.
 *
 * Example:
 *
 * {
 *   "totalRides": 25,
 *   "offeredRides": 10,
 *   "bookedRides": 15,
 *   "completedRides": 22,
 *   "cancelledRides": 3,
 *   "totalSpent": 2500
 * }
 */
router.get(
  "/summary",
  organizationMiddleware.verifyCurrentUserMembership,
  reportController.getPersonalSummary
);


// ============================================================
// PERSONAL RIDE ANALYTICS
// ============================================================

/**
 * GET /api/reports/rides
 *
 * Get personal ride statistics.
 */
router.get(
  "/rides",
  organizationMiddleware.verifyCurrentUserMembership,
  reportController.getRideAnalytics
);


// ============================================================
// PERSONAL PAYMENT ANALYTICS
// ============================================================

/**
 * GET /api/reports/payments
 *
 * Get personal payment statistics.
 */
router.get(
  "/payments",
  organizationMiddleware.verifyCurrentUserMembership,
  reportController.getPaymentAnalytics
);


// ============================================================
// PERSONAL WALLET ANALYTICS
// ============================================================

/**
 * GET /api/reports/wallet
 *
 * Get wallet usage statistics.
 */
router.get(
  "/wallet",
  organizationMiddleware.verifyCurrentUserMembership,
  reportController.getWalletAnalytics
);


// ============================================================
// MONTHLY REPORT
// ============================================================

/**
 * GET /api/reports/monthly
 *
 * Get monthly ride/payment statistics.
 *
 * Optional query:
 *
 * ?month=8&year=2026
 */
router.get(
  "/monthly",
  organizationMiddleware.verifyCurrentUserMembership,
  reportController.getMonthlyReport
);


// ============================================================
// ORGANIZATION OVERVIEW
// ============================================================

/**
 * GET /api/reports/organization
 *
 * Organization-level analytics.
 *
 * Restricted to Company Administrator.
 */
router.get(
  "/organization",
  organizationMiddleware.verifyCurrentUserMembership,
  roleMiddleware.requireRole("COMPANY_ADMIN"),
  reportController.getOrganizationReport
);


// ============================================================
// ORGANIZATION RIDES
// ============================================================

/**
 * GET /api/reports/organization/rides
 *
 * Organization-wide ride analytics.
 */
router.get(
  "/organization/rides",
  organizationMiddleware.verifyCurrentUserMembership,
  roleMiddleware.requireRole("COMPANY_ADMIN"),
  reportController.getOrganizationRideAnalytics
);


// ============================================================
// ORGANIZATION PAYMENTS
// ============================================================

/**
 * GET /api/reports/organization/payments
 *
 * Organization-wide payment analytics.
 */
router.get(
  "/organization/payments",
  organizationMiddleware.verifyCurrentUserMembership,
  roleMiddleware.requireRole("COMPANY_ADMIN"),
  reportController.getOrganizationPaymentAnalytics
);


// ============================================================
// PARTICIPATION ANALYTICS
// ============================================================

/**
 * GET /api/reports/organization/participation
 *
 * Employee participation statistics.
 */
router.get(
  "/organization/participation",
  organizationMiddleware.verifyCurrentUserMembership,
  roleMiddleware.requireRole("COMPANY_ADMIN"),
  reportController.getParticipationAnalytics
);


// ============================================================
// EXPORT REPORT
// ============================================================

/**
 * GET /api/reports/export
 *
 * Export report data.
 *
 * Example:
 *
 * /api/reports/export?type=rides&format=csv
 */
router.get(
  "/export",
  organizationMiddleware.verifyCurrentUserMembership,
  reportController.exportReport
);


// ============================================================
// EXPORT ORGANIZATION REPORT
// ============================================================

/**
 * GET /api/reports/organization/export
 *
 * Export organization-level report.
 *
 * Restricted to Company Administrator.
 */
router.get(
  "/organization/export",
  organizationMiddleware.verifyCurrentUserMembership,
  roleMiddleware.requireRole("COMPANY_ADMIN"),
  reportController.exportOrganizationReport
);


// ============================================================
// DASHBOARD
// ============================================================

/**
 * GET /api/reports/dashboard
 *
 * Combined dashboard data for
 * the logged-in employee.
 */
router.get(
  "/dashboard",
  organizationMiddleware.verifyCurrentUserMembership,
  reportController.getDashboardReport
);


// ============================================================
// ADMIN DASHBOARD
// ============================================================

/**
 * GET /api/reports/organization/dashboard
 *
 * Organization administrator dashboard.
 */
router.get(
  "/organization/dashboard",
  organizationMiddleware.verifyCurrentUserMembership,
  roleMiddleware.requireRole("COMPANY_ADMIN"),
  reportController.getOrganizationDashboard
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;