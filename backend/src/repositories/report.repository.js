// backend/src/repositories/report.repository.js

const prisma = require("../config/database.js");

/**
 * Get overall ride statistics.
 */
exports.getRideStatistics = async (
  organizationId = null
) => {
  const where = {
    ...(organizationId && {
      ride: {
        organizationId,
      },
    }),
  };

  const [
    totalRides,
    completedRides,
    cancelledRides,
    activeRides,
  ] = await Promise.all([
    prisma.ride.count({
      where,
    }),

    prisma.ride.count({
      where: {
        ...where,
        status: "COMPLETED",
      },
    }),

    prisma.ride.count({
      where: {
        ...where,
        status: "CANCELLED",
      },
    }),

    prisma.ride.count({
      where: {
        ...where,
        status: {
          in: ["PUBLISHED", "ACTIVE"],
        },
      },
    }),
  ]);

  return {
    totalRides,
    completedRides,
    cancelledRides,
    activeRides,
  };
};


/**
 * Get booking statistics.
 */
exports.getBookingStatistics = async (
  organizationId = null
) => {
  const where = {
    ...(organizationId && {
      ride: {
        organizationId,
      },
    }),
  };

  const [
    totalBookings,
    confirmedBookings,
    cancelledBookings,
    pendingBookings,
  ] = await Promise.all([
    prisma.booking.count({
      where,
    }),

    prisma.booking.count({
      where: {
        ...where,
        status: "CONFIRMED",
      },
    }),

    prisma.booking.count({
      where: {
        ...where,
        status: "CANCELLED",
      },
    }),

    prisma.booking.count({
      where: {
        ...where,
        status: "PENDING",
      },
    }),
  ]);

  return {
    totalBookings,
    confirmedBookings,
    cancelledBookings,
    pendingBookings,
  };
};


/**
 * Get trip statistics.
 */
exports.getTripStatistics = async (
  organizationId = null
) => {
  const where = {
    ...(organizationId && {
      ride: {
        organizationId,
      },
    }),
  };

  const [
    totalTrips,
    completedTrips,
    cancelledTrips,
    activeTrips,
  ] = await Promise.all([
    prisma.trip.count({
      where,
    }),

    prisma.trip.count({
      where: {
        ...where,
        status: "COMPLETED",
      },
    }),

    prisma.trip.count({
      where: {
        ...where,
        status: "CANCELLED",
      },
    }),

    prisma.trip.count({
      where: {
        ...where,
        status: "IN_PROGRESS",
      },
    }),
  ]);

  return {
    totalTrips,
    completedTrips,
    cancelledTrips,
    activeTrips,
  };
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
    revenue,
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
    revenue: revenue._sum.amount || 0,
  };
};


/**
 * Get vehicle statistics.
 */
exports.getVehicleStatistics = async (
  organizationId = null
) => {
  const where = {
    ...(organizationId && {
      organizationId,
    }),
  };

  const [
    totalVehicles,
    activeVehicles,
  ] = await Promise.all([
    prisma.vehicle.count({
      where,
    }),

    prisma.vehicle.count({
      where: {
        ...where,
        isActive: true,
      },
    }),
  ]);

  return {
    totalVehicles,
    activeVehicles,
  };
};


/**
 * Get employee statistics.
 */
exports.getEmployeeStatistics = async (
  organizationId = null
) => {
  const where = {
    ...(organizationId && {
      organizationId,
    }),
  };

  const totalEmployees =
    await prisma.user.count({
      where,
    });

  return {
    totalEmployees,
  };
};


/**
 * Get dashboard summary.
 */
exports.getDashboardSummary = async (
  organizationId = null
) => {
  const [
    rides,
    bookings,
    trips,
    payments,
    vehicles,
    employees,
  ] = await Promise.all([
    getRideStatistics(organizationId),
    getBookingStatistics(organizationId),
    getTripStatistics(organizationId),
    getPaymentStatistics(organizationId),
    getVehicleStatistics(organizationId),
    getEmployeeStatistics(organizationId),
  ]);

  return {
    rides,
    bookings,
    trips,
    payments,
    vehicles,
    employees,
  };
};


/**
 * Get revenue grouped by payment method.
 */
exports.getRevenueByPaymentMethod = async (
  organizationId = null
) => {
  const where = {
    status: "COMPLETED",

    ...(organizationId && {
      trip: {
        ride: {
          organizationId,
        },
      },
    }),
  };

  const payments = await prisma.payment.findMany({
    where,

    select: {
      method: true,
      amount: true,
    },
  });

  const result = {};

  for (const payment of payments) {
    const method = payment.method;

    if (!result[method]) {
      result[method] = 0;
    }

    result[method] += Number(payment.amount);
  }

  return result;
};


/**
 * Get rides grouped by status.
 */
exports.getRidesByStatus = async (
  organizationId = null
) => {
  const where = {
    ...(organizationId && {
      organizationId,
    }),
  };

  const rides = await prisma.ride.groupBy({
    by: ["status"],

    where,

    _count: {
      id: true,
    },
  });

  return rides.map((item) => ({
    status: item.status,
    count: item._count.id,
  }));
};


/**
 * Get bookings grouped by status.
 */
exports.getBookingsByStatus = async (
  organizationId = null
) => {
  const where = {
    ...(organizationId && {
      ride: {
        organizationId,
      },
    }),
  };

  const bookings = await prisma.booking.groupBy({
    by: ["status"],

    where,

    _count: {
      id: true,
    },
  });

  return bookings.map((item) => ({
    status: item.status,
    count: item._count.id,
  }));
};


/**
 * Get trips grouped by status.
 */
exports.getTripsByStatus = async (
  organizationId = null
) => {
  const where = {
    ...(organizationId && {
      ride: {
        organizationId,
      },
    }),
  };

  const trips = await prisma.trip.groupBy({
    by: ["status"],

    where,

    _count: {
      id: true,
    },
  });

  return trips.map((item) => ({
    status: item.status,
    count: item._count.id,
  }));
};


/**
 * Get recent completed trips.
 */
exports.getRecentCompletedTrips = async (
  organizationId = null,
  limit = 10
) => {
  return prisma.trip.findMany({
    where: {
      status: "COMPLETED",

      ...(organizationId && {
        ride: {
          organizationId,
        },
      }),
    },

    take: limit,

    include: {
      ride: {
        select: {
          id: true,
          source: true,
          destination: true,
          departureTime: true,
        },
      },

      driver: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    orderBy: {
      completedAt: "desc",
    },
  });
};


/**
 * Get report data for a date range.
 */
exports.getDateRangeReport = async (
  startDate,
  endDate,
  organizationId = null
) => {
  const [
    rides,
    trips,
    payments,
    bookings,
  ] = await Promise.all([
    prisma.ride.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },

        ...(organizationId && {
          organizationId,
        }),
      },
    }),

    prisma.trip.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },

        ...(organizationId && {
          ride: {
            organizationId,
          },
        }),
      },
    }),

    prisma.payment.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },

        status: "COMPLETED",

        ...(organizationId && {
          trip: {
            ride: {
              organizationId,
            },
          },
        }),
      },

      _sum: {
        amount: true,
      },
    }),

    prisma.booking.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },

        ...(organizationId && {
          ride: {
            organizationId,
          },
        }),
      },
    }),
  ]);

  return {
    rides,
    trips,
    bookings,
    revenue: payments._sum.amount || 0,
  };
};


/**
 * Get top drivers by completed trips.
 */
exports.getTopDrivers = async (
  organizationId = null,
  limit = 10
) => {
  const drivers = await prisma.trip.groupBy({
    by: ["driverId"],

    where: {
      status: "COMPLETED",

      ...(organizationId && {
        ride: {
          organizationId,
        },
      }),
    },

    _count: {
      id: true,
    },

    orderBy: {
      _count: {
        id: "desc",
      },
    },

    take: limit,
  });

  const driverIds = drivers.map(
    (driver) => driver.driverId
  );

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: driverIds,
      },
    },

    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return drivers.map((driver) => ({
    driver: users.find(
      (user) => user.id === driver.driverId
    ),

    completedTrips: driver._count.id,
  }));
};


/**
 * Get top users by number of completed rides.
 */
exports.getTopPassengers = async (
  organizationId = null,
  limit = 10
) => {
  const bookings = await prisma.booking.groupBy({
    by: ["passengerId"],

    where: {
      status: "CONFIRMED",

      ...(organizationId && {
        ride: {
          organizationId,
        },
      }),
    },

    _count: {
      id: true,
    },

    orderBy: {
      _count: {
        id: "desc",
      },
    },

    take: limit,
  });

  const passengerIds = bookings.map(
    (item) => item.passengerId
  );

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: passengerIds,
      },
    },

    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return bookings.map((item) => ({
    passenger: users.find(
      (user) => user.id === item.passengerId
    ),

    bookings: item._count.id,
  }));
};


/**
 * Get cancellation statistics.
 */
exports.getCancellationStatistics = async (
  organizationId = null
) => {
  const [
    cancelledRides,
    cancelledBookings,
    cancelledTrips,
  ] = await Promise.all([
    prisma.ride.count({
      where: {
        status: "CANCELLED",

        ...(organizationId && {
          organizationId,
        }),
      },
    }),

    prisma.booking.count({
      where: {
        status: "CANCELLED",

        ...(organizationId && {
          ride: {
            organizationId,
          },
        }),
      },
    }),

    prisma.trip.count({
      where: {
        status: "CANCELLED",

        ...(organizationId && {
          ride: {
            organizationId,
          },
        }),
      },
    }),
  ]);

  return {
    cancelledRides,
    cancelledBookings,
    cancelledTrips,
  };
};