const chatService = require("../services/chat.service.js");


// ============================================================
// SEND MESSAGE
// ============================================================

const sendMessage = async (req, res, next) => {
  try {
    const result = await chatService.sendMessage(
      req.user.id,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET MESSAGE BY ID
// ============================================================

const getMessageById = async (req, res, next) => {
  try {
    const result = await chatService.getMessageById(
      req.params.messageId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Message fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET TRIP CHAT
// ============================================================

const getTripChat = async (req, res, next) => {
  try {
    const result = await chatService.getTripChat(
      req.params.tripId,
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Trip chat fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET MY CONVERSATIONS
// ============================================================

const getMyConversations = async (req, res, next) => {
  try {
    const result = await chatService.getMyConversations(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Conversations fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// MARK MESSAGE AS READ
// ============================================================

const markMessageAsRead = async (req, res, next) => {
  try {
    const result = await chatService.markMessageAsRead(
      req.user.id,
      req.params.messageId
    );

    return res.status(200).json({
      success: true,
      message: "Message marked as read",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// MARK TRIP CHAT AS READ
// ============================================================

const markTripChatAsRead = async (req, res, next) => {
  try {
    const result = await chatService.markTripChatAsRead(
      req.user.id,
      req.params.tripId
    );

    return res.status(200).json({
      success: true,
      message: "Trip chat marked as read",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// DELETE MESSAGE
// ============================================================

const deleteMessage = async (req, res, next) => {
  try {
    const result = await chatService.deleteMessage(
      req.user.id,
      req.params.messageId
    );

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// GET UNREAD COUNT
// ============================================================

const getUnreadCount = async (req, res, next) => {
  try {
    const result = await chatService.getUnreadCount(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Unread message count fetched successfully",
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
  sendMessage,
  getMessageById,
  getTripChat,
  getMyConversations,
  markMessageAsRead,
  markTripChatAsRead,
  deleteMessage,
  getUnreadCount
};