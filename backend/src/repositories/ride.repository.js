// backend/src/repositories/ride.repository.js

const prisma = require("../config/database.js");

/**
 * Create a new ride
 */
exports.createRide = async (rideData) => {
  return prisma.ride.create({
    data: {
      driverId: rideData.driverId,
      organizationId: rideData.organizationId,

      vehicleId: rideData.vehicleId,

      source: rideData.source,
      destination: rideData.destination,

      departureTime: rideData.departureTime,

      availableSeats: rideData.availableSeats,
      totalSeats: rideData.totalSeats,

      farePerSeat: rideData.farePerSeat || 0,

      distance: rideData.distance || null,
      estimatedDuration: rideData.estimatedDuration || null,

      routeData: rideData.routeData || null,

      status: rideData.status || "PUBLISHED",
    },
    include: {
      driver: {
        select: {
          id: true,
          name: true,
          phone: true,
          profileImage: true,
        },
      },
      vehicle: true,
    },
  });
};

/**
 * Find ride by ID
 */
exports.findRideById = async (rideId) => {
  return prisma.ride.findUnique({
    where: {
      id: rideId,
    },
    include: {
      driver: {
        select: {
          id: true,
          name: true,
          phone: true,
          profileImage: true,
          role: true,
        },
      },

      vehicle: true,

      organization: true,

      bookings: {
        include: {
          passenger: {
            select: {
              id: true,
              name: true,
              phone: true,
              profileImage: true,
            },
          },
        },
      },
    },
  });
};

/**
 * Find rides created by a particular driver
 */
exports.findRidesByDriver = async (
  driverId,
  options = {}
) => {
  const {
    page = 1,
    limit = 20,
    status,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    driverId,

    ...(status && {
      status,
    }),
  };

  const [rides, total] = await prisma.$transaction([
    prisma.ride.findMany({
      where,
      skip,
      take: limit,

      include: {
        vehicle: true,

        bookings: {
          select: {
            id: true,
            passengerId: true,
            seatsBooked: true,
            status: true,
          },
        },
      },

      orderBy: {
        departureTime: "desc",
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
 * Search available rides
 */
exports.searchRides = async ({
  organizationId,
  source,
  destination,
  departureDate,
  minSeats = 1,
  page = 1,
  limit = 20,
}) => {
  const skip = (page - 1) * limit;

  const where = {
    ...(organizationId ? { organizationId } : {}),

    status: "PUBLISHED",

    availableSeats: {
      gte: minSeats,
    },

    ...(source && {
      source: {
        contains: source,
        mode: "insensitive",
      },
    }),

    ...(destination && {
      destination: {
        contains: destination,
        mode: "insensitive",
      },
    }),

    ...(departureDate && {
      departureTime: {
        gte: departureDate.start,
        lt: departureDate.end,
      },
    }),
  };

  const [rides, total] = await prisma.$transaction([
    prisma.ride.findMany({
      where,
      skip,
      take: limit,

      include: {
        driver: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            phone: true,
          },
        },

        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            color: true,
            vehicleType: true,
            seatingCapacity: true,
          },
        },
      },

      orderBy: {
        departureTime: "asc",
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
 * Find upcoming rides for an organization
 */
exports.findUpcomingRides = async (
  organizationId,
  limit = 20
) => {
  return prisma.ride.findMany({
    where: {
      ...(organizationId ? { organizationId } : {}),

      status: "PUBLISHED",

      departureTime: {
        gte: new Date(),
      },
    },

    include: {
      driver: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },

      vehicle: true,
    },

    orderBy: {
      departureTime: "asc",
    },

    take: limit,
  });
};

/**
 * Update ride information
 */
exports.updateRide = async (
  rideId,
  updateData
) => {
  return prisma.ride.update({
    where: {
      id: rideId,
    },

    data: updateData,

    include: {
      driver: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },

      vehicle: true,
    },
  });
};

/**
 * Update available seats
 */
exports.updateAvailableSeats = async (
  rideId,
  availableSeats
) => {
  return prisma.ride.update({
    where: {
      id: rideId,
    },

    data: {
      availableSeats,
    },
  });
};

/**
 * Decrease available seats after booking
 */
exports.decreaseAvailableSeats = async (
  rideId,
  seats
) => {
  return prisma.ride.updateMany({
    where: {
      id: rideId,

      status: "PUBLISHED",

      availableSeats: {
        gte: seats,
      },
    },

    data: {
      availableSeats: {
        decrement: seats,
      },
    },
  });
};

/**
 * Increase available seats after booking cancellation
 */
exports.increaseAvailableSeats = async (
  rideId,
  seats
) => {
  return prisma.ride.update({
    where: {
      id: rideId,
    },

    data: {
      availableSeats: {
        increment: seats,
      },
    },
  });
};

/**
 * Update ride status
 */
exports.updateRideStatus = async (
  rideId,
  status
) => {
  return prisma.ride.update({
    where: {
      id: rideId,
    },

    data: {
      status,
    },
  });
};

/**
 * Cancel a ride
 */
exports.cancelRide = async (rideId) => {
  return prisma.ride.update({
    where: {
      id: rideId,
    },

    data: {
      status: "CANCELLED",
    },
  });
};

/**
 * Check whether a ride belongs to a driver
 */
exports.rideBelongsToDriver = async (
  rideId,
  driverId
) => {
  const ride = await prisma.ride.findFirst({
    where: {
      id: rideId,
      driverId,
    },

    select: {
      id: true,
    },
  });

  return Boolean(ride);
};

/**
 * Get ride count for an organization
 */
exports.countOrganizationRides = async (
  organizationId
) => {
  return prisma.ride.count({
    where: {
      organizationId,
    },
  });
};

/**
 * Get rides by organization
 */
exports.findRidesByOrganization = async (
  organizationId,
  options = {}
) => {
  const {
    page = 1,
    limit = 20,
    status,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    organizationId,

    ...(status && {
      status,
    }),
  };

  const [rides, total] = await prisma.$transaction([
    prisma.ride.findMany({
      where,

      skip,
      take: limit,

      include: {
        driver: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },

        vehicle: true,
      },

      orderBy: {
        departureTime: "desc",
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
 * Delete a ride
 */
exports.deleteRide = async (rideId) => {
  return prisma.ride.delete({
    where: {
      id: rideId,
    },
  });
};