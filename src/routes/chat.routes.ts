import express from 'express';
import ChatController from '../features/chat/chat.controller';
import { auth, validateId } from '../middleware/index';
const router = express.Router();
router.get('/', auth, ChatController.userChat);
// router.get('/', auth, validateId, ChatController.findAll);
export default router;
