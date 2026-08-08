// backend/src/websocket/chat.socket.js

const chatService = require("../services/chat.service.js");

// ============================================================
// CHAT SOCKET
// ============================================================

const chatSocket = (socket, io) => {
  // ==========================================================
  // SEND MESSAGE
  // ==========================================================

  socket.on("chat:send", async (data, callback) => {
    try {
      const {
        receiverId,
        message,
        rideId,
        tripId,
      } = data || {};

      const senderId = socket.user?.id;

      if (!senderId) {
        throw new Error("Authentication required");
      }

      if (!receiverId) {
        throw new Error("Receiver ID is required");
      }

      if (!message || !message.trim()) {
        throw new Error("Message cannot be empty");
      }

      const result = await chatService.sendMessage({
        senderId,
        receiverId,
        message: message.trim(),
        rideId,
        tripId,
      });

      // Send message to receiver
      io.to(`user:${receiverId}`).emit(
        "chat:message",
        {
          success: true,
          data: result,
        }
      );

      // Send message back to sender
      socket.emit("chat:message:sent", {
        success: true,
        data: result,
      });

      if (typeof callback === "function") {
        callback({
          success: true,
          data: result,
        });
      }
    } catch (error) {
      console.error("Chat send error:", error);

      if (typeof callback === "function") {
        callback({
          success: false,
          message: error.message,
        });
      }

      socket.emit("chat:error", {
        message: error.message,
      });
    }
  });

  // ==========================================================
  // JOIN CONVERSATION
  // ==========================================================

  socket.on("chat:join", async (data, callback) => {
    try {
      const {
        userId,
        rideId,
        tripId,
      } = data || {};

      const currentUserId = socket.user?.id;

      if (!currentUserId) {
        throw new Error("Authentication required");
      }

      if (userId) {
        await chatService.authorizeConversation(
          currentUserId,
          userId
        );

        const roomId = getConversationRoom(
          currentUserId,
          userId
        );

        socket.join(roomId);

        if (typeof callback === "function") {
          callback({
            success: true,
            roomId,
          });
        }

        return;
      }

      if (rideId) {
        await chatService.authorizeRideChat(
          currentUserId,
          rideId
        );

        const roomId = `ride-chat:${rideId}`;

        socket.join(roomId);

        if (typeof callback === "function") {
          callback({
            success: true,
            roomId,
          });
        }

        return;
      }

      if (tripId) {
        await chatService.authorizeTripChat(
          currentUserId,
          tripId
        );

        const roomId = `trip-chat:${tripId}`;

        socket.join(roomId);

        if (typeof callback === "function") {
          callback({
            success: true,
            roomId,
          });
        }

        return;
      }

      throw new Error(
        "User ID, ride ID, or trip ID is required"
      );
    } catch (error) {
      console.error("Chat join error:", error);

      if (typeof callback === "function") {
        callback({
          success: false,
          message: error.message,
        });
      }

      socket.emit("chat:error", {
        message: error.message,
      });
    }
  });

  // ==========================================================
  // LEAVE CONVERSATION
  // ==========================================================

  socket.on("chat:leave", (data, callback) => {
    try {
      const {
        userId,
        rideId,
        tripId,
      } = data || {};

      const currentUserId = socket.user?.id;

      if (userId) {
        const roomId = getConversationRoom(
          currentUserId,
          userId
        );

        socket.leave(roomId);

        if (typeof callback === "function") {
          callback({
            success: true,
            roomId,
          });
        }

        return;
      }

      if (rideId) {
        const roomId = `ride-chat:${rideId}`;

        socket.leave(roomId);

        if (typeof callback === "function") {
          callback({
            success: true,
            roomId,
          });
        }

        return;
      }

      if (tripId) {
        const roomId = `trip-chat:${tripId}`;

        socket.leave(roomId);

        if (typeof callback === "function") {
          callback({
            success: true,
            roomId,
          });
        }

        return;
      }

      throw new Error(
        "User ID, ride ID, or trip ID is required"
      );
    } catch (error) {
      console.error("Chat leave error:", error);

      if (typeof callback === "function") {
        callback({
          success: false,
          message: error.message,
        });
      }
    }
  });

  // ==========================================================
  // TYPING START
  // ==========================================================

  socket.on("chat:typing:start", (data) => {
    try {
      const {
        receiverId,
        rideId,
        tripId,
      } = data || {};

      const senderId = socket.user?.id;

      if (!senderId) {
        return;
      }

      if (receiverId) {
        io.to(`user:${receiverId}`).emit(
          "chat:typing:start",
          {
            userId: senderId,
          }
        );
      }

      if (rideId) {
        io.to(`ride-chat:${rideId}`).emit(
          "chat:typing:start",
          {
            userId: senderId,
          }
        );
      }

      if (tripId) {
        io.to(`trip-chat:${tripId}`).emit(
          "chat:typing:start",
          {
            userId: senderId,
          }
        );
      }
    } catch (error) {
      console.error("Typing start error:", error);
    }
  });

  // ==========================================================
  // TYPING STOP
  // ==========================================================

  socket.on("chat:typing:stop", (data) => {
    try {
      const {
        receiverId,
        rideId,
        tripId,
      } = data || {};

      const senderId = socket.user?.id;

      if (!senderId) {
        return;
      }

      if (receiverId) {
        io.to(`user:${receiverId}`).emit(
          "chat:typing:stop",
          {
            userId: senderId,
          }
        );
      }

      if (rideId) {
        io.to(`ride-chat:${rideId}`).emit(
          "chat:typing:stop",
          {
            userId: senderId,
          }
        );
      }

      if (tripId) {
        io.to(`trip-chat:${tripId}`).emit(
          "chat:typing:stop",
          {
            userId: senderId,
          }
        );
      }
    } catch (error) {
      console.error("Typing stop error:", error);
    }
  });

  // ==========================================================
  // MARK MESSAGE AS READ
  // ==========================================================

  socket.on("chat:read", async (data, callback) => {
    try {
      const {
        messageId,
      } = data || {};

      const userId = socket.user?.id;

      if (!userId) {
        throw new Error("Authentication required");
      }

      if (!messageId) {
        throw new Error("Message ID is required");
      }

      const result =
        await chatService.markAsRead(
          messageId,
          userId
        );

      socket.emit("chat:read:success", {
        success: true,
        data: result,
      });

      if (typeof callback === "function") {
        callback({
          success: true,
          data: result,
        });
      }
    } catch (error) {
      console.error("Chat read error:", error);

      if (typeof callback === "function") {
        callback({
          success: false,
          message: error.message,
        });
      }

      socket.emit("chat:error", {
        message: error.message,
      });
    }
  });

  // ==========================================================
  // DISCONNECT
  // ==========================================================

  socket.on("disconnect", () => {
    console.log(
      `Chat socket disconnected: ${socket.id}`
    );
  });
};

// ============================================================
// CONVERSATION ROOM
// ============================================================

const getConversationRoom = (userId1, userId2) => {
  const users = [userId1, userId2].sort();

  return `conversation:${users[0]}:${users[1]}`;
};

// ============================================================
// EXPORT
// ============================================================

module.exports = chatSocket;