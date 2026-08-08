// backend/src/services/chat.service.js

const chatRepository = require("../repositories/chat.repository.js");
const tripRepository = require("../repositories/trip.repository.js");
const bookingRepository = require("../repositories/booking.repository.js");


/**
 * Check whether a user is allowed to access
 * a particular trip.
 *
 * Allowed users:
 * - Trip driver
 * - Confirmed passenger
 */
const verifyTripParticipant = async (
  userId,
  tripId
) => {
  const trip =
    await tripRepository.findTripById(
      tripId
    );

  if (!trip) {
    throw new Error(
      "Trip not found."
    );
  }

  // Driver is automatically a participant.
  if (
    trip.driverId === userId
  ) {
    return {
      trip,
      role: "DRIVER",
    };
  }

  // Check passenger booking.
  const booking =
    await bookingRepository.findBookingByPassengerAndRide(
      userId,
      trip.rideId
    );

  if (
    !booking ||
    booking.status !== "CONFIRMED"
  ) {
    throw new Error(
      "You are not authorized to access this trip chat."
    );
  }

  return {
    trip,
    role: "PASSENGER",
  };
};


/**
 * Get or create a chat room for a trip.
 */
exports.getOrCreateTripChat = async (
  userId,
  tripId
) => {
  await verifyTripParticipant(
    userId,
    tripId
  );

  let chat =
    await chatRepository.findChatByTripId(
      tripId
    );

  if (!chat) {
    chat =
      await chatRepository.createChat({
        tripId,
        status: "ACTIVE",
      });
  }

  return chat;
};


/**
 * Send a message inside a trip chat.
 */
exports.sendMessage = async (
  userId,
  tripId,
  messageData
) => {
  const {
    message,
    messageType = "TEXT",
  } = messageData;

  if (!message || !message.trim()) {
    throw new Error(
      "Message cannot be empty."
    );
  }

  const {
    trip,
    role,
  } = await verifyTripParticipant(
    userId,
    tripId
  );

  /*
   * Chat should only be active while
   * the trip is running.
   *
   * You can remove this restriction later
   * if your UI needs pre-trip messaging.
   */
  if (
    ![
      "SCHEDULED",
      "IN_PROGRESS",
    ].includes(trip.status)
  ) {
    throw new Error(
      "Chat is not available for this trip."
    );
  }

  const chat =
    await getOrCreateTripChat(
      userId,
      tripId
    );

  const cleanMessage =
    message.trim();

  const allowedMessageTypes = [
    "TEXT",
    "LOCATION",
    "SYSTEM",
  ];

  if (
    !allowedMessageTypes.includes(
      messageType
    )
  ) {
    throw new Error(
      "Invalid message type."
    );
  }

  const createdMessage =
    await chatRepository.createMessage({
      chatId: chat.id,
      senderId: userId,
      message: cleanMessage,
      messageType,
    });

  return {
    message: createdMessage,
    senderRole: role,
  };
};


/**
 * Get messages from a trip chat.
 */
exports.getMessages = async (
  userId,
  tripId,
  options = {}
) => {
  await verifyTripParticipant(
    userId,
    tripId
  );

  const {
    page = 1,
    limit = 50,
  } = options;

  const safePage =
    Math.max(
      Number(page) || 1,
      1
    );

  const safeLimit =
    Math.min(
      Math.max(
        Number(limit) || 50,
        1
      ),
      100
    );

  const chat =
    await chatRepository.findChatByTripId(
      tripId
    );

  if (!chat) {
    return {
      messages: [],
      page: safePage,
      limit: safeLimit,
      total: 0,
    };
  }

  return chatRepository.getMessagesByChat(
    chat.id,
    {
      page: safePage,
      limit: safeLimit,
    }
  );
};


/**
 * Mark a message as read.
 */
exports.markMessageAsRead = async (
  userId,
  messageId
) => {
  const message =
    await chatRepository.findMessageById(
      messageId
    );

  if (!message) {
    throw new Error(
      "Message not found."
    );
  }

  const trip =
    message.chat?.trip;

  if (!trip) {
    throw new Error(
      "Trip associated with this message was not found."
    );
  }

  await verifyTripParticipant(
    userId,
    trip.id
  );

  // Sender does not need to mark
  // their own message as read.
  if (
    message.senderId === userId
  ) {
    return message;
  }

  return chatRepository.markMessageAsRead(
    messageId,
    userId
  );
};


/**
 * Mark all messages in a trip chat
 * as read for the current user.
 */
exports.markAllMessagesAsRead =
  async (
    userId,
    tripId
  ) => {
    await verifyTripParticipant(
      userId,
      tripId
    );

    const chat =
      await chatRepository.findChatByTripId(
        tripId
      );

    if (!chat) {
      return {
        updated: 0,
      };
    }

    return chatRepository.markAllMessagesAsRead(
      chat.id,
      userId
    );
  };


/**
 * Delete a message.
 *
 * Normally the sender should only be able
 * to delete their own message.
 */
exports.deleteMessage = async (
  userId,
  messageId
) => {
  const message =
    await chatRepository.findMessageById(
      messageId
    );

  if (!message) {
    throw new Error(
      "Message not found."
    );
  }

  if (
    message.senderId !== userId
  ) {
    throw new Error(
      "You can only delete your own messages."
    );
  }

  return chatRepository.deleteMessage(
    messageId
  );
};


/**
 * Get unread message count.
 */
exports.getUnreadCount = async (
  userId,
  tripId
) => {
  await verifyTripParticipant(
    userId,
    tripId
  );

  const chat =
    await chatRepository.findChatByTripId(
      tripId
    );

  if (!chat) {
    return {
      unreadCount: 0,
    };
  }

  const unreadCount =
    await chatRepository.getUnreadMessageCount(
      chat.id,
      userId
    );

  return {
    unreadCount,
  };
};


/**
 * Close trip chat after trip completion.
 */
exports.closeTripChat = async (
  userId,
  tripId
) => {
  const trip =
    await tripRepository.findTripById(
      tripId
    );

  if (!trip) {
    throw new Error(
      "Trip not found."
    );
  }

  if (
    trip.driverId !== userId
  ) {
    throw new Error(
      "Only the driver can close the trip chat."
    );
  }

  const chat =
    await chatRepository.findChatByTripId(
      tripId
    );

  if (!chat) {
    return null;
  }

  return chatRepository.updateChat(
    chat.id,
    {
      status: "CLOSED",
      closedAt: new Date(),
    }
  );
};


/**
 * Check whether the user can send
 * a message to a trip.
 */
exports.canSendMessage = async (
  userId,
  tripId
) => {
  try {
    const {
      trip,
    } = await verifyTripParticipant(
      userId,
      tripId
    );

    const allowedStatuses = [
      "SCHEDULED",
      "IN_PROGRESS",
    ];

    if (
      !allowedStatuses.includes(
        trip.status
      )
    ) {
      return {
        allowed: false,
        reason:
          "Chat is not available for this trip.",
      };
    }

    return {
      allowed: true,
    };

  } catch (error) {
    return {
      allowed: false,
      reason: error.message,
    };
  }
};