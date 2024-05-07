const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    email: {
        type: String,
        required: false,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    isGuest:{
        type: Boolean,
        default: false
    },
    status:{
        type: Boolean,
        default: false
    },
    phone: {
    type: String,
    default: ''
    },
    password: {
        type: String,
        required: false,
        default: '',
        select: false
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
const user = new mongoose.model('User', schema);
module.exports = user;