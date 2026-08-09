// backend/src/controllers/payment.controller.js

const paymentService = require("../services/payment.service.js");


// ============================================================
// CREATE PAYMENT
// ============================================================

const createPayment = async (req, res, next) => {
  try {
    const { tripId, paymentMethod } = req.body;

    const result = await paymentService.createPayment(
      req.user.id,
      tripId,
      paymentMethod
    );

    return res.status(201).json({
      success: true,
      message: "Payment initiated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// PAYPAL – CREATE ORDER
// ============================================================

const createPaypalOrder = async (req, res, next) => {
  try {
    const { tripId, amount } = req.body;

    const order = await paymentService.createPaypalOrder(amount, tripId);

    return res.status(201).json({
      success: true,
      message: "PayPal order created successfully",
      data: {
        orderId: order.id,
        status: order.status,
        approvalUrl: (order.links || []).find((l) => l.rel === "approve")?.href || null,
      },
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// PAYPAL – CAPTURE PAYMENT
// ============================================================

const capturePaypalPayment = async (req, res, next) => {
  try {
    const { paymentId, paypalOrderId } = req.body;

    const result = await paymentService.capturePaypalPayment({
      userId: req.user.id,
      paymentId,
      paypalOrderId,
    });

    return res.status(200).json({
      success: true,
      message: "PayPal payment captured successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// PAYPAL WEBHOOK
// ============================================================

const handlePaypalWebhook = async (req, res) => {
  try {
    // Log the event for now; wire up full verification as needed
    const { event_type, resource } = req.body;
    console.log(`[PayPal Webhook] ${event_type}`, resource?.id || "");

    if (event_type === "CHECKOUT.ORDER.APPROVED") {
      // Optionally auto-capture here
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("[PayPal Webhook Error]", error.message);
    return res.status(200).json({ received: true }); // Always 200 to PayPal
  }
};


// ============================================================
// WALLET PAYMENT
// ============================================================

const processWalletPayment = async (req, res, next) => {
  try {
    const { tripId } = req.body;

    const result = await paymentService.createPayment(
      req.user.id,
      tripId,
      "WALLET"
    );

    return res.status(200).json({
      success: true,
      message: "Wallet payment processed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// REFUND
// ============================================================

const refundPayment = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const result = await paymentService.refundPayment(
      req.user.id,
      req.params.paymentId,
      reason || null
    );

    return res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET MY PAYMENTS
// ============================================================

const getMyPayments = async (req, res, next) => {
  try {
    const result = await paymentService.getMyPayments(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Payment history fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET PAYMENT BY ID
// ============================================================

const getPaymentById = async (req, res, next) => {
  try {
    const result = await paymentService.getPaymentById(
      req.user.id,
      req.params.paymentId
    );

    return res.status(200).json({
      success: true,
      message: "Payment details fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET PAYMENT STATUS
// ============================================================

const getPaymentStatus = async (req, res, next) => {
  try {
    const result = await paymentService.getPaymentStatus(
      req.user.id,
      req.params.paymentId
    );

    return res.status(200).json({
      success: true,
      message: "Payment status fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET TRIP PAYMENTS
// ============================================================

const getTripPayments = async (req, res, next) => {
  try {
    const result = await paymentService.getTripPayments(
      req.user.id,
      req.params.tripId
    );

    return res.status(200).json({
      success: true,
      message: "Trip payments fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET PAYMENT METHODS
// ============================================================

const getPaymentMethods = async (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Supported payment methods",
    data: {
      methods: ["CASH", "CARD", "PAYPAL", "WALLET"],
      gateway: "PayPal",
      currencies: ["USD"],
    },
  });
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  createPayment,
  createPaypalOrder,
  capturePaypalPayment,
  handlePaypalWebhook,
  processWalletPayment,
  refundPayment,
  getMyPayments,
  getPaymentById,
  getPaymentStatus,
  getTripPayments,
  getPaymentMethods,
};