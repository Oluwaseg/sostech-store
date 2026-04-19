import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  sender: mongoose.Types.ObjectId; // userId
  content: string;
  type: 'text' | 'system'; // 'system' for status updates
  createdAt: Date;
  readBy: mongoose.Types.ObjectId[]; // array of users who read this message
}

export interface IChat extends Document {
  _id: mongoose.Types.ObjectId;

  // Participants
  createdBy: mongoose.Types.ObjectId; // userId who initiated
  assignedTo?: mongoose.Types.ObjectId; // moderator/admin assigned
  participants: mongoose.Types.ObjectId[]; // [userId, supportStaffId]

  // Messages
  messages: IMessage[];
  lastMessage?: string;
  lastMessageAt?: Date;

  // Status
  type: 'support' | 'admin' | 'internal'; // support=user+staff, admin=admins only, internal=mods
  status: 'active' | 'resolved' | 'closed';

  // Metadata
  subject?: string;
  unreadCount: Map<string, number>; // { userId: unreadCount }
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ['text', 'system'],
      default: 'text',
    },

    readBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
  },
  { timestamps: false }
);

const chatSchema = new Schema<IChat>(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },

    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      required: true,
      default: [],
    },

    messages: {
      type: [messageSchema],
      default: [],
    },

    lastMessage: String,

    lastMessageAt: {
      type: Date,
      index: true,
    },

    type: {
      type: String,
      enum: ['support', 'admin', 'internal'],
      default: 'support',
    },

    status: {
      type: String,
      enum: ['active', 'resolved', 'closed'],
      default: 'active',
    },

    subject: {
      type: String,
      trim: true,
    },

    unreadCount: {
      type: Map,
      of: Number,
      default: new Map(),
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookups
chatSchema.index({ participants: 1, createdAt: -1 });
chatSchema.index({ assignedTo: 1, status: 1 });

export const Chat = mongoose.model<IChat>('Chat', chatSchema);
