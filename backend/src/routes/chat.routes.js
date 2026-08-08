// backend/src/routes/chat.routes.js

const express = require("express");
const chatController = require("../controllers/chat.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");
const organizationMiddleware = require("../middleware/organization.middleware.js");
const validationMiddleware = require("../middleware/validation.middleware.js");
const chatValidator = require("../validators/chat.validator.js");

const router = express.Router();

router.use(authMiddleware.authenticate);

// GET /api/chat/conversations
router.get("/conversations", organizationMiddleware.requireOrganization, chatController.getMyConversations);

// GET /api/chat/trip/:tripId
router.get("/trip/:tripId", organizationMiddleware.requireOrganization, chatController.getTripChat);

// POST /api/chat/trip/:tripId
router.post("/trip/:tripId", organizationMiddleware.requireOrganization,
  validationMiddleware.validate(chatValidator.sendMessage), chatController.sendMessage);

// GET /api/chat/messages/:messageId
router.get("/messages/:messageId", chatController.getMessageById);

// DELETE /api/chat/messages/:messageId
router.delete("/messages/:messageId", chatController.deleteMessage);

// PATCH /api/chat/trip/:tripId/read
router.patch("/trip/:tripId/read", organizationMiddleware.requireOrganization, chatController.markTripChatAsRead);

// GET /api/chat/unread-count
router.get("/unread-count", chatController.getUnreadCount);

module.exports = router;

