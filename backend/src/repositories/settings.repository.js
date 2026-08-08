// backend/src/repositories/settings.repository.js

const prisma = require("../config/database.js");

/**
 * Get settings for an organization.
 */
exports.getOrganizationSettings = async (
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
exports.createOrganizationSettings = async (
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
exports.updateOrganizationSettings = async (
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
exports.deleteOrganizationSettings = async (
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
exports.getUserSettings = async (
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
exports.createUserSettings = async (
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
exports.updateUserSettings = async (
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
exports.deleteUserSettings = async (
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
exports.updateNotificationSettings = async (
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
exports.getNotificationSettings = async (
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
exports.updateRidePreferences = async (
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
exports.getRidePreferences = async (
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
exports.organizationSettingsExist =
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
exports.userSettingsExist =
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