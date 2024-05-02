const mongoose = require('mongoose');
const { nanoid } =  require('nanoid');
const schema = new mongoose.Schema({
    _id: {
        type: String,
        required:true,
        default: () => nanoid(),
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