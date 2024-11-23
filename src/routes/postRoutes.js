const express = require('express');
const router = express.Router();
const postsControllers = require('../controllers/postController');
const authenticate = require('../middleware/authMiddleware');

router.get('/:id',authenticate, postsControllers.getPostsByOrganizationId);
router.post('/',authenticate, postsControllers.createPost);
router.put('/:id',authenticate, postsControllers.updatePost)
router.delete('/:id', authenticate, postsControllers.deletePost)

module.exports = router;
