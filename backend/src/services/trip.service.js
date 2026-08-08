// backend/src/services/trip.service.js

const tripRepository = require("../repositories/trip.repository.js");
const rideRepository = require("../repositories/ride.repository.js");
const bookingRepository = require("../repositories/booking.repository.js");
const organizationRepository = require("../repositories/organization.repository.js");


/**
 * Verify that a user belongs to an organization.
 */
const verifyOrganizationMembership = async (
  userId,
  organizationId
) => {
  const isMember =
    await organizationRepository.isOrganizationMember(
      organizationId,
      userId
    );

  if (!isMember) {
    throw new Error(
      "You do not belong to this organization."
    );
  }

  return true;
};


/**
 * Get ride and verify that the driver
 * owns the ride.
 */
const verifyRideDriver = async (
  userId,
  rideId
) => {
  const ride =
    await rideRepository.findRideById(
      rideId
    );

  if (!ride) {
    throw new Error(
      "Ride not found."
    );
  }

  if (
    ride.driverId !== userId
  ) {
    throw new Error(
      "Only the ride driver can perform this action."
    );
  }

  return ride;
};


/**
 * Create a trip from a confirmed ride.
 */
exports.createTrip = async (
  userId,
  rideId,
  organizationId
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  if (!rideId) {
    throw new Error(
      "Ride ID is required."
    );
  }

  if (!organizationId) {
    throw new Error(
      "Organization ID is required."
    );
  }

  await verifyOrganizationMembership(
    userId,
    organizationId
  );

  const ride =
    await verifyRideDriver(
      userId,
      rideId
    );

  if (
    ride.organizationId !== organizationId
  ) {
    throw new Error(
      "Ride belongs to another organization."
    );
  }

  if (
    ["CANCELLED", "COMPLETED"]
      .includes(ride.status)
  ) {
    throw new Error(
      "Trip cannot be created for this ride."
    );
  }

  // Prevent duplicate trips.
  const existingTrip =
    await tripRepository.findTripByRideId(
      rideId
    );

  if (existingTrip) {
    return existingTrip;
  }

  const confirmedBookings =
    await bookingRepository.getConfirmedBookingsByRide(
      rideId
    );

  if (
    !confirmedBookings ||
    confirmedBookings.length === 0
  ) {
    throw new Error(
      "A trip cannot start without a confirmed booking."
    );
  }

  const trip =
    await tripRepository.createTrip({
      rideId,
      driverId: userId,
      organizationId,
      status: "SCHEDULED",
      scheduledStartTime:
        ride.departureTime,
    });

  return trip;
};


/**
 * Get trip by ID.
 */
exports.getTripById = async (
  userId,
  tripId
) => {
  if (!tripId) {
    throw new Error(
      "Trip ID is required."
    );
  }

  const trip =
    await tripRepository.findTripById(
      tripId
    );

  if (!trip) {
    throw new Error(
      "Trip not found."
    );
  }

  const isDriver =
    trip.driverId === userId;

  const isPassenger =
    trip.bookings?.some(
      (booking) =>
        booking.passengerId === userId
    );

  if (
    !isDriver &&
    !isPassenger
  ) {
    throw new Error(
      "You are not authorized to access this trip."
    );
  }

  return trip;
};


/**
 * Get driver's trips.
 */
exports.getDriverTrips = async (
  userId,
  options = {}
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  return tripRepository.getTripsByDriver(
    userId,
    options
  );
};


/**
 * Get passenger's trips.
 */
exports.getPassengerTrips = async (
  userId,
  options = {}
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  return tripRepository.getTripsByPassenger(
    userId,
    options
  );
};


/**
 * Start a trip.
 */
exports.startTrip = async (
  userId,
  tripId
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  const trip =
    await tripRepository.findTripById(
      tripId
    );

  if (!trip) {
    throw new Error(
      "Trip not found."
    );
  }

  if (
    trip.driverId !== userId
  ) {
    throw new Error(
      "Only the driver can start the trip."
    );
  }

  if (
    trip.status === "IN_PROGRESS"
  ) {
    throw new Error(
      "Trip is already in progress."
    );
  }

  if (
    trip.status === "COMPLETED"
  ) {
    throw new Error(
      "Completed trip cannot be started again."
    );
  }

  if (
    trip.status === "CANCELLED"
  ) {
    throw new Error(
      "Cancelled trip cannot be started."
    );
  }

  const startedAt =
    new Date();

  const updatedTrip =
    await tripRepository.updateTrip(
      tripId,
      {
        status: "IN_PROGRESS",
        startedAt,
      }
    );

  // Update associated ride status.
  await rideRepository.updateRide(
    trip.rideId,
    {
      status: "ACTIVE",
    }
  );

  return updatedTrip;
};


/**
 * Complete a trip.
 */
exports.completeTrip = async (
  userId,
  tripId
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  const trip =
    await tripRepository.findTripById(
      tripId
    );

  if (!trip) {
    throw new Error(
      "Trip not found."
    );
  }

  if (
    trip.driverId !== userId
  ) {
    throw new Error(
      "Only the driver can complete the trip."
    );
  }

  if (
    trip.status !== "IN_PROGRESS"
  ) {
    throw new Error(
      "Only an active trip can be completed."
    );
  }

  const completedAt =
    new Date();

  const updatedTrip =
    await tripRepository.updateTrip(
      tripId,
      {
        status: "COMPLETED",
        completedAt,
      }
    );

  // Mark ride as completed.
  await rideRepository.updateRide(
    trip.rideId,
    {
      status: "COMPLETED",
    }
  );

  // Mark confirmed bookings as completed.
  await bookingRepository.completeBookingsForTrip(
    trip.rideId
  );

  return updatedTrip;
};


/**
 * Cancel a trip.
 */
exports.cancelTrip = async (
  userId,
  tripId,
  reason = null
) => {
  const trip =
    await tripRepository.findTripById(
      tripId
    );

  if (!trip) {
    throw new Error(
      "Trip not found."
    );
  }

  if (
    trip.driverId !== userId
  ) {
    throw new Error(
      "Only the driver can cancel the trip."
    );
  }

  if (
    ["COMPLETED", "CANCELLED"]
      .includes(trip.status)
  ) {
    throw new Error(
      "This trip cannot be cancelled."
    );
  }

  const updatedTrip =
    await tripRepository.updateTrip(
      tripId,
      {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancellationReason:
          reason,
      }
    );

  await rideRepository.updateRide(
    trip.rideId,
    {
      status: "CANCELLED",
    }
  );

  await bookingRepository.cancelBookingsForTrip(
    trip.rideId
  );

  return updatedTrip;
};


/**
 * Get active trip for a user.
 */
exports.getActiveTrip = async (
  userId
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  return tripRepository.findActiveTripForUser(
    userId
  );
};


/**
 * Get upcoming trips.
 */
exports.getUpcomingTrips = async (
  userId,
  options = {}
) => {
  return tripRepository.getUpcomingTripsForUser(
    userId,
    options
  );
};


/**
 * Get completed trips.
 */
exports.getCompletedTrips = async (
  userId,
  options = {}
) => {
  return tripRepository.getCompletedTripsForUser(
    userId,
    options
  );
};


/**
 * Get trip passengers.
 */
exports.getTripPassengers = async (
  userId,
  tripId
) => {
  const trip =
    await tripRepository.findTripById(
      tripId
    );

  if (!trip) {
    throw new Error(
      "Trip not found."
    );
  }

  if (
    trip.driverId !== userId
  ) {
    throw new Error(
      "Only the driver can view trip passengers."
    );
  }

  return bookingRepository.getConfirmedBookingsByRide(
    trip.rideId
  );
};


/**
 * Get trip status.
 */
exports.getTripStatus = async (
  userId,
  tripId
) => {
  const trip =
    await getTripById(
      userId,
      tripId
    );

  return {
    tripId: trip.id,
    status: trip.status,
    startedAt:
      trip.startedAt || null,
    completedAt:
      trip.completedAt || null,
  };
};


/**
 * Check whether trip can be started.
 */
exports.canStartTrip = async (
  userId,
  tripId
) => {
  try {
    const trip =
      await tripRepository.findTripById(
        tripId
      );

    if (!trip) {
      return {
        allowed: false,
        reason: "Trip not found.",
      };
    }

    if (
      trip.driverId !== userId
    ) {
      return {
        allowed: false,
        reason:
          "Only the driver can start the trip.",
      };
    }

    if (
      trip.status !== "SCHEDULED"
    ) {
      return {
        allowed: false,
        reason:
          "Trip is not in a startable state.",
      };
    }

    return {
      allowed: true,
    };

  } catch (error) {
    return {
      allowed: false,
      reason: error.message,
    };
  }
};


/**
 * Check whether trip can be completed.
 */
exports.canCompleteTrip = async (
  userId,
  tripId
) => {
  try {
    const trip =
      await tripRepository.findTripById(
        tripId
      );

    if (!trip) {
      return {
        allowed: false,
        reason: "Trip not found.",
      };
    }

    if (
      trip.driverId !== userId
    ) {
      return {
        allowed: false,
        reason:
          "Only the driver can complete the trip.",
      };
    }

    if (
      trip.status !== "IN_PROGRESS"
    ) {
      return {
        allowed: false,
        reason:
          "Only an active trip can be completed.",
      };
    }

    return {
      allowed: true,
    };

  } catch (error) {
    return {
      allowed: false,
      reason: error.message,
    };
  }
};