// backend/src/routes/history.routes.js

const express = require("express");
const historyController = require("../controllers/history.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");
const organizationMiddleware = require("../middleware/organization.middleware.js");

const router = express.Router();

router.use(authMiddleware.authenticate);

// GET /api/history
router.get("/", organizationMiddleware.requireOrganization, historyController.getMyRideHistory);

// GET /api/history/completed
router.get("/completed", organizationMiddleware.requireOrganization, historyController.getCompletedRides);

// GET /api/history/cancelled
router.get("/cancelled", organizationMiddleware.requireOrganization, historyController.getCancelledRides);

// GET /api/history/offered
router.get("/offered", organizationMiddleware.requireOrganization, historyController.getDriverHistory);

// GET /api/history/booked
router.get("/booked", organizationMiddleware.requireOrganization, historyController.getPassengerHistory);

// GET /api/history/trip/:tripId
router.get("/trip/:tripId", organizationMiddleware.requireOrganization, historyController.getTripHistory);

// GET /api/history/:historyId
router.get("/:historyId", organizationMiddleware.requireOrganization, historyController.getHistoryById);

// GET /api/history/:historyId/payment
router.get("/:historyId/payment", organizationMiddleware.requireOrganization, historyController.getPaymentHistory);

module.exports = router;

