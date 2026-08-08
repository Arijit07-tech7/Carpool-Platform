// backend/src/controllers/ride.controller.js

const rideService = require("../services/ride.service.js");


// ============================================================
// FIND / SEARCH RIDES
// ============================================================

const searchRides = async (req, res, next) => {
  try {
    const result = await rideService.searchRides(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Rides fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET RIDE BY ID
// ============================================================

const getRideById = async (req, res, next) => {
  try {
    const result = await rideService.getRideById(
      req.params.rideId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Ride details fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// OFFER / PUBLISH RIDE
// ============================================================

const createRide = async (req, res, next) => {
  try {
    const result = await rideService.createRide(
      req.user.id,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Ride published successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// UPDATE RIDE
// ============================================================

const updateRide = async (req, res, next) => {
  try {
    const result = await rideService.updateRide(
      req.user.id,
      req.params.rideId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Ride updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// CANCEL RIDE
// ============================================================

const cancelRide = async (req, res, next) => {
  try {
    const result = await rideService.cancelRide(
      req.user.id,
      req.params.rideId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Ride cancelled successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET MY OFFERED RIDES
// ============================================================

const getMyRides = async (req, res, next) => {
  try {
    const result = await rideService.getMyRides(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Your rides fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET AVAILABLE SEATS
// ============================================================

const getAvailableSeats = async (req, res, next) => {
  try {
    const result = await rideService.getAvailableSeats(
      req.params.rideId
    );

    return res.status(200).json({
      success: true,
      message: "Available seats fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// CONFIRM ROUTE
// ============================================================

const confirmRoute = async (req, res, next) => {
  try {
    const result = await rideService.confirmRoute(
      req.user.id,
      req.params.rideId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Route confirmed successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// CALCULATE RIDE ROUTE
// ============================================================

const calculateRoute = async (req, res, next) => {
  try {
    const result = await rideService.calculateRoute(
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Route calculated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET RIDE PASSENGERS
// ============================================================

const getRidePassengers = async (req, res, next) => {
  try {
    const result = await rideService.getRidePassengers(
      req.user.id,
      req.params.rideId
    );

    return res.status(200).json({
      success: true,
      message: "Ride passengers fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// START RIDE
// ============================================================

const startRide = async (req, res, next) => {
  try {
    const result = await rideService.startRide(
      req.user.id,
      req.params.rideId
    );

    return res.status(200).json({
      success: true,
      message: "Ride started successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// COMPLETE RIDE
// ============================================================

const completeRide = async (req, res, next) => {
  try {
    const result = await rideService.completeRide(
      req.user.id,
      req.params.rideId
    );

    return res.status(200).json({
      success: true,
      message: "Ride completed successfully",
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
  searchRides,
  getRideById,
  createRide,
  updateRide,
  cancelRide,
  getMyRides,
  getAvailableSeats,
  confirmRoute,
  calculateRoute,
  getRidePassengers,
  startRide,
  completeRide
};