/* =========================================================
   RIDESYNC
   GOOGLE MAPS + PLACES LOCATION SYSTEM
   ---------------------------------------------------------
   File location:
   RideSync/google-maps.js

   Works with:
   - find-ride.html
   - offer-ride.html
   - route-confirmation.html
   - future live-tracking pages

   Country:
   India

   Data captured:
   - Google Place ID
   - Place name
   - Formatted address
   - Latitude
   - Longitude
   ========================================================= */


/* =========================================================
   1. GOOGLE API KEY
   =========================================================

   Replace ONLY this value with your Google Maps API key.

   Example:

   const RIDESYNC_GOOGLE_API_KEY =
       "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

   ========================================================= */

const RIDESYNC_GOOGLE_API_KEY =
    "PASTE_YOUR_GOOGLE_MAPS_API_KEY_HERE";


/* =========================================================
   2. GLOBAL RIDESYNC LOCATION OBJECT
   ========================================================= */

window.RideSyncLocation = {

    start: null,

    destination: null,

    startAutocomplete: null,

    destinationAutocomplete: null

};


/* =========================================================
   3. CHECK API KEY
   ========================================================= */

function rideSyncHasApiKey() {

    return (
        RIDESYNC_GOOGLE_API_KEY &&
        RIDESYNC_GOOGLE_API_KEY !==
        "PASTE_YOUR_GOOGLE_MAPS_API_KEY_HERE"
    );

}


/* =========================================================
   4. LOAD GOOGLE MAPS API
   ========================================================= */

function loadRideSyncGoogleMaps() {

    if (!rideSyncHasApiKey()) {

        console.warn(
            "RideSync: Google Maps API key is not configured."
        );

        return;

    }


    if (
        document.getElementById(
            "ridesync-google-api"
        )
    ) {

        return;

    }


    const script =
        document.createElement("script");


    script.id =
        "ridesync-google-api";


    script.src =
        "https://maps.googleapis.com/maps/api/js" +
        "?key=" +
        encodeURIComponent(
            RIDESYNC_GOOGLE_API_KEY
        ) +
        "&libraries=places" +
        "&loading=async" +
        "&callback=initRideSyncGoogleMaps";


    script.async = true;

    script.defer = true;


    script.onerror = function () {

        console.error(
            "RideSync: Google Maps API failed to load."
        );

    };


    document.head.appendChild(script);

}


/* =========================================================
   5. CREATE LOCATION AUTOCOMPLETE
   ========================================================= */

function createRideSyncAutocomplete(
    input,
    locationType
) {

    if (!input) {

        console.warn(
            "RideSync: Location input not found."
        );

        return null;

    }


    if (
        typeof google === "undefined" ||
        !google.maps ||
        !google.maps.places
    ) {

        console.error(
            "RideSync: Google Places API is unavailable."
        );

        return null;

    }


    const autocomplete =
        new google.maps.places.Autocomplete(
            input,
            {

                /*
                 * India only
                 */

                componentRestrictions: {

                    country: "in"

                },


                /*
                 * Return only the information
                 * RideSync actually needs.
                 */

                fields: [

                    "address_components",

                    "formatted_address",

                    "geometry",

                    "name",

                    "place_id"

                ],


                /*
                 * Roads, addresses, buildings,
                 * landmarks and establishments.
                 */

                types: [

                    "geocode",

                    "establishment"

                ]

            }
        );


    /* =====================================================
       LOCATION SELECTED
       ===================================================== */

    autocomplete.addListener(
        "place_changed",
        function () {


            const place =
                autocomplete.getPlace();


            /* ---------------------------------------------
               Validate Google result
               --------------------------------------------- */

            if (
                !place ||
                !place.geometry ||
                !place.geometry.location
            ) {

                alert(
                    "Please select a valid location from the Google suggestions."
                );

                return;

            }


            /* ---------------------------------------------
               Extract coordinates
               --------------------------------------------- */

            const latitude =
                place.geometry.location.lat();


            const longitude =
                place.geometry.location.lng();


            /* ---------------------------------------------
               Create RideSync location object
               --------------------------------------------- */

            const locationData = {

                type:
                    locationType,

                placeId:
                    place.place_id || "",

                name:
                    place.name || "",

                address:
                    place.formatted_address || "",

                latitude:
                    latitude,

                longitude:
                    longitude,

                addressComponents:
                    place.address_components || [],

                selectedAt:
                    new Date().toISOString()

            };


            /* ---------------------------------------------
               Put formatted Google address inside input
               --------------------------------------------- */

            input.value =
                locationData.address;


            /* ---------------------------------------------
               Store coordinates on input
               --------------------------------------------- */

            input.dataset.placeId =
                locationData.placeId;


            input.dataset.latitude =
                locationData.latitude;


            input.dataset.longitude =
                locationData.longitude;


            /* ---------------------------------------------
               Save globally
               --------------------------------------------- */

            if (
                locationType === "start"
            ) {

                window.RideSyncLocation.start =
                    locationData;


                sessionStorage.setItem(
                    "rideSyncStartLocation",
                    JSON.stringify(
                        locationData
                    )
                );

            }


            if (
                locationType === "destination"
            ) {

                window.RideSyncLocation.destination =
                    locationData;


                sessionStorage.setItem(
                    "rideSyncDestinationLocation",
                    JSON.stringify(
                        locationData
                    )
                );

            }


            /* ---------------------------------------------
               Custom event
               Useful for other RideSync pages.
               --------------------------------------------- */

            document.dispatchEvent(

                new CustomEvent(
                    "rideSyncLocationSelected",
                    {

                        detail:
                            locationData

                    }

                )

            );


            console.log(
                "RideSync Location Selected:",
                locationData
            );

        }
    );


    return autocomplete;

}


/* =========================================================
   6. INITIALIZE FIND / OFFER RIDE LOCATIONS
   ========================================================= */

window.initRideSyncGoogleMaps =
    function () {


        console.log(
            "RideSync Google Maps API loaded."
        );


        const startInput =
            document.getElementById(
                "startLocation"
            );


        const destinationInput =
            document.getElementById(
                "destinationLocation"
            );


        /* ---------------------------------------------
           START LOCATION
           --------------------------------------------- */

        if (startInput) {

            window.RideSyncLocation
                .startAutocomplete =
                createRideSyncAutocomplete(
                    startInput,
                    "start"
                );

        }


        /* ---------------------------------------------
           DESTINATION
           --------------------------------------------- */

        if (destinationInput) {

            window.RideSyncLocation
                .destinationAutocomplete =
                createRideSyncAutocomplete(
                    destinationInput,
                    "destination"
                );

        }


        console.log(
            "RideSync location autocomplete ready."
        );

    };


/* =========================================================
   7. GET SAVED START LOCATION
   ========================================================= */

window.getRideSyncStartLocation =
    function () {

        const data =
            sessionStorage.getItem(
                "rideSyncStartLocation"
            );


        if (!data) {

            return null;

        }


        try {

            return JSON.parse(data);

        }

        catch (error) {

            console.error(
                "RideSync: Invalid start location data."
            );

            return null;

        }

    };


/* =========================================================
   8. GET SAVED DESTINATION
   ========================================================= */

window.getRideSyncDestinationLocation =
    function () {

        const data =
            sessionStorage.getItem(
                "rideSyncDestinationLocation"
            );


        if (!data) {

            return null;

        }


        try {

            return JSON.parse(data);

        }

        catch (error) {

            console.error(
                "RideSync: Invalid destination location data."
            );

            return null;

        }

    };


/* =========================================================
   9. VALIDATE LOCATION
   ========================================================= */

window.validateRideSyncLocations =
    function () {


        const start =
            getRideSyncStartLocation();


        const destination =
            getRideSyncDestinationLocation();


        if (!start) {

            return {

                valid: false,

                message:
                    "Please select a valid start location from Google suggestions."

            };

        }


        if (!destination) {

            return {

                valid: false,

                message:
                    "Please select a valid destination from Google suggestions."

            };

        }


        return {

            valid: true,

            message:
                "Locations are valid.",

            start:
                start,

            destination:
                destination

        };

    };


/* =========================================================
   10. CLEAR LOCATION DATA
   ========================================================= */

window.clearRideSyncLocations =
    function () {


        sessionStorage.removeItem(
            "rideSyncStartLocation"
        );


        sessionStorage.removeItem(
            "rideSyncDestinationLocation"
        );


        window.RideSyncLocation.start =
            null;


        window.RideSyncLocation.destination =
            null;


        console.log(
            "RideSync location data cleared."
        );

    };


/* =========================================================
   11. LOAD API
   ========================================================= */

loadRideSyncGoogleMaps();