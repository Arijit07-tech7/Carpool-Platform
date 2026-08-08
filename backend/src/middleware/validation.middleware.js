const validate = (schema) => {
  return async (req, res, next) => {
    try {
      if (!schema) {
        return next();
      }

      /*
       * Supports a custom schema with:
       *
       * schema.body
       * schema.params
       * schema.query
       *
       * Each can be a function that returns:
       * { valid: true }
       *
       * or:
       * { valid: false, errors: [...] }
       */

      const errors = [];

      if (typeof schema.body === "function") {
        const result = await schema.body(req.body);

        if (result && result.valid === false) {
          errors.push(...(result.errors || []));
        }
      }

      if (typeof schema.params === "function") {
        const result = await schema.params(req.params);

        if (result && result.valid === false) {
          errors.push(...(result.errors || []));
        }
      }

      if (typeof schema.query === "function") {
        const result = await schema.query(req.query);

        if (result && result.valid === false) {
          errors.push(...(result.errors || []));
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};


/*
 * Simple required-field validator.
 *
 * Example:
 *
 * validateRequired(["rideId", "passengerCount"])
 */
const validateRequired = (fields = []) => {
  return (req, res, next) => {
    const missingFields = [];

    for (const field of fields) {
      const value = req.body?.[field];

      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
        fields: missingFields
      });
    }

    next();
  };
};

module.exports = {
  validate,
  validateRequired
};