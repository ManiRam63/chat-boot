const mongoose = require('mongoose');
const { nanoid } =  require('nanoid');
const schema = new mongoose.Schema({
    _id: {
        type: String,
        required:true,
        default: () => nanoid(),
    },
    name: {
        type: String,
        required: false,
        unique: true
    },
    roomType: {
        type: String,
        required: true,
    },
    createdAt: {
    type: Date,
    default: Date.now()
    },
    createdBy: {
        type: String,
        required:true
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
});
const room = new mongoose.model('Room', schema);
module.exports = room;