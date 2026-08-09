// backend/src/services/vehicle.service.js

const vehicleRepository = require("../repositories/vehicle.repository.js");
const organizationRepository = require("../repositories/organization.repository.js");


/**
 * Verify that the user belongs to
 * the organization.
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
 * Register a new vehicle.
 */
exports.registerVehicle = async (
  userId,
  organizationId,
  vehicleData
) => {
  const {
    registrationNumber,
    vehicleType,
    brand,
    model,
    color,
    seatingCapacity,
    vehicleImage,
  } = vehicleData;

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

  if (
    !registrationNumber ||
    !registrationNumber.trim()
  ) {
    throw new Error(
      "Vehicle registration number is required."
    );
  }

  if (
    !vehicleType ||
    !vehicleType.trim()
  ) {
    throw new Error(
      "Vehicle type is required."
    );
  }

  const capacity =
    Number(seatingCapacity);

  if (
    !Number.isInteger(capacity) ||
    capacity <= 0
  ) {
    throw new Error(
      "Seating capacity must be a positive number."
    );
  }

  // Verify organization membership.
  await verifyOrganizationMembership(
    userId,
    organizationId
  );

  // Normalize registration number.
  const normalizedRegistration =
    registrationNumber
      .trim()
      .toUpperCase();

  // Prevent duplicate registration numbers.
  const existingVehicle =
    await vehicleRepository.findVehicleByRegistrationNumber(
      normalizedRegistration
    );

  if (existingVehicle) {
    throw new Error(
      "A vehicle with this registration number is already registered."
    );
  }

  return vehicleRepository.createVehicle({
    userId,
    organizationId,

    registrationNumber:
      normalizedRegistration,

    vehicleType:
      vehicleType.trim(),

    brand:
      brand || null,

    model:
      model || null,

    color:
      color || null,

    seatingCapacity:
      capacity,

    vehicleImage:
      vehicleImage || null,

    status: "ACTIVE",
  });
};


/**
 * Get one vehicle.
 */
exports.getVehicleById = async (
  userId,
  vehicleId
) => {
  const vehicle =
    await vehicleRepository.findVehicleById(
      vehicleId
    );

  if (!vehicle) {
    throw new Error(
      "Vehicle not found."
    );
  }

  // Only the vehicle owner can
  // access their vehicle.
  if (
    vehicle.userId !== userId
  ) {
    throw new Error(
      "You are not authorized to access this vehicle."
    );
  }

  return vehicle;
};


/**
 * Get all vehicles belonging
 * to the current user.
 */
exports.getMyVehicles = async (
  userId
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  return vehicleRepository.getVehiclesByUser(
    userId
  );
};


/**
 * Get organization vehicles.
 */
exports.getOrganizationVehicles =
  async (
    userId,
    organizationId
  ) => {
    if (
      !userId ||
      !organizationId
    ) {
      throw new Error(
        "User ID and organization ID are required."
      );
    }

    await verifyOrganizationMembership(
      userId,
      organizationId
    );

    return vehicleRepository.getVehiclesByOrganization(
      organizationId
    );
  };


/**
 * Update vehicle details.
 */
exports.updateVehicle = async (
  userId,
  vehicleId,
  updateData
) => {
  const vehicle =
    await vehicleRepository.findVehicleById(
      vehicleId
    );

  if (!vehicle) {
    throw new Error(
      "Vehicle not found."
    );
  }

  if (
    vehicle.userId !== userId
  ) {
    throw new Error(
      "You are not authorized to update this vehicle."
    );
  }

  const allowedFields = [
    "registrationNumber",
    "vehicleType",
    "brand",
    "model",
    "color",
    "seatingCapacity",
    "vehicleImage",
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

  // Registration number validation.
  if (
    filteredData.registrationNumber
  ) {
    const normalizedRegistration =
      filteredData.registrationNumber
        .trim()
        .toUpperCase();

    const existingVehicle =
      await vehicleRepository.findVehicleByRegistrationNumber(
        normalizedRegistration
      );

    if (
      existingVehicle &&
      existingVehicle.id !== vehicleId
    ) {
      throw new Error(
        "This registration number is already in use."
      );
    }

    filteredData.registrationNumber =
      normalizedRegistration;
  }

  // Seating capacity validation.
  if (
    filteredData.seatingCapacity !==
    undefined
  ) {
    const capacity =
      Number(
        filteredData.seatingCapacity
      );

    if (
      !Number.isInteger(capacity) ||
      capacity <= 0
    ) {
      throw new Error(
        "Seating capacity must be a positive number."
      );
    }

    filteredData.seatingCapacity =
      capacity;
  }

  return vehicleRepository.updateVehicle(
    vehicleId,
    filteredData
  );
};


/**
 * Delete a vehicle.
 */
exports.deleteVehicle = async (
  userId,
  vehicleId
) => {
  const vehicle =
    await vehicleRepository.findVehicleById(
      vehicleId
    );

  if (!vehicle) {
    throw new Error(
      "Vehicle not found."
    );
  }

  if (
    vehicle.userId !== userId
  ) {
    throw new Error(
      "You are not authorized to delete this vehicle."
    );
  }

  // Check whether vehicle is being
  // used by active/upcoming rides.
  const activeRideCount =
    await vehicleRepository.countActiveRides(
      vehicleId
    );

  if (
    Number(activeRideCount) > 0
  ) {
    throw new Error(
      "Vehicle cannot be deleted while it is assigned to active rides."
    );
  }

  await vehicleRepository.deleteVehicle(
    vehicleId
  );

  return {
    success: true,
    message:
      "Vehicle deleted successfully.",
  };
};


/**
 * Activate a vehicle.
 */
exports.activateVehicle = async (
  userId,
  vehicleId
) => {
  const vehicle =
    await vehicleRepository.findVehicleById(
      vehicleId
    );

  if (!vehicle) {
    throw new Error(
      "Vehicle not found."
    );
  }

  if (
    vehicle.userId !== userId
  ) {
    throw new Error(
      "You are not authorized to update this vehicle."
    );
  }

  return vehicleRepository.updateVehicle(
    vehicleId,
    {
      status: "ACTIVE",
    }
  );
};


/**
 * Deactivate a vehicle.
 */
exports.deactivateVehicle = async (
  userId,
  vehicleId
) => {
  const vehicle =
    await vehicleRepository.findVehicleById(
      vehicleId
    );

  if (!vehicle) {
    throw new Error(
      "Vehicle not found."
    );
  }

  if (
    vehicle.userId !== userId
  ) {
    throw new Error(
      "You are not authorized to update this vehicle."
    );
  }

  const activeRideCount =
    await vehicleRepository.countActiveRides(
      vehicleId
    );

  if (
    Number(activeRideCount) > 0
  ) {
    throw new Error(
      "Vehicle cannot be deactivated while assigned to active rides."
    );
  }

  return vehicleRepository.updateVehicle(
    vehicleId,
    {
      status: "INACTIVE",
    }
  );
};


/**
 * Check whether a driver has
 * a usable registered vehicle.
 */
exports.hasRegisteredVehicle =
  async (userId) => {
    const vehicles =
      await vehicleRepository.getVehiclesByUser(
        userId
      );

    const activeVehicles =
      vehicles.filter(
        (vehicle) =>
          vehicle.status === "ACTIVE"
      );

    return {
      hasVehicle:
        activeVehicles.length > 0,

      vehicles:
        activeVehicles,
    };
  };


/**
 * Validate vehicle before publishing
 * a ride.
 */
exports.validateVehicleForRide =
  async (
    userId,
    vehicleId
  ) => {
    const vehicle =
      await vehicleRepository.findVehicleById(
        vehicleId
      );

    if (!vehicle) {
      return {
        valid: false,
        reason:
          "Vehicle not found.",
      };
    }

    if (
      vehicle.userId !== userId
    ) {
      return {
        valid: false,
        reason:
          "Vehicle does not belong to this driver.",
      };
    }

    if (
      vehicle.status !== "ACTIVE"
    ) {
      return {
        valid: false,
        reason:
          "Vehicle is not active.",
      };
    }

    if (
      !vehicle.seatingCapacity ||
      Number(vehicle.seatingCapacity) <= 0
    ) {
      return {
        valid: false,
        reason:
          "Vehicle seating capacity is invalid.",
      };
    }

    return {
      valid: true,
      vehicle,
    };
  };


/**
 * Get vehicle capacity.
 */
exports.getVehicleCapacity = async (
  userId,
  vehicleId
) => {
  const vehicle =
    await getVehicleById(
      userId,
      vehicleId
    );

  return {
    vehicleId,
    seatingCapacity:
      vehicle.seatingCapacity,
  };
};