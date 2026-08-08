// backend/src/repositories/vehicle.repository.js

import prisma from "../config/database.js";

/**
 * Create a vehicle
 */
export const createVehicle = async (vehicleData) => {
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
export const findVehicleById = async (vehicleId) => {
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
export const findVehicleByRegistrationNumber = async (
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
export const registrationNumberExists = async (
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
export const findVehiclesByOwner = async (
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
export const findVehiclesByOrganization = async (
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
export const updateVehicle = async (
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
export const updateVehicleStatus = async (
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
export const verifyVehicle = async (vehicleId) => {
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
export const rejectVehicle = async (vehicleId) => {
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
export const vehicleBelongsToOwner = async (
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
export const isVehicleVerified = async (
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
export const findVerifiedVehiclesByOwner = async (
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
export const countOrganizationVehicles = async (
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
export const countVerifiedVehicles = async (
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
export const deleteVehicle = async (vehicleId) => {
  return prisma.vehicle.delete({
    where: {
      id: vehicleId,
    },
  });
};
