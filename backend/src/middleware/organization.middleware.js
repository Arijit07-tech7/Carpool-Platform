const prisma = require("../config/prisma.js");

const requireOrganization = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    let organizationId = req.user.organizationId;

    /*
     * If organizationId is not present in the JWT,
     * resolve it from the user's organization membership.
     */
    if (!organizationId) {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user.id
        },
        select: {
          organizationId: true
        }
      });

      if (!user || !user.organizationId) {
        return res.status(403).json({
          success: false,
          message: "User is not associated with an organization"
        });
      }

      organizationId = user.organizationId;
    }

    req.organizationId = organizationId;

    next();
  } catch (error) {
    next(error);
  }
};


/*
 * Use this when a route receives an organizationId
 * in params/body/query and you need to make sure it
 * belongs to the authenticated user's organization.
 */
const verifyOrganizationAccess = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const requestedOrganizationId =
      req.params.organizationId ||
      req.body.organizationId ||
      req.query.organizationId;

    if (!requestedOrganizationId) {
      return next();
    }

    if (!req.organizationId) {
      return res.status(403).json({
        success: false,
        message: "Organization context is required"
      });
    }

    if (
      String(requestedOrganizationId) !==
      String(req.organizationId)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access to this organization is denied"
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requireOrganization,
  verifyOrganizationAccess
};