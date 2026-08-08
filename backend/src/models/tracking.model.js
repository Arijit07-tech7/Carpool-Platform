// backend/src/models/tracking.model.js

const prisma = require("../config/database.js");

// ============================================================
// TRACKING MODEL
// ============================================================

const TrackingModel = {
  // ==========================================================
  // CREATE TRACKING RECORD
  // ==========================================================

  create: async (data) => {
    return prisma.tracking.create({
      data,
    });
  },

  // ==========================================================
  // FIND TRACKING RECORD BY ID
  // ==========================================================

  findById: async (id) => {
    return prisma.tracking.findUnique({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // FIND TRACKING RECORDS BY TRIP
  // ==========================================================

  findByTripId: async (tripId, options = {}) => {
    const {
      skip = 0,
      take = 100,
      orderBy = {
        timestamp: "desc",
      },
    } = options;

    return prisma.tracking.findMany({
      where: {
        tripId,
      },
      skip,
      take,
      orderBy,
    });
  },

  // ==========================================================
  // FIND LATEST LOCATION
  // ==========================================================

  findLatestByTripId: async (tripId) => {
    return prisma.tracking.findFirst({
      where: {
        tripId,
      },
      orderBy: {
        timestamp: "desc",
      },
    });
  },

  // ==========================================================
  // UPDATE TRACKING RECORD
  // ==========================================================

  update: async (id, data) => {
    return prisma.tracking.update({
      where: {
        id,
      },
      data,
    });
  },

  // ==========================================================
  // DELETE TRACKING RECORD
  // ==========================================================

  delete: async (id) => {
    return prisma.tracking.delete({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // DELETE ALL TRACKING RECORDS FOR TRIP
  // ==========================================================

  deleteByTripId: async (tripId) => {
    return prisma.tracking.deleteMany({
      where: {
        tripId,
      },
    });
  },

  // ==========================================================
  // COUNT TRACKING RECORDS
  // ==========================================================

  count: async (where = {}) => {
    return prisma.tracking.count({
      where,
    });
  },

  // ==========================================================
  // CHECK TRACKING RECORD EXISTS
  // ==========================================================

  exists: async (id) => {
    const tracking = await prisma.tracking.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    return !!tracking;
  },

  // ==========================================================
  // FIND TRACKING HISTORY
  // ==========================================================

  findHistory: async ({
    tripId,
    from,
    to,
    skip = 0,
    take = 500,
  }) => {
    const where = {
      tripId,
    };

    if (from || to) {
      where.timestamp = {};

      if (from) {
        where.timestamp.gte = from;
      }

      if (to) {
        where.timestamp.lte = to;
      }
    }

    return prisma.tracking.findMany({
      where,
      skip,
      take,
      orderBy: {
        timestamp: "asc",
      },
    });
  },
};

module.exports = TrackingModel;