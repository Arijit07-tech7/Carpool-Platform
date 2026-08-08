// backend/src/utils/helpers.js

// ============================================================
// SLEEP / DELAY
// ============================================================

const sleep = (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};


// ============================================================
// REMOVE UNDEFINED VALUES
// ============================================================

const removeUndefined = (object) => {
  if (!object || typeof object !== "object") {
    return object;
  }

  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) => value !== undefined
    )
  );
};


// ============================================================
// REMOVE NULL VALUES
// ============================================================

const removeNull = (object) => {
  if (!object || typeof object !== "object") {
    return object;
  }

  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) => value !== null
    )
  );
};


// ============================================================
// REMOVE EMPTY VALUES
// ============================================================

const removeEmptyValues = (object) => {
  if (!object || typeof object !== "object") {
    return object;
  }

  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) => {
        return (
          value !== undefined &&
          value !== null &&
          value !== ""
        );
      }
    )
  );
};


// ============================================================
// PICK OBJECT FIELDS
// ============================================================

const pick = (
  object,
  fields = []
) => {
  if (
    !object ||
    typeof object !== "object"
  ) {
    return {};
  }

  const result = {};

  for (const field of fields) {
    if (
      Object.prototype.hasOwnProperty.call(
        object,
        field
      )
    ) {
      result[field] = object[field];
    }
  }

  return result;
};


// ============================================================
// OMIT OBJECT FIELDS
// ============================================================

const omit = (
  object,
  fields = []
) => {
  if (
    !object ||
    typeof object !== "object"
  ) {
    return {};
  }

  const result = {
    ...object
  };

  for (const field of fields) {
    delete result[field];
  }

  return result;
};


// ============================================================
// CONVERT TO NUMBER
// ============================================================

const toNumber = (
  value,
  defaultValue = 0
) => {
  const number =
    Number(value);

  if (Number.isNaN(number)) {
    return defaultValue;
  }

  return number;
};


// ============================================================
// ROUND NUMBER
// ============================================================

const roundNumber = (
  value,
  decimals = 2
) => {
  const number =
    Number(value);

  if (Number.isNaN(number)) {
    return 0;
  }

  const multiplier =
    10 ** decimals;

  return (
    Math.round(
      number * multiplier
    ) / multiplier
  );
};


// ============================================================
// GENERATE RANDOM STRING
// ============================================================

const generateRandomString = (
  length = 10
) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "abcdefghijklmnopqrstuvwxyz" +
    "0123456789";

  let result = "";

  for (let i = 0; i < length; i++) {
    result +=
      characters.charAt(
        Math.floor(
          Math.random() *
          characters.length
        )
      );
  }

  return result;
};


// ============================================================
// GENERATE OTP
// ============================================================

const generateOTP = (
  length = 6
) => {
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += Math.floor(
      Math.random() * 10
    );
  }

  return otp;
};


// ============================================================
// FORMAT CURRENCY
// ============================================================

const formatCurrency = (
  amount,
  currency = "INR"
) => {
  const number =
    Number(amount);

  if (Number.isNaN(number)) {
    return `${currency} 0.00`;
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency
    }
  ).format(number);
};


// ============================================================
// FORMAT DATE
// ============================================================

const formatDate = (
  date,
  locale = "en-IN"
) => {
  const value =
    new Date(date);

  if (
    Number.isNaN(
      value.getTime()
    )
  ) {
    return null;
  }

  return value.toLocaleDateString(
    locale
  );
};


// ============================================================
// FORMAT DATE TIME
// ============================================================

const formatDateTime = (
  date,
  locale = "en-IN"
) => {
  const value =
    new Date(date);

  if (
    Number.isNaN(
      value.getTime()
    )
  ) {
    return null;
  }

  return value.toLocaleString(
    locale
  );
};


// ============================================================
// CAPITALIZE FIRST LETTER
// ============================================================

const capitalize = (
  value
) => {
  if (
    typeof value !== "string" ||
    value.length === 0
  ) {
    return value;
  }

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
};


// ============================================================
// SLUGIFY
// ============================================================

const slugify = (
  value
) => {
  if (
    typeof value !== "string"
  ) {
    return "";
  }

  return value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9\s-]/g,
      ""
    )
    .replace(
      /\s+/g,
      "-"
    )
    .replace(
      /-+/g,
      "-"
    );
};


// ============================================================
// CHECK EMPTY OBJECT
// ============================================================

const isEmptyObject = (
  object
) => {
  return (
    object &&
    typeof object === "object" &&
    !Array.isArray(object) &&
    Object.keys(object).length === 0
  );
};


// ============================================================
// SAFE JSON PARSE
// ============================================================

const safeJsonParse = (
  value,
  defaultValue = null
) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return defaultValue;
  }
};


// ============================================================
// GET NESTED OBJECT VALUE
// ============================================================

const getNestedValue = (
  object,
  path,
  defaultValue = null
) => {
  if (!object || !path) {
    return defaultValue;
  }

  const parts =
    String(path).split(".");

  let current = object;

  for (const part of parts) {
    if (
      current === null ||
      current === undefined ||
      !Object.prototype.hasOwnProperty.call(
        current,
        part
      )
    ) {
      return defaultValue;
    }

    current = current[part];
  }

  return current;
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  sleep,

  removeUndefined,
  removeNull,
  removeEmptyValues,

  pick,
  omit,

  toNumber,
  roundNumber,

  generateRandomString,
  generateOTP,

  formatCurrency,
  formatDate,
  formatDateTime,

  capitalize,
  slugify,

  isEmptyObject,
  safeJsonParse,
  getNestedValue
};