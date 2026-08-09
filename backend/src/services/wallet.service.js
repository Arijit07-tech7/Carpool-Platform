// backend/src/services/wallet.service.js

const walletRepository =
  require("../repositories/wallet.repository.js");


// ============================================================
// HELPERS
// ============================================================

const validateAmount = (amount) => {
  const numericAmount = Number(amount);

  if (
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0
  ) {
    throw new Error(
      "Amount must be greater than zero."
    );
  }

  return Number(
    numericAmount.toFixed(2)
  );
};


// ============================================================
// GET / CREATE WALLET
// ============================================================

/**
 * Get user's wallet.
 *
 * If wallet doesn't exist, create one.
 */
const getWallet = async (userId) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  let wallet =
    await walletRepository.findWalletByUserId(
      userId
    );

  if (!wallet) {
    wallet =
      await walletRepository.createWallet({
        userId,
        balance: 0,
        currency: "INR",
        status: "ACTIVE",
      });
  }

  return wallet;
};


// ============================================================
// GET BALANCE
// ============================================================

/**
 * Get current wallet balance.
 */
const getBalance = async (
  userId
) => {
  const wallet =
    await getWallet(userId);

  return {
    walletId: wallet.id,
    balance: Number(
      wallet.balance || 0
    ),
    currency:
      wallet.currency || "INR",
    status:
      wallet.status,
  };
};


// ============================================================
// RECHARGE
// ============================================================

/**
 * Start wallet recharge.
 *
 * The actual money collection can be handled
 * by Razorpay through payment.service.js.
 */
const createRecharge = async (
  userId,
  amount,
  paymentMethod = "UPI"
) => {
  const rechargeAmount =
    validateAmount(amount);

  const wallet =
    await getWallet(userId);

  if (
    wallet.status !== "ACTIVE"
  ) {
    throw new Error(
      "Wallet is not active."
    );
  }

  const allowedMethods = [
    "CARD",
    "UPI",
  ];

  if (
    !allowedMethods.includes(
      paymentMethod
    )
  ) {
    throw new Error(
      "Wallet recharge supports CARD or UPI."
    );
  }

  /*
   * Create a pending wallet transaction.
   *
   * Money is NOT added to the wallet yet.
   * It is added only after the gateway
   * payment is successfully verified.
   */
  const transaction =
    await walletRepository.createTransaction({
      walletId:
        wallet.id,

      userId,

      type:
        "RECHARGE",

      amount:
        rechargeAmount,

      status:
        "PENDING",

      paymentMethod,

      description:
        "Wallet recharge",
    });

  return transaction;
};


// ============================================================
// COMPLETE RECHARGE
// ============================================================

/**
 * Complete a wallet recharge after
 * successful payment gateway verification.
 */
const completeRecharge = async (
  userId,
  transactionId,
  gatewayData = {}
) => {
  const transaction =
    await walletRepository.findTransactionById(
      transactionId
    );

  if (!transaction) {
    throw new Error(
      "Wallet transaction not found."
    );
  }

  if (
    transaction.userId !== userId
  ) {
    throw new Error(
      "You are not authorized to complete this transaction."
    );
  }

  if (
    transaction.type !==
    "RECHARGE"
  ) {
    throw new Error(
      "This transaction is not a recharge."
    );
  }

  if (
    transaction.status ===
    "COMPLETED"
  ) {
    return transaction;
  }

  if (
    transaction.status !==
    "PENDING"
  ) {
    throw new Error(
      "This recharge cannot be completed."
    );
  }

  const wallet =
    await getWallet(userId);

  const updatedWallet =
    await walletRepository.incrementBalance(
      wallet.id,
      Number(
        transaction.amount
      )
    );

  const completedTransaction =
    await walletRepository.updateTransaction(
      transaction.id,
      {
        status:
          "COMPLETED",

        gatewayPaymentId:
          gatewayData.gatewayPaymentId ||
          null,

        gatewayOrderId:
          gatewayData.gatewayOrderId ||
          null,

        completedAt:
          new Date(),
      }
    );

  return {
    transaction:
      completedTransaction,

    wallet:
      updatedWallet,
  };
};


// ============================================================
// WALLET PAYMENT
// ============================================================

/**
 * Pay for a trip using wallet.
 *
 * This is called by payment.service.js.
 */
const payFromWallet = async (
  userId,
  amount,
  metadata = {}
) => {
  const paymentAmount =
    validateAmount(amount);

  const wallet =
    await getWallet(userId);

  if (
    wallet.status !== "ACTIVE"
  ) {
    throw new Error(
      "Wallet is not active."
    );
  }

  const balance =
    Number(
      wallet.balance || 0
    );

  if (
    balance < paymentAmount
  ) {
    throw new Error(
      `Insufficient wallet balance. Required ₹${paymentAmount}, available ₹${balance}.`
    );
  }

  /*
   * Deduct balance atomically.
   */
  const updatedWallet =
    await walletRepository.decrementBalance(
      wallet.id,
      paymentAmount
    );

  const transaction =
    await walletRepository.createTransaction({
      walletId:
        wallet.id,

      userId,

      type:
        "PAYMENT",

      amount:
        paymentAmount,

      status:
        "COMPLETED",

      paymentMethod:
        "WALLET",

      tripId:
        metadata.tripId ||
        null,

      bookingId:
        metadata.bookingId ||
        null,

      description:
        metadata.description ||
        "Carpool trip payment",

      completedAt:
        new Date(),
    });

  return {
    transaction,
    wallet:
      updatedWallet,
  };
};


// ============================================================
// CREDIT WALLET
// ============================================================

/**
 * Credit money into wallet.
 *
 * Used for:
 * - Refunds
 * - Cashback
 * - Admin adjustments
 */
const creditWallet = async (
  userId,
  amount,
  metadata = {}
) => {
  const creditAmount =
    validateAmount(amount);

  const wallet =
    await getWallet(userId);

  if (
    wallet.status !== "ACTIVE"
  ) {
    throw new Error(
      "Wallet is not active."
    );
  }

  const updatedWallet =
    await walletRepository.incrementBalance(
      wallet.id,
      creditAmount
    );

  const transaction =
    await walletRepository.createTransaction({
      walletId:
        wallet.id,

      userId,

      type:
        "CREDIT",

      amount:
        creditAmount,

      status:
        "COMPLETED",

      tripId:
        metadata.tripId ||
        null,

      bookingId:
        metadata.bookingId ||
        null,

      paymentId:
        metadata.paymentId ||
        null,

      description:
        metadata.description ||
        "Wallet credit",

      completedAt:
        new Date(),
    });

  return {
    transaction,
    wallet:
      updatedWallet,
  };
};


// ============================================================
// DEBIT WALLET
// ============================================================

/**
 * Generic wallet debit.
 *
 * Use carefully. For normal trip payments,
 * use payFromWallet().
 */
const debitWallet = async (
  userId,
  amount,
  metadata = {}
) => {
  const debitAmount =
    validateAmount(amount);

  const wallet =
    await getWallet(userId);

  if (
    wallet.status !== "ACTIVE"
  ) {
    throw new Error(
      "Wallet is not active."
    );
  }

  const balance =
    Number(
      wallet.balance || 0
    );

  if (
    balance < debitAmount
  ) {
    throw new Error(
      "Insufficient wallet balance."
    );
  }

  const updatedWallet =
    await walletRepository.decrementBalance(
      wallet.id,
      debitAmount
    );

  const transaction =
    await walletRepository.createTransaction({
      walletId:
        wallet.id,

      userId,

      type:
        "DEBIT",

      amount:
        debitAmount,

      status:
        "COMPLETED",

      tripId:
        metadata.tripId ||
        null,

      bookingId:
        metadata.bookingId ||
        null,

      description:
        metadata.description ||
        "Wallet debit",

      completedAt:
        new Date(),
    });

  return {
    transaction,
    wallet:
      updatedWallet,
  };
};


// ============================================================
// TRANSACTION HISTORY
// ============================================================

/**
 * Get wallet transaction history.
 */
const getTransactions = async (
  userId,
  options = {}
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  const {
    page = 1,
    limit = 20,
    type,
  } = options;

  const safePage =
    Math.max(
      Number(page) || 1,
      1
    );

  const safeLimit =
    Math.min(
      Math.max(
        Number(limit) || 20,
        1
      ),
      100
    );

  return walletRepository.getTransactionsByUser(
    userId,
    {
      page:
        safePage,

      limit:
        safeLimit,

      type:
        type || undefined,
    }
  );
};


// ============================================================
// SINGLE TRANSACTION
// ============================================================

/**
 * Get one wallet transaction.
 */
const getTransactionById = async (
  userId,
  transactionId
) => {
  const transaction =
    await walletRepository.findTransactionById(
      transactionId
    );

  if (!transaction) {
    throw new Error(
      "Wallet transaction not found."
    );
  }

  if (
    transaction.userId !== userId
  ) {
    throw new Error(
      "You are not authorized to access this transaction."
    );
  }

  return transaction;
};


// ============================================================
// WALLET SUMMARY
// ============================================================

/**
 * Get wallet statistics.
 */
const getWalletSummary = async (
  userId
) => {
  const wallet =
    await getWallet(userId);

  const summary =
    await walletRepository.getWalletSummary(
      wallet.id
    );

  return {
    balance:
      Number(
        wallet.balance || 0
      ),

    totalRecharge:
      Number(
        summary.totalRecharge || 0
      ),

    totalPayments:
      Number(
        summary.totalPayments || 0
      ),

    totalCredits:
      Number(
        summary.totalCredits || 0
      ),

    totalDebits:
      Number(
        summary.totalDebits || 0
      ),

    currency:
      wallet.currency ||
      "INR",
  };
};


// ============================================================
// CHECK SUFFICIENT BALANCE
// ============================================================

/**
 * Check whether wallet has enough
 * money for a payment.
 */
const hasSufficientBalance = async (
  userId,
  amount
) => {
  const requiredAmount =
    validateAmount(amount);

  const wallet =
    await getWallet(userId);

  const balance =
    Number(
      wallet.balance || 0
    );

  return {
    sufficient:
      balance >= requiredAmount,

    balance,

    required:
      requiredAmount,

    remaining:
      Math.max(
        balance -
          requiredAmount,
        0
      ),
  };
};


// ============================================================
// FREEZE WALLET
// ============================================================

/**
 * Freeze wallet.
 *
 * Usually controlled by admin.
 */
const freezeWallet = async (
  userId
) => {
  const wallet =
    await getWallet(userId);

  return walletRepository.updateWallet(
    wallet.id,
    {
      status:
        "FROZEN",
    }
  );
};


// ============================================================
// UNFREEZE WALLET
// ============================================================

const unfreezeWallet = async (
  userId
) => {
  const wallet =
    await getWallet(userId);

  return walletRepository.updateWallet(
    wallet.id,
    {
      status:
        "ACTIVE",
    }
  );
};


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getWallet,

  getBalance,

  createRecharge,

  completeRecharge,

  payFromWallet,

  creditWallet,

  debitWallet,

  getTransactions,

  getTransactionById,

  getWalletSummary,

  hasSufficientBalance,

  freezeWallet,

  unfreezeWallet,
};