// backend/src/repositories/payment.repository.js

const prisma = require("../config/database.js");

/**
 * Create a payment record.
 */
exports.createPayment = async (paymentData) => {
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

      paypalOrderId:
        paymentData.paypalOrderId || null,

      paypalCaptureId:
        paymentData.paypalCaptureId || null,

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
exports.findPaymentById = async (paymentId) => {
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
exports.findPaymentByTripId = async (tripId) => {
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
exports.hasCompletedPayment = async (tripId) => {
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
exports.findPaymentByTransactionId = async (
  transactionId
) => {
  return prisma.payment.findUnique({
    where: {
      transactionId,
    },
  });
};


/**
 * Find payment by PayPal order ID.
 */
exports.findPaymentByPaypalOrderId = async (
  paypalOrderId
) => {
  return prisma.payment.findFirst({
    where: {
      paypalOrderId,
    },
  });
};


/**
 * Find payment by PayPal capture ID.
 */
exports.findPaymentByPaypalCaptureId = async (
  paypalCaptureId
) => {
  return prisma.payment.findFirst({
    where: {
      paypalCaptureId,
    },
  });
};


/**
 * Update payment.
 */
exports.updatePayment = async (
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
exports.completePayment = async (
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

      paypalOrderId:
        paymentData.paypalOrderId || undefined,

      paypalCaptureId:
        paymentData.paypalCaptureId || undefined,

      paidAt:
        paymentData.paidAt || new Date(),
    },
  });
};


/**
 * Mark payment as failed.
 */
exports.failPayment = async (
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
exports.refundPayment = async (
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
exports.findPaymentsByPayer = async (
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
exports.findPaymentsByReceiver = async (
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
exports.findPaymentsByMethod = async (
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
exports.findPaymentsByDateRange = async (
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
exports.getTotalPaidByUser = async (
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
exports.getTotalReceivedByUser = async (
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
exports.countCompletedPayments = async (
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
exports.getPaymentStatistics = async (
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
exports.deletePayment = async (
  paymentId
) => {
  return prisma.payment.delete({
    where: {
      id: paymentId,
    },
  });
};