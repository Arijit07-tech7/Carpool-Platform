// backend/src/controllers/booking.controller.js

const bookingService = require("../services/booking.service.js");


// ============================================================
// CREATE BOOKING
// ============================================================

const createBooking = async (req, res, next) => {
  try {
    const result = await bookingService.createBooking(
      req.user.id,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Ride booked successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET BOOKING BY ID
// ============================================================

const getBookingById = async (req, res, next) => {
  try {
    const result = await bookingService.getBookingById(
      req.params.bookingId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Booking details fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET MY BOOKINGS
// ============================================================

const getMyBookings = async (req, res, next) => {
  try {
    const result = await bookingService.getMyBookings(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET RIDE BOOKINGS
// ============================================================

const getRideBookings = async (req, res, next) => {
  try {
    const result = await bookingService.getRideBookings(
      req.user.id,
      req.params.rideId,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Ride bookings fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// CONFIRM BOOKING
// ============================================================

const confirmBooking = async (req, res, next) => {
  try {
    const result = await bookingService.confirmBooking(
      req.user.id,
      req.params.bookingId
    );

    return res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// CANCEL BOOKING
// ============================================================

const cancelBooking = async (req, res, next) => {
  try {
    const result = await bookingService.cancelBooking(
      req.user.id,
      req.params.bookingId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// REJECT BOOKING
// ============================================================

const rejectBooking = async (req, res, next) => {
  try {
    const result = await bookingService.rejectBooking(
      req.user.id,
      req.params.bookingId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Booking rejected successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET BOOKING STATUS
// ============================================================

const getBookingStatus = async (req, res, next) => {
  try {
    const result = await bookingService.getBookingStatus(
      req.params.bookingId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Booking status fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// CHECK RIDE AVAILABILITY
// ============================================================

const checkAvailability = async (req, res, next) => {
  try {
    const result = await bookingService.checkAvailability(
      req.params.rideId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Ride availability checked successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// UPDATE PASSENGER COUNT
// ============================================================

const updatePassengerCount = async (req, res, next) => {
  try {
    const result = await bookingService.updatePassengerCount(
      req.user.id,
      req.params.bookingId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Passenger count updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// COMPLETE BOOKING
// ============================================================

const completeBooking = async (req, res, next) => {
  try {
    const result = await bookingService.completeBooking(
      req.user.id,
      req.params.bookingId
    );

    return res.status(200).json({
      success: true,
      message: "Booking completed successfully",
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
  createBooking,
  getBookingById,
  getMyBookings,
  getRideBookings,
  confirmBooking,
  cancelBooking,
  rejectBooking,
  getBookingStatus,
  checkAvailability,
  updatePassengerCount,
  completeBooking
};