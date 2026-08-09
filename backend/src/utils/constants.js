// backend/src/utils/constants.js

// ============================================================
// USER ROLES
// ============================================================

const USER_ROLES = {
  EMPLOYEE: "EMPLOYEE",
  COMPANY_ADMIN: "COMPANY_ADMIN"
};


// ============================================================
// USER STATUS
// ============================================================

const USER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
  PENDING: "PENDING"
};


// ============================================================
// RIDE STATUS
// ============================================================

const RIDE_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  FULL: "FULL",
  STARTED: "STARTED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};


// ============================================================
// BOOKING STATUS
// ============================================================

const BOOKING_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED"
};


// ============================================================
// TRIP STATUS
// ============================================================

const TRIP_STATUS = {
  SCHEDULED: "SCHEDULED",
  STARTED: "STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};


// ============================================================
// PAYMENT STATUS
// ============================================================

const PAYMENT_STATUS = {
  CREATED: "CREATED",
  PENDING: "PENDING",
  AUTHORIZED: "AUTHORIZED",
  CAPTURED: "CAPTURED",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
  PARTIALLY_REFUNDED: "PARTIALLY_REFUNDED",
  CANCELLED: "CANCELLED"
};


// ============================================================
// PAYMENT METHODS
// ============================================================

const PAYMENT_METHODS = {
  CASH: "CASH",
  CARD: "CARD",
  UPI: "UPI",
  WALLET: "WALLET"
};


// ============================================================
// VEHICLE STATUS
// ============================================================

const VEHICLE_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  VERIFIED: "VERIFIED",
  PENDING: "PENDING"
};


// ============================================================
// VEHICLE TYPES
// ============================================================

const VEHICLE_TYPES = {
  CAR: "CAR",
  SUV: "SUV",
  HATCHBACK: "HATCHBACK",
  SEDAN: "SEDAN",
  VAN: "VAN",
  OTHER: "OTHER"
};


// ============================================================
// WALLET TRANSACTION TYPES
// ============================================================

const WALLET_TRANSACTION_TYPES = {
  RECHARGE: "RECHARGE",
  PAYMENT: "PAYMENT",
  REFUND: "REFUND",
  CREDIT: "CREDIT",
  DEBIT: "DEBIT"
};


// ============================================================
// WALLET TRANSACTION STATUS
// ============================================================

const WALLET_TRANSACTION_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED"
};


// ============================================================
// NOTIFICATION TYPES
// ============================================================

const NOTIFICATION_TYPES = {
  BOOKING_CONFIRMED: "BOOKING_CONFIRMED",
  BOOKING_CANCELLED: "BOOKING_CANCELLED",
  NEW_BOOKING: "NEW_BOOKING",
  RIDE_CANCELLED: "RIDE_CANCELLED",
  RIDE_REMINDER: "RIDE_REMINDER",
  TRIP_STARTED: "TRIP_STARTED",
  TRIP_UPDATE: "TRIP_UPDATE",
  TRIP_COMPLETED: "TRIP_COMPLETED",
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  PAYMENT_FAILED: "PAYMENT_FAILED"
};


// ============================================================
// NOTIFICATION CHANNELS
// ============================================================

const NOTIFICATION_CHANNELS = {
  EMAIL: "EMAIL",
  PUSH: "PUSH"
};


// ============================================================
// ORGANIZATION STATUS
// ============================================================

const ORGANIZATION_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED"
};


// ============================================================
// MEMBERSHIP STATUS
// ============================================================

const MEMBERSHIP_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PENDING: "PENDING"
};


// ============================================================
// RIDE TYPES
// ============================================================

const RIDE_TYPES = {
  ONE_WAY: "ONE_WAY",
  ROUND_TRIP: "ROUND_TRIP"
};


// ============================================================
// SORT ORDER
// ============================================================

const SORT_ORDER = {
  ASC: "asc",
  DESC: "desc"
};


// ============================================================
// DEFAULT PAGINATION
// ============================================================

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};


// ============================================================
// DEFAULT CURRENCY
// ============================================================

const DEFAULT_CURRENCY = "INR";


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  USER_ROLES,
  USER_STATUS,

  RIDE_STATUS,
  BOOKING_STATUS,
  TRIP_STATUS,

  PAYMENT_STATUS,
  PAYMENT_METHODS,

  VEHICLE_STATUS,
  VEHICLE_TYPES,

  WALLET_TRANSACTION_TYPES,
  WALLET_TRANSACTION_STATUS,

  NOTIFICATION_TYPES,
  NOTIFICATION_CHANNELS,

  ORGANIZATION_STATUS,
  MEMBERSHIP_STATUS,

  RIDE_TYPES,
  SORT_ORDER,

  PAGINATION,
  DEFAULT_CURRENCY
};