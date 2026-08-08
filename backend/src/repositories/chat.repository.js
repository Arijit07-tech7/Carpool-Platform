// backend/src/repositories/chat.repository.js

const prisma = require("../config/database.js");

/**
 * Create a new chat message.
 */
exports.createMessage = async (messageData) => {
  return prisma.chat.create({
    data: {
      tripId: messageData.tripId,
      senderId: messageData.senderId,
      receiverId: messageData.receiverId || null,

      message: messageData.message,

      messageType:
        messageData.messageType || "TEXT",

      isRead: false,
    },

    include: {
      sender: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },

      receiver: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },
    },
  });
};


/**
 * Find a message by ID.
 */
exports.findMessageById = async (messageId) => {
  return prisma.chat.findUnique({
    where: {
      id: messageId,
    },

    include: {
      sender: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },

      receiver: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },

      trip: {
        select: {
          id: true,
          rideId: true,
          status: true,
        },
      },
    },
  });
};


/**
 * Get messages for a trip.
 */
exports.getTripMessages = async (
  tripId,
  options = {}
) => {
  const {
    page = 1,
    limit = 50,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    tripId,
  };

  const [messages, total] =
    await prisma.$transaction([
      prisma.chat.findMany({
        where,

        skip,
        take: limit,

        include: {
          sender: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },

          receiver: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },

        orderBy: {
          createdAt: "asc",
        },
      }),

      prisma.chat.count({
        where,
      }),
    ]);

  return {
    messages,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};


/**
 * Get conversation between two users
 * inside a particular trip.
 */
exports.getConversation = async (
  tripId,
  userOneId,
  userTwoId,
  options = {}
) => {
  const {
    page = 1,
    limit = 50,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    tripId,

    OR: [
      {
        senderId: userOneId,
        receiverId: userTwoId,
      },

      {
        senderId: userTwoId,
        receiverId: userOneId,
      },
    ],
  };

  const [messages, total] =
    await prisma.$transaction([
      prisma.chat.findMany({
        where,

        skip,
        take: limit,

        include: {
          sender: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },

          receiver: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },

        orderBy: {
          createdAt: "asc",
        },
      }),

      prisma.chat.count({
        where,
      }),
    ]);

  return {
    messages,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};


/**
 * Get unread messages for a user.
 */
exports.getUnreadMessages = async (
  userId,
  tripId = null
) => {
  return prisma.chat.findMany({
    where: {
      receiverId: userId,
      isRead: false,

      ...(tripId && {
        tripId,
      }),
    },

    include: {
      sender: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },

      trip: {
        select: {
          id: true,
          rideId: true,
        },
      },
    },

    orderBy: {
      createdAt: "asc",
    },
  });
};


/**
 * Mark a single message as read.
 */
exports.markMessageAsRead = async (
  messageId
) => {
  return prisma.chat.update({
    where: {
      id: messageId,
    },

    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
};


/**
 * Mark all messages from a sender as read.
 */
exports.markMessagesAsRead = async (
  receiverId,
  senderId,
  tripId
) => {
  return prisma.chat.updateMany({
    where: {
      receiverId,
      senderId,
      tripId,
      isRead: false,
    },

    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
};


/**
 * Count unread messages.
 */
exports.countUnreadMessages = async (
  userId,
  tripId = null
) => {
  return prisma.chat.count({
    where: {
      receiverId: userId,
      isRead: false,

      ...(tripId && {
        tripId,
      }),
    },
  });
};


/**
 * Get latest message of a trip.
 */
exports.getLatestTripMessage = async (
  tripId
) => {
  return prisma.chat.findFirst({
    where: {
      tripId,
    },

    include: {
      sender: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },

      receiver: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};


/**
 * Count messages in a trip.
 */
exports.countTripMessages = async (
  tripId
) => {
  return prisma.chat.count({
    where: {
      tripId,
    },
  });
};


/**
 * Delete a message.
 */
exports.deleteMessage = async (
  messageId
) => {
  return prisma.chat.delete({
    where: {
      id: messageId,
    },
  });
};


/**
 * Delete all chat messages for a trip.
 *
 * Normally useful for cleanup/admin operations.
 */
exports.deleteTripMessages = async (
  tripId
) => {
  return prisma.chat.deleteMany({
    where: {
      tripId,
    },
  });
};