// backend/src/validators/chat.validator.js

const Joi = require("joi");

// ============================================================
// SEND MESSAGE
// ============================================================

const sendMessageSchema = Joi.object({
  receiverId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid receiver ID",
      "any.required": "Receiver ID is required",
    }),

  message: Joi.string()
    .trim()
    .min(1)
    .max(2000)
    .required()
    .messages({
      "string.empty": "Message cannot be empty",
      "string.min": "Message cannot be empty",
      "string.max": "Message cannot exceed 2000 characters",
      "any.required": "Message is required",
    }),

  rideId: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.guid": "Invalid ride ID",
    }),

  tripId: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.guid": "Invalid trip ID",
    }),
});

// ============================================================
// SEND SOCKET MESSAGE
// ============================================================

const socketMessageSchema = Joi.object({
  receiverId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid receiver ID",
      "any.required": "Receiver ID is required",
    }),

  message: Joi.string()
    .trim()
    .min(1)
    .max(2000)
    .required()
    .messages({
      "string.empty": "Message cannot be empty",
      "string.max": "Message cannot exceed 2000 characters",
      "any.required": "Message is required",
    }),

  rideId: Joi.string()
    .uuid()
    .allow(null)
    .optional(),

  tripId: Joi.string()
    .uuid()
    .allow(null)
    .optional(),
});

// ============================================================
// CONVERSATION PARAMETER
// ============================================================

const conversationParamSchema = Joi.object({
  userId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid user ID",
      "any.required": "User ID is required",
    }),
});

// ============================================================
// MESSAGE ID PARAMETER
// ============================================================

const messageIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid message ID",
      "any.required": "Message ID is required",
    }),
});

// ============================================================
// RIDE CHAT PARAMETER
// ============================================================

const rideChatParamSchema = Joi.object({
  rideId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid ride ID",
      "any.required": "Ride ID is required",
    }),
});

// ============================================================
// TRIP CHAT PARAMETER
// ============================================================

const tripChatParamSchema = Joi.object({
  tripId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid trip ID",
      "any.required": "Trip ID is required",
    }),
});

// ============================================================
// LIST MESSAGES
// ============================================================

const listMessagesSchema = Joi.object({
  userId: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": "Invalid user ID",
    }),

  rideId: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": "Invalid ride ID",
    }),

  tripId: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": "Invalid trip ID",
    }),

  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20),
});

// ============================================================
// MARK MESSAGE AS READ
// ============================================================

const markMessageReadSchema = Joi.object({
  messageId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid message ID",
      "any.required": "Message ID is required",
    }),
});

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  sendMessageSchema,
  socketMessageSchema,
  conversationParamSchema,
  messageIdParamSchema,
  rideChatParamSchema,
  tripChatParamSchema,
  listMessagesSchema,
  markMessageReadSchema,
};