// backend/src/controllers/vehicle.controller.js

const vehicleService = require("../services/vehicle.service.js");


// ============================================================
// ADD VEHICLE
// ============================================================

const addVehicle = async (req, res, next) => {
  try {
    const result = await vehicleService.addVehicle(
      req.user.id,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET MY VEHICLES
// ============================================================

const getMyVehicles = async (req, res, next) => {
  try {
    const result = await vehicleService.getMyVehicles(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Vehicles fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET VEHICLE BY ID
// ============================================================

const getVehicleById = async (req, res, next) => {
  try {
    const result = await vehicleService.getVehicleById(
      req.params.vehicleId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Vehicle details fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// UPDATE VEHICLE
// ============================================================

const updateVehicle = async (req, res, next) => {
  try {
    const result = await vehicleService.updateVehicle(
      req.user.id,
      req.params.vehicleId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// DELETE VEHICLE
// ============================================================

const deleteVehicle = async (req, res, next) => {
  try {
    const result = await vehicleService.deleteVehicle(
      req.user.id,
      req.params.vehicleId
    );

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// SET DEFAULT VEHICLE
// ============================================================

const setDefaultVehicle = async (req, res, next) => {
  try {
    const result = await vehicleService.setDefaultVehicle(
      req.user.id,
      req.params.vehicleId
    );

    return res.status(200).json({
      success: true,
      message: "Default vehicle updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// VERIFY VEHICLE
// ============================================================

const verifyVehicle = async (req, res, next) => {
  try {
    const result = await vehicleService.verifyVehicle(
      req.user.id,
      req.params.vehicleId
    );

    return res.status(200).json({
      success: true,
      message: "Vehicle verified successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET VEHICLE STATUS
// ============================================================

const getVehicleStatus = async (req, res, next) => {
  try {
    const result = await vehicleService.getVehicleStatus(
      req.params.vehicleId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Vehicle status fetched successfully",
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
  addVehicle,
  getMyVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  setDefaultVehicle,
  verifyVehicle,
  getVehicleStatus
};