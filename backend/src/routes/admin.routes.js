// backend/src/routes/admin.routes.js

const express = require("express");
const adminController = require("../controllers/admin.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");
const organizationMiddleware = require("../middleware/organization.middleware.js");
const roleMiddleware = require("../middleware/role.middleware.js");
const validationMiddleware = require("../middleware/validation.middleware.js");
const adminValidator = require("../validators/admin.validator.js");

const router = express.Router();

router.use(authMiddleware.authenticate);
router.use(organizationMiddleware.requireOrganization);
router.use(roleMiddleware.isCompanyAdmin);

// GET /api/admin/overview
router.get("/overview", adminController.getOrganizationDetails);

// GET /api/admin/employees
router.get("/employees", adminController.getEmployees);

// GET /api/admin/employees/:employeeId
router.get("/employees/:employeeId", adminController.getEmployeeById);

// PATCH /api/admin/employees/:employeeId/status
router.patch("/employees/:employeeId/status",
  validationMiddleware.validate(adminValidator.updateEmployeeStatus),
  adminController.updateEmployeeStatus);

// GET /api/admin/vehicles
router.get("/vehicles", adminController.getOrganizationVehicles);

// GET /api/admin/vehicles/:vehicleId
router.get("/vehicles/:vehicleId", adminController.verifyEmployeeVehicle);

// GET /api/admin/rides
router.get("/rides", adminController.getOrganizationReport);

// GET /api/admin/rides/:rideId
router.get("/rides/:rideId", adminController.getOrganizationReport);

// GET /api/admin/bookings
router.get("/bookings", adminController.getOrganizationReport);

// GET /api/admin/trips
router.get("/trips", adminController.getOrganizationReport);

// GET /api/admin/payments
router.get("/payments", adminController.getOrganizationCosts);

// GET /api/admin/settings
router.get("/settings", adminController.getOrganizationDetails);

// PUT /api/admin/settings
router.put("/settings",
  validationMiddleware.validate(adminValidator.updateSettings),
  adminController.updateOrganizationSettings);

// GET /api/admin/participation
router.get("/participation", adminController.getParticipationStatistics);

// GET /api/admin/dashboard
router.get("/dashboard", adminController.getDashboard);

// GET /api/admin/export
router.get("/export", adminController.getOrganizationReport);

module.exports = router;

