import express from 'express';
import ChatController from '../features/chat/chat.controller';
import { auth } from '../middleware/index';
const router = express.Router();
router.get('/', auth, ChatController.userChat);
export default router;
