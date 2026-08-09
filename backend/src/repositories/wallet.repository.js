// backend/src/repositories/wallet.repository.js

const prisma = require("../config/database.js");

/**
 * Create a wallet for a user.
 */
exports.createWallet = async (userId) => {
  return prisma.wallet.create({
    data: {
      userId,
      balance: 0,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};


/**
 * Find wallet by user ID.
 */
exports.findWalletByUserId = async (userId) => {
  return prisma.wallet.findUnique({
    where: {
      userId,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};


/**
 * Find wallet by wallet ID.
 */
exports.findWalletById = async (walletId) => {
  return prisma.wallet.findUnique({
    where: {
      id: walletId,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });
};


/**
 * Get wallet balance.
 */
exports.getWalletBalance = async (userId) => {
  const wallet = await prisma.wallet.findUnique({
    where: {
      userId,
    },

    select: {
      balance: true,
    },
  });

  return wallet ? wallet.balance : 0;
};


/**
 * Update wallet balance.
 */
exports.updateWalletBalance = async (
  userId,
  amount
) => {
  return prisma.wallet.update({
    where: {
      userId,
    },

    data: {
      balance: amount,
    },
  });
};


/**
 * Add money to wallet.
 */
exports.creditWallet = async (
  userId,
  amount
) => {
  return prisma.wallet.update({
    where: {
      userId,
    },

    data: {
      balance: {
        increment: amount,
      },
    },
  });
};


/**
 * Deduct money from wallet.
 *
 * The service layer should check the balance
 * before calling this function.
 */
exports.debitWallet = async (
  userId,
  amount
) => {
  return prisma.wallet.updateMany({
    where: {
      userId,

      balance: {
        gte: amount,
      },
    },

    data: {
      balance: {
        decrement: amount,
      },
    },
  });
};


/**
 * Check whether wallet has enough balance.
 */
exports.hasSufficientBalance = async (
  userId,
  amount
) => {
  const wallet = await prisma.wallet.findUnique({
    where: {
      userId,
    },

    select: {
      balance: true,
    },
  });

  if (!wallet) {
    return false;
  }

  return Number(wallet.balance) >= Number(amount);
};


/**
 * Create a wallet transaction.
 */
exports.createWalletTransaction = async (
  transactionData
) => {
  return prisma.walletTransaction.create({
    data: {
      walletId: transactionData.walletId,

      type: transactionData.type,

      amount: transactionData.amount,

      status:
        transactionData.status || "COMPLETED",

      referenceId:
        transactionData.referenceId || null,

      paymentId:
        transactionData.paymentId || null,

      description:
        transactionData.description || null,
    },

    include: {
      wallet: true,
    },
  });
};


/**
 * Find wallet transaction by ID.
 */
exports.findWalletTransactionById = async (
  transactionId
) => {
  return prisma.walletTransaction.findUnique({
    where: {
      id: transactionId,
    },

    include: {
      wallet: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
};


/**
 * Find wallet transactions for a user.
 */
exports.findWalletTransactionsByUser = async (
  userId,
  options = {}
) => {
  const {
    page = 1,
    limit = 20,
    type,
    status,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    wallet: {
      userId,
    },

    ...(type && {
      type,
    }),

    ...(status && {
      status,
    }),
  };

  const [transactions, total] =
    await prisma.$transaction([
      prisma.walletTransaction.findMany({
        where,

        skip,
        take: limit,

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.walletTransaction.count({
        where,
      }),
    ]);

  return {
    transactions,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};


/**
 * Find wallet transactions by wallet ID.
 */
exports.findWalletTransactionsByWallet = async (
  walletId,
  options = {}
) => {
  const {
    page = 1,
    limit = 20,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    walletId,
  };

  const [transactions, total] =
    await prisma.$transaction([
      prisma.walletTransaction.findMany({
        where,

        skip,
        take: limit,

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.walletTransaction.count({
        where,
      }),
    ]);

  return {
    transactions,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};


/**
 * Find transaction by reference ID.
 */
exports.findTransactionByReferenceId =
  async (referenceId) => {
    return prisma.walletTransaction.findFirst({
      where: {
        referenceId,
      },
    });
  };


/**
 * Find transaction by payment ID.
 */
exports.findTransactionByPaymentId =
  async (paymentId) => {
    return prisma.walletTransaction.findFirst({
      where: {
        paymentId,
      },
    });
  };


/**
 * Update wallet transaction.
 */
exports.updateWalletTransaction = async (
  transactionId,
  updateData
) => {
  return prisma.walletTransaction.update({
    where: {
      id: transactionId,
    },

    data: updateData,
  });
};


/**
 * Mark wallet transaction as completed.
 */
exports.completeWalletTransaction = async (
  transactionId
) => {
  return prisma.walletTransaction.update({
    where: {
      id: transactionId,
    },

    data: {
      status: "COMPLETED",
    },
  });
};


/**
 * Mark wallet transaction as failed.
 */
exports.failWalletTransaction = async (
  transactionId
) => {
  return prisma.walletTransaction.update({
    where: {
      id: transactionId,
    },

    data: {
      status: "FAILED",
    },
  });
};


/**
 * Get wallet statistics.
 */
exports.getWalletStatistics = async (
  userId
) => {
  const wallet = await prisma.wallet.findUnique({
    where: {
      userId,
    },

    select: {
      id: true,
      balance: true,
    },
  });

  if (!wallet) {
    return {
      balance: 0,
      totalCredit: 0,
      totalDebit: 0,
    };
  }

  const [credit, debit] =
    await Promise.all([
      prisma.walletTransaction.aggregate({
        where: {
          walletId: wallet.id,
          type: "CREDIT",
          status: "COMPLETED",
        },

        _sum: {
          amount: true,
        },
      }),

      prisma.walletTransaction.aggregate({
        where: {
          walletId: wallet.id,
          type: "DEBIT",
          status: "COMPLETED",
        },

        _sum: {
          amount: true,
        },
      }),
    ]);

  return {
    balance: wallet.balance,

    totalCredit:
      credit._sum.amount || 0,

    totalDebit:
      debit._sum.amount || 0,
  };
};


/**
 * Delete wallet.
 */
exports.deleteWallet = async (userId) => {
  return prisma.wallet.delete({
    where: {
      userId,
    },
  });
};