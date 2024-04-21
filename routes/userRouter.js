const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const auth = require('../middlewares/auth');

router.put('/:id',auth, userController.updateUser);
router.get('/:id', userController.getUser);
router.get('/', userController.getAllUser);
router.delete('/:id',auth, userController.deleteUser);
router.post('/',userController.registerUser);

module.exports = router;

