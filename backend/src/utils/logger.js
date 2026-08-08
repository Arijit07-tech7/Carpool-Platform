// backend/src/utils/logger.js

// ============================================================
// CONFIGURATION
// ============================================================

const LOG_LEVEL =
  process.env.LOG_LEVEL || "info";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};


// ============================================================
// CHECK LOG LEVEL
// ============================================================

const shouldLog = (level) => {
  const configuredLevel =
    levels[LOG_LEVEL] !== undefined
      ? levels[LOG_LEVEL]
      : levels.info;

  return levels[level] <= configuredLevel;
};


// ============================================================
// FORMAT MESSAGE
// ============================================================

const formatMessage = (
  level,
  message,
  meta = null
) => {
  const timestamp =
    new Date().toISOString();

  const formattedMeta =
    meta && typeof meta === "object"
      ? ` ${JSON.stringify(meta)}`
      : "";

  return (
    `[${timestamp}] ` +
    `[${level.toUpperCase()}] ` +
    `${message}` +
    formattedMeta
  );
};


// ============================================================
// INFO
// ============================================================

const info = (
  message,
  meta = null
) => {
  if (!shouldLog("info")) {
    return;
  }

  console.log(
    formatMessage(
      "info",
      message,
      meta
    )
  );
};


// ============================================================
// WARNING
// ============================================================

const warn = (
  message,
  meta = null
) => {
  if (!shouldLog("warn")) {
    return;
  }

  console.warn(
    formatMessage(
      "warn",
      message,
      meta
    )
  );
};


// ============================================================
// ERROR
// ============================================================

const error = (
  message,
  meta = null
) => {
  if (!shouldLog("error")) {
    return;
  }

  console.error(
    formatMessage(
      "error",
      message,
      meta
    )
  );
};


// ============================================================
// DEBUG
// ============================================================

const debug = (
  message,
  meta = null
) => {
  if (!shouldLog("debug")) {
    return;
  }

  console.debug(
    formatMessage(
      "debug",
      message,
      meta
    )
  );
};


// ============================================================
// HTTP REQUEST LOGGER
// ============================================================

const http = (
  req,
  statusCode,
  duration
) => {
  if (!shouldLog("info")) {
    return;
  }

  info(
    `${req.method} ${req.originalUrl}`,
    {
      statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    }
  );
};


// ============================================================
// DATABASE LOGGER
// ============================================================

const database = (
  operation,
  meta = null
) => {
  if (!shouldLog("debug")) {
    return;
  }

  debug(
    `Database operation: ${operation}`,
    meta
  );
};


// ============================================================
// STARTUP LOGGER
// ============================================================

const startup = (
  message
) => {
  info(
    `SERVER STARTUP: ${message}`
  );
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  info,
  warn,
  error,
  debug,
  http,
  database,
  startup
};