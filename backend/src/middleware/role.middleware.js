const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (!req.user.role) {
      return res.status(403).json({
        success: false,
        message: "User role not found"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action"
      });
    }

    next();
  };
};

const isEmployee = authorizeRoles(
  "EMPLOYEE"
);

const isCompanyAdmin = authorizeRoles(
  "COMPANY_ADMIN"
);

const isEmployeeOrAdmin = authorizeRoles(
  "EMPLOYEE",
  "COMPANY_ADMIN"
);

module.exports = {
  authorizeRoles,
  isEmployee,
  isCompanyAdmin,
  isEmployeeOrAdmin
};