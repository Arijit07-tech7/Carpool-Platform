// backend/src/services/settings.service.js

const settingsRepository =
  require("../repositories/settings.repository.js");

const userRepository =
  require("../repositories/user.repository.js");

const organizationRepository =
  require("../repositories/organization.repository.js");


// ============================================================
// USER SETTINGS
// ============================================================

/**
 * Get settings of the logged-in user.
 */
const getUserSettings = async (
  userId
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  let settings =
    await settingsRepository.findUserSettings(
      userId
    );

  /*
   * Create default settings if they
   * do not exist yet.
   */
  if (!settings) {
    settings =
      await settingsRepository.createUserSettings(
        userId,
        {
          notificationsEnabled: true,
          emailNotifications: true,
          pushNotifications: true,
          rideNotifications: true,
          paymentNotifications: true,
          chatNotifications: true,
          liveTrackingEnabled: true,
          language: "en",
        }
      );
  }

  return settings;
};


// ============================================================
// UPDATE USER SETTINGS
// ============================================================

const updateUserSettings = async (
  userId,
  data
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  const allowedFields = [
    "notificationsEnabled",
    "emailNotifications",
    "pushNotifications",
    "rideNotifications",
    "paymentNotifications",
    "chatNotifications",
    "liveTrackingEnabled",
    "language",
  ];

  const updateData = {};

  for (
    const field of allowedFields
  ) {
    if (
      data[field] !== undefined
    ) {
      updateData[field] =
        data[field];
    }
  }

  if (
    Object.keys(updateData)
      .length === 0
  ) {
    throw new Error(
      "No valid settings provided."
    );
  }

  return settingsRepository.updateUserSettings(
    userId,
    updateData
  );
};


// ============================================================
// NOTIFICATION SETTINGS
// ============================================================

const getNotificationSettings = async (
  userId
) => {
  const settings =
    await getUserSettings(
      userId
    );

  return {
    notificationsEnabled:
      settings.notificationsEnabled,

    emailNotifications:
      settings.emailNotifications,

    pushNotifications:
      settings.pushNotifications,

    rideNotifications:
      settings.rideNotifications,

    paymentNotifications:
      settings.paymentNotifications,

    chatNotifications:
      settings.chatNotifications,
  };
};


const updateNotificationSettings =
  async (
    userId,
    data
  ) => {
    const allowedFields = [
      "notificationsEnabled",
      "emailNotifications",
      "pushNotifications",
      "rideNotifications",
      "paymentNotifications",
      "chatNotifications",
    ];

    const updateData = {};

    for (
      const field of allowedFields
    ) {
      if (
        data[field] !== undefined
      ) {
        updateData[field] =
          Boolean(
            data[field]
          );
      }
    }

    if (
      Object.keys(updateData)
        .length === 0
    ) {
      throw new Error(
        "No notification settings provided."
      );
    }

    return settingsRepository.updateUserSettings(
      userId,
      updateData
    );
  };


// ============================================================
// LANGUAGE SETTINGS
// ============================================================

const updateLanguage = async (
  userId,
  language
) => {
  if (!language) {
    throw new Error(
      "Language is required."
    );
  }

  const supportedLanguages = [
    "en",
    "bn",
    "hi",
  ];

  if (
    !supportedLanguages.includes(
      language
    )
  ) {
    throw new Error(
      "Unsupported language."
    );
  }

  return settingsRepository.updateUserSettings(
    userId,
    {
      language,
    }
  );
};


// ============================================================
// LIVE TRACKING SETTINGS
// ============================================================

const updateLiveTrackingSetting =
  async (
    userId,
    enabled
  ) => {
    if (
      typeof enabled !==
      "boolean"
    ) {
      throw new Error(
        "Live tracking setting must be true or false."
      );
    }

    return settingsRepository.updateUserSettings(
      userId,
      {
        liveTrackingEnabled:
          enabled,
      }
    );
  };


// ============================================================
// ORGANIZATION SETTINGS
// ============================================================

/**
 * Get organization settings.
 *
 * Admin authorization should be checked
 * before calling this service.
 */
const getOrganizationSettings =
  async (
    userId,
    organizationId
  ) => {
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

    return settingsRepository
      .getOrganizationSettings(
        organizationId
      );
  };


// ============================================================
// UPDATE ORGANIZATION SETTINGS
// ============================================================

const updateOrganizationSettings =
  async (
    userId,
    organizationId,
    data
  ) => {
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

    const allowedFields = [
      "rideApprovalRequired",
      "vehicleApprovalRequired",
      "allowCashPayment",
      "allowCardPayment",
      "allowUpiPayment",
      "allowWalletPayment",
      "maxPassengersPerRide",
      "rideCancellationEnabled",
      "liveTrackingEnabled",
    ];

    const updateData = {};

    for (
      const field of allowedFields
    ) {
      if (
        data[field] !== undefined
      ) {
        updateData[field] =
          data[field];
      }
    }

    if (
      Object.keys(updateData)
        .length === 0
    ) {
      throw new Error(
        "No valid organization settings provided."
      );
    }

    return settingsRepository
      .updateOrganizationSettings(
        organizationId,
        updateData
      );
  };


// ============================================================
// PAYMENT PREFERENCES
// ============================================================

const getPaymentPreferences =
  async (
    userId
  ) => {
    const settings =
      await getUserSettings(
        userId
      );

    return {
      preferredPaymentMethod:
        settings.preferredPaymentMethod ||
        null,
    };
  };


const updatePaymentPreferences =
  async (
    userId,
    paymentMethod
  ) => {
    if (!paymentMethod) {
      throw new Error(
        "Payment method is required."
      );
    }

    const allowedMethods = [
      "CASH",
      "CARD",
      "UPI",
      "WALLET",
    ];

    const normalizedMethod =
      String(
        paymentMethod
      ).toUpperCase();

    if (
      !allowedMethods.includes(
        normalizedMethod
      )
    ) {
      throw new Error(
        "Invalid payment method."
      );
    }

    return settingsRepository.updateUserSettings(
      userId,
      {
        preferredPaymentMethod:
          normalizedMethod,
      }
    );
  };


// ============================================================
// RESET USER SETTINGS
// ============================================================

const resetUserSettings = async (
  userId
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  return settingsRepository.resetUserSettings(
    userId
  );
};


// ============================================================
// COMPLETE SETTINGS
// ============================================================

const getCompleteSettings = async (
  userId,
  organizationId = null
) => {
  const userSettings =
    await getUserSettings(
      userId
    );

  const notificationSettings =
    await getNotificationSettings(
      userId
    );

  const paymentPreferences =
    await getPaymentPreferences(
      userId
    );

  let organizationSettings =
    null;

  if (organizationId) {
    organizationSettings =
      await settingsRepository
        .getOrganizationSettings(
          organizationId
        );
  }

  return {
    user:
      userSettings,

    notifications:
      notificationSettings,

    payment:
      paymentPreferences,

    organization:
      organizationSettings,
  };
};


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getUserSettings,
  updateUserSettings,

  getNotificationSettings,
  updateNotificationSettings,

  updateLanguage,

  updateLiveTrackingSetting,

  getOrganizationSettings,
  updateOrganizationSettings,

  getPaymentPreferences,
  updatePaymentPreferences,

  resetUserSettings,

  getCompleteSettings,
};