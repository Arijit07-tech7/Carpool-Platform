/* =====================================================
   RIDESYNC
   PAYMENT SUMMARY JS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const backBtn =
        document.getElementById("backBtn");

    const continueBtn =
        document.getElementById("continueBtn");


    /* -----------------------------------------------
       PAYMENT DATA
    ------------------------------------------------ */

    const defaultPayment = {
        rideId: "RS-10284",
        pickup: "Salt Lake Sector V",
        destination: "Howrah Railway Station",
        distance: "24.5 km",
        duration: "45 min",
        amount: 180,
        status: "pending"
    };


    let paymentData;

    try {

        paymentData =
            JSON.parse(
                localStorage.getItem("rideSyncPayment")
            );

    } catch (error) {

        paymentData = null;

    }


    if (!paymentData) {

        paymentData = defaultPayment;

        localStorage.setItem(
            "rideSyncPayment",
            JSON.stringify(paymentData)
        );
    }


    /* -----------------------------------------------
       UPDATE PAGE
    ------------------------------------------------ */

    const rideId =
        document.getElementById("rideId");

    const pickup =
        document.getElementById("pickup");

    const destination =
        document.getElementById("destination");

    const distance =
        document.getElementById("distance");

    const duration =
        document.getElementById("duration");

    const fare =
        document.getElementById("fare");

    const total =
        document.getElementById("total");

    const sideAmount =
        document.getElementById("sideAmount");


    if (rideId)
        rideId.textContent =
            paymentData.rideId || defaultPayment.rideId;


    if (pickup)
        pickup.textContent =
            paymentData.pickup || defaultPayment.pickup;


    if (destination)
        destination.textContent =
            paymentData.destination ||
            defaultPayment.destination;


    if (distance)
        distance.textContent =
            paymentData.distance ||
            defaultPayment.distance;


    if (duration)
        duration.textContent =
            paymentData.duration ||
            defaultPayment.duration;


    const amount =
        Number(
            paymentData.amount ||
            defaultPayment.amount
        );


    const formattedAmount =
        `₹${amount.toFixed(2)}`;


    if (fare)
        fare.textContent = formattedAmount;

    if (total)
        total.textContent = formattedAmount;

    if (sideAmount)
        sideAmount.textContent = formattedAmount;


    /* -----------------------------------------------
       BACK
    ------------------------------------------------ */

    if (backBtn) {

        backBtn.addEventListener(
            "click",
            () => {

                window.history.back();

            }
        );

    }


    /* -----------------------------------------------
       CONTINUE
       payment-summary.html
       →
       payment-method.html
    ------------------------------------------------ */

    if (continueBtn) {

        continueBtn.addEventListener(
            "click",
            () => {

                continueBtn.disabled = true;

                continueBtn.innerHTML =
                    "<span>Loading...</span>";

                setTimeout(() => {

                    window.location.href =
                        "payment-method.html";

                }, 250);

            }
        );

    }

});