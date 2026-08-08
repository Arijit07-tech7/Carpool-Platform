// backend/src/repositories/trip.repository.js

const prisma = require("../config/database.js");

/**
 * Create a trip from a confirmed ride/booking.
 */
exports.createTrip = async (tripData) => {
  return prisma.trip.create({
    data: {
      rideId: tripData.rideId,
      driverId: tripData.driverId,
      status: tripData.status || "SCHEDULED",

      startedAt: tripData.startedAt || null,
      completedAt: tripData.completedAt || null,

      startLatitude: tripData.startLatitude || null,
      startLongitude: tripData.startLongitude || null,

      endLatitude: tripData.endLatitude || null,
      endLongitude: tripData.endLongitude || null,
    },

    include: {
      ride: {
        include: {
          vehicle: true,
        },
      },

      driver: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },
    },
  });
};


/**
 * Find trip by ID.
 */
exports.findTripById = async (tripId) => {
  return prisma.trip.findUnique({
    where: {
      id: tripId,
    },

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

          vehicle: true,

          bookings: {
            where: {
              status: {
                in: ["CONFIRMED", "COMPLETED"],
              },
            },

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
      },

      driver: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },
    },
  });
};


/**
 * Find trip by ride ID.
 */
exports.findTripByRideId = async (rideId) => {
  return prisma.trip.findUnique({
    where: {
      rideId,
    },

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

          vehicle: true,

          bookings: {
            where: {
              status: {
                in: ["CONFIRMED", "COMPLETED"],
              },
            },

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
      },
    },
  });
};


/**
 * Check whether a trip already exists for a ride.
 */
exports.tripExistsForRide = async (rideId) => {
  const trip = await prisma.trip.findUnique({
    where: {
      rideId,
    },

    select: {
      id: true,
    },
  });

  return Boolean(trip);
};


/**
 * Start a trip.
 */
exports.startTrip = async (
  tripId,
  startData = {}
) => {
  return prisma.trip.update({
    where: {
      id: tripId,
    },

    data: {
      status: "IN_PROGRESS",

      startedAt: startData.startedAt || new Date(),

      startLatitude:
        startData.startLatitude || null,

      startLongitude:
        startData.startLongitude || null,
    },

    include: {
      ride: true,
    },
  });
};


/**
 * Complete a trip.
 */
exports.completeTrip = async (
  tripId,
  endData = {}
) => {
  return prisma.trip.update({
    where: {
      id: tripId,
    },

    data: {
      status: "COMPLETED",

      completedAt:
        endData.completedAt || new Date(),

      endLatitude:
        endData.endLatitude || null,

      endLongitude:
        endData.endLongitude || null,
    },

    include: {
      ride: true,
    },
  });
};


/**
 * Cancel a trip.
 */
exports.cancelTrip = async (tripId) => {
  return prisma.trip.update({
    where: {
      id: tripId,
    },

    data: {
      status: "CANCELLED",
    },

    include: {
      ride: true,
    },
  });
};


/**
 * Update trip status.
 */
exports.updateTripStatus = async (
  tripId,
  status
) => {
  return prisma.trip.update({
    where: {
      id: tripId,
    },

    data: {
      status,
    },
  });
};


/**
 * Update trip information.
 */
exports.updateTrip = async (
  tripId,
  updateData
) => {
  return prisma.trip.update({
    where: {
      id: tripId,
    },

    data: updateData,
  });
};


/**
 * Find trips belonging to a driver.
 */
exports.findTripsByDriver = async (
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

  const [trips, total] =
    await prisma.$transaction([
      prisma.trip.findMany({
        where,

        skip,
        take: limit,

        include: {
          ride: {
            include: {
              vehicle: true,

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
 * Find trips for a passenger.
 *
 * Passenger is connected to a trip
 * through the ride -> booking relationship.
 */
exports.findTripsByPassenger = async (
  passengerId,
  options = {}
) => {
  const {
    page = 1,
    limit = 20,
    status,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    ride: {
      bookings: {
        some: {
          passengerId,
          status: {
            in: ["CONFIRMED", "COMPLETED"],
          },
        },
      },
    },

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

              vehicle: true,
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
 * Find active trips.
 *
 * Used for live trip tracking.
 */
exports.findActiveTrips = async (
  organizationId
) => {
  return prisma.trip.findMany({
    where: {
      status: "IN_PROGRESS",

      ride: {
        organizationId,
      },
    },

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

          vehicle: true,
        },
      },
    },

    orderBy: {
      startedAt: "desc",
    },
  });
};


/**
 * Get trip count for an organization.
 */
exports.countOrganizationTrips = async (
  organizationId
) => {
  return prisma.trip.count({
    where: {
      ride: {
        organizationId,
      },
    },
  });
};


/**
 * Get completed trips for an organization.
 */
exports.findCompletedTripsByOrganization =
  async (
    organizationId,
    options = {}
  ) => {
    const {
      page = 1,
      limit = 20,
    } = options;

    const skip = (page - 1) * limit;

    const where = {
      status: "COMPLETED",

      ride: {
        organizationId,
      },
    };

    const [trips, total] =
      await prisma.$transaction([
        prisma.trip.findMany({
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
                  },
                },

                vehicle: true,
              },
            },
          },

          orderBy: {
            completedAt: "desc",
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
 * Check whether trip belongs to driver.
 */
exports.tripBelongsToDriver = async (
  tripId,
  driverId
) => {
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      driverId,
    },

    select: {
      id: true,
    },
  });

  return Boolean(trip);
};


/**
 * Delete a trip.
 */
exports.deleteTrip = async (tripId) => {
  return prisma.trip.delete({
    where: {
      id: tripId,
    },
  });
};