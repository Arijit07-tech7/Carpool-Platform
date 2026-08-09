// backend/src/services/ride.service.js

const rideRepository = require("../repositories/ride.repository.js");
const vehicleRepository = require("../repositories/vehicle.repository.js");
const organizationRepository = require("../repositories/organization.repository.js");

const {
  calculateFare,
} = require("../utils/calculate-fare.js");

const {
  calculateDistance,
} = require("../utils/calculate-distance.js");


/**
 * Create / publish a new ride.
 *
 * Driver must:
 * - be authenticated
 * - belong to an organization
 * - have a registered vehicle
 * - provide source and destination
 * - have available seats
 */
exports.createRide = async (
  userId,
  organizationId,
  rideData
) => {
  const {
    vehicleId,
    source,
    destination,
    departureTime,
    availableSeats,
    distance,
    fare,
    route,
    notes,
  } = rideData;

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

  if (!source || !source.trim()) {
    throw new Error(
      "Source is required."
    );
  }

  if (
    !destination ||
    !destination.trim()
  ) {
    throw new Error(
      "Destination is required."
    );
  }

  if (!departureTime) {
    throw new Error(
      "Departure time is required."
    );
  }

  if (!vehicleId) {
    throw new Error(
      "A registered vehicle is required to publish a ride."
    );
  }

  if (
    !availableSeats ||
    Number(availableSeats) <= 0
  ) {
    throw new Error(
      "Available seats must be greater than zero."
    );
  }

  // Verify organization membership.
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

  // Verify vehicle.
  const vehicle =
    await vehicleRepository.findVehicleById(
      vehicleId
    );

  if (!vehicle) {
    throw new Error(
      "Vehicle not found."
    );
  }

  // Vehicle must belong to this driver.
  if (
    vehicle.userId !== userId
  ) {
    throw new Error(
      "This vehicle does not belong to you."
    );
  }

  // Vehicle must belong to the same organization.
  if (
    vehicle.organizationId &&
    vehicle.organizationId !== organizationId
  ) {
    throw new Error(
      "Vehicle does not belong to this organization."
    );
  }

  // Check vehicle capacity.
  if (
    Number(availableSeats) >
    Number(vehicle.seatingCapacity)
  ) {
    throw new Error(
      "Available seats cannot exceed vehicle capacity."
    );
  }

  // Departure time validation.
  const departureDate =
    new Date(departureTime);

  if (
    Number.isNaN(
      departureDate.getTime()
    )
  ) {
    throw new Error(
      "Invalid departure time."
    );
  }

  if (
    departureDate <= new Date()
  ) {
    throw new Error(
      "Departure time must be in the future."
    );
  }

  // Calculate distance if it was not
  // provided by the frontend.
  let calculatedDistance =
    distance || null;

  if (
    !calculatedDistance &&
    source &&
    destination
  ) {
    try {
      calculatedDistance =
        await calculateDistance(
          source,
          destination
        );
    } catch (error) {
      calculatedDistance = null;
    }
  }

  // Calculate fare if frontend did
  // not provide one.
  let calculatedFare =
    fare || null;

  if (
    !calculatedFare &&
    calculatedDistance
  ) {
    calculatedFare =
      calculateFare(
        calculatedDistance
      );
  }

  const ride =
    await rideRepository.createRide({
      driverId: userId,
      organizationId,

      vehicleId,

      source: source.trim(),
      destination: destination.trim(),

      departureTime: departureDate,

      availableSeats:
        Number(availableSeats),

      distance:
        calculatedDistance,

      fare:
        calculatedFare,

      route:
        route || null,

      notes:
        notes || null,

      status: "PUBLISHED",
    });

  return ride;
};


/**
 * Find available rides.
 */
exports.findRides = async (
  organizationId,
  searchData = {}
) => {
  if (!organizationId) {
    throw new Error(
      "Organization ID is required."
    );
  }

  const {
    source,
    destination,
    date,
    seats = 1,
    page = 1,
    limit = 20,
  } = searchData;

  if (!source || !source.trim()) {
    throw new Error(
      "Source is required."
    );
  }

  if (
    !destination ||
    !destination.trim()
  ) {
    throw new Error(
      "Destination is required."
    );
  }

  if (
    Number(seats) <= 0
  ) {
    throw new Error(
      "Seat count must be greater than zero."
    );
  }

  return rideRepository.searchRides({
    organizationId,

    source: source.trim(),
    destination: destination.trim(),

    date: date || null,

    seats: Number(seats),

    page: Number(page),
    limit: Number(limit),
  });
};


/**
 * Get ride by ID.
 */
exports.getRideById = async (
  rideId,
  organizationId
) => {
  if (!rideId) {
    throw new Error(
      "Ride ID is required."
    );
  }

  const ride =
    await rideRepository.findRideById(
      rideId
    );

  if (!ride) {
    throw new Error(
      "Ride not found."
    );
  }

  // Prevent cross-organization access.
  if (
    organizationId &&
    ride.organizationId !== organizationId
  ) {
    throw new Error(
      "You cannot access this ride."
    );
  }

  return ride;
};


/**
 * Get rides offered by a driver.
 */
exports.getDriverRides = async (
  userId,
  options = {}
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  return rideRepository.getRidesByDriver(
    userId,
    options
  );
};


/**
 * Update a ride.
 */
exports.updateRide = async (
  userId,
  rideId,
  updateData
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

  // Only the driver who created the
  // ride can update it.
  if (
    ride.driverId !== userId
  ) {
    throw new Error(
      "You are not allowed to update this ride."
    );
  }

  // Do not allow modification after
  // trip has started/completed.
  if (
    ["ACTIVE", "COMPLETED"]
      .includes(ride.status)
  ) {
    throw new Error(
      "This ride can no longer be modified."
    );
  }

  const allowedFields = [
    "source",
    "destination",
    "departureTime",
    "availableSeats",
    "fare",
    "route",
    "notes",
  ];

  const filteredData = {};

  for (const field of allowedFields) {
    if (
      updateData[field] !== undefined
    ) {
      filteredData[field] =
        updateData[field];
    }
  }

  if (
    filteredData.departureTime
  ) {
    const departureDate =
      new Date(
        filteredData.departureTime
      );

    if (
      Number.isNaN(
        departureDate.getTime()
      )
    ) {
      throw new Error(
        "Invalid departure time."
      );
    }

    if (
      departureDate <= new Date()
    ) {
      throw new Error(
        "Departure time must be in the future."
      );
    }

    filteredData.departureTime =
      departureDate;
  }

  if (
    filteredData.availableSeats !==
    undefined
  ) {
    const vehicle =
      await vehicleRepository.findVehicleById(
        ride.vehicleId
      );

    if (
      Number(
        filteredData.availableSeats
      ) >
      Number(vehicle.seatingCapacity)
    ) {
      throw new Error(
        "Available seats cannot exceed vehicle capacity."
      );
    }

    if (
      Number(
        filteredData.availableSeats
      ) <= 0
    ) {
      throw new Error(
        "Available seats must be greater than zero."
      );
    }

    filteredData.availableSeats =
      Number(
        filteredData.availableSeats
      );
  }

  return rideRepository.updateRide(
    rideId,
    filteredData
  );
};


/**
 * Cancel a ride.
 */
exports.cancelRide = async (
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
      "You are not allowed to cancel this ride."
    );
  }

  if (
    ["COMPLETED", "CANCELLED"]
      .includes(ride.status)
  ) {
    throw new Error(
      "This ride cannot be cancelled."
    );
  }

  return rideRepository.updateRide(
    rideId,
    {
      status: "CANCELLED",
    }
  );
};


/**
 * Get available seats.
 */
exports.getAvailableSeats = async (
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

  return {
    rideId,
    availableSeats:
      ride.availableSeats,
  };
};


/**
 * Confirm route information.
 */
exports.confirmRoute = async (
  userId,
  rideId,
  routeData
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
      "Only the driver can confirm the route."
    );
  }

  const {
    source,
    destination,
    route,
    distance,
  } = routeData;

  if (
    !source ||
    !destination
  ) {
    throw new Error(
      "Source and destination are required."
    );
  }

  return rideRepository.updateRide(
    rideId,
    {
      source,
      destination,
      route: route || null,
      distance: distance || null,
    }
  );
};


/**
 * Check whether a user can publish
 * a ride.
 */
exports.canPublishRide = async (
  userId,
  organizationId,
  vehicleId
) => {
  if (
    !userId ||
    !organizationId ||
    !vehicleId
  ) {
    return {
      allowed: false,
      reason:
        "User, organization and vehicle are required.",
    };
  }

  const member =
    await organizationRepository.isOrganizationMember(
      organizationId,
      userId
    );

  if (!member) {
    return {
      allowed: false,
      reason:
        "User is not a member of this organization.",
    };
  }

  const vehicle =
    await vehicleRepository.findVehicleById(
      vehicleId
    );

  if (!vehicle) {
    return {
      allowed: false,
      reason:
        "Vehicle not found.",
    };
  }

  if (
    vehicle.userId !== userId
  ) {
    return {
      allowed: false,
      reason:
        "Vehicle does not belong to this user.",
    };
  }

  return {
    allowed: true,
  };
};


/**
 * Get upcoming rides created by driver.
 */
exports.getUpcomingRides = async (
  userId
) => {
  return rideRepository.getUpcomingRidesByDriver(
    userId
  );
};


/**
 * Get completed rides created by driver.
 */
exports.getCompletedRides = async (
  userId
) => {
  return rideRepository.getCompletedRidesByDriver(
    userId
  );
};