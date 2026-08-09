// backend/src/models/trip.model.js

const prisma = require("../config/database.js");

// ============================================================
// TRIP MODEL
// ============================================================

const TripModel = {
  // ==========================================================
  // CREATE TRIP
  // ==========================================================

  create: async (data) => {
    return prisma.trip.create({
      data,
    });
  },

  // ==========================================================
  // FIND TRIP BY ID
  // ==========================================================

  findById: async (id) => {
    return prisma.trip.findUnique({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // FIND TRIP WITH DETAILS
  // ==========================================================

  findByIdWithDetails: async (id) => {
    return prisma.trip.findUnique({
      where: {
        id,
      },
      include: {
        ride: true,
        booking: true,
        tracking: true,
      },
    });
  },

  // ==========================================================
  // FIND TRIP BY RIDE
  // ==========================================================

  findByRideId: async (rideId) => {
    return prisma.trip.findFirst({
      where: {
        rideId,
      },
    });
  },

  // ==========================================================
  // FIND TRIP BY BOOKING
  // ==========================================================

  findByBookingId: async (bookingId) => {
    return prisma.trip.findFirst({
      where: {
        bookingId,
      },
    });
  },

  // ==========================================================
  // FIND TRIPS BY DRIVER
  // ==========================================================

  findByDriverId: async (driverId, options = {}) => {
    const {
      skip = 0,
      take = 20,
      status,
    } = options;

    return prisma.trip.findMany({
      where: {
        ride: {
          driverId,
        },
        ...(status ? { status } : {}),
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // ==========================================================
  // UPDATE TRIP
  // ==========================================================

  update: async (id, data) => {
    return prisma.trip.update({
      where: {
        id,
      },
      data,
    });
  },

  // ==========================================================
  // UPDATE TRIP STATUS
  // ==========================================================

  updateStatus: async (id, status) => {
    return prisma.trip.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  },

  // ==========================================================
  // START TRIP
  // ==========================================================

  start: async (id, data = {}) => {
    return prisma.trip.update({
      where: {
        id,
      },
      data: {
        status: "DRIVER_STARTED",
        startedAt: new Date(),
        ...data,
      },
    });
  },

  // ==========================================================
  // COMPLETE TRIP
  // ==========================================================

  complete: async (id, data = {}) => {
    return prisma.trip.update({
      where: {
        id,
      },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        ...data,
      },
    });
  },

  // ==========================================================
  // CANCEL TRIP
  // ==========================================================

  cancel: async (id, data = {}) => {
    return prisma.trip.update({
      where: {
        id,
      },
      data: {
        status: "CANCELLED",
        ...data,
      },
    });
  },

  // ==========================================================
  // DELETE TRIP
  // ==========================================================

  delete: async (id) => {
    return prisma.trip.delete({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // CHECK TRIP EXISTS
  // ==========================================================

  exists: async (id) => {
    const trip = await prisma.trip.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    return !!trip;
  },

  // ==========================================================
  // COUNT TRIPS
  // ==========================================================

  count: async (where = {}) => {
    return prisma.trip.count({
      where,
    });
  },

  // ==========================================================
  // LIST TRIPS
  // ==========================================================

  findMany: async ({
    skip = 0,
    take = 20,
    where = {},
    orderBy = {
      createdAt: "desc",
    },
  } = {}) => {
    return prisma.trip.findMany({
      where,
      skip,
      take,
      orderBy,
    });
  },
};

module.exports = TripModel;