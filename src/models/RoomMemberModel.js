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
    userId: {
        type: String,
        required: true,
    },
    createdAt: {
    type: Date,
    default: Date.now()
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
});
const roomMember = new mongoose.model('RoomMember', schema);
module.exports = roomMember;