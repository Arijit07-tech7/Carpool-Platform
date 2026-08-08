// backend/src/routes/admin.routes.js

const express = require("express");

const adminController =
  require("../controllers/admin.controller.js");

const authMiddleware =
  require("../middleware/auth.middleware.js");

const organizationMiddleware =
  require("../middleware/organization.middleware.js");

const roleMiddleware =
  require("../middleware/role.middleware.js");

const validationMiddleware =
  require("../middleware/validation.middleware.js");

const adminValidator =
  require("../validators/admin.validator.js");


const router = express.Router();


// ============================================================
// AUTHENTICATION
// ============================================================

router.use(
  authMiddleware.authenticate
);


// ============================================================
// COMPANY ADMIN ACCESS
// ============================================================

router.use(
  organizationMiddleware.verifyCurrentUserMembership
);

router.use(
  roleMiddleware.requireRole("COMPANY_ADMIN")
);


// ============================================================
// ORGANIZATION OVERVIEW
// ============================================================

/**
 * GET /api/admin/overview
 *
 * Get organization overview.
 */
router.get(
  "/overview",
  adminController.getOverview
);


// ============================================================
// EMPLOYEE MANAGEMENT
// ============================================================

/**
 * GET /api/admin/employees
 *
 * Get employees belonging to
 * the administrator's organization.
 */
router.get(
  "/employees",
  adminController.getEmployees
);


/**
 * GET /api/admin/employees/:employeeId
 *
 * Get employee details.
 */
router.get(
  "/employees/:employeeId",
  adminController.getEmployeeById
);


/**
 * PATCH /api/admin/employees/:employeeId/status
 *
 * Activate/deactivate employee
 * organization membership.
 */
router.patch(
  "/employees/:employeeId/status",
  validationMiddleware.validate(
    adminValidator.updateEmployeeStatus
  ),
  adminController.updateEmployeeStatus
);


// ============================================================
// VEHICLE MANAGEMENT
// ============================================================

/**
 * GET /api/admin/vehicles
 *
 * View vehicles registered by
 * organization employees.
 */
router.get(
  "/vehicles",
  adminController.getVehicles
);


/**
 * GET /api/admin/vehicles/:vehicleId
 *
 * Get vehicle details.
 */
router.get(
  "/vehicles/:vehicleId",
  adminController.getVehicleById
);


// ============================================================
// RIDE OVERSIGHT
// ============================================================

/**
 * GET /api/admin/rides
 *
 * View organization ride activity.
 */
router.get(
  "/rides",
  adminController.getRides
);


/**
 * GET /api/admin/rides/:rideId
 *
 * Get ride details for oversight.
 */
router.get(
  "/rides/:rideId",
  adminController.getRideById
);


// ============================================================
// BOOKING OVERSIGHT
// ============================================================

/**
 * GET /api/admin/bookings
 *
 * View organization booking activity.
 */
router.get(
  "/bookings",
  adminController.getBookings
);


// ============================================================
// TRIP OVERSIGHT
// ============================================================

/**
 * GET /api/admin/trips
 *
 * View organization trip activity.
 */
router.get(
  "/trips",
  adminController.getTrips
);


// ============================================================
// PAYMENT OVERSIGHT
// ============================================================

/**
 * GET /api/admin/payments
 *
 * View organization payment activity.
 */
router.get(
  "/payments",
  adminController.getPayments
);


// ============================================================
// ORGANIZATION SETTINGS
// ============================================================

/**
 * GET /api/admin/settings
 *
 * Get organization configuration.
 */
router.get(
  "/settings",
  adminController.getSettings
);


/**
 * PUT /api/admin/settings
 *
 * Update organization configuration.
 */
router.put(
  "/settings",
  validationMiddleware.validate(
    adminValidator.updateSettings
  ),
  adminController.updateSettings
);


// ============================================================
// PARTICIPATION
// ============================================================

/**
 * GET /api/admin/participation
 *
 * Get employee participation data.
 */
router.get(
  "/participation",
  adminController.getParticipation
);


// ============================================================
// DASHBOARD
// ============================================================

/**
 * GET /api/admin/dashboard
 *
 * Get complete administrator dashboard.
 */
router.get(
  "/dashboard",
  adminController.getDashboard
);


// ============================================================
// EXPORT DATA
// ============================================================

/**
 * GET /api/admin/export
 *
 * Export organization data/report.
 *
 * Example:
 *
 * /api/admin/export?type=rides&format=csv
 */
router.get(
  "/export",
  adminController.exportData
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;