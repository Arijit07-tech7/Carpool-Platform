const express = require("express");

const cors = require("cors");

const {
  apiLimiter
} = require("./middleware/rate-limit.middleware.js");

const notFoundMiddleware =
  require("./middleware/not-found.middleware.js");

const errorMiddleware =
  require("./middleware/error.middleware.js");

const app = express();


// ============================================================
// GLOBAL MIDDLEWARE
// ============================================================

app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

app.use(apiLimiter);


// ============================================================
// ROUTES
// ============================================================

app.use("/api/auth", require("./routes/auth.routes.js"));

app.use("/api/users", require("./routes/user.routes.js"));

app.use(
  "/api/organizations",
  require("./routes/organization.routes.js")
);

app.use(
  "/api/rides",
  require("./routes/ride.routes.js")
);

app.use(
  "/api/bookings",
  require("./routes/booking.routes.js")
);

app.use(
  "/api/vehicles",
  require("./routes/vehicle.routes.js")
);

app.use(
  "/api/trips",
  require("./routes/trip.routes.js")
);

app.use(
  "/api/tracking",
  require("./routes/tracking.routes.js")
);

app.use(
  "/api/chat",
  require("./routes/chat.routes.js")
);

app.use(
  "/api/payments",
  require("./routes/payment.routes.js")
);

app.use(
  "/api/wallet",
  require("./routes/wallet.routes.js")
);

app.use(
  "/api/history",
  require("./routes/history.routes.js")
);

app.use(
  "/api/reports",
  require("./routes/report.routes.js")
);

app.use(
  "/api/admin",
  require("./routes/admin.routes.js")
);

app.use(
  "/api/settings",
  require("./routes/settings.routes.js")
);


// ============================================================
// ERROR HANDLING
// ============================================================

app.use(notFoundMiddleware);

app.use(errorMiddleware);

module.exports = app;