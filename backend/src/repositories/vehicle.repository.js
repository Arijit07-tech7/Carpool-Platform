// backend/src/repositories/vehicle.repository.js

const prisma = require("../config/database.js");

/**
 * Create a vehicle
 */
exports.createVehicle = async (vehicleData) => {
  return prisma.vehicle.create({
    data: {
      ownerId: vehicleData.ownerId,
      organizationId: vehicleData.organizationId,

      registrationNumber:
        vehicleData.registrationNumber.toUpperCase(),

      make: vehicleData.make,
      model: vehicleData.model,
      color: vehicleData.color || null,
      vehicleType: vehicleData.vehicleType,

      seatingCapacity: vehicleData.seatingCapacity,

      status: vehicleData.status || "PENDING",
    },

    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });
};

/**
 * Find vehicle by ID
 */
exports.findVehicleById = async (vehicleId) => {
  return prisma.vehicle.findUnique({
    where: {
      id: vehicleId,
    },

    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },

      organization: true,

      rides: {
        select: {
          id: true,
          source: true,
          destination: true,
          departureTime: true,
          status: true,
        },

        orderBy: {
          departureTime: "desc",
        },

        take: 10,
      },
    },
  });
};

/**
 * Find vehicle by registration number
 */
exports.findVehicleByRegistrationNumber = async (
  registrationNumber
) => {
  return prisma.vehicle.findUnique({
    where: {
      registrationNumber:
        registrationNumber.toUpperCase(),
    },
  });
};

/**
 * Check whether registration number already exists
 */
exports.registrationNumberExists = async (
  registrationNumber
) => {
  const vehicle = await prisma.vehicle.findUnique({
    where: {
      registrationNumber:
        registrationNumber.toUpperCase(),
    },

    select: {
      id: true,
    },
  });

  return Boolean(vehicle);
};

/**
 * Get vehicles belonging to a user
 */
exports.findVehiclesByOwner = async (
  ownerId,
  options = {}
) => {
  const {
    page = 1,
    limit = 20,
    status,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    ownerId,

    ...(status && {
      status,
    }),
  };

  const [vehicles, total] = await prisma.$transaction([
    prisma.vehicle.findMany({
      where,

      skip,
      take: limit,

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.vehicle.count({
      where,
    }),
  ]);

  return {
    vehicles,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get vehicles belonging to an organization
 */
exports.findVehiclesByOrganization = async (
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

  const [vehicles, total] = await prisma.$transaction([
    prisma.vehicle.findMany({
      where,

      skip,
      take: limit,

      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.vehicle.count({
      where,
    }),
  ]);

  return {
    vehicles,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Update vehicle information
 */
exports.updateVehicle = async (
  vehicleId,
  updateData
) => {
  return prisma.vehicle.update({
    where: {
      id: vehicleId,
    },

    data: updateData,

    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });
};

/**
 * Update vehicle status
 */
exports.updateVehicleStatus = async (
  vehicleId,
  status
) => {
  return prisma.vehicle.update({
    where: {
      id: vehicleId,
    },

    data: {
      status,
    },
  });
};

/**
 * Verify a vehicle
 */
exports.verifyVehicle = async (vehicleId) => {
  return prisma.vehicle.update({
    where: {
      id: vehicleId,
    },

    data: {
      status: "VERIFIED",
    },
  });
};

/**
 * Reject a vehicle
 */
exports.rejectVehicle = async (vehicleId) => {
  return prisma.vehicle.update({
    where: {
      id: vehicleId,
    },

    data: {
      status: "REJECTED",
    },
  });
};

/**
 * Check whether vehicle belongs to a user
 */
exports.vehicleBelongsToOwner = async (
  vehicleId,
  ownerId
) => {
  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id: vehicleId,
      ownerId,
    },

    select: {
      id: true,
    },
  });

  return Boolean(vehicle);
};

/**
 * Check whether vehicle is verified
 */
exports.isVehicleVerified = async (
  vehicleId
) => {
  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id: vehicleId,
      status: "VERIFIED",
    },

    select: {
      id: true,
    },
  });

  return Boolean(vehicle);
};

/**
 * Get verified vehicles of an employee
 *
 * Useful when publishing a ride.
 */
exports.findVerifiedVehiclesByOwner = async (
  ownerId
) => {
  return prisma.vehicle.findMany({
    where: {
      ownerId,
      status: "VERIFIED",
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * Count vehicles in an organization
 */
exports.countOrganizationVehicles = async (
  organizationId
) => {
  return prisma.vehicle.count({
    where: {
      organizationId,
    },
  });
};

/**
 * Count verified vehicles
 */
exports.countVerifiedVehicles = async (
  organizationId
) => {
  return prisma.vehicle.count({
    where: {
      organizationId,
      status: "VERIFIED",
    },
  });
};

/**
 * Delete vehicle
 */
exports.deleteVehicle = async (vehicleId) => {
  return prisma.vehicle.delete({
    where: {
      id: vehicleId,
    },
  });
};
