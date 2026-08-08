const historyService = require("../services/history.service.js");


// ============================================================
// GET MY RIDE HISTORY
// ============================================================

const getMyRideHistory = async (req, res, next) => {
  try {
    const result = await historyService.getMyRideHistory(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Ride history fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET HISTORY BY ID
// ============================================================

const getHistoryById = async (req, res, next) => {
  try {
    const result = await historyService.getHistoryById(
      req.params.historyId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "History details fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET MY COMPLETED RIDES
// ============================================================

const getCompletedRides = async (req, res, next) => {
  try {
    const result = await historyService.getCompletedRides(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Completed rides fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET MY CANCELLED RIDES
// ============================================================

const getCancelledRides = async (req, res, next) => {
  try {
    const result = await historyService.getCancelledRides(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Cancelled rides fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET RIDES AS DRIVER
// ============================================================

const getDriverHistory = async (req, res, next) => {
  try {
    const result = await historyService.getDriverHistory(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Driver ride history fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET RIDES AS PASSENGER
// ============================================================

const getPassengerHistory = async (req, res, next) => {
  try {
    const result = await historyService.getPassengerHistory(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Passenger ride history fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET TRIP HISTORY
// ============================================================

const getTripHistory = async (req, res, next) => {
  try {
    const result = await historyService.getTripHistory(
      req.params.tripId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Trip history fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET PAYMENT HISTORY
// ============================================================

const getPaymentHistory = async (req, res, next) => {
  try {
    const result = await historyService.getPaymentHistory(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Payment history fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET HISTORY SUMMARY
// ============================================================

const getHistorySummary = async (req, res, next) => {
  try {
    const result = await historyService.getHistorySummary(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "History summary fetched successfully",
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
  getMyRideHistory,
  getHistoryById,
  getCompletedRides,
  getCancelledRides,
  getDriverHistory,
  getPassengerHistory,
  getTripHistory,
  getPaymentHistory,
  getHistorySummary
};
