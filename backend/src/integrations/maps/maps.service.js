// backend/src/integrations/maps/maps.service.js

const axios = require("axios");


// ============================================================
// CONFIGURATION
// ============================================================

const MAP_PROVIDER =
  process.env.MAP_PROVIDER || "openstreetmap";

const GOOGLE_MAPS_API_KEY =
  process.env.GOOGLE_MAPS_API_KEY || null;


// ============================================================
// GEOCODING
// ============================================================

/**
 * Convert an address/place name into coordinates.
 *
 * Example:
 *
 * "Kolkata Airport"
 *
 * becomes:
 *
 * {
 *   latitude: 22.6547,
 *   longitude: 88.4467
 * }
 */
const geocode = async (address) => {
  if (!address) {
    throw new Error("Address is required for geocoding");
  }

  if (MAP_PROVIDER === "google") {
    return geocodeWithGoogle(address);
  }

  return geocodeWithOpenStreetMap(address);
};


// ============================================================
// OPENSTREETMAP GEOCODING
// ============================================================

const geocodeWithOpenStreetMap = async (address) => {
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: address,
        format: "json",
        limit: 1
      },
      headers: {
        "User-Agent":
          "Enterprise-Carpooling-Platform/1.0"
      }
    }
  );

  if (
    !response.data ||
    response.data.length === 0
  ) {
    throw new Error("Location could not be found");
  }

  const location = response.data[0];

  return {
    latitude: Number(location.lat),
    longitude: Number(location.lon),
    displayName: location.display_name
  };
};


// ============================================================
// GOOGLE MAPS GEOCODING
// ============================================================

const geocodeWithGoogle = async (address) => {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error(
      "GOOGLE_MAPS_API_KEY is not configured"
    );
  }

  const response = await axios.get(
    "https://maps.googleapis.com/maps/api/geocode/json",
    {
      params: {
        address,
        key: GOOGLE_MAPS_API_KEY
      }
    }
  );

  if (
    response.data.status !== "OK" ||
    !response.data.results.length
  ) {
    throw new Error("Location could not be found");
  }

  const location =
    response.data.results[0].geometry.location;

  return {
    latitude: location.lat,
    longitude: location.lng,
    displayName:
      response.data.results[0].formatted_address
  };
};


// ============================================================
// REVERSE GEOCODING
// ============================================================

/**
 * Convert coordinates into a readable address.
 *
 * latitude + longitude
 *        ↓
 * readable location
 */
const reverseGeocode = async (
  latitude,
  longitude
) => {
  if (
    latitude === undefined ||
    longitude === undefined
  ) {
    throw new Error(
      "Latitude and longitude are required"
    );
  }

  if (MAP_PROVIDER === "google") {
    return reverseGeocodeWithGoogle(
      latitude,
      longitude
    );
  }

  const response = await axios.get(
    "https://nominatim.openstreetmap.org/reverse",
    {
      params: {
        lat: latitude,
        lon: longitude,
        format: "json"
      },
      headers: {
        "User-Agent":
          "Enterprise-Carpooling-Platform/1.0"
      }
    }
  );

  if (!response.data) {
    throw new Error(
      "Location address could not be determined"
    );
  }

  return {
    latitude: Number(latitude),
    longitude: Number(longitude),
    displayName:
      response.data.display_name
  };
};


// ============================================================
// GOOGLE REVERSE GEOCODING
// ============================================================

const reverseGeocodeWithGoogle = async (
  latitude,
  longitude
) => {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error(
      "GOOGLE_MAPS_API_KEY is not configured"
    );
  }

  const response = await axios.get(
    "https://maps.googleapis.com/maps/api/geocode/json",
    {
      params: {
        latlng: `${latitude},${longitude}`,
        key: GOOGLE_MAPS_API_KEY
      }
    }
  );

  if (
    response.data.status !== "OK" ||
    !response.data.results.length
  ) {
    throw new Error(
      "Location address could not be determined"
    );
  }

  return {
    latitude: Number(latitude),
    longitude: Number(longitude),
    displayName:
      response.data.results[0].formatted_address
  };
};


// ============================================================
// DISTANCE
// ============================================================

/**
 * Calculate straight-line distance between
 * two coordinates.
 *
 * This is useful for basic distance checks.
 *
 * For actual road distance use route.service.js.
 */
const calculateDistance = (
  origin,
  destination
) => {
  if (
    !origin ||
    !destination ||
    origin.latitude === undefined ||
    origin.longitude === undefined ||
    destination.latitude === undefined ||
    destination.longitude === undefined
  ) {
    throw new Error(
      "Valid origin and destination coordinates are required"
    );
  }

  const earthRadius = 6371;

  const lat1 =
    (origin.latitude * Math.PI) / 180;

  const lat2 =
    (destination.latitude * Math.PI) / 180;

  const deltaLat =
    ((destination.latitude -
      origin.latitude) *
      Math.PI) /
    180;

  const deltaLon =
    ((destination.longitude -
      origin.longitude) *
      Math.PI) /
    180;

  const a =
    Math.sin(deltaLat / 2) *
      Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
};


// ============================================================
// VALIDATE COORDINATES
// ============================================================

const validateCoordinates = (
  latitude,
  longitude
) => {
  const lat = Number(latitude);
  const lon = Number(longitude);

  if (
    Number.isNaN(lat) ||
    Number.isNaN(lon)
  ) {
    return false;
  }

  if (lat < -90 || lat > 90) {
    return false;
  }

  if (lon < -180 || lon > 180) {
    return false;
  }

  return true;
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  geocode,
  reverseGeocode,
  calculateDistance,
  validateCoordinates
};