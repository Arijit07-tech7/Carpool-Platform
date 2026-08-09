// backend/src/integrations/notifications/email.service.js

// ============================================================
// CONFIGURATION
// ============================================================

const EMAIL_API_URL =
  process.env.EMAIL_API_URL || "";

const EMAIL_API_KEY =
  process.env.EMAIL_API_KEY || "";

const EMAIL_FROM =
  process.env.EMAIL_FROM ||
  "noreply@carpool.local";


// ============================================================
// VALIDATE EMAIL CONFIGURATION
// ============================================================

const validateEmailConfiguration = () => {
  if (!EMAIL_API_URL) {
    throw new Error(
      "EMAIL_API_URL is not configured"
    );
  }

  if (!EMAIL_API_KEY) {
    throw new Error(
      "EMAIL_API_KEY is not configured"
    );
  }

  if (!EMAIL_FROM) {
    throw new Error(
      "EMAIL_FROM is not configured"
    );
  }
};


// ============================================================
// SEND EMAIL
// ============================================================

const sendEmail = async ({
  to,
  subject,
  text,
  html
}) => {
  if (!to) {
    throw new Error(
      "Recipient email address is required"
    );
  }

  if (!subject) {
    throw new Error(
      "Email subject is required"
    );
  }

  if (!text && !html) {
    throw new Error(
      "Email text or HTML content is required"
    );
  }

  validateEmailConfiguration();

  const response = await fetch(
    EMAIL_API_URL,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization":
          `Bearer ${EMAIL_API_KEY}`
      },

      body: JSON.stringify({
        from: EMAIL_FROM,
        to,
        subject,
        text: text || "",
        html: html || ""
      })
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Email sending failed: ${errorText}`
    );
  }

  let data = null;

  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  return {
    success: true,
    message: "Email sent successfully",
    data
  };
};


// ============================================================
// SEND WELCOME EMAIL
// ============================================================

const sendWelcomeEmail = async ({
  email,
  name
}) => {
  return sendEmail({
    to: email,

    subject:
      "Welcome to Enterprise Carpooling Platform",

    text:
      `Hello ${name || "User"},\n\n` +
      `Welcome to the Enterprise Carpooling Platform. ` +
      `Your account has been created successfully.\n\n` +
      `Thank you.`,

    html:
      `<h2>Welcome ${name || "User"}!</h2>` +
      `<p>Your account has been created successfully.</p>` +
      `<p>Thank you for joining our carpooling platform.</p>`
  });
};


// ============================================================
// SEND BOOKING CONFIRMATION
// ============================================================

const sendBookingConfirmationEmail = async ({
  email,
  name,
  bookingId,
  rideDetails
}) => {
  return sendEmail({
    to: email,

    subject:
      "Ride Booking Confirmed",

    text:
      `Hello ${name || "User"},\n\n` +
      `Your ride booking has been confirmed.\n\n` +
      `Booking ID: ${bookingId}\n` +
      `Pickup: ${rideDetails?.pickup || "N/A"}\n` +
      `Destination: ${rideDetails?.destination || "N/A"}\n` +
      `Date: ${rideDetails?.date || "N/A"}\n` +
      `Time: ${rideDetails?.time || "N/A"}\n\n` +
      `Thank you.`,

    html:
      `<h2>Ride Booking Confirmed</h2>` +
      `<p>Hello ${name || "User"},</p>` +
      `<p>Your ride booking has been confirmed.</p>` +
      `<p><strong>Booking ID:</strong> ${bookingId}</p>` +
      `<p><strong>Pickup:</strong> ${rideDetails?.pickup || "N/A"}</p>` +
      `<p><strong>Destination:</strong> ${rideDetails?.destination || "N/A"}</p>` +
      `<p><strong>Date:</strong> ${rideDetails?.date || "N/A"}</p>` +
      `<p><strong>Time:</strong> ${rideDetails?.time || "N/A"}</p>`
  });
};


// ============================================================
// SEND BOOKING CANCELLATION EMAIL
// ============================================================

const sendBookingCancellationEmail = async ({
  email,
  name,
  bookingId,
  reason
}) => {
  return sendEmail({
    to: email,

    subject:
      "Ride Booking Cancelled",

    text:
      `Hello ${name || "User"},\n\n` +
      `Your ride booking has been cancelled.\n\n` +
      `Booking ID: ${bookingId}\n` +
      `Reason: ${reason || "Not specified"}\n\n` +
      `Thank you.`,

    html:
      `<h2>Ride Booking Cancelled</h2>` +
      `<p>Hello ${name || "User"},</p>` +
      `<p>Your ride booking has been cancelled.</p>` +
      `<p><strong>Booking ID:</strong> ${bookingId}</p>` +
      `<p><strong>Reason:</strong> ${reason || "Not specified"}</p>`
  });
};


// ============================================================
// SEND RIDE PUBLISHED EMAIL
// ============================================================

const sendRidePublishedEmail = async ({
  email,
  name,
  rideId,
  rideDetails
}) => {
  return sendEmail({
    to: email,

    subject:
      "Ride Published Successfully",

    text:
      `Hello ${name || "User"},\n\n` +
      `Your ride has been published successfully.\n\n` +
      `Ride ID: ${rideId}\n` +
      `Pickup: ${rideDetails?.pickup || "N/A"}\n` +
      `Destination: ${rideDetails?.destination || "N/A"}\n` +
      `Date: ${rideDetails?.date || "N/A"}\n` +
      `Time: ${rideDetails?.time || "N/A"}\n\n` +
      `Passengers can now find and book your ride.`,

    html:
      `<h2>Ride Published Successfully</h2>` +
      `<p>Hello ${name || "User"},</p>` +
      `<p>Your ride has been published successfully.</p>` +
      `<p><strong>Ride ID:</strong> ${rideId}</p>` +
      `<p><strong>Pickup:</strong> ${rideDetails?.pickup || "N/A"}</p>` +
      `<p><strong>Destination:</strong> ${rideDetails?.destination || "N/A"}</p>` +
      `<p><strong>Date:</strong> ${rideDetails?.date || "N/A"}</p>` +
      `<p><strong>Time:</strong> ${rideDetails?.time || "N/A"}</p>`
  });
};


// ============================================================
// SEND PAYMENT CONFIRMATION EMAIL
// ============================================================

const sendPaymentConfirmationEmail = async ({
  email,
  name,
  paymentId,
  amount,
  currency = "INR"
}) => {
  return sendEmail({
    to: email,

    subject:
      "Payment Successful",

    text:
      `Hello ${name || "User"},\n\n` +
      `Your payment was successful.\n\n` +
      `Payment ID: ${paymentId}\n` +
      `Amount: ${currency} ${amount}\n\n` +
      `Thank you.`,

    html:
      `<h2>Payment Successful</h2>` +
      `<p>Hello ${name || "User"},</p>` +
      `<p>Your payment was successful.</p>` +
      `<p><strong>Payment ID:</strong> ${paymentId}</p>` +
      `<p><strong>Amount:</strong> ${currency} ${amount}</p>`
  });
};


// ============================================================
// SEND TRIP STARTED EMAIL
// ============================================================

const sendTripStartedEmail = async ({
  email,
  name,
  tripId
}) => {
  return sendEmail({
    to: email,

    subject:
      "Your Carpool Trip Has Started",

    text:
      `Hello ${name || "User"},\n\n` +
      `Your carpool trip has started.\n\n` +
      `Trip ID: ${tripId}\n\n` +
      `You can use the platform to view live trip information.`,

    html:
      `<h2>Your Trip Has Started</h2>` +
      `<p>Hello ${name || "User"},</p>` +
      `<p>Your carpool trip has started.</p>` +
      `<p><strong>Trip ID:</strong> ${tripId}</p>` +
      `<p>You can view live trip information from the platform.</p>`
  });
};


// ============================================================
// SEND TRIP COMPLETED EMAIL
// ============================================================

const sendTripCompletedEmail = async ({
  email,
  name,
  tripId
}) => {
  return sendEmail({
    to: email,

    subject:
      "Carpool Trip Completed",

    text:
      `Hello ${name || "User"},\n\n` +
      `Your carpool trip has been completed successfully.\n\n` +
      `Trip ID: ${tripId}\n\n` +
      `Thank you for using the Enterprise Carpooling Platform.`,

    html:
      `<h2>Trip Completed</h2>` +
      `<p>Hello ${name || "User"},</p>` +
      `<p>Your carpool trip has been completed successfully.</p>` +
      `<p><strong>Trip ID:</strong> ${tripId}</p>` +
      `<p>Thank you for using the Enterprise Carpooling Platform.</p>`
  });
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail,
  sendRidePublishedEmail,
  sendPaymentConfirmationEmail,
  sendTripStartedEmail,
  sendTripCompletedEmail
};