// backend/src/models/history.model.js

const prisma = require("../config/database.js");

// ============================================================
// HISTORY MODEL
// ============================================================

const HistoryModel = {
  // ==========================================================
  // CREATE HISTORY RECORD
  // ==========================================================

  create: async (data) => {
    return prisma.history.create({
      data,
    });
  },

  // ==========================================================
  // FIND HISTORY BY ID
  // ==========================================================

  findById: async (id) => {
    return prisma.history.findUnique({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // FIND USER HISTORY
  // ==========================================================

  findByUserId: async (userId, options = {}) => {
    const {
      skip = 0,
      take = 20,
      type,
    } = options;

    return prisma.history.findMany({
      where: {
        userId,
        ...(type ? { type } : {}),
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // ==========================================================
  // FIND RIDE HISTORY
  // ==========================================================

  findByRideId: async (rideId, options = {}) => {
    const {
      skip = 0,
      take = 20,
    } = options;

    return prisma.history.findMany({
      where: {
        rideId,
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // ==========================================================
  // FIND BOOKING HISTORY
  // ==========================================================

  findByBookingId: async (bookingId, options = {}) => {
    const {
      skip = 0,
      take = 20,
    } = options;

    return prisma.history.findMany({
      where: {
        bookingId,
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // ==========================================================
  // FIND TRIP HISTORY
  // ==========================================================

  findByTripId: async (tripId, options = {}) => {
    const {
      skip = 0,
      take = 20,
    } = options;

    return prisma.history.findMany({
      where: {
        tripId,
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // ==========================================================
  // UPDATE HISTORY
  // ==========================================================

  update: async (id, data) => {
    return prisma.history.update({
      where: {
        id,
      },
      data,
    });
  },

  // ==========================================================
  // DELETE HISTORY RECORD
  // ==========================================================

  delete: async (id) => {
    return prisma.history.delete({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // DELETE USER HISTORY
  // ==========================================================

  deleteByUserId: async (userId) => {
    return prisma.history.deleteMany({
      where: {
        userId,
      },
    });
  },

  // ==========================================================
  // CHECK HISTORY EXISTS
  // ==========================================================

  exists: async (id) => {
    const history = await prisma.history.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    return !!history;
  },

  // ==========================================================
  // COUNT HISTORY
  // ==========================================================

  count: async (where = {}) => {
    return prisma.history.count({
      where,
    });
  },

  // ==========================================================
  // LIST HISTORY
  // ==========================================================

  findMany: async ({
    skip = 0,
    take = 20,
    where = {},
    orderBy = {
      createdAt: "desc",
    },
  } = {}) => {
    return prisma.history.findMany({
      where,
      skip,
      take,
      orderBy,
    });
  },
};

module.exports = HistoryModel;
