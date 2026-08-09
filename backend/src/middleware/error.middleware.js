const errorMiddleware = (error, req, res, next) => {
  console.error("ERROR:", error);

  let statusCode = error.statusCode || 500;

  let message =
    error.message || "Internal server error";

  /*
   * Prisma errors
   */

  if (error.code === "P2002") {
    statusCode = 409;
    message = "A record with this value already exists";
  }

  if (error.code === "P2025") {
    statusCode = 404;
    message = "Requested record was not found";
  }

  if (error.code === "P2003") {
    statusCode = 400;
    message =
      "Operation failed because related data exists";
  }

  /*
   * JWT errors
   */

  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  }

  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token has expired";
  }

  /*
   * Development details
   */

  const response = {
    success: false,
    message
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
};

module.exports = errorMiddleware;