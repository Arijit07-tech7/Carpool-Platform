// backend/src/models/vehicle.model.js

const prisma = require("../config/database.js");

// ============================================================
// VEHICLE MODEL
// ============================================================

const VehicleModel = {
  // ==========================================================
  // CREATE VEHICLE
  // ==========================================================

  create: async (data) => {
    return prisma.vehicle.create({
      data,
    });
  },

  // ==========================================================
  // FIND VEHICLE BY ID
  // ==========================================================

  findById: async (id) => {
    return prisma.vehicle.findUnique({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // FIND VEHICLE BY REGISTRATION NUMBER
  // ==========================================================

  findByRegistrationNumber: async (registrationNumber) => {
    return prisma.vehicle.findUnique({
      where: {
        registrationNumber,
      },
    });
  },

  // ==========================================================
  // FIND VEHICLES BY DRIVER
  // ==========================================================

  findByDriverId: async (driverId) => {
    return prisma.vehicle.findMany({
      where: {
        driverId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // ==========================================================
  // UPDATE VEHICLE
  // ==========================================================

  update: async (id, data) => {
    return prisma.vehicle.update({
      where: {
        id,
      },
      data,
    });
  },

  // ==========================================================
  // DELETE VEHICLE
  // ==========================================================

  delete: async (id) => {
    return prisma.vehicle.delete({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // CHECK VEHICLE EXISTS
  // ==========================================================

  exists: async (id) => {
    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    return !!vehicle;
  },

  // ==========================================================
  // LIST VEHICLES
  // ==========================================================

  findMany: async ({
    skip = 0,
    take = 20,
    where = {},
    orderBy = {
      createdAt: "desc",
    },
  } = {}) => {
    return prisma.vehicle.findMany({
      where,
      skip,
      take,
      orderBy,
    });
  },

  // ==========================================================
  // COUNT VEHICLES
  // ==========================================================

  count: async (where = {}) => {
    return prisma.vehicle.count({
      where,
    });
  },
};

module.exports = VehicleModel;