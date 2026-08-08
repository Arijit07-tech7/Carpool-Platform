// backend/src/repositories/user.repository.js

import prisma from "../config/database.js";

/**
 * Find a user by ID
 */
export const findUserById = async (userId) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      organization: true,
      organizationMembership: true,
      vehicles: true,
      wallet: true,
      settings: true,
    },
  });
};

/**
 * Find a user by email
 */
export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
    include: {
      organization: true,
      organizationMembership: true,
      wallet: true,
      settings: true,
    },
  });
};

/**
 * Find a user by ID without sensitive information
 */
export const findPublicUserById = async (userId) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      profileImage: true,
      role: true,
      status: true,
      organizationId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Create a new user
 */
export const createUser = async (userData) => {
  return prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password,
      phone: userData.phone || null,
      profileImage: userData.profileImage || null,
      role: userData.role || "EMPLOYEE",
      status: userData.status || "ACTIVE",
      organizationId: userData.organizationId,
    },
  });
};

/**
 * Update user profile
 */
export const updateUser = async (userId, updateData) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      profileImage: true,
      role: true,
      status: true,
      organizationId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Update user password
 */
export const updateUserPassword = async (userId, hashedPassword) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
};

/**
 * Update user status
 */
export const updateUserStatus = async (userId, status) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      organizationId: true,
    },
  });
};

/**
 * Update profile image
 */
export const updateProfileImage = async (userId, profileImage) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      profileImage,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      profileImage: true,
      role: true,
      status: true,
    },
  });
};

/**
 * Get users belonging to an organization
 */
export const findUsersByOrganization = async (
  organizationId,
  options = {}
) => {
  const {
    page = 1,
    limit = 20,
    search = "",
    role,
    status,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    organizationId,

    ...(role && {
      role,
    }),

    ...(status && {
      status,
    }),

    ...(search && {
      OR: [
        {
          name: {
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
        {
          phone: {
            contains: search,
          },
        },
      ],
    }),
  };

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        role: true,
        status: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
    }),

    prisma.user.count({
      where,
    }),
  ]);

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Count users in an organization
 */
export const countUsersByOrganization = async (organizationId) => {
  return prisma.user.count({
    where: {
      organizationId,
    },
  });
};

/**
 * Check whether an email already exists
 */
export const emailExists = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
    select: {
      id: true,
    },
  });

  return Boolean(user);
};

/**
 * Delete user
 *
 * Use carefully because related records may be
 * deleted depending on Prisma relation settings.
 */
export const deleteUser = async (userId) => {
  return prisma.user.delete({
    where: {
      id: userId,
    },
  });
};