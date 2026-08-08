// backend/src/routes/organization.routes.js

const express = require("express");

const organizationController =
  require("../controllers/organization.controller.js");

const authMiddleware =
  require("../middleware/auth.middleware.js");

const organizationMiddleware =
  require("../middleware/organization.middleware.js");

const validationMiddleware =
  require("../middleware/validation.middleware.js");

const organizationValidator =
  require("../validators/organization.validator.js");


const router = express.Router();


// ============================================================
// AUTHENTICATION
// ============================================================

router.use(
  authMiddleware.authenticate
);


// ============================================================
// CURRENT USER ORGANIZATION
// ============================================================

/**
 * GET /api/organizations/me
 *
 * Get the organization of the
 * currently logged-in employee.
 */
router.get(
  "/me",
  organizationController.getMyOrganization
);


/**
 * GET /api/organizations/me/members
 *
 * Get employees/members of the
 * current organization.
 */
router.get(
  "/me/members",
  organizationController.getMembers
);


// ============================================================
// ORGANIZATION DETAILS
// ============================================================

/**
 * GET /api/organizations/:organizationId
 *
 * Get organization information.
 */
router.get(
  "/:organizationId",
  organizationMiddleware.verifyOrganizationAccess,
  organizationController.getOrganizationById
);


// ============================================================
// ORGANIZATION MEMBERSHIP
// ============================================================

/**
 * GET /api/organizations/:organizationId/membership
 *
 * Get current user's membership
 * information.
 */
router.get(
  "/:organizationId/membership",
  organizationMiddleware.verifyOrganizationAccess,
  organizationController.getMemberById // using getMemberById as fallback
);


// ============================================================
// ORGANIZATION SETTINGS
// ============================================================

/**
 * GET /api/organizations/:organizationId/settings
 *
 * Get organization settings.
 */
router.get(
  "/:organizationId/settings",
  organizationMiddleware.verifyOrganizationAccess,
  organizationController.getOrganizationSettings
);


/**
 * PUT /api/organizations/:organizationId/settings
 *
 * Update organization settings.
 *
 * This should normally be restricted
 * to organization administrators.
 */
router.put(
  "/:organizationId/settings",
  organizationMiddleware.verifyOrganizationAccess,
  validationMiddleware.validate(
    organizationValidator.updateSettings
  ),
  organizationController.updateOrganizationSettings
);


// ============================================================
// ORGANIZATION PARTICIPATION
// ============================================================

/**
 * GET /api/organizations/:organizationId/participation
 *
 * Get organization carpool participation.
 */
router.get(
  "/:organizationId/participation",
  organizationMiddleware.verifyOrganizationAccess,
  organizationController.getParticipationSummary
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;

