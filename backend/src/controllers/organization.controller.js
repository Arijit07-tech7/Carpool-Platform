// backend/src/controllers/organization.controller.js

const organizationService =
  require("../services/organization.service.js");


// ============================================================
// GET MY ORGANIZATION
// ============================================================

const getMyOrganization = async (req, res, next) => {
  try {
    const result =
      await organizationService.getMyOrganization(
        req.user.id
      );

    return res.status(200).json({
      success: true,
      message: "Organization fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET ORGANIZATION BY ID
// ============================================================

const getOrganizationById = async (req, res, next) => {
  try {
    const result =
      await organizationService.getOrganizationById(
        req.params.organizationId,
        req.user
      );

    return res.status(200).json({
      success: true,
      message: "Organization details fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// UPDATE ORGANIZATION
// ============================================================

const updateOrganization = async (req, res, next) => {
  try {
    const result =
      await organizationService.updateOrganization(
        req.user.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Organization updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET ORGANIZATION MEMBERS
// ============================================================

const getMembers = async (req, res, next) => {
  try {
    const result =
      await organizationService.getMembers(
        req.user.id,
        req.query
      );

    return res.status(200).json({
      success: true,
      message: "Organization members fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET MEMBER BY ID
// ============================================================

const getMemberById = async (req, res, next) => {
  try {
    const result =
      await organizationService.getMemberById(
        req.params.memberId,
        req.user
      );

    return res.status(200).json({
      success: true,
      message: "Member details fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// ADD MEMBER
// ============================================================

const addMember = async (req, res, next) => {
  try {
    const result =
      await organizationService.addMember(
        req.user.id,
        req.body
      );

    return res.status(201).json({
      success: true,
      message: "Member added successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// REMOVE MEMBER
// ============================================================

const removeMember = async (req, res, next) => {
  try {
    const result =
      await organizationService.removeMember(
        req.user.id,
        req.params.memberId
      );

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// UPDATE MEMBER STATUS
// ============================================================

const updateMemberStatus = async (req, res, next) => {
  try {
    const result =
      await organizationService.updateMemberStatus(
        req.user.id,
        req.params.memberId,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Member status updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET ORGANIZATION SETTINGS
// ============================================================

const getOrganizationSettings = async (req, res, next) => {
  try {
    const result =
      await organizationService.getOrganizationSettings(
        req.user.id
      );

    return res.status(200).json({
      success: true,
      message: "Organization settings fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// UPDATE ORGANIZATION SETTINGS
// ============================================================

const updateOrganizationSettings = async (req, res, next) => {
  try {
    const result =
      await organizationService.updateOrganizationSettings(
        req.user.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Organization settings updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET PARTICIPATION SUMMARY
// ============================================================

const getParticipationSummary = async (req, res, next) => {
  try {
    const result =
      await organizationService.getParticipationSummary(
        req.user.id,
        req.query
      );

    return res.status(200).json({
      success: true,
      message: "Participation summary fetched successfully",
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
  getMyOrganization,
  getOrganizationById,
  updateOrganization,
  getMembers,
  getMemberById,
  addMember,
  removeMember,
  updateMemberStatus,
  getOrganizationSettings,
  updateOrganizationSettings,
  getParticipationSummary
};