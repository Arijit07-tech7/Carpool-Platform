const walletService = require("../services/wallet.service.js");


// ============================================================
// GET WALLET
// ============================================================

const getWallet = async (req, res, next) => {
  try {
    const result = await walletService.getWallet(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Wallet details fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET WALLET BALANCE
// ============================================================

const getBalance = async (req, res, next) => {
  try {
    const result = await walletService.getBalance(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Wallet balance fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// CREATE / INITIALIZE WALLET
// ============================================================

const createWallet = async (req, res, next) => {
  try {
    const result = await walletService.createWallet(
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: "Wallet created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// RECHARGE WALLET
// ============================================================

const rechargeWallet = async (req, res, next) => {
  try {
    const result = await walletService.rechargeWallet(
      req.user.id,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Wallet recharge initiated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// VERIFY WALLET RECHARGE
// ============================================================

const verifyRecharge = async (req, res, next) => {
  try {
    const result = await walletService.verifyRecharge(
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Wallet recharge verified successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// PAY USING WALLET
// ============================================================

const payUsingWallet = async (req, res, next) => {
  try {
    const result = await walletService.payUsingWallet(
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Wallet payment completed successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET WALLET TRANSACTIONS
// ============================================================

const getTransactions = async (req, res, next) => {
  try {
    const result = await walletService.getTransactions(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Wallet transactions fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET TRANSACTION BY ID
// ============================================================

const getTransactionById = async (req, res, next) => {
  try {
    const result = await walletService.getTransactionById(
      req.user.id,
      req.params.transactionId
    );

    return res.status(200).json({
      success: true,
      message: "Wallet transaction fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// REFUND TO WALLET
// ============================================================

const refundToWallet = async (req, res, next) => {
  try {
    const result = await walletService.refundToWallet(
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Amount refunded to wallet successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// WALLET STATEMENT
// ============================================================

const getWalletStatement = async (req, res, next) => {
  try {
    const result = await walletService.getWalletStatement(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Wallet statement fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  getWallet,
  getBalance,
  createWallet,
  rechargeWallet,
  verifyRecharge,
  payUsingWallet,
  getTransactions,
  getTransactionById,
  refundToWallet,
  getWalletStatement
};