// backend/src/repositories/payment.repository.js

import prisma from "../config/database.js";

/**
 * Create a payment record.
 */
export const createPayment = async (paymentData) => {
  return prisma.payment.create({
    data: {
      tripId: paymentData.tripId,
      payerId: paymentData.payerId,
      receiverId: paymentData.receiverId || null,

      amount: paymentData.amount,

      method: paymentData.method,

      status: paymentData.status || "PENDING",

      transactionId:
        paymentData.transactionId || null,

      razorpayOrderId:
        paymentData.razorpayOrderId || null,

      razorpayPaymentId:
        paymentData.razorpayPaymentId || null,

      razorpaySignature:
        paymentData.razorpaySignature || null,

      description:
        paymentData.description || null,

      paidAt: paymentData.paidAt || null,
    },

    include: {
      trip: true,

      payer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },

      receiver: {
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
 * Find payment by ID.
 */
export const findPaymentById = async (paymentId) => {
  return prisma.payment.findUnique({
    where: {
      id: paymentId,
    },

    include: {
      trip: {
        include: {
          ride: true,
        },
      },

      payer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },

      receiver: {
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
 * Find payment for a trip.
 */
export const findPaymentByTripId = async (tripId) => {
  return prisma.payment.findFirst({
    where: {
      tripId,
    },

    include: {
      payer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },

      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },

      trip: {
        include: {
          ride: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};


/**
 * Check whether a trip already has a completed payment.
 */
export const hasCompletedPayment = async (tripId) => {
  const payment = await prisma.payment.findFirst({
    where: {
      tripId,
      status: "COMPLETED",
    },

    select: {
      id: true,
    },
  });

  return Boolean(payment);
};


/**
 * Find payment by transaction ID.
 */
export const findPaymentByTransactionId = async (
  transactionId
) => {
  return prisma.payment.findUnique({
    where: {
      transactionId,
    },
  });
};


/**
 * Find payment by Razorpay order ID.
 */
export const findPaymentByRazorpayOrderId = async (
  razorpayOrderId
) => {
  return prisma.payment.findFirst({
    where: {
      razorpayOrderId,
    },
  });
};


/**
 * Find payment by Razorpay payment ID.
 */
export const findPaymentByRazorpayPaymentId = async (
  razorpayPaymentId
) => {
  return prisma.payment.findFirst({
    where: {
      razorpayPaymentId,
    },
  });
};


/**
 * Update payment.
 */
export const updatePayment = async (
  paymentId,
  updateData
) => {
  return prisma.payment.update({
    where: {
      id: paymentId,
    },

    data: updateData,
  });
};


/**
 * Mark payment as completed.
 */
export const completePayment = async (
  paymentId,
  paymentData = {}
) => {
  return prisma.payment.update({
    where: {
      id: paymentId,
    },

    data: {
      status: "COMPLETED",

      transactionId:
        paymentData.transactionId || undefined,

      razorpayPaymentId:
        paymentData.razorpayPaymentId || undefined,

      razorpaySignature:
        paymentData.razorpaySignature || undefined,

      paidAt:
        paymentData.paidAt || new Date(),
    },
  });
};


/**
 * Mark payment as failed.
 */
export const failPayment = async (
  paymentId,
  reason = null
) => {
  return prisma.payment.update({
    where: {
      id: paymentId,
    },

    data: {
      status: "FAILED",

      description: reason,
    },
  });
};


/**
 * Mark payment as refunded.
 */
export const refundPayment = async (
  paymentId
) => {
  return prisma.payment.update({
    where: {
      id: paymentId,
    },

    data: {
      status: "REFUNDED",
    },
  });
};


/**
 * Get payments made by a user.
 */
export const findPaymentsByPayer = async (
  payerId,
  options = {}
) => {
  const {
    page = 1,
    limit = 20,
    status,
    method,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    payerId,

    ...(status && {
      status,
    }),

    ...(method && {
      method,
    }),
  };

  const [payments, total] =
    await prisma.$transaction([
      prisma.payment.findMany({
        where,

        skip,
        take: limit,

        include: {
          trip: {
            include: {
              ride: {
                select: {
                  id: true,
                  source: true,
                  destination: true,
                  departureTime: true,
                },
              },
            },
          },

          receiver: {
            select: {
              id: true,
              name: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.payment.count({
        where,
      }),
    ]);

  return {
    payments,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};


/**
 * Get payments received by a driver.
 */
export const findPaymentsByReceiver = async (
  receiverId,
  options = {}
) => {
  const {
    page = 1,
    limit = 20,
    status,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    receiverId,

    ...(status && {
      status,
    }),
  };

  const [payments, total] =
    await prisma.$transaction([
      prisma.payment.findMany({
        where,

        skip,
        take: limit,

        include: {
          payer: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },

          trip: {
            include: {
              ride: {
                select: {
                  id: true,
                  source: true,
                  destination: true,
                },
              },
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.payment.count({
        where,
      }),
    ]);

  return {
    payments,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};


/**
 * Get payments by payment method.
 */
export const findPaymentsByMethod = async (
  method,
  options = {}
) => {
  const {
    page = 1,
    limit = 20,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    method,
  };

  const [payments, total] =
    await prisma.$transaction([
      prisma.payment.findMany({
        where,

        skip,
        take: limit,

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.payment.count({
        where,
      }),
    ]);

  return {
    payments,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};


/**
 * Get completed payments within a date range.
 */
export const findPaymentsByDateRange = async (
  startDate,
  endDate,
  organizationId = null
) => {
  return prisma.payment.findMany({
    where: {
      status: "COMPLETED",

      createdAt: {
        gte: startDate,
        lte: endDate,
      },

      ...(organizationId && {
        trip: {
          ride: {
            organizationId,
          },
        },
      }),
    },

    include: {
      payer: {
        select: {
          id: true,
          name: true,
        },
      },

      receiver: {
        select: {
          id: true,
          name: true,
        },
      },

      trip: {
        include: {
          ride: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};


/**
 * Calculate total completed payment amount
 * for a user.
 */
export const getTotalPaidByUser = async (
  payerId
) => {
  const result = await prisma.payment.aggregate({
    where: {
      payerId,
      status: "COMPLETED",
    },

    _sum: {
      amount: true,
    },
  });

  return result._sum.amount || 0;
};


/**
 * Calculate total amount received by a driver.
 */
export const getTotalReceivedByUser = async (
  receiverId
) => {
  const result = await prisma.payment.aggregate({
    where: {
      receiverId,
      status: "COMPLETED",
    },

    _sum: {
      amount: true,
    },
  });

  return result._sum.amount || 0;
};


/**
 * Count completed payments.
 */
export const countCompletedPayments = async (
  organizationId = null
) => {
  return prisma.payment.count({
    where: {
      status: "COMPLETED",

      ...(organizationId && {
        trip: {
          ride: {
            organizationId,
          },
        },
      }),
    },
  });
};


/**
 * Get payment statistics.
 */
export const getPaymentStatistics = async (
  organizationId = null
) => {
  const where = {
    ...(organizationId && {
      trip: {
        ride: {
          organizationId,
        },
      },
    }),
  };

  const [
    totalPayments,
    completedPayments,
    failedPayments,
    refundedPayments,
    totalAmount,
  ] = await Promise.all([
    prisma.payment.count({
      where,
    }),

    prisma.payment.count({
      where: {
        ...where,
        status: "COMPLETED",
      },
    }),

    prisma.payment.count({
      where: {
        ...where,
        status: "FAILED",
      },
    }),

    prisma.payment.count({
      where: {
        ...where,
        status: "REFUNDED",
      },
    }),

    prisma.payment.aggregate({
      where: {
        ...where,
        status: "COMPLETED",
      },

      _sum: {
        amount: true,
      },
    }),
  ]);

  return {
    totalPayments,
    completedPayments,
    failedPayments,
    refundedPayments,
    totalAmount: totalAmount._sum.amount || 0,
  };
};


/**
 * Delete a payment.
 *
 * Normally this should be restricted to
 * administrative/cleanup operations.
 */
export const deletePayment = async (
  paymentId
) => {
  return prisma.payment.delete({
    where: {
      id: paymentId,
    },
  });
};