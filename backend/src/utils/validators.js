// backend/src/utils/validators.js

// ============================================================
// REQUIRED VALUE
// ============================================================

const isRequired = (value) => {
  return (
    value !== undefined &&
    value !== null &&
    String(value).trim() !== ""
  );
};


// ============================================================
// EMAIL
// ============================================================

const isValidEmail = (email) => {
  if (!isRequired(email)) {
    return false;
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(
    String(email).trim()
  );
};


// ============================================================
// PASSWORD
// ============================================================

const isValidPassword = (password) => {
  if (!isRequired(password)) {
    return false;
  }

  return String(password).length >= 8;
};


// ============================================================
// PHONE NUMBER
// ============================================================

const isValidPhone = (phone) => {
  if (!isRequired(phone)) {
    return false;
  }

  const phoneRegex =
    /^\+?[1-9]\d{9,14}$/;

  return phoneRegex.test(
    String(phone).trim()
  );
};


// ============================================================
// NUMBER
// ============================================================

const isValidNumber = (value) => {
  if (value === null || value === undefined) {
    return false;
  }

  return (
    value !== "" &&
    Number.isFinite(Number(value))
  );
};


// ============================================================
// POSITIVE NUMBER
// ============================================================

const isPositiveNumber = (value) => {
  return (
    isValidNumber(value) &&
    Number(value) > 0
  );
};


// ============================================================
// NON-NEGATIVE NUMBER
// ============================================================

const isNonNegativeNumber = (value) => {
  return (
    isValidNumber(value) &&
    Number(value) >= 0
  );
};


// ============================================================
// INTEGER
// ============================================================

const isInteger = (value) => {
  if (!isValidNumber(value)) {
    return false;
  }

  return Number.isInteger(
    Number(value)
  );
};


// ============================================================
// POSITIVE INTEGER
// ============================================================

const isPositiveInteger = (value) => {
  return (
    isInteger(value) &&
    Number(value) > 0
  );
};


// ============================================================
// BOOLEAN
// ============================================================

const isBoolean = (value) => {
  return (
    value === true ||
    value === false
  );
};


// ============================================================
// STRING
// ============================================================

const isString = (value) => {
  return typeof value === "string";
};


// ============================================================
// NON-EMPTY STRING
// ============================================================

const isNonEmptyString = (value) => {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
};


// ============================================================
// ARRAY
// ============================================================

const isArray = (value) => {
  return Array.isArray(value);
};


// ============================================================
// OBJECT
// ============================================================

const isObject = (value) => {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
};


// ============================================================
// DATE
// ============================================================

const isValidDate = (value) => {
  if (!isRequired(value)) {
    return false;
  }

  const date =
    new Date(value);

  return !Number.isNaN(
    date.getTime()
  );
};


// ============================================================
// FUTURE DATE
// ============================================================

const isFutureDate = (value) => {
  if (!isValidDate(value)) {
    return false;
  }

  return (
    new Date(value).getTime() >
    Date.now()
  );
};


// ============================================================
// UUID
// ============================================================

const isValidUUID = (value) => {
  if (!isRequired(value)) {
    return false;
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegex.test(
    String(value)
  );
};


// ============================================================
// LATITUDE
// ============================================================

const isValidLatitude = (value) => {
  if (!isValidNumber(value)) {
    return false;
  }

  const latitude =
    Number(value);

  return (
    latitude >= -90 &&
    latitude <= 90
  );
};


// ============================================================
// LONGITUDE
// ============================================================

const isValidLongitude = (value) => {
  if (!isValidNumber(value)) {
    return false;
  }

  const longitude =
    Number(value);

  return (
    longitude >= -180 &&
    longitude <= 180
  );
};


// ============================================================
// COORDINATES
// ============================================================

const areValidCoordinates = (
  latitude,
  longitude
) => {
  return (
    isValidLatitude(latitude) &&
    isValidLongitude(longitude)
  );
};


// ============================================================
// ENUM VALUE
// ============================================================

const isValidEnum = (
  value,
  allowedValues = []
) => {
  return allowedValues.includes(value);
};


// ============================================================
// STRING LENGTH
// ============================================================

const isValidLength = (
  value,
  min,
  max
) => {
  if (!isString(value)) {
    return false;
  }

  const length =
    value.trim().length;

  if (
    min !== undefined &&
    length < min
  ) {
    return false;
  }

  if (
    max !== undefined &&
    length > max
  ) {
    return false;
  }

  return true;
};


// ============================================================
// VEHICLE REGISTRATION NUMBER
// ============================================================

const isValidVehicleNumber = (
  vehicleNumber
) => {
  if (!isRequired(vehicleNumber)) {
    return false;
  }

  const value =
    String(vehicleNumber)
      .trim()
      .toUpperCase();

  const vehicleRegex =
    /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/;

  return vehicleRegex.test(value);
};


// ============================================================
// PRICE
// ============================================================

const isValidPrice = (price) => {
  return (
    isNonNegativeNumber(price) &&
    Number(price) >= 0
  );
};


// ============================================================
// PAGINATION
// ============================================================

const isValidPagination = (
  page,
  limit
) => {
  return (
    isPositiveInteger(page) &&
    isPositiveInteger(limit)
  );
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  isRequired,
  isValidEmail,
  isValidPassword,
  isValidPhone,

  isValidNumber,
  isPositiveNumber,
  isNonNegativeNumber,

  isInteger,
  isPositiveInteger,

  isBoolean,
  isString,
  isNonEmptyString,

  isArray,
  isObject,

  isValidDate,
  isFutureDate,

  isValidUUID,

  isValidLatitude,
  isValidLongitude,
  areValidCoordinates,

  isValidEnum,
  isValidLength,

  isValidVehicleNumber,
  isValidPrice,

  isValidPagination
};