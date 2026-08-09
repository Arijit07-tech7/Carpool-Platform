// backend/src/integrations/maps/route.service.js

const axios = require("axios");


// ============================================================
// CONFIGURATION
// ============================================================

const MAP_PROVIDER =
  process.env.MAP_PROVIDER || "openstreetmap";

const GOOGLE_MAPS_API_KEY =
  process.env.GOOGLE_MAPS_API_KEY || null;


// ============================================================
// CALCULATE ROUTE
// ============================================================

/**
 * Calculate a road route between two locations.
 *
 * origin:
 * {
 *   latitude: 22.5726,
 *   longitude: 88.3639
 * }
 *
 * destination:
 * {
 *   latitude: 22.6547,
 *   longitude: 88.4467
 * }
 */
const calculateRoute = async (
  origin,
  destination
) => {
  validateLocation(origin, "origin");
  validateLocation(destination, "destination");

  if (MAP_PROVIDER === "google") {
    return calculateGoogleRoute(
      origin,
      destination
    );
  }

  return calculateOpenStreetMapRoute(
    origin,
    destination
  );
};


// ============================================================
// OPENSTREETMAP / OSRM ROUTE
// ============================================================

const calculateOpenStreetMapRoute = async (
  origin,
  destination
) => {
  const coordinates =
    `${origin.longitude},${origin.latitude};` +
    `${destination.longitude},${destination.latitude}`;

  const url =
    `https://router.project-osrm.org/route/v1/driving/${coordinates}`;

  const response = await axios.get(url, {
    params: {
      overview: "full",
      steps: true,
      geometries: "geojson"
    }
  });

  if (
    !response.data ||
    response.data.code !== "Ok" ||
    !response.data.routes ||
    !response.data.routes.length
  ) {
    throw new Error(
      "Route could not be calculated"
    );
  }

  const route = response.data.routes[0];

  return formatRouteResponse(route);
};


// ============================================================
// GOOGLE MAPS ROUTE
// ============================================================

const calculateGoogleRoute = async (
  origin,
  destination
) => {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error(
      "GOOGLE_MAPS_API_KEY is not configured"
    );
  }

  const response = await axios.get(
    "https://maps.googleapis.com/maps/api/directions/json",
    {
      params: {
        origin:
          `${origin.latitude},${origin.longitude}`,

        destination:
          `${destination.latitude},${destination.longitude}`,

        mode: "driving",

        key: GOOGLE_MAPS_API_KEY
      }
    }
  );

  if (
    response.data.status !== "OK" ||
    !response.data.routes ||
    !response.data.routes.length
  ) {
    throw new Error(
      "Route could not be calculated"
    );
  }

  const route =
    response.data.routes[0];

  const leg =
    route.legs[0];

  return {
    distanceMeters:
      leg.distance.value,

    distanceKm:
      leg.distance.value / 1000,

    durationSeconds:
      leg.duration.value,

    durationMinutes:
      Math.ceil(
        leg.duration.value / 60
      ),

    distanceText:
      leg.distance.text,

    durationText:
      leg.duration.text,

    startAddress:
      leg.start_address,

    endAddress:
      leg.end_address,

    polyline:
      route.overview_polyline
        ? route.overview_polyline.points
        : null
  };
};


// ============================================================
// FORMAT OSRM ROUTE
// ============================================================

const formatRouteResponse = (
  route
) => {
  return {
    distanceMeters:
      route.distance,

    distanceKm:
      route.distance / 1000,

    durationSeconds:
      route.duration,

    durationMinutes:
      Math.ceil(
        route.duration / 60
      ),

    distanceText:
      `${(route.distance / 1000).toFixed(2)} km`,

    durationText:
      formatDuration(
        route.duration
      ),

    geometry:
      route.geometry || null,

    steps:
      formatSteps(
        route.legs
      )
  };
};


// ============================================================
// FORMAT ROUTE STEPS
// ============================================================

const formatSteps = (
  legs
) => {
  if (!legs || !legs.length) {
    return [];
  }

  const steps = [];

  for (const leg of legs) {
    if (!leg.steps) {
      continue;
    }

    for (const step of leg.steps) {
      steps.push({
        distanceMeters:
          step.distance,

        durationSeconds:
          step.duration,

        instruction:
          step.name || null,

        maneuver:
          step.maneuver
            ? step.maneuver.type
            : null,

        location:
          step.maneuver
            ? step.maneuver.location
            : null
      });
    }
  }

  return steps;
};


// ============================================================
// FORMAT DURATION
// ============================================================

const formatDuration = (
  seconds
) => {
  const totalMinutes =
    Math.ceil(seconds / 60);

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours =
    Math.floor(totalMinutes / 60);

  const minutes =
    totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
};


// ============================================================
// ESTIMATE FARE
// ============================================================

/**
 * Calculate an estimated ride fare
 * from route distance.
 *
 * This is only a utility calculation.
 * The final fare should be decided by
 * ride.service.js / payment.service.js.
 */
const estimateFare = (
  distanceKm,
  pricePerKm = 5
) => {
  const distance =
    Number(distanceKm);

  const rate =
    Number(pricePerKm);

  if (
    Number.isNaN(distance) ||
    distance < 0
  ) {
    throw new Error(
      "Invalid distance"
    );
  }

  if (
    Number.isNaN(rate) ||
    rate < 0
  ) {
    throw new Error(
      "Invalid price per kilometer"
    );
  }

  return Number(
    (distance * rate).toFixed(2)
  );
};


// ============================================================
// CHECK ROUTE DISTANCE
// ============================================================

const isRouteWithinLimit = (
  distanceKm,
  maximumDistanceKm
) => {
  const distance =
    Number(distanceKm);

  const maximum =
    Number(maximumDistanceKm);

  if (
    Number.isNaN(distance) ||
    Number.isNaN(maximum)
  ) {
    return false;
  }

  return distance <= maximum;
};


// ============================================================
// VALIDATE LOCATION
// ============================================================

const validateLocation = (
  location,
  name
) => {
  if (!location) {
    throw new Error(
      `${name} location is required`
    );
  }

  const latitude =
    Number(location.latitude);

  const longitude =
    Number(location.longitude);

  if (
    Number.isNaN(latitude) ||
    Number.isNaN(longitude)
  ) {
    throw new Error(
      `Invalid ${name} coordinates`
    );
  }

  if (
    latitude < -90 ||
    latitude > 90
  ) {
    throw new Error(
      `Invalid ${name} latitude`
    );
  }

  if (
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error(
      `Invalid ${name} longitude`
    );
  }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  calculateRoute,
  estimateFare,
  isRouteWithinLimit
};