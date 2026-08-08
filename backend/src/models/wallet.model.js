// backend/src/models/wallet.model.js

const prisma = require("../config/database.js");

// ============================================================
// WALLET MODEL
// ============================================================

const WalletModel = {
  // ==========================================================
  // CREATE WALLET
  // ==========================================================

  create: async (data) => {
    return prisma.wallet.create({
      data,
    });
  },

  // ==========================================================
  // FIND WALLET BY ID
  // ==========================================================

  findById: async (id) => {
    return prisma.wallet.findUnique({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // FIND WALLET BY USER ID
  // ==========================================================

  findByUserId: async (userId) => {
    return prisma.wallet.findUnique({
      where: {
        userId,
      },
    });
  },

  // ==========================================================
  // FIND WALLET WITH USER
  // ==========================================================

  findByIdWithUser: async (id) => {
    return prisma.wallet.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
  },

  // ==========================================================
  // UPDATE WALLET
  // ==========================================================

  update: async (id, data) => {
    return prisma.wallet.update({
      where: {
        id,
      },
      data,
    });
  },

  // ==========================================================
  // UPDATE BALANCE
  // ==========================================================

  updateBalance: async (id, balance) => {
    return prisma.wallet.update({
      where: {
        id,
      },
      data: {
        balance,
      },
    });
  },

  // ==========================================================
  // CREDIT WALLET
  // ==========================================================

  credit: async (id, amount) => {
    return prisma.wallet.update({
      where: {
        id,
      },
      data: {
        balance: {
          increment: amount,
        },
      },
    });
  },

  // ==========================================================
  // DEBIT WALLET
  // ==========================================================

  debit: async (id, amount) => {
    return prisma.wallet.update({
      where: {
        id,
      },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });
  },

  // ==========================================================
  // CHECK WALLET EXISTS
  // ==========================================================

  exists: async (id) => {
    const wallet = await prisma.wallet.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    return !!wallet;
  },

  // ==========================================================
  // GET WALLET BALANCE
  // ==========================================================

  getBalance: async (userId) => {
    const wallet = await prisma.wallet.findUnique({
      where: {
        userId,
      },
      select: {
        balance: true,
      },
    });

    return wallet ? wallet.balance : 0;
  },

  // ==========================================================
  // DELETE WALLET
  // ==========================================================

  delete: async (id) => {
    return prisma.wallet.delete({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // LIST WALLETS
  // ==========================================================

  findMany: async ({
    skip = 0,
    take = 20,
    where = {},
    orderBy = {
      createdAt: "desc",
    },
  } = {}) => {
    return prisma.wallet.findMany({
      where,
      skip,
      take,
      orderBy,
    });
  },

  // ==========================================================
  // COUNT WALLETS
  // ==========================================================

  count: async (where = {}) => {
    return prisma.wallet.count({
      where,
    });
  },
};

module.exports = WalletModel;