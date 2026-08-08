// backend/src/utils/calculate-fare.js

/**
 * Calculate the fare for a ride.
 * Simple placeholder logic.
 */
function calculateFare(distance, vehicleType, baseRate = 10) {
  const d = Number(distance) || 0;
  return baseRate + (d * 5); // Just a simple formula for demo
}

module.exports = {
  calculateFare,
};
