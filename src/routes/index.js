const express = require('express')
const userController = require('../feature/user/user.Controller')
const authController = require('../feature/auth/auth.Controller');
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

module.exports = router