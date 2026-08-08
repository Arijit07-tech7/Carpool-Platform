const paymentService = require("../services/payment.service.js");


// ============================================================
// CREATE PAYMENT
// ============================================================

const createPayment = async (req, res, next) => {
  try {
    const result = await paymentService.createPayment(
      req.user.id,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET PAYMENT BY ID
// ============================================================

const getPaymentById = async (req, res, next) => {
  try {
    const result = await paymentService.getPaymentById(
      req.params.paymentId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Payment details fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET PAYMENT STATUS
// ============================================================

const getPaymentStatus = async (req, res, next) => {
  try {
    const result = await paymentService.getPaymentStatus(
      req.params.paymentId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Payment status fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// VERIFY PAYMENT
// ============================================================

const verifyPayment = async (req, res, next) => {
  try {
    const result = await paymentService.verifyPayment(
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// PROCESS REFUND
// ============================================================

const processRefund = async (req, res, next) => {
  try {
    const result = await paymentService.processRefund(
      req.user.id,
      req.params.paymentId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET MY PAYMENTS
// ============================================================

const getMyPayments = async (req, res, next) => {
  try {
    const result = await paymentService.getMyPayments(
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
// GET TRIP PAYMENTS
// ============================================================

const getTripPayments = async (req, res, next) => {
  try {
    const result = await paymentService.getTripPayments(
      req.params.tripId,
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Trip payments fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET BOOKING PAYMENT
// ============================================================

const getBookingPayment = async (req, res, next) => {
  try {
    const result = await paymentService.getBookingPayment(
      req.params.bookingId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Booking payment fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// PAYMENT WEBHOOK
// ============================================================

const paymentWebhook = async (req, res, next) => {
  try {
    const result = await paymentService.handleWebhook(
      req.body,
      req.headers
    );

    return res.status(200).json({
      success: true,
      message: "Payment webhook processed successfully",
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
  createPayment,
  getPaymentById,
  getPaymentStatus,
  verifyPayment,
  processRefund,
  getMyPayments,
  getTripPayments,
  getBookingPayment,
  paymentWebhook
};