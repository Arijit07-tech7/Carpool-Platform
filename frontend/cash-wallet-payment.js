/* =====================================================
   RIDESYNC
   CASH / WALLET PAYMENT
   DEMO PAYMENT LOGIC
   ===================================================== */


/* ===============================
   PAYMENT AMOUNT
   =============================== */

const PAYMENT_AMOUNT = 180;


/* ===============================
   DEMO WALLET
   =============================== */

let walletBalance =
    Number(localStorage.getItem("ridesync_wallet_balance"));

if (
    !Number.isFinite(walletBalance) ||
    walletBalance < 0
) {
    walletBalance = 500;

    localStorage.setItem(
        "ridesync_wallet_balance",
        walletBalance
    );
}


/* ===============================
   ELEMENTS
   =============================== */

const paymentAmount =
    document.getElementById("paymentAmount");

const walletBalanceElement =
    document.getElementById("walletBalance");

const walletBalanceSmall =
    document.getElementById("walletBalanceSmall");

const rideAmountSmall =
    document.getElementById("rideAmountSmall");

const remainingBalance =
    document.getElementById("remainingBalance");

const walletPayBtn =
    document.getElementById("walletPayBtn");

const walletStatus =
    document.getElementById("walletStatus");

const walletStatusText =
    document.getElementById("walletStatusText");

const walletPanel =
    document.getElementById("walletPanel");

const cashPanel =
    document.getElementById("cashPanel");

const walletOption =
    document.getElementById("walletOption");

const cashOption =
    document.getElementById("cashOption");

const driverDemo =
    document.getElementById("driverDemo");

const cashRequestBtn =
    document.getElementById("cashRequestBtn");

const cashStatus =
    document.getElementById("cashStatus");

const cashAmount =
    document.getElementById("cashAmount");


/* ===============================
   INITIAL UI
   =============================== */

paymentAmount.textContent =
    `₹${PAYMENT_AMOUNT}`;

rideAmountSmall.textContent =
    `₹${PAYMENT_AMOUNT}`;

cashAmount.textContent =
    `₹${PAYMENT_AMOUNT}`;


/* ===============================
   UPDATE WALLET
   =============================== */

function updateWalletUI() {

    const remaining =
        walletBalance - PAYMENT_AMOUNT;


    walletBalanceElement.textContent =
        `₹${walletBalance}`;

    walletBalanceSmall.textContent =
        `₹${walletBalance}`;


    remainingBalance.textContent =
        remaining >= 0
            ? `₹${remaining}`
            : `₹0`;


    if (walletBalance >= PAYMENT_AMOUNT) {

        walletStatusText.textContent =
            "Sufficient balance available";

        walletPayBtn.disabled = false;

        walletPayBtn.textContent =
            `Pay ₹${PAYMENT_AMOUNT} from Wallet`;

    } else {

        walletStatusText.textContent =
            `Insufficient balance • ₹${PAYMENT_AMOUNT - walletBalance} more needed`;

        walletPayBtn.disabled = true;

        walletPayBtn.textContent =
            "Insufficient Wallet Balance";
    }
}


/* ===============================
   SELECT PAYMENT METHOD
   =============================== */

function selectPayment(method) {

    if (method === "wallet") {

        walletOption.classList.add("active");

        cashOption.classList.remove("active");

        walletPanel.classList.remove("hidden");

        cashPanel.classList.add("hidden");

        driverDemo.classList.add("hidden");

    }


    if (method === "cash") {

        cashOption.classList.add("active");

        walletOption.classList.remove("active");

        cashPanel.classList.remove("hidden");

        walletPanel.classList.add("hidden");

    }
}


/* ===============================
   WALLET PAYMENT
   =============================== */

function payFromWallet() {

    if (walletBalance < PAYMENT_AMOUNT) {

        alert(
            "Insufficient wallet balance. Please recharge your wallet."
        );

        return;
    }


    const confirmPayment =
        confirm(
            `Pay ₹${PAYMENT_AMOUNT} from your RideSync wallet?`
        );


    if (!confirmPayment) {
        return;
    }


    walletBalance -= PAYMENT_AMOUNT;


    localStorage.setItem(
        "ridesync_wallet_balance",
        walletBalance
    );


    /* PAYMENT RECORD */

    const transactionId =
        "RSW" +
        Date.now();


    localStorage.setItem(
        "ridesync_last_payment",
        JSON.stringify({

            method: "Wallet",

            amount: PAYMENT_AMOUNT,

            transactionId,

            status: "Successful",

            date:
                new Date().toLocaleString(
                    "en-IN"
                )

        })
    );


    /* SUCCESS PAGE */

    window.location.href =
        "payment-success.html?method=Wallet&amount=" +
        PAYMENT_AMOUNT +
        "&transaction=" +
        transactionId;
}


/* ===============================
   RECHARGE WALLET
   =============================== */

function rechargeWallet() {

    const amount =
        prompt(
            "Enter demo recharge amount:"
        );


    if (amount === null) {
        return;
    }


    const recharge =
        Number(amount);


    if (
        !Number.isFinite(recharge) ||
        recharge <= 0
    ) {

        alert(
            "Please enter a valid recharge amount."
        );

        return;
    }


    walletBalance += recharge;


    localStorage.setItem(
        "ridesync_wallet_balance",
        walletBalance
    );


    updateWalletUI();


    alert(
        `Wallet recharged successfully!\n\nNew Balance: ₹${walletBalance}`
    );
}


/* ===============================
   CASH REQUEST
   =============================== */

function requestCashPayment() {

    cashRequestBtn.disabled = true;

    cashRequestBtn.textContent =
        "Request Sent ✓";

    cashStatus.textContent =
        "Waiting for Driver Approval";


    driverDemo.classList.remove(
        "hidden"
    );
}


/* ===============================
   DRIVER APPROVAL
   =============================== */

function approveCashPayment() {

    cashStatus.textContent =
        "Driver Approved";


    const transactionId =
        "RSC" +
        Date.now();


    localStorage.setItem(
        "ridesync_last_payment",
        JSON.stringify({

            method: "Cash",

            amount: PAYMENT_AMOUNT,

            transactionId,

            status: "Successful",

            date:
                new Date().toLocaleString(
                    "en-IN"
                )

        })
    );


    setTimeout(() => {

        window.location.href =
            "payment-success.html?method=Cash&amount=" +
            PAYMENT_AMOUNT +
            "&transaction=" +
            transactionId;

    }, 600);
}


/* ===============================
   BACK
   =============================== */

function goBack() {

    window.history.back();
}


/* ===============================
   START
   =============================== */

updateWalletUI();