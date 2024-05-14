import express from 'express';
import RoomController from '../features/room/room.controller';
import { auth, validateId } from '../middleware/index';
const router = express.Router();
router.delete('/deleteMember', auth, RoomController.deleteMember);
router.get('/', auth, RoomController.findAll);
router.get('/:id', auth, validateId, RoomController.findOne);
router.post('/', auth, RoomController.create);
router.patch('', auth, RoomController.update);
router.delete('/:id', auth, validateId, RoomController.delete);

export default router;
