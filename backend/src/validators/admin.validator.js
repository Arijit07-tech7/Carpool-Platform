// backend/src/validators/admin.validator.js

const updateEmployeeStatus = {
  body: (data) => {
    const errors = [];
    if (!data.status) {
      errors.push({ field: "status", message: "Status is required" });
    }
    return errors.length > 0 ? { valid: false, errors } : { valid: true };
  }
};

const updateSettings = {
  body: (_data) => ({ valid: true })
};

module.exports = {
  updateEmployeeStatus,
  updateSettings
};
