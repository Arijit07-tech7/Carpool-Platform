// backend/src/integrations/payments/razorpay.service.js

const Razorpay = require("razorpay");
const crypto = require("crypto");


// ============================================================
// RAZORPAY CONFIGURATION
// ============================================================

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  console.warn(
    "Razorpay credentials are not configured."
  );
}


// ============================================================
// RAZORPAY CLIENT
// ============================================================

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret
});


// ============================================================
// CREATE PAYMENT ORDER
// ============================================================

const createOrder = async ({
  amount,
  currency = "INR",
  receipt,
  notes = {}
}) => {
  if (!amount || Number(amount) <= 0) {
    throw new Error("Valid payment amount is required");
  }

  const order = await razorpay.orders.create({
    amount: Math.round(Number(amount) * 100),
    currency,
    receipt,
    notes
  });

  return {
    id: order.id,
    amount: order.amount,
    currency: order.currency,
    status: order.status,
    receipt: order.receipt
  };
};


// ============================================================
// GET PAYMENT ORDER
// ============================================================

const getOrder = async (orderId) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const order = await razorpay.orders.fetch(orderId);

  return {
    id: order.id,
    amount: order.amount,
    currency: order.currency,
    status: order.status,
    receipt: order.receipt,
    notes: order.notes
  };
};


// ============================================================
// GET PAYMENT
// ============================================================

const getPayment = async (paymentId) => {
  if (!paymentId) {
    throw new Error("Payment ID is required");
  }

  const payment =
    await razorpay.payments.fetch(paymentId);

  return {
    id: payment.id,
    orderId: payment.order_id,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
    method: payment.method,
    email: payment.email,
    contact: payment.contact
  };
};


// ============================================================
// VERIFY PAYMENT SIGNATURE
// ============================================================

const verifyPaymentSignature = ({
  orderId,
  paymentId,
  signature
}) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  if (!paymentId) {
    throw new Error("Payment ID is required");
  }

  if (!signature) {
    throw new Error("Payment signature is required");
  }

  const generatedSignature =
    crypto
      .createHmac(
        "sha256",
        razorpayKeySecret
      )
      .update(
        `${orderId}|${paymentId}`
      )
      .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(generatedSignature),
    Buffer.from(signature)
  );
};


// ============================================================
// CAPTURE PAYMENT
// ============================================================

const capturePayment = async ({
  paymentId,
  amount,
  currency = "INR"
}) => {
  if (!paymentId) {
    throw new Error("Payment ID is required");
  }

  if (!amount || Number(amount) <= 0) {
    throw new Error("Valid payment amount is required");
  }

  const payment =
    await razorpay.payments.capture(
      paymentId,
      Math.round(Number(amount) * 100),
      currency
    );

  return {
    id: payment.id,
    orderId: payment.order_id,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status
  };
};


// ============================================================
// REFUND PAYMENT
// ============================================================

const refundPayment = async ({
  paymentId,
  amount,
  notes = {}
}) => {
  if (!paymentId) {
    throw new Error("Payment ID is required");
  }

  const refundOptions = {
    notes
  };

  if (amount !== undefined) {
    if (Number(amount) <= 0) {
      throw new Error(
        "Refund amount must be greater than zero"
      );
    }

    refundOptions.amount =
      Math.round(Number(amount) * 100);
  }

  const refund =
    await razorpay.payments.refund(
      paymentId,
      refundOptions
    );

  return {
    id: refund.id,
    paymentId: refund.payment_id,
    amount: refund.amount,
    currency: refund.currency,
    status: refund.status
  };
};


// ============================================================
// GET REFUND
// ============================================================

const getRefund = async (
  paymentId,
  refundId
) => {
  if (!paymentId) {
    throw new Error("Payment ID is required");
  }

  if (!refundId) {
    throw new Error("Refund ID is required");
  }

  const refund =
    await razorpay.payments.fetchRefund(
      paymentId,
      refundId
    );

  return {
    id: refund.id,
    paymentId: refund.payment_id,
    amount: refund.amount,
    currency: refund.currency,
    status: refund.status
  };
};


// ============================================================
// VERIFY WEBHOOK SIGNATURE
// ============================================================

const verifyWebhookSignature = (
  payload,
  signature,
  webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
) => {
  if (!payload) {
    throw new Error(
      "Webhook payload is required"
    );
  }

  if (!signature) {
    throw new Error(
      "Webhook signature is required"
    );
  }

  if (!webhookSecret) {
    throw new Error(
      "RAZORPAY_WEBHOOK_SECRET is not configured"
    );
  }

  const generatedSignature =
    crypto
      .createHmac(
        "sha256",
        webhookSecret
      )
      .update(payload)
      .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(generatedSignature),
    Buffer.from(signature)
  );
};


// ============================================================
// GET ALL PAYMENTS FOR AN ORDER
// ============================================================

const getOrderPayments = async (
  orderId
) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const payments =
    await razorpay.orders.fetchPayments(
      orderId
    );

  return payments.items.map((payment) => ({
    id: payment.id,
    orderId: payment.order_id,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
    method: payment.method
  }));
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  createOrder,
  getOrder,
  getPayment,
  verifyPaymentSignature,
  capturePayment,
  refundPayment,
  getRefund,
  verifyWebhookSignature,
  getOrderPayments
};