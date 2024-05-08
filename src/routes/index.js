const express = require('express');
const userController = require('../feature/user/user.Controller');
const roomController = require('../feature/room/room.Controller');
const authController = require('../feature/auth/auth.Controller');
const chatController = require('../feature/chat/chat.Controller');
const auth = require('../middleware/index')
const router = express.Router();
// auth routes//
router.post('/login', authController.signIn);
//user routes//
router.get('/user', auth, userController.findAll);
router.get('/user/:id', auth , userController.findOne);
router.post('/user', auth, userController.create);
router.patch('/user',auth , userController.update);
router.delete('/user/:id', auth , userController.delete);
 //room routes//
 router.delete('/room/deleteMember', auth , roomController.deleteMember);
 router.get('/room/getUserByRoomId', auth , roomController.getUserRoomId);
 router.get('/room', auth, roomController.findAll);
 router.get('/room/:id', auth , roomController.findOne);
 router.post('/room', auth, roomController.create);
 router.patch('/room',auth ,roomController.update);
 router.delete('/room/:id', auth ,roomController.delete);
 router.post('/room/addMember', auth , roomController.AddMember);
// chat routes//
router.get('/chat', auth , chatController.userChat);
router.post('/chat', auth , chatController.createChat);
module.exports = router