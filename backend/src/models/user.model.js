// backend/src/models/user.model.js

const prisma = require("../config/database.js");

// ============================================================
// USER MODEL
// ============================================================

const UserModel = {
  // ==========================================================
  // CREATE USER
  // ==========================================================

  create: async (data) => {
    return prisma.user.create({
      data,
    });
  },

  // ==========================================================
  // FIND USER BY ID
  // ==========================================================

  findById: async (id) => {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // FIND USER BY EMAIL
  // ==========================================================

  findByEmail: async (email) => {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  },

  // ==========================================================
  // UPDATE USER
  // ==========================================================

  update: async (id, data) => {
    return prisma.user.update({
      where: {
        id,
      },
      data,
    });
  },

  // ==========================================================
  // DELETE USER
  // ==========================================================

  delete: async (id) => {
    return prisma.user.delete({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // CHECK USER EXISTS
  // ==========================================================

  exists: async (id) => {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    return !!user;
  },

  // ==========================================================
  // LIST USERS
  // ==========================================================

  findMany: async ({
    skip = 0,
    take = 20,
    where = {},
    orderBy = {
      createdAt: "desc",
    },
  } = {}) => {
    return prisma.user.findMany({
      where,
      skip,
      take,
      orderBy,
    });
  },

  // ==========================================================
  // COUNT USERS
  // ==========================================================

  count: async (where = {}) => {
    return prisma.user.count({
      where,
    });
  },
};

module.exports = UserModel;