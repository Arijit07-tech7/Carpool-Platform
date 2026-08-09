// backend/src/websocket/notification.socket.js

// ============================================================
// NOTIFICATION SOCKET
// ============================================================

const notificationSocket = (socket, io) => {
  // ==========================================================
  // JOIN NOTIFICATION ROOM
  // ==========================================================

  socket.on("notification:join", (data, callback) => {
    try {
      const userId = socket.user?.id;

      if (!userId) {
        throw new Error("Authentication required");
      }

      socket.join(`user:${userId}`);

      socket.emit("notification:joined", {
        success: true,
        userId,
      });

      if (typeof callback === "function") {
        callback({
          success: true,
          userId,
        });
      }
    } catch (error) {
      console.error("Notification join error:", error);

      if (typeof callback === "function") {
        callback({
          success: false,
          message: error.message,
        });
      }

      socket.emit("notification:error", {
        message: error.message,
      });
    }
  });

  // ==========================================================
  // LEAVE NOTIFICATION ROOM
  // ==========================================================

  socket.on("notification:leave", (data, callback) => {
    try {
      const userId = socket.user?.id;

      if (!userId) {
        throw new Error("Authentication required");
      }

      socket.leave(`user:${userId}`);

      socket.emit("notification:left", {
        success: true,
        userId,
      });

      if (typeof callback === "function") {
        callback({
          success: true,
          userId,
        });
      }
    } catch (error) {
      console.error("Notification leave error:", error);

      if (typeof callback === "function") {
        callback({
          success: false,
          message: error.message,
        });
      }
    }
  });

  // ==========================================================
  // MARK NOTIFICATION AS READ
  // ==========================================================

  socket.on(
    "notification:read",
    (data, callback) => {
      try {
        const {
          notificationId,
        } = data || {};

        if (!notificationId) {
          throw new Error(
            "Notification ID is required"
          );
        }

        const userId = socket.user?.id;

        if (!userId) {
          throw new Error(
            "Authentication required"
          );
        }

        // The actual database update should be handled
        // by notification service/controller if a
        // Notification model is added later.

        socket.emit("notification:read:success", {
          success: true,
          notificationId,
        });

        if (typeof callback === "function") {
          callback({
            success: true,
            notificationId,
          });
        }
      } catch (error) {
        console.error(
          "Notification read error:",
          error
        );

        if (typeof callback === "function") {
          callback({
            success: false,
            message: error.message,
          });
        }

        socket.emit("notification:error", {
          message: error.message,
        });
      }
    }
  );

  // ==========================================================
  // MARK ALL NOTIFICATIONS AS READ
  // ==========================================================

  socket.on(
    "notification:read-all",
    (data, callback) => {
      try {
        const userId = socket.user?.id;

        if (!userId) {
          throw new Error(
            "Authentication required"
          );
        }

        socket.emit(
          "notification:read-all:success",
          {
            success: true,
            userId,
          }
        );

        if (typeof callback === "function") {
          callback({
            success: true,
            userId,
          });
        }
      } catch (error) {
        console.error(
          "Notification read-all error:",
          error
        );

        if (typeof callback === "function") {
          callback({
            success: false,
            message: error.message,
          });
        }

        socket.emit("notification:error", {
          message: error.message,
        });
      }
    }
  );

  // ==========================================================
  // DISCONNECT
  // ==========================================================

  socket.on("disconnect", () => {
    console.log(
      `Notification socket disconnected: ${socket.id}`
    );
  });
};

// ============================================================
// SEND NOTIFICATION TO USER
// ============================================================

const sendNotification = (io, userId, notification) => {
  if (!io) {
    throw new Error("Socket.IO instance is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  io.to(`user:${userId}`).emit(
    "notification:new",
    {
      success: true,
      data: notification,
    }
  );
};

// ============================================================
// SEND NOTIFICATION TO MULTIPLE USERS
// ============================================================

const sendNotificationToUsers = (
  io,
  userIds,
  notification
) => {
  if (!io) {
    throw new Error("Socket.IO instance is required");
  }

  if (!Array.isArray(userIds)) {
    throw new Error("User IDs must be an array");
  }

  userIds.forEach((userId) => {
    if (userId) {
      sendNotification(
        io,
        userId,
        notification
      );
    }
  });
};

// ============================================================
// EXPORT
// ============================================================

module.exports = notificationSocket;

module.exports.sendNotification =
  sendNotification;

module.exports.sendNotificationToUsers =
  sendNotificationToUsers;