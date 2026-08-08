

import { Server } from "socket.io";
import env from "./env.js";


let io = null;

/**
 * Initialize Socket.IO
 *
 * @param {Object} httpServer - Node.js HTTP server
 * @returns {Server}
 */
export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: env.corsOrigin,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },

    transports: ["websocket", "polling"],

    pingTimeout: 60000,
    pingInterval: 25000,
  });

  console.log("✅ Socket.IO initialized");

  return io;
};

/**
 * Get Socket.IO instance.
 *
 * This can be used from services, socket handlers,
 * notifications, etc.
 *
 * @returns {Server}
 */
export const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized. Call initializeSocket() first."
    );
  }

  return io;
};

/**
 * Emit an event to a specific room.
 *
 * @param {string} room
 * @param {string} event
 * @param {*} data
 */
export const emitToRoom = (room, event, data) => {
  const socket = getIO();

  socket.to(room).emit(event, data);
};

/**
 * Emit an event to a specific socket.
 *
 * @param {string} socketId
 * @param {string} event
 * @param {*} data
 */
export const emitToSocket = (socketId, event, data) => {
  const socket = getIO();

  socket.to(socketId).emit(event, data);
};

/**
 * Broadcast an event to all connected clients.
 *
 * @param {string} event
 * @param {*} data
 */
export const broadcastEvent = (event, data) => {
  const socket = getIO();

  socket.emit(event, data);
};

export default {
  initializeSocket,
  getIO,
  emitToRoom,
  emitToSocket,
  broadcastEvent,
};