// backend/src/utils/pagination.js

// ============================================================
// DEFAULT VALUES
// ============================================================

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;


// ============================================================
// GET PAGINATION PARAMETERS
// ============================================================

const getPagination = (
  page,
  limit
) => {
  let currentPage =
    Number(page);

  let currentLimit =
    Number(limit);

  if (
    !Number.isInteger(currentPage) ||
    currentPage < 1
  ) {
    currentPage = DEFAULT_PAGE;
  }

  if (
    !Number.isInteger(currentLimit) ||
    currentLimit < 1
  ) {
    currentLimit = DEFAULT_LIMIT;
  }

  if (currentLimit > MAX_LIMIT) {
    currentLimit = MAX_LIMIT;
  }

  const skip =
    (currentPage - 1) *
    currentLimit;

  return {
    page: currentPage,
    limit: currentLimit,
    skip
  };
};


// ============================================================
// GET PAGINATION FROM QUERY
// ============================================================

const getPaginationFromQuery = (
  query = {}
) => {
  return getPagination(
    query.page,
    query.limit
  );
};


// ============================================================
// CALCULATE TOTAL PAGES
// ============================================================

const getTotalPages = (
  total,
  limit
) => {
  const totalItems =
    Number(total);

  const currentLimit =
    Number(limit);

  if (
    !Number.isFinite(totalItems) ||
    totalItems <= 0
  ) {
    return 0;
  }

  if (
    !Number.isFinite(currentLimit) ||
    currentLimit <= 0
  ) {
    return 0;
  }

  return Math.ceil(
    totalItems / currentLimit
  );
};


// ============================================================
// BUILD PAGINATION META
// ============================================================

const getPaginationMeta = ({
  page,
  limit,
  total
}) => {
  const currentPage =
    Number(page);

  const currentLimit =
    Number(limit);

  const totalItems =
    Number(total);

  const totalPages =
    getTotalPages(
      totalItems,
      currentLimit
    );

  return {
    page: currentPage,
    limit: currentLimit,
    total: totalItems,
    totalPages,

    hasNextPage:
      currentPage < totalPages,

    hasPreviousPage:
      currentPage > 1
  };
};


// ============================================================
// BUILD PAGINATED RESULT
// ============================================================

const buildPaginatedResult = ({
  data = [],
  page,
  limit,
  total
}) => {
  return {
    data,
    meta: getPaginationMeta({
      page,
      limit,
      total
    })
  };
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  getPagination,
  getPaginationFromQuery,
  getTotalPages,
  getPaginationMeta,
  buildPaginatedResult
};