// backend/src/utils/response.js

// ============================================================
// SUCCESS RESPONSE
// ============================================================

const successResponse = (
  res,
  {
    statusCode = 200,
    message = "Request successful",
    data = null,
    meta = null
  } = {}
) => {
  const response = {
    success: true,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};


// ============================================================
// ERROR RESPONSE
// ============================================================

const errorResponse = (
  res,
  {
    statusCode = 500,
    message = "Something went wrong",
    errors = null
  } = {}
) => {
  const response = {
    success: false,
    message
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};


// ============================================================
// CREATED RESPONSE
// ============================================================

const createdResponse = (
  res,
  {
    message = "Resource created successfully",
    data = null
  } = {}
) => {
  return successResponse(res, {
    statusCode: 201,
    message,
    data
  });
};


// ============================================================
// NO CONTENT RESPONSE
// ============================================================

const noContentResponse = (
  res
) => {
  return res.status(204).send();
};


// ============================================================
// PAGINATED RESPONSE
// ============================================================

const paginatedResponse = (
  res,
  {
    message = "Data fetched successfully",
    data = [],
    page = 1,
    limit = 10,
    total = 0
  } = {}
) => {
  const currentPage =
    Number(page);

  const currentLimit =
    Number(limit);

  const totalItems =
    Number(total);

  const totalPages =
    currentLimit > 0
      ? Math.ceil(
          totalItems / currentLimit
        )
      : 0;

  return res.status(200).json({
    success: true,
    message,
    data,
    meta: {
      page: currentPage,
      limit: currentLimit,
      total: totalItems,
      totalPages,
      hasNextPage:
        currentPage < totalPages,
      hasPreviousPage:
        currentPage > 1
    }
  });
};


// ============================================================
// VALIDATION ERROR
// ============================================================

const validationErrorResponse = (
  res,
  errors
) => {
  return errorResponse(res, {
    statusCode: 400,
    message: "Validation failed",
    errors
  });
};


// ============================================================
// UNAUTHORIZED RESPONSE
// ============================================================

const unauthorizedResponse = (
  res,
  message = "Authentication required"
) => {
  return errorResponse(res, {
    statusCode: 401,
    message
  });
};


// ============================================================
// FORBIDDEN RESPONSE
// ============================================================

const forbiddenResponse = (
  res,
  message = "You do not have permission to perform this action"
) => {
  return errorResponse(res, {
    statusCode: 403,
    message
  });
};


// ============================================================
// NOT FOUND RESPONSE
// ============================================================

const notFoundResponse = (
  res,
  message = "Resource not found"
) => {
  return errorResponse(res, {
    statusCode: 404,
    message
  });
};


// ============================================================
// CONFLICT RESPONSE
// ============================================================

const conflictResponse = (
  res,
  message = "Resource already exists"
) => {
  return errorResponse(res, {
    statusCode: 409,
    message
  });
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  successResponse,
  errorResponse,
  createdResponse,
  noContentResponse,
  paginatedResponse,
  validationErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  conflictResponse
};