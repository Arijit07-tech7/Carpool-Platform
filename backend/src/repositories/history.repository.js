// backend/src/repositories/history.repository.js

import prisma from "../config/database.js";

/**
 * Create a ride history record.
 */
export const createHistory = async (historyData) => {
  return prisma.history.create({
    data: {
      userId: historyData.userId,
      tripId: historyData.tripId,

      rideId: historyData.rideId || null,

      role: historyData.role || null,

      status: historyData.status || "COMPLETED",

      amount: historyData.amount || 0,

      paymentMethod:
        historyData.paymentMethod || null,

      completedAt:
        historyData.completedAt || new Date(),

      notes:
        historyData.notes || null,
    },

    include: {
      trip: true,
      ride: true,

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
 * Find history record by ID.
 */
export const findHistoryById = async (historyId) => {
  return prisma.history.findUnique({
    where: {
      id: historyId,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      trip: {
        include: {
          ride: true,
        },
      },

      ride: true,
    },
  });
};


/**
 * Find history for a specific trip.
 */
export const findHistoryByTripId = async (tripId) => {
  return prisma.history.findMany({
    where: {
      tripId,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      ride: true,
      trip: true,
    },

    orderBy: {
      completedAt: "desc",
    },
  });
};


/**
 * Check whether history already exists
 * for a user and trip.
 */
export const historyExists = async (
  userId,
  tripId
) => {
  const record = await prisma.history.findFirst({
    where: {
      userId,
      tripId,
    },

    select: {
      id: true,
    },
  });

  return Boolean(record);
};


/**
 * Get ride history of a user.
 */
export const getUserHistory = async (
  userId,
  options = {}
) => {
  const {
    page = 1,
    limit = 20,
    status,
    role,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    userId,

    ...(status && {
      status,
    }),

    ...(role && {
      role,
    }),
  };

  const [history, total] =
    await prisma.$transaction([
      prisma.history.findMany({
        where,

        skip,
        take: limit,

        include: {
          ride: {
            select: {
              id: true,
              source: true,
              destination: true,
              departureTime: true,
              fare: true,
            },
          },

          trip: {
            select: {
              id: true,
              status: true,
              startedAt: true,
              completedAt: true,
            },
          },
        },

        orderBy: {
          completedAt: "desc",
        },
      }),

      prisma.history.count({
        where,
      }),
    ]);

  return {
    history,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};


/**
 * Get rides where the user was the driver.
 */
export const getDriverHistory = async (
  userId,
  options = {}
) => {
  const {
    page = 1,
    limit = 20,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    userId,
    role: "DRIVER",
  };

  const [history, total] =
    await prisma.$transaction([
      prisma.history.findMany({
        where,

        skip,
        take: limit,

        include: {
          ride: true,

          trip: {
            include: {
              bookings: {
                include: {
                  passenger: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },

        orderBy: {
          completedAt: "desc",
        },
      }),

      prisma.history.count({
        where,
      }),
    ]);

  return {
    history,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};


/**
 * Get rides where the user was a passenger.
 */
export const getPassengerHistory = async (
  userId,
  options = {}
) => {
  const {
    page = 1,
    limit = 20,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    userId,
    role: "PASSENGER",
  };

  const [history, total] =
    await prisma.$transaction([
      prisma.history.findMany({
        where,

        skip,
        take: limit,

        include: {
          ride: {
            include: {
              driver: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                  profileImage: true,
                },
              },
            },
          },

          trip: true,
        },

        orderBy: {
          completedAt: "desc",
        },
      }),

      prisma.history.count({
        where,
      }),
    ]);

  return {
    history,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};


/**
 * Get history between two dates.
 */
export const getHistoryByDateRange = async (
  userId,
  startDate,
  endDate
) => {
  return prisma.history.findMany({
    where: {
      userId,

      completedAt: {
        gte: startDate,
        lte: endDate,
      },
    },

    include: {
      ride: true,
      trip: true,
    },

    orderBy: {
      completedAt: "desc",
    },
  });
};


/**
 * Get recent ride history.
 */
export const getRecentHistory = async (
  userId,
  limit = 10
) => {
  return prisma.history.findMany({
    where: {
      userId,
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

      trip: {
        select: {
          id: true,
          status: true,
          completedAt: true,
        },
      },
    },

    orderBy: {
      completedAt: "desc",
    },
  });
};


/**
 * Get total completed rides of a user.
 */
export const countCompletedRides = async (
  userId
) => {
  return prisma.history.count({
    where: {
      userId,
      status: "COMPLETED",
    },
  });
};


/**
 * Get total amount spent by a passenger.
 */
export const getTotalSpent = async (
  userId
) => {
  const result = await prisma.history.aggregate({
    where: {
      userId,
      role: "PASSENGER",
      status: "COMPLETED",
    },

    _sum: {
      amount: true,
    },
  });

  return result._sum.amount || 0;
};


/**
 * Get total earnings of a driver.
 */
export const getTotalEarnings = async (
  userId
) => {
  const result = await prisma.history.aggregate({
    where: {
      userId,
      role: "DRIVER",
      status: "COMPLETED",
    },

    _sum: {
      amount: true,
    },
  });

  return result._sum.amount || 0;
};


/**
 * Get history statistics for a user.
 */
export const getHistoryStatistics = async (
  userId
) => {
  const [
    totalRides,
    driverRides,
    passengerRides,
    totalSpent,
    totalEarnings,
  ] = await Promise.all([
    prisma.history.count({
      where: {
        userId,
      },
    }),

    prisma.history.count({
      where: {
        userId,
        role: "DRIVER",
        status: "COMPLETED",
      },
    }),

    prisma.history.count({
      where: {
        userId,
        role: "PASSENGER",
        status: "COMPLETED",
      },
    }),

    prisma.history.aggregate({
      where: {
        userId,
        role: "PASSENGER",
        status: "COMPLETED",
      },

      _sum: {
        amount: true,
      },
    }),

    prisma.history.aggregate({
      where: {
        userId,
        role: "DRIVER",
        status: "COMPLETED",
      },

      _sum: {
        amount: true,
      },
    }),
  ]);

  return {
    totalRides,
    driverRides,
    passengerRides,
    totalSpent:
      totalSpent._sum.amount || 0,
    totalEarnings:
      totalEarnings._sum.amount || 0,
  };
};


/**
 * Update a history record.
 */
export const updateHistory = async (
  historyId,
  updateData
) => {
  return prisma.history.update({
    where: {
      id: historyId,
    },

    data: updateData,
  });
};


/**
 * Delete a history record.
 */
export const deleteHistory = async (
  historyId
) => {
  return prisma.history.delete({
    where: {
      id: historyId,
    },
  });
};