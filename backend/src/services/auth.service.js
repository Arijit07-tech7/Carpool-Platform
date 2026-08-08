// backend/src/services/auth.service.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import * as userRepository from "../repositories/user.repository.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/jwt.js";


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
export const register = async (userData) => {
  const {
    name,
    email,
    phone,
    password,
    role,
    organizationId,
  } = userData;

  // Check whether email already exists.
  const existingUser =
    await userRepository.findUserByEmail(email);

  if (existingUser) {
    throw new Error(
      "An account with this email already exists."
    );
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
      organizationId: organizationId || null,
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
export const login = async (
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
export const verifyToken = (token) => {
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
export const getAuthenticatedUser = async (
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
export const changePassword = async (
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
export const isEmailAvailable = async (
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
export const authenticateToken = async (
  token
) => {
  const decoded =
    verifyToken(token);

  const user =
    await getAuthenticatedUser(
      decoded.userId
    );

  return {
    user,
    decoded,
  };
};