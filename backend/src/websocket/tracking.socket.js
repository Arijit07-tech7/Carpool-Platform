// backend/src/websocket/tracking.socket.js

const trackingService = require("../services/tracking.service.js");

// ============================================================
// TRACKING SOCKET
// ============================================================

const trackingSocket = (socket, io) => {
  // ==========================================================
  // START TRACKING
  // ==========================================================

  socket.on("tracking:start", async (data, callback) => {
    try {
      const { tripId } = data || {};

      if (!tripId) {
        throw new Error("Trip ID is required");
      }

      const userId = socket.user?.id;

      if (!userId) {
        throw new Error("Authentication required");
      }

      const result = await trackingService.startTracking(
        tripId,
        userId
      );

      socket.join(`trip:${tripId}`);

      socket.emit("tracking:started", {
        success: true,
        tripId,
        data: result,
      });

      if (typeof callback === "function") {
        callback({
          success: true,
          data: result,
        });
      }
    } catch (error) {
      console.error("Tracking start error:", error);

      if (typeof callback === "function") {
        callback({
          success: false,
          message: error.message,
        });
      }

      socket.emit("tracking:error", {
        message: error.message,
      });
    }
  });

  // ==========================================================
  // UPDATE LOCATION
  // ==========================================================

  socket.on("tracking:update", async (data, callback) => {
    try {
      const {
        tripId,
        latitude,
        longitude,
        speed,
        heading,
      } = data || {};

      if (!tripId) {
        throw new Error("Trip ID is required");
      }

      if (
        typeof latitude !== "number" ||
        typeof longitude !== "number"
      ) {
        throw new Error(
          "Valid latitude and longitude are required"
        );
      }

      const userId = socket.user?.id;

      if (!userId) {
        throw new Error("Authentication required");
      }

      const location = {
        latitude,
        longitude,
        ...(typeof speed === "number" ? { speed } : {}),
        ...(typeof heading === "number" ? { heading } : {}),
      };

      const result =
        await trackingService.updateLocation(
          tripId,
          userId,
          location
        );

      // Send updated location to everyone
      // inside this trip room.
      io.to(`trip:${tripId}`).emit(
        "tracking:location",
        {
          success: true,
          tripId,
          data: result,
        }
      );

      if (typeof callback === "function") {
        callback({
          success: true,
          data: result,
        });
      }
    } catch (error) {
      console.error("Tracking update error:", error);

      if (typeof callback === "function") {
        callback({
          success: false,
          message: error.message,
        });
      }

      socket.emit("tracking:error", {
        message: error.message,
      });
    }
  });

  // ==========================================================
  // JOIN TRIP TRACKING
  // ==========================================================

  socket.on("tracking:join", async (data, callback) => {
    try {
      const { tripId } = data || {};

      if (!tripId) {
        throw new Error("Trip ID is required");
      }

      const userId = socket.user?.id;

      if (!userId) {
        throw new Error("Authentication required");
      }

      await trackingService.authorizeTrackingAccess(
        tripId,
        userId
      );

      socket.join(`trip:${tripId}`);

      const latestLocation =
        await trackingService.getLatestLocation(tripId);

      socket.emit("tracking:joined", {
        success: true,
        tripId,
        data: latestLocation,
      });

      if (typeof callback === "function") {
        callback({
          success: true,
          data: latestLocation,
        });
      }
    } catch (error) {
      console.error("Tracking join error:", error);

      if (typeof callback === "function") {
        callback({
          success: false,
          message: error.message,
        });
      }

      socket.emit("tracking:error", {
        message: error.message,
      });
    }
  });

  // ==========================================================
  // LEAVE TRIP TRACKING
  // ==========================================================

  socket.on("tracking:leave", (data, callback) => {
    try {
      const { tripId } = data || {};

      if (!tripId) {
        throw new Error("Trip ID is required");
      }

      socket.leave(`trip:${tripId}`);

      socket.emit("tracking:left", {
        success: true,
        tripId,
      });

      if (typeof callback === "function") {
        callback({
          success: true,
          tripId,
        });
      }
    } catch (error) {
      console.error("Tracking leave error:", error);

      if (typeof callback === "function") {
        callback({
          success: false,
          message: error.message,
        });
      }
    }
  });

  // ==========================================================
  // STOP TRACKING
  // ==========================================================

  socket.on("tracking:stop", async (data, callback) => {
    try {
      const { tripId } = data || {};

      if (!tripId) {
        throw new Error("Trip ID is required");
      }

      const userId = socket.user?.id;

      if (!userId) {
        throw new Error("Authentication required");
      }

      const result =
        await trackingService.stopTracking(
          tripId,
          userId
        );

      io.to(`trip:${tripId}`).emit(
        "tracking:stopped",
        {
          success: true,
          tripId,
          data: result,
        }
      );

      if (typeof callback === "function") {
        callback({
          success: true,
          data: result,
        });
      }
    } catch (error) {
      console.error("Tracking stop error:", error);

      if (typeof callback === "function") {
        callback({
          success: false,
          message: error.message,
        });
      }

      socket.emit("tracking:error", {
        message: error.message,
      });
    }
  });
};

// ============================================================
// EXPORT
// ============================================================

module.exports = trackingSocket;