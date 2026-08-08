// backend/src/controllers/user.controller.js

const userService = require("../services/user.service.js");


// ============================================================
// GET MY PROFILE
// ============================================================

const getMyProfile = async (req, res, next) => {
  try {
    const result = await userService.getMyProfile(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// UPDATE MY PROFILE
// ============================================================

const updateMyProfile = async (req, res, next) => {
  try {
    const result = await userService.updateMyProfile(
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET USER BY ID
// ============================================================

const getUserById = async (req, res, next) => {
  try {
    const result = await userService.getUserById(
      req.params.userId,
      req.user
    );

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// UPDATE PROFILE PHOTO
// ============================================================

const updateProfilePhoto = async (req, res, next) => {
  try {
    const result = await userService.updateProfilePhoto(
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET MY ORGANIZATION
// ============================================================

const getMyOrganization = async (req, res, next) => {
  try {
    const result = await userService.getMyOrganization(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Organization information fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// UPDATE CONTACT INFORMATION
// ============================================================

const updateContactInformation = async (req, res, next) => {
  try {
    const result =
      await userService.updateContactInformation(
        req.user.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Contact information updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET USER STATISTICS
// ============================================================

const getMyStatistics = async (req, res, next) => {
  try {
    const result = await userService.getMyStatistics(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "User statistics fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// DEACTIVATE ACCOUNT
// ============================================================

const deactivateAccount = async (req, res, next) => {
  try {
    const result = await userService.deactivateAccount(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Account deactivated successfully",
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
  getMyProfile,
  updateMyProfile,
  getUserById,
  updateProfilePhoto,
  getMyOrganization,
  updateContactInformation,
  getMyStatistics,
  deactivateAccount
};