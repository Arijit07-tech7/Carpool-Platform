// backend/src/routes/vehicle.routes.js

const express = require("express");

const vehicleController =
  require("../controllers/vehicle.controller.js");

const authMiddleware =
  require("../middleware/auth.middleware.js");

const organizationMiddleware =
  require("../middleware/organization.middleware.js");

const validationMiddleware =
  require("../middleware/validation.middleware.js");

const vehicleValidator =
  require("../validators/vehicle.validator.js");


const router = express.Router();


// ============================================================
// AUTHENTICATION
// ============================================================

router.use(
  authMiddleware.authenticate
);


// ============================================================
// MY VEHICLES
// ============================================================

/**
 * GET /api/vehicles
 *
 * Get all vehicles registered
 * by the logged-in employee.
 */
router.get(
  "/",
  organizationMiddleware.verifyCurrentUserMembership,
  vehicleController.getMyVehicles
);


// ============================================================
// ACTIVE VEHICLES
// ============================================================

/**
 * GET /api/vehicles/active
 *
 * Get the employee's active vehicles.
 */
router.get(
  "/active",
  organizationMiddleware.verifyCurrentUserMembership,
  vehicleController.getActiveVehicles
);


// ============================================================
// REGISTER VEHICLE
// ============================================================

/**
 * POST /api/vehicles
 *
 * Register a new vehicle.
 *
 * Example:
 *
 * {
 *   "vehicleType": "CAR",
 *   "brand": "Toyota",
 *   "model": "Innova",
 *   "registrationNumber": "WB01AB1234",
 *   "color": "White",
 *   "seatCapacity": 6
 * }
 */
router.post(
  "/",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    vehicleValidator.createVehicle
  ),
  vehicleController.createVehicle
);


// ============================================================
// VEHICLE DETAILS
// ============================================================

/**
 * GET /api/vehicles/:vehicleId
 *
 * Get vehicle details.
 */
router.get(
  "/:vehicleId",
  organizationMiddleware.verifyCurrentUserMembership,
  vehicleController.getVehicleById
);


// ============================================================
// UPDATE VEHICLE
// ============================================================

/**
 * PUT /api/vehicles/:vehicleId
 *
 * Update vehicle information.
 */
router.put(
  "/:vehicleId",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    vehicleValidator.updateVehicle
  ),
  vehicleController.updateVehicle
);


// ============================================================
// VEHICLE DOCUMENT / PHOTO
// ============================================================

/**
 * PUT /api/vehicles/:vehicleId/photo
 *
 * Update vehicle photo.
 */
router.put(
  "/:vehicleId/photo",
  organizationMiddleware.verifyCurrentUserMembership,
  vehicleController.updateVehiclePhoto
);


// ============================================================
// SET DEFAULT VEHICLE
// ============================================================

/**
 * PATCH /api/vehicles/:vehicleId/default
 *
 * Set a vehicle as the default
 * vehicle for ride publishing.
 */
router.patch(
  "/:vehicleId/default",
  organizationMiddleware.verifyCurrentUserMembership,
  vehicleController.setDefaultVehicle
);


// ============================================================
// ACTIVATE VEHICLE
// ============================================================

/**
 * PATCH /api/vehicles/:vehicleId/activate
 *
 * Activate a registered vehicle.
 */
router.patch(
  "/:vehicleId/activate",
  organizationMiddleware.verifyCurrentUserMembership,
  vehicleController.activateVehicle
);


// ============================================================
// DEACTIVATE VEHICLE
// ============================================================

/**
 * PATCH /api/vehicles/:vehicleId/deactivate
 *
 * Deactivate a vehicle.
 */
router.patch(
  "/:vehicleId/deactivate",
  organizationMiddleware.verifyCurrentUserMembership,
  vehicleController.deactivateVehicle
);


// ============================================================
// DELETE VEHICLE
// ============================================================

/**
 * DELETE /api/vehicles/:vehicleId
 *
 * Remove/deactivate a vehicle.
 *
 * The service layer should prevent
 * deletion if the vehicle is attached
 * to an active/upcoming ride.
 */
router.delete(
  "/:vehicleId",
  organizationMiddleware.verifyCurrentUserMembership,
  vehicleController.deleteVehicle
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;