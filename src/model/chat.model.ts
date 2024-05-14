import mongoose, { Schema } from 'mongoose';
const chatSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    messageType: {
      type: String,
      required: true
    },
    isNotSeen: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'users',
      default: []
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);
const ChatModel = mongoose.model('chat', chatSchema);
export default ChatModel;
