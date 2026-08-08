// backend/src/models/payment.model.js

const prisma = require("../config/database.js");

// ============================================================
// PAYMENT MODEL
// ============================================================

const PaymentModel = {
  // ==========================================================
  // CREATE PAYMENT
  // ==========================================================

  create: async (data) => {
    return prisma.payment.create({
      data,
    });
  },

  // ==========================================================
  // FIND PAYMENT BY ID
  // ==========================================================

  findById: async (id) => {
    return prisma.payment.findUnique({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // FIND PAYMENT WITH DETAILS
  // ==========================================================

  findByIdWithDetails: async (id) => {
    return prisma.payment.findUnique({
      where: {
        id,
      },
      include: {
        booking: true,
        user: true,
      },
    });
  },

  // ==========================================================
  // FIND PAYMENT BY BOOKING
  // ==========================================================

  findByBookingId: async (bookingId) => {
    return prisma.payment.findFirst({
      where: {
        bookingId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // ==========================================================
  // FIND PAYMENTS BY USER
  // ==========================================================

  findByUserId: async (userId, options = {}) => {
    const {
      skip = 0,
      take = 20,
      status,
    } = options;

    return prisma.payment.findMany({
      where: {
        userId,
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
  // FIND BY RAZORPAY ORDER ID
  // ==========================================================

  findByRazorpayOrderId: async (razorpayOrderId) => {
    return prisma.payment.findFirst({
      where: {
        razorpayOrderId,
      },
    });
  },

  // ==========================================================
  // FIND BY RAZORPAY PAYMENT ID
  // ==========================================================

  findByRazorpayPaymentId: async (razorpayPaymentId) => {
    return prisma.payment.findFirst({
      where: {
        razorpayPaymentId,
      },
    });
  },

  // ==========================================================
  // UPDATE PAYMENT
  // ==========================================================

  update: async (id, data) => {
    return prisma.payment.update({
      where: {
        id,
      },
      data,
    });
  },

  // ==========================================================
  // UPDATE PAYMENT STATUS
  // ==========================================================

  updateStatus: async (id, status) => {
    return prisma.payment.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  },

  // ==========================================================
  // MARK PAYMENT SUCCESS
  // ==========================================================

  markSuccess: async (
    id,
    {
      razorpayPaymentId,
      razorpaySignature,
    } = {}
  ) => {
    return prisma.payment.update({
      where: {
        id,
      },
      data: {
        status: "SUCCESS",
        ...(razorpayPaymentId
          ? { razorpayPaymentId }
          : {}),
        ...(razorpaySignature
          ? { razorpaySignature }
          : {}),
      },
    });
  },

  // ==========================================================
  // MARK PAYMENT FAILED
  // ==========================================================

  markFailed: async (id) => {
    return prisma.payment.update({
      where: {
        id,
      },
      data: {
        status: "FAILED",
      },
    });
  },

  // ==========================================================
  // MARK PAYMENT REFUNDED
  // ==========================================================

  markRefunded: async (id, refundData = {}) => {
    return prisma.payment.update({
      where: {
        id,
      },
      data: {
        status: "REFUNDED",
        ...refundData,
      },
    });
  },

  // ==========================================================
  // DELETE PAYMENT
  // ==========================================================

  delete: async (id) => {
    return prisma.payment.delete({
      where: {
        id,
      },
    });
  },

  // ==========================================================
  // CHECK PAYMENT EXISTS
  // ==========================================================

  exists: async (id) => {
    const payment = await prisma.payment.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    return !!payment;
  },

  // ==========================================================
  // COUNT PAYMENTS
  // ==========================================================

  count: async (where = {}) => {
    return prisma.payment.count({
      where,
    });
  },

  // ==========================================================
  // LIST PAYMENTS
  // ==========================================================

  findMany: async ({
    skip = 0,
    take = 20,
    where = {},
    orderBy = {
      createdAt: "desc",
    },
  } = {}) => {
    return prisma.payment.findMany({
      where,
      skip,
      take,
      orderBy,
    });
  },
};

module.exports = PaymentModel;