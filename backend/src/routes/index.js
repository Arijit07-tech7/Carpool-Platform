// backend/src/routes/index.js

const express = require("express");

const authRoutes =
  require("./auth.routes.js");

const userRoutes =
  require("./user.routes.js");

const organizationRoutes =
  require("./organization.routes.js");

const rideRoutes =
  require("./ride.routes.js");

const bookingRoutes =
  require("./booking.routes.js");

const vehicleRoutes =
  require("./vehicle.routes.js");

const tripRoutes =
  require("./trip.routes.js");

const trackingRoutes =
  require("./tracking.routes.js");

const chatRoutes =
  require("./chat.routes.js");

const paymentRoutes =
  require("./payment.routes.js");

const walletRoutes =
  require("./wallet.routes.js");

const historyRoutes =
  require("./history.routes.js");

const reportRoutes =
  require("./report.routes.js");

const adminRoutes =
  require("./admin.routes.js");

const settingsRoutes =
  require("./settings.routes.js");


const router = express.Router();


// ============================================================
// AUTHENTICATION
// ============================================================

router.use(
  "/auth",
  authRoutes
);


// ============================================================
// USER
// ============================================================

router.use(
  "/users",
  userRoutes
);


// ============================================================
// ORGANIZATION
// ============================================================

router.use(
  "/organizations",
  organizationRoutes
);


// ============================================================
// RIDES
// ============================================================

router.use(
  "/rides",
  rideRoutes
);


// ============================================================
// BOOKINGS
// ============================================================

router.use(
  "/bookings",
  bookingRoutes
);


// ============================================================
// VEHICLES
// ============================================================

router.use(
  "/vehicles",
  vehicleRoutes
);


// ============================================================
// TRIPS
// ============================================================

router.use(
  "/trips",
  tripRoutes
);


// ============================================================
// LIVE TRACKING
// ============================================================

router.use(
  "/tracking",
  trackingRoutes
);


// ============================================================
// CHAT
// ============================================================

router.use(
  "/chat",
  chatRoutes
);


// ============================================================
// PAYMENTS
// ============================================================

router.use(
  "/payments",
  paymentRoutes
);


// ============================================================
// WALLET
// ============================================================

router.use(
  "/wallet",
  walletRoutes
);


// ============================================================
// RIDE HISTORY
// ============================================================

router.use(
  "/history",
  historyRoutes
);


// ============================================================
// REPORTS
// ============================================================

router.use(
  "/reports",
  reportRoutes
);


// ============================================================
// ADMIN
// ============================================================

router.use(
  "/admin",
  adminRoutes
);


// ============================================================
// SETTINGS
// ============================================================

router.use(
  "/settings",
  settingsRoutes
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;

