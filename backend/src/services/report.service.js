// backend/src/services/report.service.js

const reportRepository =
  require("../repositories/report.repository.js");


// ============================================================
// HELPERS
// ============================================================

const normalizeDate = (date) => {
  if (!date) {
    return null;
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    throw new Error(
      "Invalid date."
    );
  }

  return parsedDate;
};


const normalizePagination = (
  page = 1,
  limit = 20
) => {
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

  return {
    page: safePage,
    limit: safeLimit,
  };
};


// ============================================================
// EMPLOYEE DASHBOARD
// ============================================================

/**
 * Complete report dashboard for an employee.
 *
 * This combines:
 * - Ride statistics
 * - Payment statistics
 * - Driver statistics
 * - Passenger statistics
 * - Wallet statistics
 */
const getEmployeeDashboard = async (
  userId,
  filters = {}
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  const startDate =
    normalizeDate(
      filters.startDate
    );

  const endDate =
    normalizeDate(
      filters.endDate
    );

  const options = {
    startDate,
    endDate,
  };

  const [
    rideStats,
    paymentStats,
    driverStats,
    passengerStats,
    walletStats,
  ] = await Promise.all([
    reportRepository.getRideStatistics(
      userId,
      options
    ),

    reportRepository.getPaymentStatistics(
      userId,
      options
    ),

    reportRepository.getDriverStatistics(
      userId,
      options
    ),

    reportRepository.getPassengerStatistics(
      userId,
      options
    ),

    reportRepository.getWalletStatistics(
      userId,
      options
    ),
  ]);

  return {
    period: {
      startDate,
      endDate,
    },

    rides:
      rideStats,

    payments:
      paymentStats,

    driver:
      driverStats,

    passenger:
      passengerStats,

    wallet:
      walletStats,
  };
};


// ============================================================
// RIDE REPORT
// ============================================================

/**
 * Get ride-related analytics.
 */
const getRideReport = async (
  userId,
  filters = {}
) => {
  const startDate =
    normalizeDate(
      filters.startDate
    );

  const endDate =
    normalizeDate(
      filters.endDate
    );

  return reportRepository.getRideStatistics(
    userId,
    {
      startDate,
      endDate,
    }
  );
};


// ============================================================
// PAYMENT REPORT
// ============================================================

/**
 * Get payment analytics.
 */
const getPaymentReport = async (
  userId,
  filters = {}
) => {
  const startDate =
    normalizeDate(
      filters.startDate
    );

  const endDate =
    normalizeDate(
      filters.endDate
    );

  return reportRepository.getPaymentStatistics(
    userId,
    {
      startDate,
      endDate,
    }
  );
};


// ============================================================
// DRIVER REPORT
// ============================================================

/**
 * Statistics for rides offered by
 * the current employee.
 */
const getDriverReport = async (
  userId,
  filters = {}
) => {
  const startDate =
    normalizeDate(
      filters.startDate
    );

  const endDate =
    normalizeDate(
      filters.endDate
    );

  return reportRepository.getDriverStatistics(
    userId,
    {
      startDate,
      endDate,
    }
  );
};


// ============================================================
// PASSENGER REPORT
// ============================================================

/**
 * Statistics for rides taken by
 * the current employee.
 */
const getPassengerReport = async (
  userId,
  filters = {}
) => {
  const startDate =
    normalizeDate(
      filters.startDate
    );

  const endDate =
    normalizeDate(
      filters.endDate
    );

  return reportRepository.getPassengerStatistics(
    userId,
    {
      startDate,
      endDate,
    }
  );
};


// ============================================================
// WALLET REPORT
// ============================================================

/**
 * Wallet-related analytics.
 */
const getWalletReport = async (
  userId,
  filters = {}
) => {
  const startDate =
    normalizeDate(
      filters.startDate
    );

  const endDate =
    normalizeDate(
      filters.endDate
    );

  return reportRepository.getWalletStatistics(
    userId,
    {
      startDate,
      endDate,
    }
  );
};


// ============================================================
// PAYMENT METHOD REPORT
// ============================================================

/**
 * Shows how much the employee
 * paid through:
 *
 * CASH
 * CARD
 * UPI
 * WALLET
 */
const getPaymentMethodReport =
  async (
    userId,
    filters = {}
  ) => {
    const startDate =
      normalizeDate(
        filters.startDate
      );

    const endDate =
      normalizeDate(
        filters.endDate
      );

    return reportRepository.getPaymentMethodBreakdown(
      userId,
      {
        startDate,
        endDate,
      }
    );
  };


// ============================================================
// MONTHLY REPORT
// ============================================================

/**
 * Monthly ride/payment statistics.
 *
 * Useful for charts.
 */
const getMonthlyReport = async (
  userId,
  year
) => {
  const currentYear =
    new Date().getFullYear();

  const selectedYear =
    Number(year) || currentYear;

  if (
    selectedYear < 2000 ||
    selectedYear > currentYear + 1
  ) {
    throw new Error(
      "Invalid report year."
    );
  }

  return reportRepository.getMonthlyStatistics(
    userId,
    selectedYear
  );
};


// ============================================================
// ROUTE REPORT
// ============================================================

/**
 * Most frequently used routes.
 */
const getRouteReport = async (
  userId,
  filters = {}
) => {
  const startDate =
    normalizeDate(
      filters.startDate
    );

  const endDate =
    normalizeDate(
      filters.endDate
    );

  const {
    page,
    limit,
  } =
    normalizePagination(
      filters.page,
      filters.limit
    );

  return reportRepository.getPopularRoutes(
    userId,
    {
      startDate,
      endDate,
      page,
      limit,
    }
  );
};


// ============================================================
// ORGANIZATION REPORT
// ============================================================

/**
 * Organization-level analytics.
 *
 * This should be protected by the
 * organization/admin authorization middleware.
 */
const getOrganizationReport =
  async (
    userId,
    organizationId,
    filters = {}
  ) => {
    if (!organizationId) {
      throw new Error(
        "Organization ID is required."
      );
    }

    const startDate =
      normalizeDate(
        filters.startDate
      );

    const endDate =
      normalizeDate(
        filters.endDate
      );

    return reportRepository.getOrganizationStatistics(
      organizationId,
      {
        startDate,
        endDate,
      }
    );
  };


// ============================================================
// ORGANIZATION USAGE REPORT
// ============================================================

/**
 * Organization carpool usage.
 *
 * Useful for admin dashboard:
 * - Active employees
 * - Total rides
 * - Total bookings
 * - Total distance
 * - Total spending
 */
const getOrganizationUsageReport =
  async (
    userId,
    organizationId,
    filters = {}
  ) => {
    if (!organizationId) {
      throw new Error(
        "Organization ID is required."
      );
    }

    const startDate =
      normalizeDate(
        filters.startDate
      );

    const endDate =
      normalizeDate(
        filters.endDate
      );

    return reportRepository.getOrganizationUsage(
      organizationId,
      {
        startDate,
        endDate,
      }
    );
  };


// ============================================================
// SAVINGS REPORT
// ============================================================

/**
 * Estimate user's carpool savings.
 *
 * The actual calculation rules should be
 * implemented in the repository based on
 * your project's fare/distance data.
 */
const getSavingsReport = async (
  userId,
  filters = {}
) => {
  const startDate =
    normalizeDate(
      filters.startDate
    );

  const endDate =
    normalizeDate(
      filters.endDate
    );

  return reportRepository.getSavingsStatistics(
    userId,
    {
      startDate,
      endDate,
    }
  );
};


// ============================================================
// DISTANCE REPORT
// ============================================================

/**
 * Total distance travelled through
 * the carpool platform.
 */
const getDistanceReport = async (
  userId,
  filters = {}
) => {
  const startDate =
    normalizeDate(
      filters.startDate
    );

  const endDate =
    normalizeDate(
      filters.endDate
    );

  return reportRepository.getDistanceStatistics(
    userId,
    {
      startDate,
      endDate,
    }
  );
};


// ============================================================
// EXPORT REPORT DATA
// ============================================================

/**
 * Return report data in a format that
 * frontend can convert to CSV/PDF.
 */
const getExportData = async (
  userId,
  filters = {}
) => {
  const dashboard =
    await getEmployeeDashboard(
      userId,
      filters
    );

  return {
    generatedAt:
      new Date(),

    userId,

    period: {
      startDate:
        dashboard.period.startDate,

      endDate:
        dashboard.period.endDate,
    },

    data:
      dashboard,
  };
};


// ============================================================
// ADMIN SUMMARY
// ============================================================

/**
 * Platform/organization admin summary.
 *
 * Authorization must be checked by
 * admin middleware/controller.
 */
const getAdminSummary = async (
  organizationId,
  filters = {}
) => {
  if (!organizationId) {
    throw new Error(
      "Organization ID is required."
    );
  }

  const startDate =
    normalizeDate(
      filters.startDate
    );

  const endDate =
    normalizeDate(
      filters.endDate
    );

  const [
    users,
    rides,
    bookings,
    payments,
    vehicles,
  ] = await Promise.all([
    reportRepository.getEmployeeCount(
      organizationId
    ),

    reportRepository.getOrganizationRideCount(
      organizationId,
      {
        startDate,
        endDate,
      }
    ),

    reportRepository.getOrganizationBookingCount(
      organizationId,
      {
        startDate,
        endDate,
      }
    ),

    reportRepository.getOrganizationPaymentSummary(
      organizationId,
      {
        startDate,
        endDate,
      }
    ),

    reportRepository.getVehicleCount(
      organizationId
    ),
  ]);

  return {
    employees:
      users,

    rides:
      rides,

    bookings:
      bookings,

    payments:
      payments,

    vehicles:
      vehicles,

    period: {
      startDate,
      endDate,
    },
  };
};


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getEmployeeDashboard,

  getRideReport,

  getPaymentReport,

  getDriverReport,

  getPassengerReport,

  getWalletReport,

  getPaymentMethodReport,

  getMonthlyReport,

  getRouteReport,

  getOrganizationReport,

  getOrganizationUsageReport,

  getSavingsReport,

  getDistanceReport,

  getExportData,

  getAdminSummary,
};