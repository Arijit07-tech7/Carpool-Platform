// backend/src/config/paypal.js

const env = require("./env.js");

const PAYPAL_BASE_URL =
  env.paypalMode === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

/**
 * Get a PayPal access token using client credentials.
 */
const getAccessToken = async () => {
  const credentials = Buffer.from(
    `${env.paypalClientId}:${env.paypalClientSecret}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `PayPal token error: ${data.error_description || "Unknown error"}`
    );
  }

  return data.access_token;
};


/**
 * Create a PayPal order.
 *
 * @param {number} amount   - Amount in USD (e.g. 10.00)
 * @param {string} currency - ISO currency code (default: USD)
 * @param {string} tripId   - Reference ID for the trip
 * @returns {Promise<object>} PayPal order object
 */
const createOrder = async (amount, currency = "USD", tripId = "") => {
  const accessToken = await getAccessToken();

  const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: `trip_${tripId}`,
          amount: {
            currency_code: currency,
            value: Number(amount).toFixed(2),
          },
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `PayPal create order error: ${JSON.stringify(data.details || data.message || data)}`
    );
  }

  return data; // { id, status, links, ... }
};


/**
 * Capture a PayPal order (completes the payment).
 *
 * @param {string} orderId - PayPal order ID from createOrder
 * @returns {Promise<object>} Capture result
 */
const captureOrder = async (orderId) => {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `PayPal capture error: ${JSON.stringify(data.details || data.message || data)}`
    );
  }

  return data; // { id, status, purchase_units, ... }
};


/**
 * Refund a PayPal capture.
 *
 * @param {string} captureId - The capture ID from captureOrder
 * @param {number|null} amount - Partial refund amount; null = full refund
 * @returns {Promise<object>} Refund result
 */
const refundCapture = async (captureId, amount = null) => {
  const accessToken = await getAccessToken();

  const body = amount
    ? JSON.stringify({
        amount: {
          value: Number(amount).toFixed(2),
          currency_code: "USD",
        },
      })
    : "{}";

  const response = await fetch(
    `${PAYPAL_BASE_URL}/v2/payments/captures/${captureId}/refund`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `PayPal refund error: ${JSON.stringify(data.details || data.message || data)}`
    );
  }

  return data;
};


module.exports = {
  getAccessToken,
  createOrder,
  captureOrder,
  refundCapture,
};
