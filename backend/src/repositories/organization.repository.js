// backend/src/repositories/organization.repository.js

import prisma from "../config/database.js";

/**
 * Find organization by ID
 */
export const findOrganizationById = async (organizationId) => {
  return prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
    include: {
      settings: true,
    },
  });
};

/**
 * Find organization by unique organization code
 */
export const findOrganizationByCode = async (code) => {
  return prisma.organization.findUnique({
    where: {
      code: code.toUpperCase(),
    },
  });
};

/**
 * Find organization by email
 */
export const findOrganizationByEmail = async (email) => {
  return prisma.organization.findFirst({
    where: {
      email: email.toLowerCase(),
    },
  });
};

/**
 * Create a new organization
 */
export const createOrganization = async (organizationData) => {
  return prisma.organization.create({
    data: {
      name: organizationData.name,
      code: organizationData.code.toUpperCase(),
      description: organizationData.description || null,
      email: organizationData.email
        ? organizationData.email.toLowerCase()
        : null,
      phone: organizationData.phone || null,
      address: organizationData.address || null,
      isActive: true,
    },
  });
};

/**
 * Update organization information
 */
export const updateOrganization = async (
  organizationId,
  updateData
) => {
  return prisma.organization.update({
    where: {
      id: organizationId,
    },
    data: updateData,
  });
};

/**
 * Activate or deactivate organization
 */
export const updateOrganizationStatus = async (
  organizationId,
  isActive
) => {
  return prisma.organization.update({
    where: {
      id: organizationId,
    },
    data: {
      isActive,
    },
  });
};

/**
 * Check whether organization code already exists
 */
export const organizationCodeExists = async (code) => {
  const organization = await prisma.organization.findUnique({
    where: {
      code: code.toUpperCase(),
    },
    select: {
      id: true,
    },
  });

  return Boolean(organization);
};

/**
 * Get organization with its employees
 */
export const getOrganizationWithUsers = async (
  organizationId
) => {
  return prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
};

/**
 * Get organization statistics
 */
export const getOrganizationStats = async (
  organizationId
) => {
  const [
    totalUsers,
    activeUsers,
    totalVehicles,
    totalRides,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        organizationId,
      },
    }),

    prisma.user.count({
      where: {
        organizationId,
        status: "ACTIVE",
      },
    }),

    prisma.vehicle.count({
      where: {
        organizationId,
      },
    }),

    prisma.ride.count({
      where: {
        organizationId,
      },
    }),
  ]);

  return {
    totalUsers,
    activeUsers,
    totalVehicles,
    totalRides,
  };
};

/**
 * Get all organizations
 *
 * Mainly useful for SUPER_ADMIN.
 */
export const findAllOrganizations = async ({
  page = 1,
  limit = 20,
  search = "",
} = {}) => {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  const [organizations, total] = await prisma.$transaction([
    prisma.organization.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.organization.count({
      where,
    }),
  ]);

  return {
    organizations,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Delete organization
 *
 * Use carefully because related records may be
 * deleted through Prisma cascade relations.
 */
export const deleteOrganization = async (organizationId) => {
  return prisma.organization.delete({
    where: {
      id: organizationId,
    },
  });
};