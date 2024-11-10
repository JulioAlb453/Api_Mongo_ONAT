const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');

router.get('/obtenerUsuarios/',authenticate, userController.getUsers);
router.get('/:id',authenticate, userController.getUserById);
router.delete('/:id',authenticate, userController.deleteUser);
router.post('/',authenticate, userController.createUser);
router.post('/login',authenticate, userController.loginUser);

module.exports = router;
