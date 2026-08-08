// backend/src/services/booking.service.js

import * as bookingRepository from "../repositories/booking.repository.js";
import * as rideRepository from "../repositories/ride.repository.js";
import * as organizationRepository from "../repositories/organization.repository.js";


/**
 * Check whether the passenger belongs
 * to the ride's organization.
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
 * Book seats on a ride.
 */
export const createBooking = async (
  userId,
  organizationId,
  bookingData
) => {
  const {
    rideId,
    seats = 1,
  } = bookingData;

  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  if (!organizationId) {
    throw new Error(
      "Organization ID is required."
    );
  }

  if (!rideId) {
    throw new Error(
      "Ride ID is required."
    );
  }

  const seatCount = Number(seats);

  if (
    !Number.isInteger(seatCount) ||
    seatCount <= 0
  ) {
    throw new Error(
      "Seats must be a positive integer."
    );
  }

  // Verify passenger organization.
  await verifyOrganizationMembership(
    userId,
    organizationId
  );

  // Find ride.
  const ride =
    await rideRepository.findRideById(
      rideId
    );

  if (!ride) {
    throw new Error(
      "Ride not found."
    );
  }

  // Prevent cross-organization booking.
  if (
    ride.organizationId !== organizationId
  ) {
    throw new Error(
      "You cannot book a ride from another organization."
    );
  }

  // Driver cannot book their own ride.
  if (
    ride.driverId === userId
  ) {
    throw new Error(
      "Driver cannot book their own ride."
    );
  }

  // Ride must be available.
  if (
    ride.status !== "PUBLISHED"
  ) {
    throw new Error(
      "This ride is not available for booking."
    );
  }

  // Check available seats.
  if (
    Number(ride.availableSeats) <
    seatCount
  ) {
    throw new Error(
      "Not enough seats available."
    );
  }

  // Prevent duplicate active booking.
  const existingBooking =
    await bookingRepository.findActiveBooking(
      rideId,
      userId
    );

  if (existingBooking) {
    throw new Error(
      "You already have an active booking for this ride."
    );
  }

  /*
   * Calculate booking amount.
   *
   * If ride.fare represents the price
   * per seat:
   */
  const totalAmount =
    Number(ride.fare || 0) *
    seatCount;

  const booking =
    await bookingRepository.createBooking({
      rideId,
      passengerId: userId,
      seats: seatCount,
      amount: totalAmount,
      status: "CONFIRMED",
    });

  /*
   * Reduce available seats only after
   * successful booking creation.
   */
  await rideRepository.decreaseAvailableSeats(
    rideId,
    seatCount
  );

  return booking;
};


/**
 * Get booking by ID.
 */
export const getBookingById = async (
  bookingId,
  userId,
  organizationId
) => {
  if (!bookingId) {
    throw new Error(
      "Booking ID is required."
    );
  }

  const booking =
    await bookingRepository.findBookingById(
      bookingId
    );

  if (!booking) {
    throw new Error(
      "Booking not found."
    );
  }

  if (
    organizationId &&
    booking.ride?.organizationId !==
      organizationId
  ) {
    throw new Error(
      "You cannot access this booking."
    );
  }

  const isPassenger =
    booking.passengerId === userId;

  const isDriver =
    booking.ride?.driverId === userId;

  if (
    !isPassenger &&
    !isDriver
  ) {
    throw new Error(
      "You are not authorized to access this booking."
    );
  }

  return booking;
};


/**
 * Get passenger's bookings.
 */
export const getMyBookings = async (
  userId,
  options = {}
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  return bookingRepository.getBookingsByPassenger(
    userId,
    options
  );
};


/**
 * Get bookings for a driver's ride.
 */
export const getRideBookings = async (
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
      "Only the driver can view passenger bookings."
    );
  }

  return bookingRepository.getBookingsByRide(
    rideId
  );
};


/**
 * Cancel a passenger booking.
 */
export const cancelBooking = async (
  userId,
  bookingId
) => {
  const booking =
    await bookingRepository.findBookingById(
      bookingId
    );

  if (!booking) {
    throw new Error(
      "Booking not found."
    );
  }

  if (
    booking.passengerId !== userId
  ) {
    throw new Error(
      "You can only cancel your own booking."
    );
  }

  if (
    ["CANCELLED", "COMPLETED"]
      .includes(booking.status)
  ) {
    throw new Error(
      "This booking cannot be cancelled."
    );
  }

  const updatedBooking =
    await bookingRepository.updateBooking(
      bookingId,
      {
        status: "CANCELLED",
        cancelledAt: new Date(),
      }
    );

  // Return seats to the ride.
  await rideRepository.increaseAvailableSeats(
    booking.rideId,
    Number(booking.seats)
  );

  return updatedBooking;
};


/**
 * Confirm a pending booking.
 *
 * Useful if the platform later supports
 * driver approval.
 */
export const confirmBooking = async (
  userId,
  bookingId
) => {
  const booking =
    await bookingRepository.findBookingById(
      bookingId
    );

  if (!booking) {
    throw new Error(
      "Booking not found."
    );
  }

  if (
    booking.ride?.driverId !== userId
  ) {
    throw new Error(
      "Only the ride driver can confirm this booking."
    );
  }

  if (
    booking.status !== "PENDING"
  ) {
    throw new Error(
      "Only pending bookings can be confirmed."
    );
  }

  return bookingRepository.updateBooking(
    bookingId,
    {
      status: "CONFIRMED",
      confirmedAt: new Date(),
    }
  );
};


/**
 * Reject a booking.
 */
export const rejectBooking = async (
  userId,
  bookingId
) => {
  const booking =
    await bookingRepository.findBookingById(
      bookingId
    );

  if (!booking) {
    throw new Error(
      "Booking not found."
    );
  }

  if (
    booking.ride?.driverId !== userId
  ) {
    throw new Error(
      "Only the ride driver can reject this booking."
    );
  }

  if (
    ["CANCELLED", "REJECTED", "COMPLETED"]
      .includes(booking.status)
  ) {
    throw new Error(
      "This booking cannot be rejected."
    );
  }

  const updatedBooking =
    await bookingRepository.updateBooking(
      bookingId,
      {
        status: "REJECTED",
        rejectedAt: new Date(),
      }
    );

  // If seats were reserved for the
  // booking, return them.
  await rideRepository.increaseAvailableSeats(
    booking.rideId,
    Number(booking.seats)
  );

  return updatedBooking;
};


/**
 * Get active bookings for passenger.
 */
export const getActiveBookings = async (
  userId
) => {
  return bookingRepository.getActiveBookingsByPassenger(
    userId
  );
};


/**
 * Get completed bookings for passenger.
 */
export const getCompletedBookings = async (
  userId
) => {
  return bookingRepository.getCompletedBookingsByPassenger(
    userId
  );
};


/**
 * Check whether passenger can book
 * a particular ride.
 */
export const canBookRide = async (
  userId,
  organizationId,
  rideId,
  seats = 1
) => {
  try {
    await verifyOrganizationMembership(
      userId,
      organizationId
    );

    const ride =
      await rideRepository.findRideById(
        rideId
      );

    if (!ride) {
      return {
        allowed: false,
        reason: "Ride not found.",
      };
    }

    if (
      ride.organizationId !== organizationId
    ) {
      return {
        allowed: false,
        reason:
          "Ride belongs to another organization.",
      };
    }

    if (
      ride.driverId === userId
    ) {
      return {
        allowed: false,
        reason:
          "Driver cannot book their own ride.",
      };
    }

    if (
      ride.status !== "PUBLISHED"
    ) {
      return {
        allowed: false,
        reason:
          "Ride is not available.",
      };
    }

    if (
      Number(ride.availableSeats) <
      Number(seats)
    ) {
      return {
        allowed: false,
        reason:
          "Not enough seats available.",
      };
    }

    const existingBooking =
      await bookingRepository.findActiveBooking(
        rideId,
        userId
      );

    if (existingBooking) {
      return {
        allowed: false,
        reason:
          "You already booked this ride.",
      };
    }

    return {
      allowed: true,
      availableSeats:
        ride.availableSeats,
      estimatedAmount:
        Number(ride.fare || 0) *
        Number(seats),
    };

  } catch (error) {
    return {
      allowed: false,
      reason: error.message,
    };
  }
};


/**
 * Get booking statistics for a passenger.
 */
export const getBookingStatistics = async (
  userId
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  return bookingRepository.getBookingStatistics(
    userId
  );
};