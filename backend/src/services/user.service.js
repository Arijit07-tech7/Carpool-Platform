const userRepository = require("../repositories/user.repository.js");

/**
 * Remove sensitive fields before returning user data.
 */
const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const {
    password,
    passwordHash,
    ...safeUser
  } = user;

  return safeUser;
};


/**
 * Get user profile.
 */
exports.getProfile = async (userId) => {
  const user =
    await userRepository.findUserById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  return sanitizeUser(user);
};


/**
 * Update user profile.
 */
exports.updateProfile = async (
  userId,
  updateData
) => {
  const user =
    await userRepository.findUserById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  // Only allow profile-related fields.
  const allowedFields = [
    "name",
    "phone",
    "profileImage",
    "gender",
    "dateOfBirth",
  ];

  const filteredData = {};

  for (const field of allowedFields) {
    if (
      updateData[field] !== undefined
    ) {
      filteredData[field] =
        updateData[field];
    }
  }

  const updatedUser =
    await userRepository.updateUser(
      userId,
      filteredData
    );

  return sanitizeUser(updatedUser);
};


/**
 * Get user by ID.
 */
exports.getUserById = async (
  userId
) => {
  const user =
    await userRepository.findUserById(
      userId
    );

  if (!user) {
    throw new Error("User not found.");
  }

  return sanitizeUser(user);
};


/**
 * Get user by email.
 */
exports.getUserByEmail = async (
  email
) => {
  const user =
    await userRepository.findUserByEmail(
      email
    );

  if (!user) {
    throw new Error("User not found.");
  }

  return sanitizeUser(user);
};


/**
 * Get employees belonging to
 * an organization.
 */
exports.getOrganizationEmployees =
  async (
    organizationId,
    options = {}
  ) => {
    if (!organizationId) {
      throw new Error(
        "Organization ID is required."
      );
    }

    return userRepository.getUsersByOrganization(
      organizationId,
      options
    );
  };


/**
 * Search users inside an organization.
 */
exports.searchOrganizationUsers =
  async (
    organizationId,
    search
  ) => {
    if (!organizationId) {
      throw new Error(
        "Organization ID is required."
      );
    }

    if (!search || !search.trim()) {
      throw new Error(
        "Search query is required."
      );
    }

    return userRepository.searchUsers(
      organizationId,
      search.trim()
    );
  };


/**
 * Check whether an email is already
 * registered.
 */
exports.checkEmail = async (
  email
) => {
  if (!email) {
    throw new Error(
      "Email is required."
    );
  }

  const user =
    await userRepository.findUserByEmail(
      email
    );

  return {
    available: !user,
  };
};


/**
 * Delete user account.
 */
exports.deleteAccount = async (
  userId
) => {
  const user =
    await userRepository.findUserById(
      userId
    );

  if (!user) {
    throw new Error("User not found.");
  }

  await userRepository.deleteUser(
    userId
  );

  return {
    success: true,
    message:
      "User account deleted successfully.",
  };
};


/**
 * Get basic user statistics.
 */
exports.getUserStatistics = async (
  userId
) => {
  const user =
    await userRepository.findUserById(
      userId
    );

  if (!user) {
    throw new Error("User not found.");
  }

  const statistics =
    await userRepository.getUserStatistics(
      userId
    );

  return {
    user: sanitizeUser(user),
    statistics,
  };
};