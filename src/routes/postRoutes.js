const express = require('express');
const router = express.Router();
const postsControllers = require('../controllers/postController');
const authenticate = require('../middleware/authMiddleware');

router.get('/:id',authenticate, postsControllers.getPostsByOrganizationId);
router.post('/',authenticate, postsControllers.createPost);
// router.get('/:id',authenticate, postsControllers);
// router.delete('/:id',authenticate, postsControllers);
 

module.exports = router;
