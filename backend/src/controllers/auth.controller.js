// backend/src/controllers/auth.controller.js

const authService = require("../services/auth.service.js");


// ============================================================
// REGISTER
// ============================================================

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// LOGIN
// ============================================================

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// LOGOUT
// ============================================================

const logout = async (req, res, next) => {
  try {
    const result = await authService.logout(req.user);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET CURRENT USER
// ============================================================

const getCurrentUser = async (req, res, next) => {
  try {
    const result = await authService.getCurrentUser(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Current user fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// REFRESH TOKEN
// ============================================================

const refreshToken = async (req, res, next) => {
  try {
    const result = await authService.refreshToken(
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// CHANGE PASSWORD
// ============================================================

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// FORGOT PASSWORD
// ============================================================

const forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.forgotPassword(
      req.body.email
    );

    return res.status(200).json({
      success: true,
      message: "Password reset request processed",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// RESET PASSWORD
// ============================================================

const resetPassword = async (req, res, next) => {
  try {
    const result = await authService.resetPassword(
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword
};