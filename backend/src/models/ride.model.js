// backend/src/models/ride.model.js

const prisma = require("../config/database.js");

// ============================================================
// RIDE MODEL
// ============================================================

const RideModel = {
  // ==========================================================
  // CREATE RIDE
  // ==========================================================

  create: async (data) => {
    return prisma.ride.create({
      data,
    });
  },

  // ==========================================================
  // FIND RIDE BY ID
  // ==========================================================

  findById: async (id) => {
    return prisma.ride.findUnique({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // UPDATE RIDE
  // ==========================================================

  update: async (id, data) => {
    return prisma.ride.update({
      where: {
        id,
      },
      data,
    });
  },

  // ==========================================================
  // DELETE RIDE
  // ==========================================================

  delete: async (id) => {
    return prisma.ride.delete({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // FIND RIDES BY DRIVER
  // ==========================================================

  findByDriverId: async (driverId, options = {}) => {
    const {
      skip = 0,
      take = 20,
    } = options;

    return prisma.ride.findMany({
      where: {
        driverId,
      },
      skip,
      take,
      orderBy: {
        departureTime: "asc",
      },
    });
  },

  // ==========================================================
  // FIND RIDES BY ORGANIZATION
  // ==========================================================

  findByOrganizationId: async (organizationId, options = {}) => {
    const {
      skip = 0,
      take = 20,
    } = options;

    return prisma.ride.findMany({
      where: {
        organizationId,
      },
      skip,
      take,
      orderBy: {
        departureTime: "asc",
      },
    });
  },

  // ==========================================================
  // SEARCH RIDES
  // ==========================================================

  search: async ({
    where = {},
    skip = 0,
    take = 20,
    orderBy = {
      departureTime: "asc",
    },
  } = {}) => {
    return prisma.ride.findMany({
      where,
      skip,
      take,
      orderBy,
    });
  },

  // ==========================================================
  // COUNT RIDES
  // ==========================================================

  count: async (where = {}) => {
    return prisma.ride.count({
      where,
    });
  },

  // ==========================================================
  // CHECK RIDE EXISTS
  // ==========================================================

  exists: async (id) => {
    const ride = await prisma.ride.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    return !!ride;
  },

  // ==========================================================
  // UPDATE AVAILABLE SEATS
  // ==========================================================

  updateAvailableSeats: async (id, availableSeats) => {
    return prisma.ride.update({
      where: {
        id,
      },
      data: {
        availableSeats,
      },
    });
  },

  // ==========================================================
  // INCREMENT AVAILABLE SEATS
  // ==========================================================

  incrementAvailableSeats: async (id, seats) => {
    return prisma.ride.update({
      where: {
        id,
      },
      data: {
        availableSeats: {
          increment: seats,
        },
      },
    });
  },

  // ==========================================================
  // DECREMENT AVAILABLE SEATS
  // ==========================================================

  decrementAvailableSeats: async (id, seats) => {
    return prisma.ride.update({
      where: {
        id,
      },
      data: {
        availableSeats: {
          decrement: seats,
        },
      },
    });
  },

  // ==========================================================
  // UPDATE RIDE STATUS
  // ==========================================================

  updateStatus: async (id, status) => {
    return prisma.ride.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  },
};

module.exports = RideModel;