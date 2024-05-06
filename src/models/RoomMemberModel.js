const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId(),
      },
    roomId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    userId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User',
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