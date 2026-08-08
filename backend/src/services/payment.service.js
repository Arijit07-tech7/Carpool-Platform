
// backend/src/services/payment.service.js

const crypto = require("crypto");

const paymentRepository = require("../repositories/payment.repository.js");
const tripRepository = require("../repositories/trip.repository.js");
const bookingRepository = require("../repositories/booking.repository.js");
const walletService = require("./wallet.service.js");

const razorpay = require("../config/razorpay.js");


// ============================================================
// CONSTANTS
// ============================================================

const PAYMENT_METHODS = [
  "CASH",
  "CARD",
  "UPI",
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
const validatePaymentMethod = (
  paymentMethod
) => {
  if (
    !PAYMENT_METHODS.includes(
      paymentMethod
    )
  ) {
    throw new Error(
      `Invalid payment method. Allowed methods: ${PAYMENT_METHODS.join(
        ", "
      )}`
    );
  }

  return true;
};


/**
 * Get trip and verify that the user
 * is allowed to make/view payment.
 */
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

  const isDriver =
    trip.driverId === userId;

  const booking =
    await bookingRepository.findBookingByPassengerAndRide(
      userId,
      trip.rideId
    );

  const isPassenger =
    !!booking;

  if (
    !isDriver &&
    !isPassenger
  ) {
    throw new Error(
      "You are not authorized to access this trip payment."
    );
  }

  return {
    trip,
    booking,
    isDriver,
    isPassenger,
  };
};


/**
 * Get passenger booking amount.
 */
const getBookingAmount = async (
  userId,
  tripId
) => {
  const {
    trip,
    booking,
  } = await verifyTripAccess(
    userId,
    tripId
  );

  if (!booking) {
    throw new Error(
      "Passenger booking not found."
    );
  }

  const amount =
    Number(
      booking.amount || 0
    );

  if (
    !Number.isFinite(amount) ||
    amount < 0
  ) {
    throw new Error(
      "Invalid booking amount."
    );
  }

  return {
    trip,
    booking,
    amount,
  };
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
 * Card / UPI:
 * - Create Razorpay order.
 *
 * Wallet:
 * - Check wallet balance.
 * - Deduct wallet balance.
 */
exports.createPayment = async (
  userId,
  tripId,
  paymentMethod
) => {
  validatePaymentMethod(
    paymentMethod
  );

  const {
    trip,
    booking,
    amount,
  } = await getBookingAmount(
    userId,
    tripId
  );

  if (
    trip.status !== "COMPLETED"
  ) {
    throw new Error(
      "Payment can only be processed after trip completion."
    );
  }

  if (
    booking.paymentStatus ===
    "COMPLETED"
  ) {
    throw new Error(
      "This booking has already been paid."
    );
  }


  // ----------------------------------------------------------
  // CASH PAYMENT
  // ----------------------------------------------------------

  if (
    paymentMethod === "CASH"
  ) {
    const payment =
      await paymentRepository.createPayment({
        userId,
        tripId,
        bookingId:
          booking.id,

        amount,

        paymentMethod:
          "CASH",

        status:
          "COMPLETED",

        currency:
          "INR",

        paidAt:
          new Date(),
      });

    await bookingRepository.updateBooking(
      booking.id,
      {
        paymentStatus:
          "COMPLETED",
      }
    );

    return payment;
  }


  // ----------------------------------------------------------
  // WALLET PAYMENT
  // ----------------------------------------------------------

  if (
    paymentMethod === "WALLET"
  ) {
    const walletPayment =
      await processWalletPayment(
        userId,
        tripId,
        booking.id,
        amount
      );

    return walletPayment;
  }


  // ----------------------------------------------------------
  // RAZORPAY PAYMENT
  // CARD / UPI
  // ----------------------------------------------------------

  const order =
    await createRazorpayOrder(
      amount,
      tripId
    );

  const payment =
    await paymentRepository.createPayment({
      userId,
      tripId,
      bookingId:
        booking.id,

      amount,

      paymentMethod,

      status:
        "PENDING",

      currency:
        "INR",

      gateway:
        "RAZORPAY",

      gatewayOrderId:
        order.id,
    });

  return {
    payment,
    razorpayOrder: order,
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
  const wallet =
    await walletService.getWallet(
      userId
    );

  const balance =
    Number(
      wallet.balance || 0
    );

  if (
    balance < amount
  ) {
    throw new Error(
      `Insufficient wallet balance. Required ₹${amount}, available ₹${balance}.`
    );
  }

  /*
   * Deduct money from wallet.
   *
   * walletService is responsible for
   * maintaining wallet transaction history.
   */
  const transaction =
    await walletService.payFromWallet(
      userId,
      amount,
      {
        tripId,
        bookingId,
        description:
          "Carpool trip payment",
      }
    );

  const payment =
    await paymentRepository.createPayment({
      userId,
      tripId,
      bookingId,

      amount,

      paymentMethod:
        "WALLET",

      status:
        "COMPLETED",

      currency:
        "INR",

      paidAt:
        new Date(),

      walletTransactionId:
        transaction.id,
    });

  await bookingRepository.updateBooking(
    bookingId,
    {
      paymentStatus:
        "COMPLETED",
    }
  );

  return payment;
};


// ============================================================
// RAZORPAY ORDER
// ============================================================

/**
 * Create Razorpay order.
 *
 * Razorpay amount is stored in paise.
 *
 * Example:
 * ₹100 = 10000 paise
 */
exports.createRazorpayOrder =
  async (
    amount,
    tripId
  ) => {
    if (
      !razorpay
    ) {
      throw new Error(
        "Razorpay is not configured."
      );
    }

    const numericAmount =
      Number(amount);

    if (
      !Number.isFinite(
        numericAmount
      ) ||
      numericAmount <= 0
    ) {
      throw new Error(
        "Payment amount must be greater than zero."
      );
    }

    const options = {
      amount:
        Math.round(
          numericAmount * 100
        ),

      currency:
        "INR",

      receipt:
        `trip_${tripId}_${Date.now()}`,

      notes: {
        tripId:
          String(tripId),
      },
    };

    return razorpay.orders.create(
      options
    );
  };


// ============================================================
// VERIFY RAZORPAY PAYMENT
// ============================================================

/**
 * Verify Razorpay payment signature.
 */
exports.verifyRazorpayPayment =
  async ({
    userId,
    paymentId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  }) => {
    if (
      !paymentId ||
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      throw new Error(
        "Incomplete Razorpay payment information."
      );
    }

    const payment =
      await paymentRepository.findPaymentById(
        paymentId
      );

    if (!payment) {
      throw new Error(
        "Payment record not found."
      );
    }

    if (
      payment.userId !== userId
    ) {
      throw new Error(
        "You are not authorized to verify this payment."
      );
    }

    if (
      payment.gatewayOrderId !==
      razorpayOrderId
    ) {
      throw new Error(
        "Razorpay order ID does not match."
      );
    }

    const secret =
      process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      throw new Error(
        "Razorpay secret is not configured."
      );
    }

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          secret
        )
        .update(
          `${razorpayOrderId}|${razorpayPaymentId}`
        )
        .digest("hex");

    if (
      generatedSignature !==
      razorpaySignature
    ) {
      await paymentRepository.updatePayment(
        paymentId,
        {
          status:
            "FAILED",
        }
      );

      throw new Error(
        "Invalid Razorpay payment signature."
      );
    }

    const updatedPayment =
      await paymentRepository.updatePayment(
        paymentId,
        {
          status:
            "COMPLETED",

          gatewayPaymentId:
            razorpayPaymentId,

          gatewaySignature:
            razorpaySignature,

          paidAt:
            new Date(),
        }
      );

    await bookingRepository.updateBooking(
      payment.bookingId,
      {
        paymentStatus:
          "COMPLETED",
      }
    );

    return updatedPayment;
  };


// ============================================================
// PAYMENT DETAILS
// ============================================================

/**
 * Get payment by ID.
 */
exports.getPaymentById = async (
  userId,
  paymentId
) => {
  const payment =
    await paymentRepository.findPaymentById(
      paymentId
    );

  if (!payment) {
    throw new Error(
      "Payment not found."
    );
  }

  if (
    payment.userId !== userId
  ) {
    throw new Error(
      "You are not authorized to access this payment."
    );
  }

  return payment;
};


/**
 * Get payments for a user.
 */
exports.getMyPayments = async (
  userId,
  options = {}
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  return paymentRepository.getPaymentsByUser(
    userId,
    options
  );
};


/**
 * Get payments for a trip.
 */
exports.getTripPayments = async (
  userId,
  tripId
) => {
  const {
    trip,
    isDriver,
    isPassenger,
  } =
    await verifyTripAccess(
      userId,
      tripId
    );

  return paymentRepository.getPaymentsByTrip(
    trip.id
  );
};


// ============================================================
// REFUND
// ============================================================

/**
 * Refund a payment.
 *
 * Actual Razorpay refund integration can
 * be connected here when required.
 */
exports.refundPayment = async (
  userId,
  paymentId,
  reason = null
) => {
  const payment =
    await paymentRepository.findPaymentById(
      paymentId
    );

  if (!payment) {
    throw new Error(
      "Payment not found."
    );
  }

  /*
   * Normally refund authorization should
   * be restricted to admin/authorized roles.
   *
   * For now, the payment owner can request
   * a refund.
   */
  if (
    payment.userId !== userId
  ) {
    throw new Error(
      "You are not authorized to refund this payment."
    );
  }

  if (
    payment.status !==
    "COMPLETED"
  ) {
    throw new Error(
      "Only completed payments can be refunded."
    );
  }

  if (
    payment.paymentMethod ===
    "WALLET"
  ) {
    await walletService.creditWallet(
      userId,
      payment.amount,
      {
        tripId:
          payment.tripId,

        paymentId:
          payment.id,

        description:
          "Trip payment refund",
      }
    );
  }

  /*
   * Razorpay refund can be added when
   * gatewayPaymentId exists.
   */
  if (
    payment.gateway ===
      "RAZORPAY" &&
    payment.gatewayPaymentId
  ) {
    if (
      !razorpay
    ) {
      throw new Error(
        "Razorpay is not configured."
      );
    }

    await razorpay.payments.refund(
      payment.gatewayPaymentId,
      {
        amount:
          Math.round(
            Number(payment.amount) *
              100
          ),
      }
    );
  }

  return paymentRepository.updatePayment(
    paymentId,
    {
      status:
        "REFUNDED",

      refundedAt:
        new Date(),

      refundReason:
        reason,
    }
  );
};


// ============================================================
// PAYMENT STATUS
// ============================================================

/**
 * Check payment status.
 */
exports.getPaymentStatus = async (
  userId,
  paymentId
) => {
  const payment =
    await getPaymentById(
      userId,
      paymentId
    );

  return {
    paymentId:
      payment.id,

    status:
      payment.status,

    paymentMethod:
      payment.paymentMethod,

    amount:
      payment.amount,

    currency:
      payment.currency,

    paidAt:
      payment.paidAt || null,
  };
};


// ============================================================
// PAYMENT ELIGIBILITY
// ============================================================

/**
 * Check whether user can make payment
 * for a trip.
 */
exports.canMakePayment = async (
  userId,
  tripId
) => {
  try {
    const {
      trip,
      booking,
    } =
      await getBookingAmount(
        userId,
        tripId
      );

    if (
      trip.status !==
      "COMPLETED"
    ) {
      return {
        allowed: false,
        reason:
          "Trip must be completed before payment.",
      };
    }

    if (
      !booking
    ) {
      return {
        allowed: false,
        reason:
          "Passenger booking not found.",
      };
    }

    if (
      booking.paymentStatus ===
      "COMPLETED"
    ) {
      return {
        allowed: false,
        reason:
          "Payment has already been completed.",
      };
    }

    return {
      allowed: true,

      amount:
        Number(
          booking.amount || 0
        ),

      methods:
        PAYMENT_METHODS,
    };

  } catch (error) {
    return {
      allowed: false,
      reason:
        error.message,
    };
  }
};


// ============================================================
// PAYMENT SUMMARY
// ============================================================

/**
 * Get payment summary for a user.
 */
exports.getPaymentSummary = async (
  userId
) => {
  const summary =
    await paymentRepository.getPaymentSummary(
      userId
    );

  return {
    totalPayments:
      summary.totalPayments || 0,

    totalAmount:
      summary.totalAmount || 0,

    completedPayments:
      summary.completedPayments || 0,

    pendingPayments:
      summary.pendingPayments || 0,

    failedPayments:
      summary.failedPayments || 0,

    refundedAmount:
      summary.refundedAmount || 0,
  };
};