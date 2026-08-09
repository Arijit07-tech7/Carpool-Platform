// backend/src/server.js

const http = require("http");
const app = require("./app.js");
const prisma = require("./config/database.js");
const { initializeSocket } = require("./config/socket.js");
const env = require("./config/env.js");
const initializeWebSocket = require("./websocket/index.js");

const port = env.port || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Initialize WebSocket event handlers
initializeWebSocket(io);

// Start server
async function startServer() {
  try {
    // Connect to Database
    await prisma.connectDatabase();

    server.listen(port, () => {
      console.log(`🚀 Server running in ${env.nodeEnv} mode on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
