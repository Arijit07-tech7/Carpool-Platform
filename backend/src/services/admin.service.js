// backend/src/services/admin.service.js

const adminRepository =
  require("../repositories/admin.repository.js");

const organizationRepository =
  require("../repositories/organization.repository.js");

const userRepository =
  require("../repositories/user.repository.js");

const vehicleRepository =
  require("../repositories/vehicle.repository.js");

const rideRepository =
  require("../repositories/ride.repository.js");


// ============================================================
// ADMIN ACCESS
// ============================================================

/**
 * Verify that the user is an administrator
 * of the requested organization.
 *
 * The actual authentication/role check should
 * also be handled by middleware.
 */
const verifyAdminAccess = async (
  userId,
  organizationId
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  if (!organizationId) {
    throw new Error(
      "Organization ID is required."
    );
  }

  const admin =
    await adminRepository.findOrganizationAdmin(
      userId,
      organizationId
    );

  if (!admin) {
    throw new Error(
      "You are not authorized to manage this organization."
    );
  }

  return admin;
};


// ============================================================
// ORGANIZATION
// ============================================================

/**
 * Get organization information.
 */
const getOrganization = async (
  userId,
  organizationId
) => {
  await verifyAdminAccess(
    userId,
    organizationId
  );

  const organization =
    await organizationRepository.findById(
      organizationId
    );

  if (!organization) {
    throw new Error(
      "Organization not found."
    );
  }

  return organization;
};


/**
 * Update organization configuration.
 */
const updateOrganization = async (
  userId,
  organizationId,
  data
) => {
  await verifyAdminAccess(
    userId,
    organizationId
  );

  const allowedFields = [
    "name",
    "description",
    "address",
    "contactEmail",
    "contactPhone",
    "logo",
  ];

  const updateData = {};

  for (
    const field of allowedFields
  ) {
    if (
      data[field] !== undefined
    ) {
      updateData[field] =
        data[field];
    }
  }

  if (
    Object.keys(updateData)
      .length === 0
  ) {
    throw new Error(
      "No valid organization fields provided."
    );
  }

  return organizationRepository.update(
    organizationId,
    updateData
  );
};


// ============================================================
// EMPLOYEE MANAGEMENT
// ============================================================

/**
 * Get employees belonging to organization.
 */
const getEmployees = async (
  userId,
  organizationId,
  options = {}
) => {
  await verifyAdminAccess(
    userId,
    organizationId
  );

  const {
    page = 1,
    limit = 20,
    search,
    status,
  } = options;

  const safePage =
    Math.max(
      Number(page) || 1,
      1
    );

  const safeLimit =
    Math.min(
      Math.max(
        Number(limit) || 20,
        1
      ),
      100
    );

  return adminRepository.getEmployees(
    organizationId,
    {
      page:
        safePage,

      limit:
        safeLimit,

      search:
        search || undefined,

      status:
        status || undefined,
    }
  );
};


/**
 * Get one employee.
 */
const getEmployee = async (
  userId,
  organizationId,
  employeeId
) => {
  await verifyAdminAccess(
    userId,
    organizationId
  );

  const employee =
    await userRepository.findById(
      employeeId
    );

  if (!employee) {
    throw new Error(
      "Employee not found."
    );
  }

  if (
    employee.organizationId !==
    organizationId
  ) {
    throw new Error(
      "Employee does not belong to this organization."
    );
  }

  return employee;
};


/**
 * Activate employee account.
 */
const activateEmployee = async (
  userId,
  organizationId,
  employeeId
) => {
  await getEmployee(
    userId,
    organizationId,
    employeeId
  );

  return adminRepository.updateEmployeeStatus(
    employeeId,
    organizationId,
    "ACTIVE"
  );
};


/**
 * Deactivate employee account.
 */
const deactivateEmployee = async (
  userId,
  organizationId,
  employeeId
) => {
  await getEmployee(
    userId,
    organizationId,
    employeeId
  );

  return adminRepository.updateEmployeeStatus(
    employeeId,
    organizationId,
    "INACTIVE"
  );
};


// ============================================================
// VEHICLE MANAGEMENT
// ============================================================

/**
 * Get organization vehicles.
 */
const getVehicles = async (
  userId,
  organizationId,
  options = {}
) => {
  await verifyAdminAccess(
    userId,
    organizationId
  );

  const {
    page = 1,
    limit = 20,
    status,
  } = options;

  return adminRepository.getVehicles(
    organizationId,
    {
      page:
        Math.max(
          Number(page) || 1,
          1
        ),

      limit:
        Math.min(
          Math.max(
            Number(limit) || 20,
            1
          ),
          100
        ),

      status:
        status || undefined,
    }
  );
};


/**
 * Approve a vehicle.
 */
const approveVehicle = async (
  userId,
  organizationId,
  vehicleId
) => {
  await verifyAdminAccess(
    userId,
    organizationId
  );

  const vehicle =
    await vehicleRepository.findById(
      vehicleId
    );

  if (!vehicle) {
    throw new Error(
      "Vehicle not found."
    );
  }

  if (
    vehicle.organizationId !==
    organizationId
  ) {
    throw new Error(
      "Vehicle does not belong to this organization."
    );
  }

  return adminRepository.updateVehicleStatus(
    vehicleId,
    organizationId,
    "APPROVED"
  );
};


/**
 * Reject a vehicle.
 */
const rejectVehicle = async (
  userId,
  organizationId,
  vehicleId,
  reason = null
) => {
  await verifyAdminAccess(
    userId,
    organizationId
  );

  const vehicle =
    await vehicleRepository.findById(
      vehicleId
    );

  if (!vehicle) {
    throw new Error(
      "Vehicle not found."
    );
  }

  if (
    vehicle.organizationId !==
    organizationId
  ) {
    throw new Error(
      "Vehicle does not belong to this organization."
    );
  }

  return adminRepository.updateVehicleStatus(
    vehicleId,
    organizationId,
    "REJECTED",
    reason
  );
};


// ============================================================
// RIDE MANAGEMENT
// ============================================================

/**
 * Get organization rides.
 */
const getRides = async (
  userId,
  organizationId,
  options = {}
) => {
  await verifyAdminAccess(
    userId,
    organizationId
  );

  const {
    page = 1,
    limit = 20,
    status,
    startDate,
    endDate,
  } = options;

  return adminRepository.getRides(
    organizationId,
    {
      page:
        Math.max(
          Number(page) || 1,
          1
        ),

      limit:
        Math.min(
          Math.max(
            Number(limit) || 20,
            1
          ),
          100
        ),

      status:
        status || undefined,

      startDate:
        startDate
          ? new Date(startDate)
          : undefined,

      endDate:
        endDate
          ? new Date(endDate)
          : undefined,
    }
  );
};


// ============================================================
// RIDE PARTICIPATION
// ============================================================

/**
 * Get participation statistics.
 */
const getParticipation = async (
  userId,
  organizationId,
  filters = {}
) => {
  await verifyAdminAccess(
    userId,
    organizationId
  );

  return adminRepository.getParticipationStatistics(
    organizationId,
    {
      startDate:
        filters.startDate
          ? new Date(
              filters.startDate
            )
          : undefined,

      endDate:
        filters.endDate
          ? new Date(
              filters.endDate
            )
          : undefined,
    }
  );
};


// ============================================================
// DASHBOARD
// ============================================================

/**
 * Main admin dashboard.
 */
const getDashboard = async (
  userId,
  organizationId
) => {
  await verifyAdminAccess(
    userId,
    organizationId
  );

  const [
    employeeStats,
    vehicleStats,
    rideStats,
    participationStats,
  ] = await Promise.all([
    adminRepository.getEmployeeStatistics(
      organizationId
    ),

    adminRepository.getVehicleStatistics(
      organizationId
    ),

    adminRepository.getRideStatistics(
      organizationId
    ),

    adminRepository.getParticipationStatistics(
      organizationId
    ),
  ]);

  return {
    employees:
      employeeStats,

    vehicles:
      vehicleStats,

    rides:
      rideStats,

    participation:
      participationStats,
  };
};


// ============================================================
// ADMIN SETTINGS
// ============================================================

/**
 * Update organization-level platform settings.
 */
const updateSettings = async (
  userId,
  organizationId,
  settings
) => {
  await verifyAdminAccess(
    userId,
    organizationId
  );

  return adminRepository.updateOrganizationSettings(
    organizationId,
    settings
  );
};


/**
 * Get organization settings.
 */
const getSettings = async (
  userId,
  organizationId
) => {
  await verifyAdminAccess(
    userId,
    organizationId
  );

  return adminRepository.getOrganizationSettings(
    organizationId
  );
};


// ============================================================
// ADMIN AUDIT
// ============================================================

/**
 * Record an administrative action.
 */
const logAdminAction = async (
  userId,
  organizationId,
  action,
  details = null
) => {
  await verifyAdminAccess(
    userId,
    organizationId
  );

  return adminRepository.createAuditLog({
    userId,
    organizationId,
    action,
    details,
    createdAt:
      new Date(),
  });
};


/**
 * Get admin audit history.
 */
const getAuditLogs = async (
  userId,
  organizationId,
  options = {}
) => {
  await verifyAdminAccess(
    userId,
    organizationId
  );

  return adminRepository.getAuditLogs(
    organizationId,
    {
      page:
        Math.max(
          Number(options.page) || 1,
          1
        ),

      limit:
        Math.min(
          Math.max(
            Number(options.limit) || 20,
            1
          ),
          100
        ),
    }
  );
};


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  verifyAdminAccess,

  getOrganization,
  updateOrganization,

  getEmployees,
  getEmployee,
  activateEmployee,
  deactivateEmployee,

  getVehicles,
  approveVehicle,
  rejectVehicle,

  getRides,

  getParticipation,

  getDashboard,

  updateSettings,
  getSettings,

  logAdminAction,
  getAuditLogs,
};