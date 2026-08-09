// backend/src/services/auth.service.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRepository = require("../repositories/user.repository.js");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/jwt.js");


/**
 * Generate JWT token for authenticated user.
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
      organizationId: user.organizationId || null,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
};


/**
 * Remove sensitive information before
 * returning user data.
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
 * Register a new user.
 */
exports.register = async (userData) => {
  const {
    name,
    email,
    phone,
    password,
    role,
    organizationId,
    organizationCode,
  } = userData;

  // Check whether email already exists.
  const existingUser =
    await userRepository.findUserByEmail(email);

  if (existingUser) {
    throw new Error(
      "An account with this email already exists."
    );
  }

  // Resolve organizationId: accept either direct UUID or a human-readable code.
  let resolvedOrgId = organizationId || null;

  if (!resolvedOrgId && organizationCode) {
    const prisma = require("../config/database.js");
    const org = await prisma.organization.findUnique({
      where: { code: organizationCode.trim().toUpperCase() },
    });

    if (!org) {
      throw new Error(
        "Invalid organization code. Please check and try again."
      );
    }

    resolvedOrgId = org.id;
  }

  // Hash password before storing it.
  const hashedPassword =
    await bcrypt.hash(password, 12);

  const user =
    await userRepository.createUser({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "EMPLOYEE",
      organizationId: resolvedOrgId,
    });

  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
};


/**
 * Login user.
 */
exports.login = async (
  email,
  password
) => {
  const user =
    await userRepository.findUserByEmail(email);

  if (!user) {
    throw new Error(
      "Invalid email or password."
    );
  }

  const passwordHash =
    user.password || user.passwordHash;

  if (!passwordHash) {
    throw new Error(
      "User password is not configured."
    );
  }

  const passwordValid =
    await bcrypt.compare(
      password,
      passwordHash
    );

  if (!passwordValid) {
    throw new Error(
      "Invalid email or password."
    );
  }

  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
};


/**
 * Verify JWT token.
 */
exports.verifyToken = (token) => {
  try {
    return jwt.verify(
      token,
      JWT_SECRET
    );
  } catch (error) {
    throw new Error(
      "Invalid or expired token."
    );
  }
};


/**
 * Get authenticated user.
 */
exports.getAuthenticatedUser = async (
  userId
) => {
  const user =
    await userRepository.findUserById(userId);

  if (!user) {
    throw new Error(
      "User not found."
    );
  }

  return sanitizeUser(user);
};


/**
 * Change user password.
 */
exports.changePassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user =
    await userRepository.findUserById(
      userId
    );

  if (!user) {
    throw new Error(
      "User not found."
    );
  }

  const passwordHash =
    user.password || user.passwordHash;

  const valid =
    await bcrypt.compare(
      currentPassword,
      passwordHash
    );

  if (!valid) {
    throw new Error(
      "Current password is incorrect."
    );
  }

  const newPasswordHash =
    await bcrypt.hash(
      newPassword,
      12
    );

  await userRepository.updateUser(
    userId,
    {
      password: newPasswordHash,
    }
  );

  return {
    success: true,
    message:
      "Password changed successfully.",
  };
};


/**
 * Check whether email is available.
 */
exports.isEmailAvailable = async (
  email
) => {
  const user =
    await userRepository.findUserByEmail(
      email
    );

  return !user;
};


/**
 * Get user information from token.
 */
exports.authenticateToken = async (
  token
) => {
  const decoded =
    exports.verifyToken(token);

  const user =
    await exports.getAuthenticatedUser(
      decoded.userId
    );

  return {
    user,
    decoded,
  };
};


/**
 * Logout user (stateless — client drops the token).
 */
exports.logout = async (user) => {
  // JWT is stateless; nothing to invalidate server-side.
  return { success: true, message: "Logged out successfully." };
};


/**
 * Get current authenticated user by ID.
 */
exports.getCurrentUser = async (userId) => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new Error("User not found.");
  }
  return sanitizeUser(user);
};


/**
 * Forgot password — sends reset email.
 * (stub: email sending not yet wired up)
 */
exports.forgotPassword = async (email) => {
  const user = await userRepository.findUserByEmail(email);
  // Don't reveal whether account exists
  if (!user) {
    return { success: true, message: "If an account exists, a reset link has been sent." };
  }
  // TODO: generate reset token and send email
  return { success: true, message: "If an account exists, a reset link has been sent." };
};


/**
 * Reset password using token.
 * (stub: token verification not yet wired up)
 */
exports.resetPassword = async ({ token, newPassword, confirmPassword }) => {
  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }
  // TODO: verify reset token and update password
  return { success: true, message: "Password reset successfully." };
};