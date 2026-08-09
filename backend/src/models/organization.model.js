// backend/src/models/organization.model.js

const prisma = require("../config/database.js");

// ============================================================
// ORGANIZATION MODEL
// ============================================================

const OrganizationModel = {
  // ==========================================================
  // CREATE ORGANIZATION
  // ==========================================================

  create: async (data) => {
    return prisma.organization.create({
      data,
    });
  },

  // ==========================================================
  // FIND ORGANIZATION BY ID
  // ==========================================================

  findById: async (id) => {
    return prisma.organization.findUnique({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // FIND ORGANIZATION BY CODE
  // ==========================================================

  findByCode: async (code) => {
    return prisma.organization.findUnique({
      where: {
        code,
      },
    });
  },

  // ==========================================================
  // FIND ORGANIZATION BY NAME
  // ==========================================================

  findByName: async (name) => {
    return prisma.organization.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
  },

  // ==========================================================
  // UPDATE ORGANIZATION
  // ==========================================================

  update: async (id, data) => {
    return prisma.organization.update({
      where: {
        id,
      },
      data,
    });
  },

  // ==========================================================
  // DELETE ORGANIZATION
  // ==========================================================

  delete: async (id) => {
    return prisma.organization.delete({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // CHECK ORGANIZATION EXISTS
  // ==========================================================

  exists: async (id) => {
    const organization = await prisma.organization.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    return !!organization;
  },

  // ==========================================================
  // LIST ORGANIZATIONS
  // ==========================================================

  findMany: async ({
    skip = 0,
    take = 20,
    where = {},
    orderBy = {
      createdAt: "desc",
    },
  } = {}) => {
    return prisma.organization.findMany({
      where,
      skip,
      take,
      orderBy,
    });
  },

  // ==========================================================
  // COUNT ORGANIZATIONS
  // ==========================================================

  count: async (where = {}) => {
    return prisma.organization.count({
      where,
    });
  },
};

module.exports = OrganizationModel;