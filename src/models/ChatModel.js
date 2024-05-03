const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId(),
      },
    roomId: {
        type: String,
        required: true,
    },
    senderId: {
        type: String,
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