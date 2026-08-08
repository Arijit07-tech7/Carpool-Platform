// backend/src/models/booking.model.js

const prisma = require("../config/database.js");

// ============================================================
// BOOKING MODEL
// ============================================================

const BookingModel = {
  // ==========================================================
  // CREATE BOOKING
  // ==========================================================

  create: async (data) => {
    return prisma.booking.create({
      data,
    });
  },

  // ==========================================================
  // FIND BOOKING BY ID
  // ==========================================================

  findById: async (id) => {
    return prisma.booking.findUnique({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // FIND BOOKING WITH DETAILS
  // ==========================================================

  findByIdWithDetails: async (id) => {
    return prisma.booking.findUnique({
      where: {
        id,
      },
      include: {
        ride: true,
        passenger: true,
        payment: true,
        trip: true,
      },
    });
  },

  // ==========================================================
  // FIND BOOKINGS BY PASSENGER
  // ==========================================================

  findByPassengerId: async (passengerId, options = {}) => {
    const {
      skip = 0,
      take = 20,
      status,
    } = options;

    return prisma.booking.findMany({
      where: {
        passengerId,
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
  // FIND BOOKINGS BY RIDE
  // ==========================================================

  findByRideId: async (rideId, options = {}) => {
    const {
      skip = 0,
      take = 20,
      status,
    } = options;

    return prisma.booking.findMany({
      where: {
        rideId,
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
  // FIND PASSENGER BOOKING FOR A RIDE
  // ==========================================================

  findByRideAndPassenger: async (rideId, passengerId) => {
    return prisma.booking.findFirst({
      where: {
        rideId,
        passengerId,
      },
    });
  },

  // ==========================================================
  // UPDATE BOOKING
  // ==========================================================

  update: async (id, data) => {
    return prisma.booking.update({
      where: {
        id,
      },
      data,
    });
  },

  // ==========================================================
  // UPDATE BOOKING STATUS
  // ==========================================================

  updateStatus: async (id, status) => {
    return prisma.booking.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  },

  // ==========================================================
  // DELETE BOOKING
  // ==========================================================

  delete: async (id) => {
    return prisma.booking.delete({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // CHECK BOOKING EXISTS
  // ==========================================================

  exists: async (id) => {
    const booking = await prisma.booking.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    return !!booking;
  },

  // ==========================================================
  // COUNT BOOKINGS
  // ==========================================================

  count: async (where = {}) => {
    return prisma.booking.count({
      where,
    });
  },

  // ==========================================================
  // LIST BOOKINGS
  // ==========================================================

  findMany: async ({
    skip = 0,
    take = 20,
    where = {},
    orderBy = {
      createdAt: "desc",
    },
  } = {}) => {
    return prisma.booking.findMany({
      where,
      skip,
      take,
      orderBy,
    });
  },
};

module.exports = BookingModel;