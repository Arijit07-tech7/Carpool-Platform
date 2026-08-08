// backend/src/routes/chat.routes.js

const express = require("express");

const chatController =
  require("../controllers/chat.controller.js");

const authMiddleware =
  require("../middleware/auth.middleware.js");

const organizationMiddleware =
  require("../middleware/organization.middleware.js");

const validationMiddleware =
  require("../middleware/validation.middleware.js");

const chatValidator =
  require("../validators/chat.validator.js");


const router = express.Router();


// ============================================================
// AUTHENTICATION
// ============================================================

router.use(
  authMiddleware.authenticate
);


// ============================================================
// MY CONVERSATIONS
// ============================================================

/**
 * GET /api/chat/conversations
 *
 * Get conversations available to
 * the authenticated employee.
 */
router.get(
  "/conversations",
  organizationMiddleware.verifyCurrentUserMembership,
  chatController.getConversations
);


// ============================================================
// TRIP CHAT
// ============================================================

/**
 * GET /api/chat/trip/:tripId
 *
 * Get chat messages for a trip.
 *
 * Only the driver and passengers
 * of the trip should have access.
 */
router.get(
  "/trip/:tripId",
  organizationMiddleware.verifyCurrentUserMembership,
  chatController.getTripMessages
);


// ============================================================
// SEND MESSAGE
// ============================================================

/**
 * POST /api/chat/trip/:tripId
 *
 * Send a message to trip participants.
 *
 * Example body:
 *
 * {
 *   "message": "I will reach in 5 minutes."
 * }
 */
router.post(
  "/trip/:tripId",
  organizationMiddleware.verifyCurrentUserMembership,
  validationMiddleware.validate(
    chatValidator.sendMessage
  ),
  chatController.sendMessage
);


// ============================================================
// MESSAGE DETAILS
// ============================================================

/**
 * GET /api/chat/messages/:messageId
 *
 * Get a specific message.
 */
router.get(
  "/messages/:messageId",
  chatController.getMessageById
);


// ============================================================
// DELETE MESSAGE
// ============================================================

/**
 * DELETE /api/chat/messages/:messageId
 *
 * Delete a message owned by the
 * authenticated employee.
 */
router.delete(
  "/messages/:messageId",
  chatController.deleteMessage
);


// ============================================================
// MARK AS READ
// ============================================================

/**
 * PATCH /api/chat/trip/:tripId/read
 *
 * Mark trip messages as read.
 */
router.patch(
  "/trip/:tripId/read",
  organizationMiddleware.verifyCurrentUserMembership,
  chatController.markMessagesAsRead
);


// ============================================================
// UNREAD COUNT
// ============================================================

/**
 * GET /api/chat/unread-count
 *
 * Get unread chat message count.
 */
router.get(
  "/unread-count",
  chatController.getUnreadCount
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;
