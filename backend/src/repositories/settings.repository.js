// backend/src/repositories/settings.repository.js

import prisma from "../config/database.js";

/**
 * Get settings for an organization.
 */
export const getOrganizationSettings = async (
  organizationId
) => {
  return prisma.settings.findUnique({
    where: {
      organizationId,
    },
  });
};


/**
 * Create organization settings.
 */
export const createOrganizationSettings = async (
  organizationId,
  settingsData = {}
) => {
  return prisma.settings.create({
    data: {
      organizationId,

      ...settingsData,
    },
  });
};


/**
 * Update organization settings.
 */
export const updateOrganizationSettings = async (
  organizationId,
  settingsData
) => {
  return prisma.settings.upsert({
    where: {
      organizationId,
    },

    update: {
      ...settingsData,
      updatedAt: new Date(),
    },

    create: {
      organizationId,
      ...settingsData,
    },
  });
};


/**
 * Delete organization settings.
 */
export const deleteOrganizationSettings = async (
  organizationId
) => {
  return prisma.settings.delete({
    where: {
      organizationId,
    },
  });
};


/**
 * Get user settings.
 */
export const getUserSettings = async (
  userId
) => {
  return prisma.userSettings.findUnique({
    where: {
      userId,
    },
  });
};


/**
 * Create user settings.
 */
export const createUserSettings = async (
  userId,
  settingsData = {}
) => {
  return prisma.userSettings.create({
    data: {
      userId,

      ...settingsData,
    },
  });
};


/**
 * Update user settings.
 */
export const updateUserSettings = async (
  userId,
  settingsData
) => {
  return prisma.userSettings.upsert({
    where: {
      userId,
    },

    update: {
      ...settingsData,
      updatedAt: new Date(),
    },

    create: {
      userId,
      ...settingsData,
    },
  });
};


/**
 * Delete user settings.
 */
export const deleteUserSettings = async (
  userId
) => {
  return prisma.userSettings.delete({
    where: {
      userId,
    },
  });
};


/**
 * Update notification preferences.
 */
export const updateNotificationSettings = async (
  userId,
  notificationData
) => {
  return prisma.userSettings.update({
    where: {
      userId,
    },

    data: {
      ...notificationData,
      updatedAt: new Date(),
    },
  });
};


/**
 * Get notification preferences.
 */
export const getNotificationSettings = async (
  userId
) => {
  return prisma.userSettings.findUnique({
    where: {
      userId,
    },

    select: {
      emailNotifications: true,
      pushNotifications: true,
      rideNotifications: true,
      paymentNotifications: true,
      tripNotifications: true,
    },
  });
};


/**
 * Update ride preferences.
 */
export const updateRidePreferences = async (
  userId,
  ridePreferences
) => {
  return prisma.userSettings.update({
    where: {
      userId,
    },

    data: {
      ...ridePreferences,
      updatedAt: new Date(),
    },
  });
};


/**
 * Get ride preferences.
 */
export const getRidePreferences = async (
  userId
) => {
  return prisma.userSettings.findUnique({
    where: {
      userId,
    },

    select: {
      preferredPaymentMethod: true,
      preferredRideType: true,
      autoAcceptRides: true,
    },
  });
};


/**
 * Check whether organization settings exist.
 */
export const organizationSettingsExist =
  async (organizationId) => {
    const settings =
      await prisma.settings.findUnique({
        where: {
          organizationId,
        },

        select: {
          id: true,
        },
      });

    return Boolean(settings);
  };


/**
 * Check whether user settings exist.
 */
export const userSettingsExist =
  async (userId) => {
    const settings =
      await prisma.userSettings.findUnique({
        where: {
          userId,
        },

        select: {
          id: true,
        },
      });

    return Boolean(settings);
  };