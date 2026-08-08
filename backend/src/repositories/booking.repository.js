// backend/src/repositories/booking.repository.js

const prisma = require("../config/database.js");

/**
 * Create a new booking
 */
exports.createBooking = async (bookingData) => {
  return prisma.booking.create({
    data: {
      rideId: bookingData.rideId,
      passengerId: bookingData.passengerId,
      seatsBooked: bookingData.seatsBooked,
      fare: bookingData.fare || 0,
      status: bookingData.status || "CONFIRMED",
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

      passenger: {
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
 * Find booking by ID
 */
exports.findBookingById = async (bookingId) => {
  return prisma.booking.findUnique({
    where: {
      id: bookingId,
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
          organization: true,
        },
      },

      passenger: {
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
 * Find a booking by passenger and ride
 */
exports.findBookingByPassengerAndRide = async (
  passengerId,
  rideId
) => {
  return prisma.booking.findFirst({
    where: {
      passengerId,
      rideId,
    },
  });
};

/**
 * Check whether passenger already has an active booking
 */
exports.hasActiveBooking = async (
  passengerId,
  rideId
) => {
  const booking = await prisma.booking.findFirst({
    where: {
      passengerId,
      rideId,

      status: {
        in: ["PENDING", "CONFIRMED"],
      },
    },

    select: {
      id: true,
      status: true,
    },
  });

  return Boolean(booking);
};

/**
 * Get all bookings made by a passenger
 */
exports.findBookingsByPassenger = async (
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
    passengerId,

    ...(status && {
      status,
    }),
  };

  const [bookings, total] = await prisma.$transaction([
    prisma.booking.findMany({
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

    prisma.booking.count({
      where,
    }),
  ]);

  return {
    bookings,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get all bookings for a ride
 */
exports.findBookingsByRide = async (rideId) => {
  return prisma.booking.findMany({
    where: {
      rideId,
    },

    include: {
      passenger: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },
    },

    orderBy: {
      createdAt: "asc",
    },
  });
};

/**
 * Get confirmed bookings for a ride
 */
exports.findConfirmedBookingsByRide = async (
  rideId
) => {
  return prisma.booking.findMany({
    where: {
      rideId,

      status: "CONFIRMED",
    },

    include: {
      passenger: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },
    },

    orderBy: {
      createdAt: "asc",
    },
  });
};

/**
 * Update booking
 */
exports.updateBooking = async (
  bookingId,
  updateData
) => {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },

    data: updateData,

    include: {
      ride: true,

      passenger: {
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
 * Update booking status
 */
exports.updateBookingStatus = async (
  bookingId,
  status
) => {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },

    data: {
      status,
    },
  });
};

/**
 * Cancel booking
 */
exports.cancelBooking = async (bookingId) => {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },

    data: {
      status: "CANCELLED",
    },
  });
};

/**
 * Confirm booking
 */
exports.confirmBooking = async (bookingId) => {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },

    data: {
      status: "CONFIRMED",
    },
  });
};

/**
 * Reject booking
 */
exports.rejectBooking = async (bookingId) => {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },

    data: {
      status: "REJECTED",
    },
  });
};

/**
 * Mark booking as completed
 */
exports.completeBooking = async (bookingId) => {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },

    data: {
      status: "COMPLETED",
    },
  });
};

/**
 * Count bookings for a ride
 */
exports.countBookingsByRide = async (rideId) => {
  return prisma.booking.count({
    where: {
      rideId,
    },
  });
};

/**
 * Count confirmed seats for a ride
 */
exports.countConfirmedSeats = async (rideId) => {
  const result = await prisma.booking.aggregate({
    where: {
      rideId,

      status: "CONFIRMED",
    },

    _sum: {
      seatsBooked: true,
    },
  });

  return result._sum.seatsBooked || 0;
};

/**
 * Get booking count for a passenger
 */
exports.countPassengerBookings = async (
  passengerId
) => {
  return prisma.booking.count({
    where: {
      passengerId,
    },
  });
};

/**
 * Get bookings for an organization
 */
exports.findOrganizationBookings = async (
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
    ride: {
      organizationId,
    },

    ...(status && {
      status,
    }),
  };

  const [bookings, total] = await prisma.$transaction([
    prisma.booking.findMany({
      where,

      skip,
      take: limit,

      include: {
        passenger: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },

        ride: {
          include: {
            driver: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.booking.count({
      where,
    }),
  ]);

  return {
    bookings,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Delete booking
 */
exports.deleteBooking = async (bookingId) => {
  return prisma.booking.delete({
    where: {
      id: bookingId,
    },
  });
};