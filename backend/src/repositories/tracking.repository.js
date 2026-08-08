// backend/src/repositories/tracking.repository.js

import prisma from "../config/database.js";

/**
 * Create a new tracking/location record.
 */
export const createTrackingRecord = async (trackingData) => {
  return prisma.tracking.create({
    data: {
      tripId: trackingData.tripId,
      latitude: trackingData.latitude,
      longitude: trackingData.longitude,

      speed: trackingData.speed || null,
      heading: trackingData.heading || null,
      accuracy: trackingData.accuracy || null,

      recordedAt: trackingData.recordedAt || new Date(),
    },
  });
};


/**
 * Get the latest location of a trip.
 */
export const getLatestLocation = async (tripId) => {
  return prisma.tracking.findFirst({
    where: {
      tripId,
    },

    orderBy: {
      recordedAt: "desc",
    },
  });
};


/**
 * Get complete location history of a trip.
 */
export const getTripLocationHistory = async (
  tripId
) => {
  return prisma.tracking.findMany({
    where: {
      tripId,
    },

    orderBy: {
      recordedAt: "asc",
    },
  });
};


/**
 * Get recent tracking records.
 */
export const getRecentTrackingRecords = async (
  tripId,
  limit = 50
) => {
  return prisma.tracking.findMany({
    where: {
      tripId,
    },

    orderBy: {
      recordedAt: "desc",
    },

    take: limit,
  });
};


/**
 * Check whether tracking data exists for a trip.
 */
export const trackingDataExists = async (
  tripId
) => {
  const record = await prisma.tracking.findFirst({
    where: {
      tripId,
    },

    select: {
      id: true,
    },
  });

  return Boolean(record);
};


/**
 * Delete tracking records for a trip.
 */
export const deleteTripTracking = async (
  tripId
) => {
  return prisma.tracking.deleteMany({
    where: {
      tripId,
    },
  });
};


/**
 * Count tracking records for a trip.
 */
export const countTripTrackingRecords = async (
  tripId
) => {
  return prisma.tracking.count({
    where: {
      tripId,
    },
  });
};


/**
 * Get tracking records within a time range.
 */
export const getTrackingByTimeRange = async (
  tripId,
  startTime,
  endTime
) => {
  return prisma.tracking.findMany({
    where: {
      tripId,

      recordedAt: {
        gte: startTime,
        lte: endTime,
      },
    },

    orderBy: {
      recordedAt: "asc",
    },
  });
};


/**
 * Get latest locations for multiple active trips.
 *
 * Useful for admin/organization monitoring.
 */
export const getLatestLocationsForTrips = async (
  tripIds
) => {
  const records = [];

  for (const tripId of tripIds) {
    const location = await getLatestLocation(tripId);

    if (location) {
      records.push(location);
    }
  }

  return records;
};


/**
 * Check whether a trip has recent location data.
 *
 * Useful for detecting inactive GPS updates.
 */
export const hasRecentLocation = async (
  tripId,
  seconds = 60
) => {
  const minimumTime = new Date(
    Date.now() - seconds * 1000
  );

  const location = await prisma.tracking.findFirst({
    where: {
      tripId,

      recordedAt: {
        gte: minimumTime,
      },
    },

    select: {
      id: true,
      recordedAt: true,
    },

    orderBy: {
      recordedAt: "desc",
    },
  });

  return Boolean(location);
};