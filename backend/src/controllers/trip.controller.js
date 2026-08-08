// backend/src/controllers/trip.controller.js

const tripService = require("../services/trip.service.js");


// ============================================================
// CREATE TRIP
// ============================================================

const createTrip = async (req, res, next) => {
  try {
    const result = await tripService.createTrip(
      req.user.id,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Trip created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET TRIP BY ID
// ============================================================

const getTripById = async (req, res, next) => {
  try {
    const result = await tripService.getTripById(
      req.params.tripId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Trip details fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET MY TRIPS
// ============================================================

const getMyTrips = async (req, res, next) => {
  try {
    const result = await tripService.getMyTrips(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Trips fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET ACTIVE TRIP
// ============================================================

const getActiveTrip = async (req, res, next) => {
  try {
    const result = await tripService.getActiveTrip(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Active trip fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// START TRIP
// ============================================================

const startTrip = async (req, res, next) => {
  try {
    const result = await tripService.startTrip(
      req.user.id,
      req.params.tripId
    );

    return res.status(200).json({
      success: true,
      message: "Trip started successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// UPDATE TRIP STATUS
// ============================================================

const updateTripStatus = async (req, res, next) => {
  try {
    const result = await tripService.updateTripStatus(
      req.user.id,
      req.params.tripId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Trip status updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// COMPLETE TRIP
// ============================================================

const completeTrip = async (req, res, next) => {
  try {
    const result = await tripService.completeTrip(
      req.user.id,
      req.params.tripId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Trip completed successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// CANCEL TRIP
// ============================================================

const cancelTrip = async (req, res, next) => {
  try {
    const result = await tripService.cancelTrip(
      req.user.id,
      req.params.tripId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Trip cancelled successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET TRIP PASSENGERS
// ============================================================

const getTripPassengers = async (req, res, next) => {
  try {
    const result = await tripService.getTripPassengers(
      req.params.tripId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Trip passengers fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET TRIP SUMMARY
// ============================================================

const getTripSummary = async (req, res, next) => {
  try {
    const result = await tripService.getTripSummary(
      req.params.tripId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Trip summary fetched successfully",
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
  createTrip,
  getTripById,
  getMyTrips,
  getActiveTrip,
  startTrip,
  updateTripStatus,
  completeTrip,
  cancelTrip,
  getTripPassengers,
  getTripSummary
};