// backend/src/websocket/index.js

const trackingSocket = require("./tracking.socket.js");
const chatSocket = require("./chat.socket.js");
const notificationSocket = require("./notification.socket.js");

// ============================================================
// INITIALIZE WEBSOCKET
// ============================================================

const initializeWebSocket = (io) => {
  if (!io) {
    throw new Error("Socket.IO instance is required");
  }

  // ----------------------------------------------------------
  // Authentication middleware
  // ----------------------------------------------------------

  io.use(async (socket, next) => {
    try {
      const user = socket.user;

      if (!user) {
        return next(new Error("Authentication required"));
      }

      next();
    } catch (error) {
      next(error);
    }
  });

  // ----------------------------------------------------------
  // Connection
  // ----------------------------------------------------------

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    const userId = socket.user?.id;

    // --------------------------------------------------------
    // Join personal user room
    // --------------------------------------------------------

    if (userId) {
      socket.join(`user:${userId}`);
    }

    // --------------------------------------------------------
    // Initialize tracking events
    // --------------------------------------------------------

    trackingSocket(socket, io);

    // --------------------------------------------------------
    // Initialize chat events
    // --------------------------------------------------------

    chatSocket(socket, io);

    // --------------------------------------------------------
    // Initialize notification events
    // --------------------------------------------------------

    notificationSocket(socket, io);

    // --------------------------------------------------------
    // Disconnect
    // --------------------------------------------------------

    socket.on("disconnect", (reason) => {
      console.log(
        `Socket disconnected: ${socket.id} - ${reason}`
      );
    });

    // --------------------------------------------------------
    // Socket error
    // --------------------------------------------------------

    socket.on("error", (error) => {
      console.error(
        `Socket error [${socket.id}]:`,
        error
      );
    });
  });

  console.log("WebSocket initialized successfully");

  return io;
};

module.exports = initializeWebSocket;