// backend/src/services/history.service.js

const historyRepository =
  require("../repositories/history.repository.js");

const tripRepository =
  require("../repositories/trip.repository.js");

const bookingRepository =
  require("../repositories/booking.repository.js");

const paymentRepository =
  require("../repositories/payment.repository.js");


// ============================================================
// HELPERS
// ============================================================

const verifyTripAccess = async (
  userId,
  tripId
) => {
  const trip =
    await tripRepository.findTripById(
      tripId
    );

  if (!trip) {
    throw new Error(
      "Trip not found."
    );
  }

  // Driver
  if (
    trip.driverId === userId
  ) {
    return {
      trip,
      role: "DRIVER",
      booking: null,
    };
  }

  // Passenger
  const booking =
    await bookingRepository.findBookingByPassengerAndRide(
      userId,
      trip.rideId
    );

  if (!booking) {
    throw new Error(
      "You are not a participant of this trip."
    );
  }

  return {
    trip,
    role: "PASSENGER",
    booking,
  };
};


// ============================================================
// CREATE HISTORY
// ============================================================

/**
 * Create ride history after a trip is completed.
 *
 * This should normally be called by the trip
 * completion workflow.
 */
const createHistory = async (
  userId,
  tripId
) => {
  const {
    trip,
    role,
    booking,
  } =
    await verifyTripAccess(
      userId,
      tripId
    );

  if (
    trip.status !==
    "COMPLETED"
  ) {
    throw new Error(
      "Ride history can only be created for completed trips."
    );
  }

  /*
   * Prevent duplicate history records.
   */
  const existing =
    await historyRepository.findHistoryByUserAndTrip(
      userId,
      tripId
    );

  if (existing) {
    return existing;
  }

  let payment = null;

  if (booking) {
    payment =
      await paymentRepository.findPaymentByBookingId(
        booking.id
      );
  } else {
    /*
     * Driver may have payment records
     * associated with the trip.
     */
    payment =
      await paymentRepository.findPaymentByTripAndUser(
        tripId,
        userId
      );
  }

  const history =
    await historyRepository.createHistory({
      userId,

      tripId,

      bookingId:
        booking?.id || null,

      role,

      rideId:
        trip.rideId,

      driverId:
        trip.driverId,

      status:
        "COMPLETED",

      paymentId:
        payment?.id || null,

      amount:
        booking?.amount ||
        payment?.amount ||
        0,

      paymentMethod:
        payment?.paymentMethod ||
        null,

      paymentStatus:
        payment?.status ||
        "PENDING",

      completedAt:
        trip.completedAt ||
        new Date(),
    });

  return history;
};


// ============================================================
// GET MY HISTORY
// ============================================================

/**
 * Get all ride history for current user.
 */
const getMyHistory = async (
  userId,
  options = {}
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  const {
    page = 1,
    limit = 20,
    role,
    status,
    startDate,
    endDate,
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

  return historyRepository.getHistoryByUser(
    userId,
    {
      page:
        safePage,

      limit:
        safeLimit,

      role:
        role || undefined,

      status:
        status || undefined,

      startDate:
        startDate || undefined,

      endDate:
        endDate || undefined,
    }
  );
};


// ============================================================
// GET SINGLE HISTORY
// ============================================================

/**
 * Get one history record.
 */
const getHistoryById = async (
  userId,
  historyId
) => {
  const history =
    await historyRepository.findHistoryById(
      historyId
    );

  if (!history) {
    throw new Error(
      "Ride history not found."
    );
  }

  if (
    history.userId !== userId
  ) {
    throw new Error(
      "You are not authorized to access this history."
    );
  }

  return history;
};


// ============================================================
// GET TRIP HISTORY
// ============================================================

/**
 * Get history for a specific trip.
 */
const getTripHistory = async (
  userId,
  tripId
) => {
  await verifyTripAccess(
    userId,
    tripId
  );

  return historyRepository.getHistoryByTrip(
    tripId
  );
};


// ============================================================
// GET DRIVER HISTORY
// ============================================================

/**
 * Get rides where current user
 * was the driver.
 */
const getDriverHistory = async (
  userId,
  options = {}
) => {
  return historyRepository.getHistoryByUser(
    userId,
    {
      ...options,
      role: "DRIVER",
    }
  );
};


// ============================================================
// GET PASSENGER HISTORY
// ============================================================

/**
 * Get rides where current user
 * was a passenger.
 */
const getPassengerHistory = async (
  userId,
  options = {}
) => {
  return historyRepository.getHistoryByUser(
    userId,
    {
      ...options,
      role: "PASSENGER",
    }
  );
};


// ============================================================
// HISTORY SUMMARY
// ============================================================

/**
 * Summary for dashboard/reports.
 */
const getHistorySummary = async (
  userId
) => {
  const summary =
    await historyRepository.getHistorySummary(
      userId
    );

  return {
    totalRides:
      summary.totalRides || 0,

    completedRides:
      summary.completedRides || 0,

    cancelledRides:
      summary.cancelledRides || 0,

    driverRides:
      summary.driverRides || 0,

    passengerRides:
      summary.passengerRides || 0,

    totalSpent:
      Number(
        summary.totalSpent || 0
      ),

    totalEarned:
      Number(
        summary.totalEarned || 0
      ),
  };
};


// ============================================================
// SEARCH HISTORY
// ============================================================

/**
 * Search history using route,
 * date, role, etc.
 */
const searchHistory = async (
  userId,
  filters = {}
) => {
  return historyRepository.searchHistory(
    userId,
    {
      query:
        filters.query || undefined,

      role:
        filters.role || undefined,

      paymentMethod:
        filters.paymentMethod ||
        undefined,

      paymentStatus:
        filters.paymentStatus ||
        undefined,

      startDate:
        filters.startDate ||
        undefined,

      endDate:
        filters.endDate ||
        undefined,

      page:
        Math.max(
          Number(filters.page) || 1,
          1
        ),

      limit:
        Math.min(
          Math.max(
            Number(filters.limit) || 20,
            1
          ),
          100
        ),
    }
  );
};


// ============================================================
// REFRESH PAYMENT STATUS
// ============================================================

/**
 * Update history payment status
 * from the latest payment record.
 */
const syncPaymentStatus = async (
  userId,
  historyId
) => {
  const history =
    await getHistoryById(
      userId,
      historyId
    );

  if (
    !history.paymentId
  ) {
    return history;
  }

  const payment =
    await paymentRepository.findPaymentById(
      history.paymentId
    );

  if (!payment) {
    return history;
  }

  return historyRepository.updateHistory(
    history.id,
    {
      paymentStatus:
        payment.status,

      paymentMethod:
        payment.paymentMethod,

      amount:
        payment.amount,
    }
  );
};


// ============================================================
// DELETE HISTORY
// ============================================================

/**
 * Normally ride history should not be
 * physically deleted because it is useful
 * for reports and financial records.
 *
 * Instead, archive it.
 */
const archiveHistory = async (
  userId,
  historyId
) => {
  const history =
    await getHistoryById(
      userId,
      historyId
    );

  return historyRepository.updateHistory(
    history.id,
    {
      archived:
        true,

      archivedAt:
        new Date(),
    }
  );
};


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createHistory,

  getMyHistory,

  getHistoryById,

  getTripHistory,

  getDriverHistory,

  getPassengerHistory,

  getHistorySummary,

  searchHistory,

  syncPaymentStatus,

  archiveHistory,
};