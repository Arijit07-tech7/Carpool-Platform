// backend/src/integrations/payments/payment.gateway.js

const razorpayService = require("./razorpay.service.js");


// ============================================================
// PAYMENT PROVIDER
// ============================================================

const PAYMENT_PROVIDER =
  process.env.PAYMENT_PROVIDER || "razorpay";


// ============================================================
// CREATE PAYMENT ORDER
// ============================================================

const createPaymentOrder = async ({
  amount,
  currency = "INR",
  receipt,
  notes = {}
}) => {
  switch (PAYMENT_PROVIDER) {
    case "razorpay":
      return razorpayService.createOrder({
        amount,
        currency,
        receipt,
        notes
      });

    default:
      throw new Error(
        `Unsupported payment provider: ${PAYMENT_PROVIDER}`
      );
  }
};


// ============================================================
// GET PAYMENT ORDER
// ============================================================

const getPaymentOrder = async (
  orderId
) => {
  switch (PAYMENT_PROVIDER) {
    case "razorpay":
      return razorpayService.getOrder(orderId);

    default:
      throw new Error(
        `Unsupported payment provider: ${PAYMENT_PROVIDER}`
      );
  }
};


// ============================================================
// GET PAYMENT
// ============================================================

const getPayment = async (
  paymentId
) => {
  switch (PAYMENT_PROVIDER) {
    case "razorpay":
      return razorpayService.getPayment(
        paymentId
      );

    default:
      throw new Error(
        `Unsupported payment provider: ${PAYMENT_PROVIDER}`
      );
  }
};


// ============================================================
// VERIFY PAYMENT
// ============================================================

const verifyPayment = ({
  orderId,
  paymentId,
  signature
}) => {
  switch (PAYMENT_PROVIDER) {
    case "razorpay":
      return razorpayService.verifyPaymentSignature({
        orderId,
        paymentId,
        signature
      });

    default:
      throw new Error(
        `Unsupported payment provider: ${PAYMENT_PROVIDER}`
      );
  }
};


// ============================================================
// CAPTURE PAYMENT
// ============================================================

const capturePayment = async ({
  paymentId,
  amount,
  currency = "INR"
}) => {
  switch (PAYMENT_PROVIDER) {
    case "razorpay":
      return razorpayService.capturePayment({
        paymentId,
        amount,
        currency
      });

    default:
      throw new Error(
        `Unsupported payment provider: ${PAYMENT_PROVIDER}`
      );
  }
};


// ============================================================
// REFUND PAYMENT
// ============================================================

const refundPayment = async ({
  paymentId,
  amount,
  notes = {}
}) => {
  switch (PAYMENT_PROVIDER) {
    case "razorpay":
      return razorpayService.refundPayment({
        paymentId,
        amount,
        notes
      });

    default:
      throw new Error(
        `Unsupported payment provider: ${PAYMENT_PROVIDER}`
      );
  }
};


// ============================================================
// GET REFUND
// ============================================================

const getRefund = async (
  paymentId,
  refundId
) => {
  switch (PAYMENT_PROVIDER) {
    case "razorpay":
      return razorpayService.getRefund(
        paymentId,
        refundId
      );

    default:
      throw new Error(
        `Unsupported payment provider: ${PAYMENT_PROVIDER}`
      );
  }
};


// ============================================================
// VERIFY WEBHOOK
// ============================================================

const verifyWebhook = (
  payload,
  signature
) => {
  switch (PAYMENT_PROVIDER) {
    case "razorpay":
      return razorpayService.verifyWebhookSignature(
        payload,
        signature
      );

    default:
      throw new Error(
        `Unsupported payment provider: ${PAYMENT_PROVIDER}`
      );
  }
};


// ============================================================
// GET ORDER PAYMENTS
// ============================================================

const getOrderPayments = async (
  orderId
) => {
  switch (PAYMENT_PROVIDER) {
    case "razorpay":
      return razorpayService.getOrderPayments(
        orderId
      );

    default:
      throw new Error(
        `Unsupported payment provider: ${PAYMENT_PROVIDER}`
      );
  }
};


// ============================================================
// GET ACTIVE PROVIDER
// ============================================================

const getPaymentProvider = () => {
  return PAYMENT_PROVIDER;
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  createPaymentOrder,
  getPaymentOrder,
  getPayment,
  verifyPayment,
  capturePayment,
  refundPayment,
  getRefund,
  verifyWebhook,
  getOrderPayments,
  getPaymentProvider
};