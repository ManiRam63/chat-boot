const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message:{
      type: String,
      required: true,
    },
    messageType: {
        type: String,
        required: true,
    },
    createdAt: {
    type: Date,
    default: Date.now()
    },
    isNotSeen:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users',
        default: []
    },
    updateddAt: {
        type: Date,
        default: Date.now()
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
});
const roomMember = new mongoose.model('chat', schema);
module.exports = roomMember;