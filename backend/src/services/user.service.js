import * as userRepository from "../repositories/user.repository.js";

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
export const getProfile = async (userId) => {
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
export const updateProfile = async (
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
export const getUserById = async (
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
export const getUserByEmail = async (
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
export const getOrganizationEmployees =
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
export const searchOrganizationUsers =
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
export const checkEmail = async (
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
export const deleteAccount = async (
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
export const getUserStatistics = async (
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