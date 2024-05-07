const mongoose = require('mongoose');
const schema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User"
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
});
const room = new mongoose.model('Room', schema);
module.exports = room;