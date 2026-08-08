const reportService = require("../services/report.service.js");


// ============================================================
// GET OVERVIEW REPORT
// ============================================================

const getOverviewReport = async (req, res, next) => {
  try {
    const result = await reportService.getOverviewReport(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Overview report fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET RIDE REPORT
// ============================================================

const getRideReport = async (req, res, next) => {
  try {
    const result = await reportService.getRideReport(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Ride report fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET BOOKING REPORT
// ============================================================

const getBookingReport = async (req, res, next) => {
  try {
    const result = await reportService.getBookingReport(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Booking report fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET TRIP REPORT
// ============================================================

const getTripReport = async (req, res, next) => {
  try {
    const result = await reportService.getTripReport(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Trip report fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET PAYMENT REPORT
// ============================================================

const getPaymentReport = async (req, res, next) => {
  try {
    const result = await reportService.getPaymentReport(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Payment report fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET WALLET REPORT
// ============================================================

const getWalletReport = async (req, res, next) => {
  try {
    const result = await reportService.getWalletReport(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Wallet report fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET DRIVER REPORT
// ============================================================

const getDriverReport = async (req, res, next) => {
  try {
    const result = await reportService.getDriverReport(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Driver report fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET PASSENGER REPORT
// ============================================================

const getPassengerReport = async (req, res, next) => {
  try {
    const result = await reportService.getPassengerReport(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Passenger report fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET ORGANIZATION REPORT
// ============================================================

const getOrganizationReport = async (req, res, next) => {
  try {
    const result = await reportService.getOrganizationReport(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Organization report fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET REPORT SUMMARY
// ============================================================

const getReportSummary = async (req, res, next) => {
  try {
    const result = await reportService.getReportSummary(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Report summary fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// EXPORT REPORT
// ============================================================

const exportReport = async (req, res, next) => {
  try {
    const result = await reportService.exportReport(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Report exported successfully",
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
  getOverviewReport,
  getRideReport,
  getBookingReport,
  getTripReport,
  getPaymentReport,
  getWalletReport,
  getDriverReport,
  getPassengerReport,
  getOrganizationReport,
  getReportSummary,
  exportReport
};