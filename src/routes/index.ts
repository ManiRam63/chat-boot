import express from 'express';
import AuthController from '../features/auth/auth.controller';
import userRoutes from './user.routes';
import chatRoutes from './chat.routes';
import roomRoutes from './room.routes';
const router = express.Router();
// Auth routes
router.post('/login', AuthController.signIn);
router.use('/user', userRoutes);
router.use('/chat', chatRoutes);
router.use('/room', roomRoutes);
export default router;
