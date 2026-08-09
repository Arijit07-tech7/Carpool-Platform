// backend/src/controllers/tracking.controller.js

const trackingService = require("../services/tracking.service.js");


// ============================================================
// UPDATE LIVE LOCATION
// ============================================================

const updateLocation = async (req, res, next) => {
  try {
    const result = await trackingService.updateLocation(
      req.user.id,
      req.params.tripId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Live location updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET CURRENT TRIP LOCATION
// ============================================================

const getCurrentLocation = async (req, res, next) => {
  try {
    const result = await trackingService.getCurrentLocation(
      req.params.tripId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Current trip location fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET LIVE TRIP TRACKING
// ============================================================

const getLiveTracking = async (req, res, next) => {
  try {
    const result = await trackingService.getLiveTracking(
      req.params.tripId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Live trip tracking fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET LOCATION HISTORY
// ============================================================

const getLocationHistory = async (req, res, next) => {
  try {
    const result = await trackingService.getLocationHistory(
      req.params.tripId,
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Location history fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// START TRACKING
// ============================================================

const startTracking = async (req, res, next) => {
  try {
    const result = await trackingService.startTracking(
      req.user.id,
      req.params.tripId
    );

    return res.status(200).json({
      success: true,
      message: "Live tracking started successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// STOP TRACKING
// ============================================================

const stopTracking = async (req, res, next) => {
  try {
    const result = await trackingService.stopTracking(
      req.user.id,
      req.params.tripId
    );

    return res.status(200).json({
      success: true,
      message: "Live tracking stopped successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET TRACKING STATUS
// ============================================================

const getTrackingStatus = async (req, res, next) => {
  try {
    const result = await trackingService.getTrackingStatus(
      req.params.tripId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Tracking status fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// SHARE LOCATION
// ============================================================

const shareLocation = async (req, res, next) => {
  try {
    const result = await trackingService.shareLocation(
      req.user.id,
      req.params.tripId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Location shared successfully",
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
  updateLocation,
  getCurrentLocation,
  getLiveTracking,
  getLocationHistory,
  startTracking,
  stopTracking,
  getTrackingStatus,
  shareLocation
};
