const adminService = require("../services/admin.service.js");


// ============================================================
// GET ADMIN DASHBOARD
// ============================================================

const getDashboard = async (req, res, next) => {
  try {
    const result = await adminService.getDashboard(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Admin dashboard fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET ORGANIZATION DETAILS
// ============================================================

const getOrganizationDetails = async (req, res, next) => {
  try {
    const result = await adminService.getOrganizationDetails(
      req.user.id
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
// GET ORGANIZATION EMPLOYEES
// ============================================================

const getEmployees = async (req, res, next) => {
  try {
    const result = await adminService.getEmployees(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET EMPLOYEE BY ID
// ============================================================

const getEmployeeById = async (req, res, next) => {
  try {
    const result = await adminService.getEmployeeById(
      req.user.id,
      req.params.employeeId
    );

    return res.status(200).json({
      success: true,
      message: "Employee details fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// UPDATE EMPLOYEE STATUS
// ============================================================

const updateEmployeeStatus = async (req, res, next) => {
  try {
    const result = await adminService.updateEmployeeStatus(
      req.user.id,
      req.params.employeeId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Employee status updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// REMOVE EMPLOYEE
// ============================================================

const removeEmployee = async (req, res, next) => {
  try {
    const result = await adminService.removeEmployee(
      req.user.id,
      req.params.employeeId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Employee removed successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET ORGANIZATION VEHICLES
// ============================================================

const getOrganizationVehicles = async (req, res, next) => {
  try {
    const result = await adminService.getOrganizationVehicles(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Organization vehicles fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// VERIFY EMPLOYEE VEHICLE
// ============================================================

const verifyEmployeeVehicle = async (req, res, next) => {
  try {
    const result = await adminService.verifyEmployeeVehicle(
      req.user.id,
      req.params.vehicleId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Employee vehicle verification updated successfully",
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
    const result = await adminService.getOrganizationReport(
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
// GET ORGANIZATION COSTS
// ============================================================

const getOrganizationCosts = async (req, res, next) => {
  try {
    const result = await adminService.getOrganizationCosts(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Organization costs fetched successfully",
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
    const result = await adminService.updateOrganizationSettings(
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
// GET PARTICIPATION STATISTICS
// ============================================================

const getParticipationStatistics = async (req, res, next) => {
  try {
    const result = await adminService.getParticipationStatistics(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Participation statistics fetched successfully",
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
  getDashboard,
  getOrganizationDetails,
  getEmployees,
  getEmployeeById,
  updateEmployeeStatus,
  removeEmployee,
  getOrganizationVehicles,
  verifyEmployeeVehicle,
  getOrganizationReport,
  getOrganizationCosts,
  updateOrganizationSettings,
  getParticipationStatistics
};