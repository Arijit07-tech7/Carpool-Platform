// backend/src/integrations/notifications/push.service.js

// ============================================================
// CONFIGURATION
// ============================================================

const PUSH_API_URL =
  process.env.PUSH_API_URL || "";

const PUSH_API_KEY =
  process.env.PUSH_API_KEY || "";


// ============================================================
// VALIDATE CONFIGURATION
// ============================================================

const validatePushConfiguration = () => {
  if (!PUSH_API_URL) {
    throw new Error(
      "PUSH_API_URL is not configured"
    );
  }

  if (!PUSH_API_KEY) {
    throw new Error(
      "PUSH_API_KEY is not configured"
    );
  }
};


// ============================================================
// SEND PUSH NOTIFICATION
// ============================================================

const sendPushNotification = async ({
  token,
  title,
  body,
  data = {}
}) => {
  if (!token) {
    throw new Error(
      "Push notification token is required"
    );
  }

  if (!title) {
    throw new Error(
      "Notification title is required"
    );
  }

  if (!body) {
    throw new Error(
      "Notification body is required"
    );
  }

  validatePushConfiguration();

  const response = await fetch(
    PUSH_API_URL,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization":
          `Bearer ${PUSH_API_KEY}`
      },

      body: JSON.stringify({
        token,
        notification: {
          title,
          body
        },
        data
      })
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Push notification failed: ${errorText}`
    );
  }

  let result = null;

  try {
    result = await response.json();
  } catch (error) {
    result = null;
  }

  return {
    success: true,
    message: "Push notification sent successfully",
    data: result
  };
};


// ============================================================
// SEND TO MULTIPLE DEVICES
// ============================================================

const sendPushToMultipleDevices = async ({
  tokens,
  title,
  body,
  data = {}
}) => {
  if (
    !Array.isArray(tokens) ||
    tokens.length === 0
  ) {
    throw new Error(
      "At least one push token is required"
    );
  }

  const results = [];

  for (const token of tokens) {
    try {
      const result =
        await sendPushNotification({
          token,
          title,
          body,
          data
        });

      results.push({
        token,
        success: true,
        result
      });
    } catch (error) {
      results.push({
        token,
        success: false,
        error: error.message
      });
    }
  }

  return {
    success: true,
    total: tokens.length,
    results
  };
};


// ============================================================
// BOOKING CONFIRMED
// ============================================================

const sendBookingConfirmedNotification = async ({
  token,
  bookingId,
  rideId
}) => {
  return sendPushNotification({
    token,

    title: "Booking Confirmed",

    body:
      "Your carpool ride booking has been confirmed.",

    data: {
      type: "BOOKING_CONFIRMED",
      bookingId: String(bookingId),
      rideId: String(rideId)
    }
  });
};


// ============================================================
// BOOKING CANCELLED
// ============================================================

const sendBookingCancelledNotification = async ({
  token,
  bookingId,
  reason
}) => {
  return sendPushNotification({
    token,

    title: "Booking Cancelled",

    body:
      reason ||
      "Your carpool booking has been cancelled.",

    data: {
      type: "BOOKING_CANCELLED",
      bookingId: String(bookingId)
    }
  });
};


// ============================================================
// NEW BOOKING REQUEST
// ============================================================

const sendNewBookingNotification = async ({
  token,
  bookingId,
  rideId,
  passengerName
}) => {
  return sendPushNotification({
    token,

    title: "New Ride Booking",

    body:
      `${passengerName || "A passenger"} ` +
      "has requested your ride.",

    data: {
      type: "NEW_BOOKING",
      bookingId: String(bookingId),
      rideId: String(rideId)
    }
  });
};


// ============================================================
// RIDE CANCELLED
// ============================================================

const sendRideCancelledNotification = async ({
  token,
  rideId,
  reason
}) => {
  return sendPushNotification({
    token,

    title: "Ride Cancelled",

    body:
      reason ||
      "The ride has been cancelled.",

    data: {
      type: "RIDE_CANCELLED",
      rideId: String(rideId)
    }
  });
};


// ============================================================
// TRIP STARTED
// ============================================================

const sendTripStartedNotification = async ({
  token,
  tripId
}) => {
  return sendPushNotification({
    token,

    title: "Trip Started",

    body:
      "Your carpool trip has started.",

    data: {
      type: "TRIP_STARTED",
      tripId: String(tripId)
    }
  });
};


// ============================================================
// TRIP COMPLETED
// ============================================================

const sendTripCompletedNotification = async ({
  token,
  tripId
}) => {
  return sendPushNotification({
    token,

    title: "Trip Completed",

    body:
      "Your carpool trip has been completed.",

    data: {
      type: "TRIP_COMPLETED",
      tripId: String(tripId)
    }
  });
};


// ============================================================
// PAYMENT SUCCESS
// ============================================================

const sendPaymentSuccessNotification = async ({
  token,
  paymentId,
  amount
}) => {
  return sendPushNotification({
    token,

    title: "Payment Successful",

    body:
      `Your payment of ₹${amount} was successful.`,

    data: {
      type: "PAYMENT_SUCCESS",
      paymentId: String(paymentId),
      amount: String(amount)
    }
  });
};


// ============================================================
// PAYMENT FAILED
// ============================================================

const sendPaymentFailedNotification = async ({
  token,
  paymentId
}) => {
  return sendPushNotification({
    token,

    title: "Payment Failed",

    body:
      "Your payment could not be completed.",

    data: {
      type: "PAYMENT_FAILED",
      paymentId: String(paymentId)
    }
  });
};


// ============================================================
// RIDE REMINDER
// ============================================================

const sendRideReminderNotification = async ({
  token,
  rideId,
  minutesBefore
}) => {
  return sendPushNotification({
    token,

    title: "Ride Reminder",

    body:
      `Your ride starts in ${minutesBefore} minutes.`,

    data: {
      type: "RIDE_REMINDER",
      rideId: String(rideId),
      minutesBefore:
        String(minutesBefore)
    }
  });
};


// ============================================================
// LIVE TRIP UPDATE
// ============================================================

const sendTripUpdateNotification = async ({
  token,
  tripId,
  message
}) => {
  return sendPushNotification({
    token,

    title: "Trip Update",

    body:
      message ||
      "There is an update to your active trip.",

    data: {
      type: "TRIP_UPDATE",
      tripId: String(tripId)
    }
  });
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  sendPushNotification,
  sendPushToMultipleDevices,

  sendBookingConfirmedNotification,
  sendBookingCancelledNotification,
  sendNewBookingNotification,

  sendRideCancelledNotification,

  sendTripStartedNotification,
  sendTripCompletedNotification,

  sendPaymentSuccessNotification,
  sendPaymentFailedNotification,

  sendRideReminderNotification,
  sendTripUpdateNotification
};