// backend/src/models/chat.model.js

const prisma = require("../config/database.js");

// ============================================================
// CHAT MODEL
// ============================================================

const ChatModel = {
  // ==========================================================
  // CREATE MESSAGE
  // ==========================================================

  create: async (data) => {
    return prisma.chat.create({
      data,
    });
  },

  // ==========================================================
  // FIND MESSAGE BY ID
  // ==========================================================

  findById: async (id) => {
    return prisma.chat.findUnique({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // FIND MESSAGE WITH USERS
  // ==========================================================

  findByIdWithUsers: async (id) => {
    return prisma.chat.findUnique({
      where: {
        id,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
  },

  // ==========================================================
  // FIND CONVERSATION
  // ==========================================================

  findConversation: async (
    senderId,
    receiverId,
    options = {}
  ) => {
    const {
      skip = 0,
      take = 50,
    } = options;

    return prisma.chat.findMany({
      where: {
        OR: [
          {
            senderId,
            receiverId,
          },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
      },
      skip,
      take,
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  // ==========================================================
  // FIND MESSAGES BY RIDE
  // ==========================================================

  findByRideId: async (rideId, options = {}) => {
    const {
      skip = 0,
      take = 100,
    } = options;

    return prisma.chat.findMany({
      where: {
        rideId,
      },
      skip,
      take,
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  // ==========================================================
  // FIND MESSAGES BY TRIP
  // ==========================================================

  findByTripId: async (tripId, options = {}) => {
    const {
      skip = 0,
      take = 100,
    } = options;

    return prisma.chat.findMany({
      where: {
        tripId,
      },
      skip,
      take,
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  // ==========================================================
  // FIND MESSAGES SENT BY USER
  // ==========================================================

  findBySenderId: async (senderId, options = {}) => {
    const {
      skip = 0,
      take = 50,
    } = options;

    return prisma.chat.findMany({
      where: {
        senderId,
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // ==========================================================
  // FIND MESSAGES RECEIVED BY USER
  // ==========================================================

  findByReceiverId: async (receiverId, options = {}) => {
    const {
      skip = 0,
      take = 50,
    } = options;

    return prisma.chat.findMany({
      where: {
        receiverId,
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // ==========================================================
  // DELETE MESSAGE
  // ==========================================================

  delete: async (id) => {
    return prisma.chat.delete({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // DELETE MESSAGES FOR RIDE
  // ==========================================================

  deleteByRideId: async (rideId) => {
    return prisma.chat.deleteMany({
      where: {
        rideId,
      },
    });
  },

  // ==========================================================
  // DELETE MESSAGES FOR TRIP
  // ==========================================================

  deleteByTripId: async (tripId) => {
    return prisma.chat.deleteMany({
      where: {
        tripId,
      },
    });
  },

  // ==========================================================
  // COUNT MESSAGES
  // ==========================================================

  count: async (where = {}) => {
    return prisma.chat.count({
      where,
    });
  },

  // ==========================================================
  // CHECK MESSAGE EXISTS
  // ==========================================================

  exists: async (id) => {
    const message = await prisma.chat.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    return !!message;
  },

  // ==========================================================
  // LIST MESSAGES
  // ==========================================================

  findMany: async ({
    skip = 0,
    take = 50,
    where = {},
    orderBy = {
      createdAt: "desc",
    },
  } = {}) => {
    return prisma.chat.findMany({
      where,
      skip,
      take,
      orderBy,
    });
  },
};

module.exports = ChatModel;