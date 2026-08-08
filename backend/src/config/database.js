

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["warn", "error"],
});

// Connect to database
prisma.connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

// Disconnect from database
prisma.disconnectDatabase = async () => {
  try {
    await prisma.$disconnect();
    console.log("🛑 PostgreSQL database disconnected");
  } catch (error) {
    console.error("❌ Database disconnection failed:", error);
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.disconnectDatabase();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.disconnectDatabase();
  process.exit(0);
});

module.exports = prisma;