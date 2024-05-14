import express from 'express';
import UserController from './../features/user/user.controller';
import { auth, validateId } from '../middleware/index';
const router = express.Router();
router.post('/', UserController.create);
router.get('/:id', auth, validateId, UserController.findOne);
router.get('/', auth, UserController.findAll);
router.post('/update/:id', auth, UserController.update);
router.delete('/:id', auth, validateId, UserController.delete);

export default router;
