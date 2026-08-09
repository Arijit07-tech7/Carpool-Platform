const settingsService = require("../services/settings.service.js");


// ============================================================
// GET MY SETTINGS
// ============================================================

const getMySettings = async (req, res, next) => {
  try {
    const result = await settingsService.getMySettings(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Settings fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// UPDATE MY SETTINGS
// ============================================================

const updateMySettings = async (req, res, next) => {
  try {
    const result = await settingsService.updateMySettings(
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET NOTIFICATION SETTINGS
// ============================================================

const getNotificationSettings = async (req, res, next) => {
  try {
    const result = await settingsService.getNotificationSettings(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Notification settings fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// UPDATE NOTIFICATION SETTINGS
// ============================================================

const updateNotificationSettings = async (req, res, next) => {
  try {
    const result = await settingsService.updateNotificationSettings(
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Notification settings updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET PRIVACY SETTINGS
// ============================================================

const getPrivacySettings = async (req, res, next) => {
  try {
    const result = await settingsService.getPrivacySettings(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Privacy settings fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// UPDATE PRIVACY SETTINGS
// ============================================================

const updatePrivacySettings = async (req, res, next) => {
  try {
    const result = await settingsService.updatePrivacySettings(
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Privacy settings updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET RIDE PREFERENCES
// ============================================================

const getRidePreferences = async (req, res, next) => {
  try {
    const result = await settingsService.getRidePreferences(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Ride preferences fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// UPDATE RIDE PREFERENCES
// ============================================================

const updateRidePreferences = async (req, res, next) => {
  try {
    const result = await settingsService.updateRidePreferences(
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Ride preferences updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET APPLICATION SETTINGS
// ============================================================

const getApplicationSettings = async (req, res, next) => {
  try {
    const result = await settingsService.getApplicationSettings(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Application settings fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// RESET SETTINGS
// ============================================================

const resetSettings = async (req, res, next) => {
  try {
    const result = await settingsService.resetSettings(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Settings reset successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  getMySettings,
  updateMySettings,
  getNotificationSettings,
  updateNotificationSettings,
  getPrivacySettings,
  updatePrivacySettings,
  getRidePreferences,
  updateRidePreferences,
  getApplicationSettings,
  resetSettings
};
