
/* =========================================================
   RIDESYNC
   TRIP COMPLETED PAGE
   PAGE-SPECIFIC JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("RideSync Trip Completed loaded.");

    const proceedButton =
        document.getElementById("proceedPaymentBtn");


    if (!proceedButton) {

        console.error(
            "RideSync: Proceed to Payment button not found."
        );

        return;
    }


    proceedButton.addEventListener("click", () => {

        /*
         * Save basic trip information.
         * This can be used by the next payment pages.
         */

        const tripData = {

            rideId: "RS-10284",

            pickup: "Salt Lake Sector V",

            destination:
                "Howrah Railway Station",

            distance: "24.5 km",

            duration: "45 min",

            amount: 180,

            currency: "INR",

            status: "payment_pending"

        };


        localStorage.setItem(
            "ridesync_trip",
            JSON.stringify(tripData)
        );


        /*
         * Move to the NEXT page.
         *
         * All payment files are inside
         * the same folder, so we DON'T use ../
         */

        window.location.href =
            "payment-summary.html";

    });

});