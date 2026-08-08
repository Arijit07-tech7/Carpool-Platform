// backend/src/repositories/booking.repository.js

import prisma from "../config/database.js";

/**
 * Create a new booking
 */
export const createBooking = async (bookingData) => {
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
export const findBookingById = async (bookingId) => {
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
export const findBookingByPassengerAndRide = async (
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
export const hasActiveBooking = async (
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
export const findBookingsByPassenger = async (
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
export const findBookingsByRide = async (rideId) => {
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
export const findConfirmedBookingsByRide = async (
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
export const updateBooking = async (
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
export const updateBookingStatus = async (
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
export const cancelBooking = async (bookingId) => {
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
export const confirmBooking = async (bookingId) => {
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
export const rejectBooking = async (bookingId) => {
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
export const completeBooking = async (bookingId) => {
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
export const countBookingsByRide = async (rideId) => {
  return prisma.booking.count({
    where: {
      rideId,
    },
  });
};

/**
 * Count confirmed seats for a ride
 */
export const countConfirmedSeats = async (rideId) => {
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
export const countPassengerBookings = async (
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
export const findOrganizationBookings = async (
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
export const deleteBooking = async (bookingId) => {
  return prisma.booking.delete({
    where: {
      id: bookingId,
    },
  });
};