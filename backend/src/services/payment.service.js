// backend/src/services/payment.service.js

const paymentRepository = require("../repositories/payment.repository.js");
const tripRepository = require("../repositories/trip.repository.js");
const bookingRepository = require("../repositories/booking.repository.js");
const walletService = require("./wallet.service.js");
const paypal = require("../config/paypal.js");


// ============================================================
// CONSTANTS
// ============================================================

const PAYMENT_METHODS = [
  "CASH",
  "CARD",
  "PAYPAL",
  "WALLET",
];

const PAYMENT_STATUSES = [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
];


// ============================================================
// HELPERS
// ============================================================

/**
 * Validate payment method.
 */
const validatePaymentMethod = (paymentMethod) => {
  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    throw new Error(
      `Invalid payment method. Allowed methods: ${PAYMENT_METHODS.join(", ")}`
    );
  }
  return true;
};


/**
 * Get trip and verify that the user
 * is allowed to make/view payment.
 */
const verifyTripAccess = async (userId, tripId) => {
  const trip = await tripRepository.findTripById(tripId);

  if (!trip) {
    throw new Error("Trip not found.");
  }

  const isDriver = trip.driverId === userId;

  const booking = await bookingRepository.findBookingByPassengerAndRide(
    userId,
    trip.rideId
  );

  const isPassenger = !!booking;

  if (!isDriver && !isPassenger) {
    throw new Error(
      "You are not authorized to access this trip payment."
    );
  }

  return { trip, booking, isDriver, isPassenger };
};


/**
 * Get passenger booking amount.
 */
const getBookingAmount = async (userId, tripId) => {
  const { trip, booking } = await verifyTripAccess(userId, tripId);

  if (!booking) {
    throw new Error("Passenger booking not found.");
  }

  const amount = Number(booking.amount || 0);

  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Invalid booking amount.");
  }

  return { trip, booking, amount };
};


// ============================================================
// CREATE PAYMENT
// ============================================================

/**
 * Create a payment record.
 *
 * Cash:
 * - Payment can be recorded directly.
 *
 * PayPal (CARD / PAYPAL):
 * - Create a PayPal order → return order ID + approval URL.
 * - Frontend redirects user to PayPal approval page.
 * - On return, call capturePaypalPayment() to finalize.
 *
 * Wallet:
 * - Check wallet balance.
 * - Deduct wallet balance.
 */
exports.createPayment = async (userId, tripId, paymentMethod) => {
  validatePaymentMethod(paymentMethod);

  const { trip, booking, amount } = await getBookingAmount(userId, tripId);

  if (trip.status !== "COMPLETED") {
    throw new Error(
      "Payment can only be processed after trip completion."
    );
  }

  if (booking.paymentStatus === "COMPLETED") {
    throw new Error("This booking has already been paid.");
  }


  // ----------------------------------------------------------
  // CASH PAYMENT
  // ----------------------------------------------------------

  if (paymentMethod === "CASH") {
    const payment = await paymentRepository.createPayment({
      userId,
      tripId,
      bookingId: booking.id,
      amount,
      paymentMethod: "CASH",
      status: "COMPLETED",
      currency: "USD",
      paidAt: new Date(),
    });

    await bookingRepository.updateBooking(booking.id, {
      paymentStatus: "COMPLETED",
    });

    return payment;
  }


  // ----------------------------------------------------------
  // WALLET PAYMENT
  // ----------------------------------------------------------

  if (paymentMethod === "WALLET") {
    const walletPayment = await processWalletPayment(
      userId,
      tripId,
      booking.id,
      amount
    );
    return walletPayment;
  }


  // ----------------------------------------------------------
  // PAYPAL PAYMENT (CARD / PAYPAL)
  // ----------------------------------------------------------

  const order = await exports.createPaypalOrder(amount, tripId);

  const payment = await paymentRepository.createPayment({
    userId,
    tripId,
    bookingId: booking.id,
    amount,
    paymentMethod,
    status: "PENDING",
    currency: "USD",
    gateway: "PAYPAL",
    paypalOrderId: order.id,
  });

  // Find the approval URL for the frontend redirect
  const approvalUrl = (order.links || []).find(
    (l) => l.rel === "approve"
  )?.href || null;

  return {
    payment,
    paypalOrder: order,
    approvalUrl,
  };
};


// ============================================================
// WALLET PAYMENT
// ============================================================

/**
 * Process payment using wallet.
 */
const processWalletPayment = async (
  userId,
  tripId,
  bookingId,
  amount
) => {
  const wallet = await walletService.getWallet(userId);
  const balance = Number(wallet.balance || 0);

  if (balance < amount) {
    throw new Error(
      `Insufficient wallet balance. Required $${amount}, available $${balance}.`
    );
  }

  const transaction = await walletService.payFromWallet(userId, amount, {
    tripId,
    bookingId,
    description: "Carpool trip payment",
  });

  const payment = await paymentRepository.createPayment({
    userId,
    tripId,
    bookingId,
    amount,
    paymentMethod: "WALLET",
    status: "COMPLETED",
    currency: "USD",
    paidAt: new Date(),
    walletTransactionId: transaction.id,
  });

  await bookingRepository.updateBooking(bookingId, {
    paymentStatus: "COMPLETED",
  });

  return payment;
};


// ============================================================
// PAYPAL ORDER
// ============================================================

/**
 * Create a PayPal order.
 *
 * @param {number} amount - The amount in USD
 * @param {string} tripId - Trip reference ID
 */
exports.createPaypalOrder = async (amount, tripId) => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error("Payment amount must be greater than zero.");
  }

  return paypal.createOrder(numericAmount, "USD", tripId);
};


// ============================================================
// CAPTURE PAYPAL PAYMENT
// ============================================================

/**
 * Capture (finalize) a PayPal payment after user approval.
 *
 * Called by the frontend after the user returns from PayPal.
 *
 * @param {object} options
 * @param {string} options.userId
 * @param {string} options.paymentId  - Internal payment DB record ID
 * @param {string} options.paypalOrderId - PayPal order ID
 */
exports.capturePaypalPayment = async ({
  userId,
  paymentId,
  paypalOrderId,
}) => {
  if (!paymentId || !paypalOrderId) {
    throw new Error("Payment ID and PayPal order ID are required.");
  }

  const payment = await paymentRepository.findPaymentById(paymentId);

  if (!payment) {
    throw new Error("Payment record not found.");
  }

  if (payment.userId !== userId) {
    throw new Error("You are not authorized to capture this payment.");
  }

  if (payment.paypalOrderId !== paypalOrderId) {
    throw new Error("PayPal order ID does not match payment record.");
  }

  // Call PayPal to capture the order
  let captureData;
  try {
    captureData = await paypal.captureOrder(paypalOrderId);
  } catch (err) {
    await paymentRepository.updatePayment(paymentId, { status: "FAILED" });
    throw new Error(`PayPal capture failed: ${err.message}`);
  }

  if (captureData.status !== "COMPLETED") {
    await paymentRepository.updatePayment(paymentId, { status: "FAILED" });
    throw new Error(
      `PayPal payment not completed. Status: ${captureData.status}`
    );
  }

  // Extract capture ID from the response
  const captureId =
    captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id || null;

  const updatedPayment = await paymentRepository.updatePayment(paymentId, {
    status: "COMPLETED",
    paypalCaptureId: captureId,
    paidAt: new Date(),
  });

  await bookingRepository.updateBooking(payment.bookingId, {
    paymentStatus: "COMPLETED",
  });

  return updatedPayment;
};


// ============================================================
// PAYMENT DETAILS
// ============================================================

/**
 * Get payment by ID.
 */
exports.getPaymentById = async (userId, paymentId) => {
  const payment = await paymentRepository.findPaymentById(paymentId);

  if (!payment) {
    throw new Error("Payment not found.");
  }

  if (payment.userId !== userId) {
    throw new Error("You are not authorized to access this payment.");
  }

  return payment;
};


/**
 * Get payments for a user.
 */
exports.getMyPayments = async (userId, options = {}) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  return paymentRepository.getPaymentsByUser(userId, options);
};


/**
 * Get payments for a trip.
 */
exports.getTripPayments = async (userId, tripId) => {
  const { trip } = await verifyTripAccess(userId, tripId);

  return paymentRepository.getPaymentsByTrip(trip.id);
};


// ============================================================
// REFUND
// ============================================================

/**
 * Refund a payment.
 *
 * - WALLET payments: credit the wallet back.
 * - PAYPAL payments: call PayPal refund API.
 * - CASH payments: mark as refunded (manual process).
 */
exports.refundPayment = async (userId, paymentId, reason = null) => {
  const payment = await paymentRepository.findPaymentById(paymentId);

  if (!payment) {
    throw new Error("Payment not found.");
  }

  if (payment.userId !== userId) {
    throw new Error("You are not authorized to refund this payment.");
  }

  if (payment.status !== "COMPLETED") {
    throw new Error("Only completed payments can be refunded.");
  }

  // Wallet refund
  if (payment.paymentMethod === "WALLET") {
    await walletService.creditWallet(userId, payment.amount, {
      tripId: payment.tripId,
      paymentId: payment.id,
      description: "Trip payment refund",
    });
  }

  // PayPal refund
  if (
    payment.gateway === "PAYPAL" &&
    payment.paypalCaptureId
  ) {
    await paypal.refundCapture(
      payment.paypalCaptureId,
      Number(payment.amount)
    );
  }

  return paymentRepository.updatePayment(paymentId, {
    status: "REFUNDED",
    refundedAt: new Date(),
    refundReason: reason,
  });
};


// ============================================================
// PAYMENT STATUS
// ============================================================

/**
 * Check payment status.
 */
exports.getPaymentStatus = async (userId, paymentId) => {
  const payment = await exports.getPaymentById(userId, paymentId);

  return {
    paymentId: payment.id,
    status: payment.status,
    paymentMethod: payment.paymentMethod,
    amount: payment.amount,
    currency: payment.currency,
    paidAt: payment.paidAt || null,
  };
};


// ============================================================
// PAYMENT ELIGIBILITY
// ============================================================

/**
 * Check whether user can make payment for a trip.
 */
exports.canMakePayment = async (userId, tripId) => {
  try {
    const { trip, booking } = await getBookingAmount(userId, tripId);

    if (trip.status !== "COMPLETED") {
      return {
        allowed: false,
        reason: "Trip must be completed before payment.",
      };
    }

    if (!booking) {
      return {
        allowed: false,
        reason: "Passenger booking not found.",
      };
    }

    if (booking.paymentStatus === "COMPLETED") {
      return {
        allowed: false,
        reason: "Payment has already been completed.",
      };
    }

    return {
      allowed: true,
      amount: Number(booking.amount || 0),
      methods: PAYMENT_METHODS,
    };
  } catch (error) {
    return {
      allowed: false,
      reason: error.message,
    };
  }
};


// ============================================================
// PAYMENT SUMMARY
// ============================================================

/**
 * Get payment summary for a user.
 */
exports.getPaymentSummary = async (userId) => {
  const summary = await paymentRepository.getPaymentSummary(userId);

  return {
    totalPayments: summary.totalPayments || 0,
    totalAmount: summary.totalAmount || 0,
    completedPayments: summary.completedPayments || 0,
    pendingPayments: summary.pendingPayments || 0,
    failedPayments: summary.failedPayments || 0,
    refundedAmount: summary.refundedAmount || 0,
  };
};