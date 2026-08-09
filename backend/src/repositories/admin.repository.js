// backend/src/repositories/admin.repository.js

const prisma = require("../config/database.js");

/**
 * Get all users.
 */
exports.getAllUsers = async (options = {}) => {
  const {
    page = 1,
    limit = 20,
    search,
    role,
    organizationId,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    ...(role && { role }),

    ...(organizationId && {
      organizationId,
    }),

    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          phone: {
            contains: search,
          },
        },
      ],
    }),
  };

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip,
      take: limit,

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.user.count({
      where,
    }),
  ]);

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};


/**
 * Find a user by ID.
 */
exports.findUserById = async (userId) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      organizationId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};


/**
 * Update user information.
 */
exports.updateUser = async (
  userId,
  updateData
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },

    data: updateData,

    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      organizationId: true,
      updatedAt: true,
    },
  });
};


/**
 * Delete a user.
 */
exports.deleteUser = async (userId) => {
  return prisma.user.delete({
    where: {
      id: userId,
    },
  });
};


/**
 * Get all organizations.
 */
exports.getAllOrganizations = async (
  options = {}
) => {
  const {
    page = 1,
    limit = 20,
    search,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    }),
  };

  const [organizations, total] =
    await prisma.$transaction([
      prisma.organization.findMany({
        where,
        skip,
        take: limit,

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.organization.count({
        where,
      }),
    ]);

  return {
    organizations,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};


/**
 * Get organization details.
 */
exports.getOrganizationDetails = async (
  organizationId
) => {
  return prisma.organization.findUnique({
    where: {
      id: organizationId,
    },

    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },

      vehicles: true,
    },
  });
};


/**
 * Get all rides for admin.
 */
exports.getAllRides = async (
  options = {}
) => {
  const {
    page = 1,
    limit = 20,
    organizationId,
    status,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    ...(organizationId && {
      organizationId,
    }),

    ...(status && {
      status,
    }),
  };

  const [rides, total] =
    await prisma.$transaction([
      prisma.ride.findMany({
        where,

        skip,
        take: limit,

        include: {
          driver: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          vehicle: true,

          organization: {
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

      prisma.ride.count({
        where,
      }),
    ]);

  return {
    rides,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};


/**
 * Get all trips for admin.
 */
exports.getAllTrips = async (
  options = {}
) => {
  const {
    page = 1,
    limit = 20,
    organizationId,
    status,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    ...(organizationId && {
      ride: {
        organizationId,
      },
    }),

    ...(status && {
      status,
    }),
  };

  const [trips, total] =
    await prisma.$transaction([
      prisma.trip.findMany({
        where,

        skip,
        take: limit,

        include: {
          ride: true,

          driver: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.trip.count({
        where,
      }),
    ]);

  return {
    trips,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};


/**
 * Get all payments for admin.
 */
exports.getAllPayments = async (
  options = {}
) => {
  const {
    page = 1,
    limit = 20,
    organizationId,
    status,
    method,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    ...(organizationId && {
      trip: {
        ride: {
          organizationId,
        },
      },
    }),

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
          payer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          receiver: {
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
 * Get platform-wide statistics.
 */
exports.getPlatformStatistics = async () => {
  const [
    users,
    organizations,
    vehicles,
    rides,
    bookings,
    trips,
    payments,
    revenue,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.organization.count(),

    prisma.vehicle.count(),

    prisma.ride.count(),

    prisma.booking.count(),

    prisma.trip.count(),

    prisma.payment.count(),

    prisma.payment.aggregate({
      where: {
        status: "COMPLETED",
      },

      _sum: {
        amount: true,
      },
    }),
  ]);

  return {
    users,
    organizations,
    vehicles,
    rides,
    bookings,
    trips,
    payments,
    revenue: revenue._sum.amount || 0,
  };
};


/**
 * Get active trips.
 */
exports.getActiveTrips = async (
  organizationId = null
) => {
  return prisma.trip.findMany({
    where: {
      status: "IN_PROGRESS",

      ...(organizationId && {
        ride: {
          organizationId,
        },
      }),
    },

    include: {
      ride: true,

      driver: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
    },

    orderBy: {
      startedAt: "desc",
    },
  });
};


/**
 * Get recently registered users.
 */
exports.getRecentUsers = async (
  limit = 10
) => {
  return prisma.user.findMany({
    take: limit,

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};


/**
 * Get recently created rides.
 */
exports.getRecentRides = async (
  limit = 10
) => {
  return prisma.ride.findMany({
    take: limit,

    include: {
      driver: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};


/**
 * Get system activity summary.
 */
exports.getActivitySummary = async () => {
  const [
    recentUsers,
    recentRides,
    activeTrips,
  ] = await Promise.all([
    getRecentUsers(10),
    getRecentRides(10),
    getActiveTrips(),
  ]);

  return {
    recentUsers,
    recentRides,
    activeTrips,
  };
};


/**
 * Get organization user count.
 */
exports.getOrganizationUserCount = async (
  organizationId
) => {
  return prisma.user.count({
    where: {
      organizationId,
    },
  });
};


/**
 * Get organization vehicle count.
 */
exports.getOrganizationVehicleCount =
  async (organizationId) => {
    return prisma.vehicle.count({
      where: {
        organizationId,
      },
    });
  };


/**
 * Get organization ride count.
 */
exports.getOrganizationRideCount =
  async (organizationId) => {
    return prisma.ride.count({
      where: {
        organizationId,
      },
    });
  };


/**
 * Get organization statistics.
 */
exports.getOrganizationStatistics =
  async (organizationId) => {
    const [
      users,
      vehicles,
      rides,
      bookings,
      trips,
      payments,
    ] = await Promise.all([
      getOrganizationUserCount(
        organizationId
      ),

      getOrganizationVehicleCount(
        organizationId
      ),

      getOrganizationRideCount(
        organizationId
      ),

      prisma.booking.count({
        where: {
          ride: {
            organizationId,
          },
        },
      }),

      prisma.trip.count({
        where: {
          ride: {
            organizationId,
          },
        },
      }),

      prisma.payment.count({
        where: {
          trip: {
            ride: {
              organizationId,
            },
          },
        },
      }),
    ]);

    return {
      users,
      vehicles,
      rides,
      bookings,
      trips,
      payments,
    };
  };