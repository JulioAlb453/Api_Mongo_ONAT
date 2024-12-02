const express = require('express');
const router = express.Router();
const postsControllers = require('../controllers/postController');
const authenticate = require('../middleware/authMiddleware');

router.get('/obtenerProductos/:_id', postsControllers.getPostsByOrganizationId);
router.get('/obtenerProductosByIdPost/:_id', postsControllers.obtenerPostPorId);
router.post('/',authenticate, postsControllers.createPost);
router.put('/:id',authenticate, postsControllers.updatePost)
router.delete('/:id', authenticate, postsControllers.deletePost)

module.exports = router;
